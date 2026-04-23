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
