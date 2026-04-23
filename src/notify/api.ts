import type { NotifyInput } from "./types";

/**
 * 通过 shell 提供的 notification_center 发送通知。
 *
 * 路由：`POST /api/apps/notification_center/notify`。
 * notification_center 当前是 server 内的 local service（走 bus invoke），未来若拆成
 * 独立子进程，URL 不变（透明 UDS 反代）。**业务代码请用 `ctx.shell.notify(...)`**，
 * 不要直接 fetch 这个 URL。
 */
export async function postNotify(
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
