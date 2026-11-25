# Padhmaranga Rajarathne · Engineering portfolio

A static Next.js portfolio with a procedural Three.js hero, a searchable work index, shareable case studies, an interactive research sandbox, an engineering lab and a print-friendly recruiter overview.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

## Preview and verify the production export

```sh
npm run typecheck
npm run lint
npm run build
npm run verify:export
npx playwright install chromium
npm test
npm run serve
```

The local static preview is available at [127.0.0.1:4173](http://127.0.0.1:4173/). Tests start the local server automatically if needed. The deployable output is in `out/`.

The local preview includes the supplied professional profile, career history, case studies, selected Drive captures, writing and Apple developer releases. The ignored `private/MEDIA_REVIEW.md` records asset provenance, the portrait edit prompt and items awaiting approval. The deployment workflow still requires the final content review.

For local review of the deck's client-branded media, set `PORTFOLIO_LOCAL_MEDIA_REVIEW=1` before building. This mode uses the media files under the ignored `private/` directory and requires an unset `NEXT_PUBLIC_SITE_URL`.

## GitHub Pages

After the final content is approved and the identity is confirmed, push the reviewed source to `USERNAME.github.io` on `main`. Choose **GitHub Actions** under **Settings → Pages → Build and deployment → Source**, then manually run **Check and deploy GitHub Pages** from the Actions tab. The artifact is published at `https://USERNAME.github.io/`. The [deployment guide](DEPLOYMENT.md) covers project-site URLs and the local rehearsal.

## Documentation

- [Architecture](ARCHITECTURE.md)
- [Content editing](CONTENT_GUIDE.md)
- [Asset checklist](ASSET_CHECKLIST.md)
- [GitHub Pages setup](DEPLOYMENT.md)
- [Quality assurance](QA_REPORT.md)
- [Performance measurements](PERFORMANCE_REPORT.md)
