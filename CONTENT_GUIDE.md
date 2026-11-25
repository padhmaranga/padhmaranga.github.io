# Editing content

## Profile, experience and education

Edit `src/content/profile.ts` to update verified branding, professional contact, CV, portrait, experience, skills, education, certifications and products. Use public HTTPS links for external profiles, product listings and documentation. Use site-root paths such as `/documents/padhmaranga-rajarathne-cv.pdf` for approved files in `public/`. Optional empty fields suppress their actions in the UI.

Review employment dates and titles against the CV. Describe individual responsibilities separately from team achievements. For education, use the institution’s official qualification and module names and set the status to `Ongoing` or `Completed` as supported by the evidence. Context labels in the skills map should reflect the source of each skill.

## Case studies and categories

1. Work in the ignored `private/` directory while a project is draft or private. The local `project-intake.json` contains the initial candidates.
2. Verify title, dates, technologies, role, results, current status and ownership. Obtain permission for client references and media.
3. Add an approved record to `src/content/professional-projects.ts` using a permanent, unique lowercase slug. Choose categories and a featured flag. Use `Professional project` for authorized work. Include alt text and captions where they add context.
4. Copy only approved and optimized media into `public/projects/<slug>/`. Add links only when they resolve and reflect the approved distribution scope.
5. Rebuild and review the direct route, filters, related work, metadata and recruiter overview.

## Research

Edit `src/content/research.ts` after confirming the title and public scope with the approved proposal. A dedicated case study can then be added through the published project schema. Keep demonstration values and methods clearly labeled and retain research data, materials and unapproved outcomes in private storage.

## Publication review

Check public copy and public files for personal data, credentials, confidential client details and unapproved research before changing `identityVerified` or approving deployment. The source and the exported artifact both require review. Update the social card with `node scripts/share-image.mjs` after changing the public branding.
