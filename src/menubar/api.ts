import type { MenuBarConfig } from "./types";

export interface ShellMenuBarApi {
  /** 注册当前 app 的菜单栏配置。null 清除。返回 dispose。 */
  set: (config: MenuBarConfig | null) => () => void;
}
