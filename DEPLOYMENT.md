# GitHub Pages deployment

No Git repository or remote was present at intake. Replace `USERNAME` with the confirmed GitHub owner. The public user-site repository is `USERNAME.github.io`, and the public URL is `https://USERNAME.github.io/`. For a repository named `portfolio`, the workflow automatically builds for `https://USERNAME.github.io/portfolio/`.

## Before the first deploy

1. Review the local content and exported files against the private completion checklist. Confirm the professional identity and set `identityVerified: true` in `src/content/profile.ts` only when that record is approved.
2. After approval to publish, create the intended repository, commit the reviewed source and lockfile on `main`, and push. Keep `private/`, `artifacts/`, generated build files and source evidence outside the commit.
3. In **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**.
4. Open **Actions → Check and deploy GitHub Pages → Run workflow**, and choose `main`. The workflow builds, checks links, runs Playwright, uploads `out/` and deploys through the official Pages actions.
5. Follow the workflow’s deployment URL and check the homepage, an individual case-study URL, the research sandbox, `robots.txt` and `sitemap.xml`.

Push and pull-request runs validate the site. Only a manually dispatched run on `main` deploys it. The static artifact includes `.nojekyll` for the `_next` assets.

## Local project-site rehearsal

From PowerShell:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/portfolio'
$env:NEXT_PUBLIC_SITE_URL = 'https://USERNAME.github.io'
npm run build
npm run verify:export
npm test
npm run serve
```

The preview then serves from `http://127.0.0.1:4173/portfolio/`. Stop any running root preview before using the same port. Clear both environment variables before rebuilding the root preview. For indexing and canonical metadata, the site URL is the HTTPS origin with the path configured separately. Change the workflow’s resolved origin if a custom domain is approved later.

[GitHub Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

[Next.js static export documentation](https://nextjs.org/docs/app/guides/static-exports)
