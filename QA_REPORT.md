# Quality assurance report

## Gaming.pptx media correction

The local review export passed 17 Playwright tests. The new checks verify the deck's exact video links and case-study stills, optional Drive iframe loading, native AR playback, and the two local-only client captures. The default export check confirmed that the two local-review Drive IDs and the superseded Unity capture are absent. Both builds passed static verification with 31 routes and 1,060 internal references.

## Professional portfolio update

The updated static portfolio passed strict TypeScript, ESLint, production build and 15 Playwright tests on both the root path and a GitHub Pages-style `/portfolio/` subpath. The export checker verified 30 HTML routes and 1,000 internal references on each. The added test verified local playback and captions for both Drive excerpts, experience and education content, seven App Store links, four writing links and the LinkedIn contact. Desktop and mobile screenshots of Home, Projects, a professional case study and Writing were reviewed.

## Initial portfolio build

Tested on 25 November 2026 on Windows with Node.js 24.13.0 and Playwright Chromium. Tests targeted the exported files through the local static server.

| Check                                 | Result                                                                                                                                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dependency installation               | Passed and generated the npm lockfile. The installation-time npm audit reported zero vulnerabilities.                                                                                            |
| Strict TypeScript and ESLint          | Passed.                                                                                                                                                                                          |
| Next.js production build              | Passed for both root and `/portfolio/` configurations.                                                                                                                                           |
| Static output and internal references | 16 exported HTML routes and 486 internal document, media and bundle references checked for each configuration. The export includes a static error page, sitemap, robots file and `.nojekyll`.    |
| Project-site metadata                 | Confirmed the deep-route canonical and social image URL included `/portfolio/` with a simulated GitHub Pages origin. The local content remained noindex.                                         |
| Browser suite                         | 14 passed against each path configuration, plus 14 passed with gzip delivery enabled on the root build.                                                                                          |
| Responsive layout                     | Home, Work, Intelligence Core and Research checked at 360, 390, 768, 1024, 1440 and 1920 px. A separate 844 × 390 landscape test ran with JavaScript disabled.                                   |
| Keyboard and navigation               | Skip link, mobile menu, Escape, menu focus, location updates, static route transitions and direct case-study refresh checked.                                                                    |
| Portfolio and lab                     | Search, category and technology filters, empty results, reset, neural input and architecture selection checked. The lighting controls load after a request.                                      |
| Rendering                             | Reduced motion shows the poster. Forced WebGL failure preserves 2D content. Chromium software rendering initialized the hero and research canvas, and hero playback could be paused and resumed. |
| Accessibility                         | Axe returned zero violations against the selected WCAG 2.2 AA tags on Home, Work, one case study, Research, Recruiter, Contact and the Engineering Lab.                                          |
| HTTP and browser errors               | Core navigation, filters, research and hero WebGL scenarios passed console and response assertions.                                                                                              |

Desktop and mobile screenshots for Home, Work, Intelligence Core and Research are in `artifacts/screenshots/`. The local QA pass also captured the animated hero and reviewed the pages visually. The first pass identified core artwork clipping, horizontal overflow, a monogram accessible name mismatch and static prefetch requests for unavailable files. The final layout positions the art inside its cards, and navigation uses regular static links.

Browser coverage was Chromium. Automated accessibility checks cover a subset of WCAG, and the software renderer checks initialization and interaction rather than GPU frame rate. Contact actions, product listings, job records, qualifications, external profiles and professional case studies require the missing source material before they can be verified. GitHub Pages was rehearsed with local root and subpath builds. The repository and website are unpublished.
