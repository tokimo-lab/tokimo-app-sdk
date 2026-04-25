/**
 * Snapshot of the host shell's current appearance preferences.
 *
 * Exposed to third-party app bundles so they can adapt their layout to
 * platform-style chrome (macOS traffic-light button area, dark/light theme,
 * etc.) without re-implementing platform detection.
 */
export interface AppAppearanceSnapshot {
  /** Resolved theme — "light" or "dark" (no "auto" leak). */
  theme: "light" | "dark";
  /**
   * Title-bar styling preference resolved from user settings.
   *
   * - `"mac"` — macOS-style chrome (traffic-light buttons on the left,
   *   centered title). Apps with overlay title bars should reserve ~78px on
   *   the left for the traffic-light cluster.
   * - `"windows"` — Windows-style chrome (caption buttons on the right).
   */
  titleBarStyle: "mac" | "windows";
  /** Convenience: equivalent to `titleBarStyle === "mac"`. */
  isMacStyle: boolean;
}
