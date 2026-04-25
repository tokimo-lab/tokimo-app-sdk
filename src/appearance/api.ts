import type { ReactiveSnapshotApi } from "../reactive";
import type { AppAppearanceSnapshot } from "./types";

/**
 * Reactive theme + title-bar style for third-party apps. Bundles should
 * consume via `useShellAppearance(ctx)` rather than calling these directly.
 *
 * Shell-side: build with `createReactiveSource<AppAppearanceSnapshot>(...)`
 * and pass the source object as the injection — its shape already matches
 * this interface.
 */
export type ShellAppearanceApi = ReactiveSnapshotApi<AppAppearanceSnapshot>;
