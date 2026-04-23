export interface ShellWindowNavApi {
  /** 当前路由路径（窗口内）。 */
  getRoute: () => string;
  /** push 到当前窗口的导航栈。 */
  navigate: (route: string, title?: string) => void;
  /** 替换当前路由，不入栈。 */
  replace: (route: string, title?: string) => void;
  /** 后退一步。 */
  goBack: () => void;
  /** 是否有上一级可返回。 */
  canGoBack: () => boolean;
  /** 订阅路由变化。 */
  subscribe: (listener: () => void) => () => void;
}
