# Architecture

## Static delivery

The App Router pre-renders the main pages and enumerates published case-study slugs through `generateStaticParams`. The output contains static HTML, styles, client bundles and media. A standard static HTTP server serves directory index pages. Internal navigation uses base-path-aware anchors so a host only needs to support regular file requests. There are no runtime handlers, credentials, databases or third-party scripts.

## Components and content

`src/content/profile.ts`, `projects.ts` and `research.ts` own site copy and records. Reusable sections in `src/components` render timelines, products, contact actions and project cards. Case-study records support approved roles and results, ordered architecture, galleries, captioned video, code samples and comparisons. Routing, assets, canonical URLs, structured data, sitemap and crawler directives share the site configuration.

`src/app/globals.css` contains layout, component styles and custom properties for dark surfaces, type, borders, spacing and interaction. Tailwind’s PostCSS integration supplies the CSS foundation. Space Grotesk, Inter and JetBrains Mono are served from the build.

## Browser interaction

- The project index computes category, technology and multi-term search intersections locally. Motion handles short card transitions.
- The Intelligence Core renders a procedural network, metallic geometry and orbital paths with Three.js, React Three Fiber and Drei. A static illustration ships in the HTML. Pointer movement over the artwork or the play control requests the scene, which loads after a visible WebGL 2 capability check. The same control pauses the motion. DPR, node count and pointer effects adapt to smaller screens. ScrollTrigger drives scene transformations and section reveals. Lenis initializes on the first wheel input on fine-pointer devices with standard motion preferences.
- The research sandbox calculates stopping distances client side from two sets of friction inputs. Both visualizations and the numeric result read the same calculations. The optional 3D view renders on demand.
- The engineering lab includes a small neural network, a projectile model and an architecture walkthrough and an on-demand 3D lighting studio. It also links to the digital twin demonstration.
- Reduced-motion controls, native disclosure elements, a skip link and a responsive menu keep essential content accessible through regular HTML controls.

## Public boundary

Keep documents, drafts, candidate records and unapproved media outside `src/` and `public/`. Git ignores the local `private/` directory. Everything in `public/` is copied into the output. A project record enters the public route map only after it is explicitly added to the typed published-project array.
