# Study Flow — navigation and state contract

This is a **proposed** contract. During Phase 2.0 inspect existing URL format and adjust the implementation to retain backwards-compatible links. Record any deviation and rationale.

## Sources of truth

- URL path + `card` + `seed`: selected session/card and reproducible challenge variant.
- Persisted `study-flow:v1`: completion, confidence, review timestamps, historical progress.
- Component state: transient input, animation and loading; must not override a valid deep link.
- Content registry: canonical session and card IDs; IDs must not depend on locale.

## History rules

| User action                       | History                                                                                | State behavior                                                      |
| --------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Click Next/Previous card          | `pushState`                                                                            | New URL is a reversible navigation step                             |
| Select session/path/collection    | `pushState`                                                                            | Preserve meaningful destination and seed only if relevant           |
| Open explicit deep link           | Browser navigation                                                                     | Honor valid card/seed; do not restore a different card from storage |
| Initial load with absent `card`   | `replaceState` only if canonicalization is needed                                      | Select deterministic first/default card                             |
| Invalid `card` or `seed`          | `replaceState` to safe canonical URL                                                   | No crash; show recoverable fallback if session missing              |
| Locale switch                     | `pushState`                                                                            | Retain session/card/seed when IDs exist in target locale            |
| Browser Back/Forward (`popstate`) | **Never push**                                                                         | Derive selected card/seed from current URL                          |
| Reload                            | No history mutation except canonicalization                                            | Restore exact valid URL selection and persisted progress            |
| Explicit completion               | Prefer no URL change unless navigating                                                 | Persist completion once; avoid duplicate review events              |
| Reset/retry or regenerate variant | `pushState` if new seed is user-visible navigation; otherwise document explicit policy | Never silently regenerate seed on rerender                          |

Do not call `pushState` from URL synchronization effects. Prevent repeated pushes for same canonical URL. Retain hash/query conventions already used by existing router, including GitHub Pages behavior. Test initial load and hard refresh on deployed route (or equivalent preview with SPA fallback).

## Edge cases

- First card Previous: disabled or explicit exit; never navigate to an undefined card.
- Last card Next: show completion/self-check flow; completion must be explicit.
- Unknown session/card: show safe recovery and meaningful navigation, not blank screen.
- Query seed: define accepted syntax and bounds after inspecting existing generator; malformed or huge values normalize safely.
- Session change: reset transient answer state but retain persisted review data.
- Keyboard: ignore shortcuts while editing text, interacting with controls or using modifier keys. Do not break native navigation.
- Swipe: require horizontal intent threshold, ignore interactive elements/text selection and keep vertical scrolling native.
- Browser focus: heading or main card focus management should be accessible without disruptive scroll jumps.
- Storage unavailable: continue in ephemeral mode with visible, nonfatal warning if appropriate.
- Migration: idempotent; preserve older progress keys; do not downgrade newer stored schema.

## Required navigation tests

N01 Next/Previous; N02 boundaries; N03 session transition; N04 path/collection transition; N05 Back/Forward; N06 reload; N07 deep link; N08 invalid card; N09 malformed seed; N10 locale switch; N11 explicit completion; N12 swipe vs vertical scroll; N13 keyboard while input focused; N14 persisted progress vs URL priority; N15 no duplicate history entries.
