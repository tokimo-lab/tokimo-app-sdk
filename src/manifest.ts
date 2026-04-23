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

import type { AppRuntimeCtx } from "./runtime";

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

export function defineApp(def: AppDefinition): AppDefinition {
  return def;
}
