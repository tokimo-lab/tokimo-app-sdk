/**
 * Tiny snapshot+subscribe primitive shared by all reactive shell APIs
 * (`appearance`, future `locale`, etc.).
 *
 * Why this exists: every reactive injection from the shell needs the same
 * boilerplate — a snapshot ref, a Set<listener>, and a fan-out useEffect.
 * Without this helper, each new API duplicates ~30 lines in the shell adapter
 * and one of them inevitably becomes a no-op subscribe (we shipped that bug
 * for `windowNav` for a while). Centralising the pattern makes adding new
 * reactive APIs a 2-line change.
 *
 * The shape `{ getSnapshot, subscribe }` is exactly what `useSyncExternalStore`
 * expects, so on the bundle side `useSyncExternalStore(src.subscribe, src.getSnapshot)`
 * just works.
 */

export interface ReactiveSnapshotApi<T> {
  /** Returns the current snapshot. Stable identity across no-op renders. */
  getSnapshot: () => T;
  /**
   * Register a listener; called on every `set()` whose new value !== current.
   * Returns an unsubscribe function.
   */
  subscribe: (listener: () => void) => () => void;
}

/**
 * Like {@link ReactiveSnapshotApi} but with a `set()` setter — for shell-side
 * use only. Bundles must only see the read-side ({@link ReactiveSnapshotApi}).
 */
export interface ReactiveSource<T> extends ReactiveSnapshotApi<T> {
  /**
   * Updates the snapshot and notifies all listeners. Listeners that throw are
   * logged and isolated — one buggy subscriber cannot break the rest.
   */
  set: (next: T) => void;
}

/**
 * Create a reactive source seeded with `initial`. Equality is by reference; if
 * you need value equality, pass a custom `equals` predicate to skip identical
 * updates and avoid spurious re-renders in bundle subscribers.
 */
export function createReactiveSource<T>(
  initial: T,
  options: { equals?: (a: T, b: T) => boolean } = {},
): ReactiveSource<T> {
  let current = initial;
  const listeners = new Set<() => void>();
  const equals = options.equals ?? Object.is;

  return {
    getSnapshot: () => current,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set: (next) => {
      if (equals(current, next)) return;
      current = next;
      for (const listener of listeners) {
        try {
          listener();
        } catch (err) {
          console.error("[app-sdk] reactive source listener threw:", err);
        }
      }
    },
  };
}
