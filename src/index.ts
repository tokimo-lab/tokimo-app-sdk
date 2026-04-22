/**
 * @tokimo/app-sdk — runtime contract between third-party apps and the shell.
 *
 * Each app bundles its own React + UI deps and exposes a `mount(container, ctx)`
 * function. The shell's adapter renders an empty div and calls `mount()` from a
 * `useEffect`, so the app gets a fully isolated React root inside the shell's
 * window content. Communication with the shell happens through plain async calls
 * over the bus HTTP gateway — no cross-realm React contexts.
 *
 * See docs/app/multi-process-architecture.md for the full design.
 */

// ── Manifest types ──

export interface AppManifestLite {
  id: string;
  appName: string;
  /** Lucide icon name (resolved by shell). */
  icon?: string;
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
  title: string;
  body?: string;
  level?: "info" | "success" | "warning" | "error";
  showToast?: boolean;
}

export function defineApp(def: AppDefinition): AppDefinition {
  return def;
}

// ── HTTP bus client (used by apps and the shell adapter alike) ──

export async function busCall<T = unknown>(
  service: string,
  method: string,
  payload: unknown = {},
): Promise<T> {
  const r = await fetch("/api/bus/call", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ service, method, payload }),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => `${r.status}`);
    throw new Error(`bus.call(${service}.${method}) failed: ${text}`);
  }
  return (await r.json()) as T;
}

/** Convenience: scope all calls to a specific service. */
export function makeBusClient(service: string) {
  return {
    call: <T = unknown>(method: string, payload: unknown = {}) =>
      busCall<T>(service, method, payload),
    callService: busCall,
  };
}

export function makeShellApi(): ShellApi {
  return {
    notify: (input) =>
      busCall("notification_center", "notify", {
        ...input,
        show_toast: input.showToast ?? true,
      }),
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
