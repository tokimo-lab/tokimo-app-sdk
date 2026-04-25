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

/*
 * Why no `accent` / dark-mode field here?
 *
 * The host applies `data-accent="<name>"` on `<html>` and toggles `.dark`
 * on the same element. Both translate to CSS variables (e.g. `--accent`,
 * `--accent-subtle`, `--bg-base`) that **cascade** into every descendant —
 * including third-party app bundles, whose DOM is mounted inside the host
 * document. Bundles therefore consume `var(--accent)`, `var(--bg-base)`,
 * etc. directly and automatically follow whatever the host displays, with
 * zero JS plumbing and no remount required.
 *
 * Concretely this means:
 *   - DO NOT wrap your bundle in a `<ConfigProvider theme={...}>` /
 *     `<ThemeProvider>`. Doing so makes the bundle re-write
 *     `<html data-accent>` / `<html class="dark">` and fight the host for
 *     the global attribute.
 *   - DO use `var(--accent)` (and friends) in styles / Tailwind arbitrary
 *     values. They update live as the user changes preferences.
 *   - DO use a plain `<ConfigProvider locale={...}>` if you only need
 *     locale wiring for `@tokimo/ui` components.
 */
