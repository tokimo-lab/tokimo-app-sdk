# @tokiomo/app-sdk

Runtime contract between the **Tokimo shell** and **third-party Tokimo apps**.

A Tokimo app's UI imports only this package + `@tokimo/ui`; the shell injects
window-manager, bus client, i18n, and notification handles via a global
runtime object so the app code stays decoupled from shell internals.

## Exports

| Export               | Purpose                                             |
|----------------------|-----------------------------------------------------|
| `defineApp(def)`     | Default-exported entry of every app's UI bundle     |
| `useBus()`           | Call own backend bus methods                        |
| `useBusService(svc)` | Call another service's bus methods (cross-app)      |
| `useNotify()`        | Send a Tokimo notification (system inbox + toast)   |
| `useAppT()`          | i18n hook auto-bound to the app's namespace         |
| `useWindowManager()` | Open/close other windows (e.g. cross-app workflows) |

## Status

Pilot — shipped alongside `tokimo-app-helloworld` reference app.
