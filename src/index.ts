/**
 * @tokimo/app-sdk — runtime contract between third-party apps and the shell.
 *
 * Each app bundles its own React + UI deps and exposes a `mount(container, ctx)`
 * function. The shell's adapter renders an empty div and calls `mount()` from a
 * `useEffect`, so the app gets a fully isolated React root inside the shell's
 * window content.
 *
 * 后端通信契约：每个 app 子进程自己起一个 axum server 监听 UDS，server 端通过
 * `/api/apps/<id>/<rest>` 透明反代过去。app 前端**直接 `fetch("/api/apps/<id>/...")`**
 * 即可（保持现有 typed REST + React Query 链路不变）；SDK 不再提供通用 RPC 包装。
 *
 * 跨 app 调用（如 `notification_center.notify`）通过 `ctx.shell.*` 暴露的
 * 命名能力发起，shell 内部决定路由方式（local svc 仍走 bus invoke、子进程 app
 * 走 UDS 反代）。业务代码不应该硬编码这些 URL。
 *
 * See docs/app/multi-process-architecture.md for the full design.
 */

// ── Manifest types ──

export interface AppManifestLite {
  id: string;
  appName: string;
  /** Lucide icon name (resolved by shell). */
  icon?: string;
  /**
   * Image-based icon URL. When set, takes precedence over `icon` in surfaces
   * that support raster icons (window title bar, taskbar, launchpad, notifications).
   * Use a relative `assets/...` path (the shell rewrites it to
   * `/api/apps/<id>/assets/...`) or an absolute URL.
   */
  image?: string;
  color?: string;
  windowType: string;
  defaultSize?: { width: number; height: number };
  category?: "app" | "page" | "system" | "popup";
}

export interface AppDefinition {
  id: string;
  manifest: AppManifestLite;
  translations?: Record<string, Record<string, string>>;
  /**
   * Mount the app into a shell-provided DOM container.
   * Must return a dispose function that tears down the React root.
   */
  mount: (container: HTMLElement, ctx: AppRuntimeCtx) => Dispose;
}

export type Dispose = () => void;

export interface AppRuntimeCtx {
  windowId: string;
  appId: string;
  locale: string;
  theme: "light" | "dark";
  shell: ShellApi;
}

export interface ShellApi {
  notify: (input: NotifyInput) => Promise<void>;
}

export interface NotifyInput {
  /**
   * 触发该通知的 app id（用于通知中心 app 列表聚合）。
   * 缺省时由 shell 注入当前 app 的 manifest.id。
   */
  appId?: string;
  /**
   * 通知分类（用于"系统设置 → 通知中心"中的开关粒度）；缺省 "default"。
   * 同一 app 可定义多个 category（如 "task_success" / "task_failed"）。
   */
  categoryId?: string;
  /** 分类显示名（i18n key 或纯文本）；首次注册 source 时落库。 */
  categoryLabel?: string;
  title: string;
  body?: string;
  level?: "info" | "success" | "warning" | "error";
}

export function defineApp(def: AppDefinition): AppDefinition {
  return def;
}

// ── Shell-injected capabilities ──

/**
 * 通过 shell 提供的 notification_center 发送通知。
 *
 * 路由：`POST /api/apps/notification_center/notify`。
 * notification_center 当前是 server 内的 local service（走 bus invoke），未来若拆成
 * 独立子进程，URL 不变（透明 UDS 反代）。**业务代码请用 `ctx.shell.notify(...)`**，
 * 不要直接 fetch 这个 URL。
 */
async function postNotify(
  input: NotifyInput,
  fallbackAppId: string,
): Promise<void> {
  const r = await fetch("/api/apps/notification_center/notify", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      app_id: input.appId ?? fallbackAppId,
      category_id: input.categoryId ?? "default",
      category_label: input.categoryLabel,
      title: input.title,
      body: input.body,
      level: input.level,
    }),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => `${r.status}`);
    throw new Error(`notify failed: ${text}`);
  }
}

export function makeShellApi(appId: string): ShellApi {
  return {
    notify: (input) => postNotify(input, appId),
  };
}

/** Tiny i18n helper, used by apps that pass `translations` to defineApp. */
export function makeTranslator(
  translations: Record<string, Record<string, string>> | undefined,
  locale: string,
) {
  const bundle = translations?.[locale] ?? {};
  return (key: string, fallback?: string): string =>
    bundle[key] ?? fallback ?? key;
}
