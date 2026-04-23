import type { ShellMediaApi } from "./media";
import type { ShellMenuBarApi } from "./menubar";
import type { NotifyInput } from "./notify";
import type { ShellToastApi } from "./toast";
import type { ShellWindowNavApi } from "./window-nav";

export interface AppRuntimeCtx {
  windowId: string;
  appId: string;
  locale: string;
  theme: "light" | "dark";
  shell: ShellApi;
}

export interface ShellApi {
  notify: (input: NotifyInput) => Promise<void>;
  /** 全局媒体引擎（CentralMusicEngine 的薄包装），跨 app 单例。 */
  media: ShellMediaApi;
  /** 顶部菜单栏注册（窗口聚焦时显示）。 */
  menubar: ShellMenuBarApi;
  /** Toast / 消息提示。 */
  toast: ShellToastApi;
  /** 窗口内导航（route / replace / goBack）。 */
  windowNav: ShellWindowNavApi;
}
