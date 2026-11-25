# Performance report

These measurements describe the initial portfolio build, before the professional content and portrait update.

Measured on 25 November 2026 using Lighthouse 13.6.0 and Chrome 158 on Windows. Each run targeted the cold homepage of the local static export before activating the 3D scene.

| Lighthouse configuration                    | Performance | Accessibility | Best practices | SEO |   LCP |   CLS | Total blocking time |
| ------------------------------------------- | ----------: | ------------: | -------------: | --: | ----: | ----: | ------------------: |
| Desktop                                     |          99 |           100 |            100 |  66 | 1.0 s | 0.001 |                0 ms |
| Mobile, simulated throttling, uncompressed  |          81 |           100 |            100 |  66 | 5.2 s | 0.002 |               20 ms |
| Mobile, DevTools throttling, uncompressed   |          95 |           100 |            100 |  66 | 2.4 s | 0.001 |               30 ms |
| Mobile, simulated throttling, gzip delivery |          95 |           100 |            100 |  66 | 2.9 s |     0 |               20 ms |

The mobile result depends on the throttling and delivery configuration. Gzip reduced the cold homepage transfer from approximately **710 kB to 308 kB** in Lighthouse. The desktop and DevTools mobile runs met the LCP target of 2.5 seconds. Both simulated mobile runs exceeded that target. All four runs met the CLS target of 0.1. The preview’s deliberate noindex configuration was the sole failed Lighthouse SEO audit. Earlier trials using Chrome for Testing showed additional Windows GPU and renderer scheduling overhead and remain in the raw reports for comparison.

The homepage now uses a 50 kB WebP poster. Three.js starts when a mouse moves over the artwork or a visitor selects the play control. Before then, the browser can display the hero from the static export. The live scene caps pixel ratio, uses fewer nodes on narrow screens, and stops running offscreen, on pause or when the tab is inactive. The optional research and lab scenes are loaded individually on request and render on demand. Project-card components on the homepage render independently of the filter animation code used on the Work route.

Raw reports are in `artifacts/lighthouse/`. To repeat the optional compressed test, set `SITE_PREVIEW_GZIP=1` and a free `PORT` before running `npm run serve`, then audit the printed URL. Local scores describe the test machine and configuration. Hosted delivery and field Core Web Vitals remain unmeasured.
