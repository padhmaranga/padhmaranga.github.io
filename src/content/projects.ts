import type { ProfessionalLink } from "./profile";

import { professionalProjects } from "./professional-projects";

export const categories = [
  "Games & Gameplay",
  "Real-Time 3D & XR",
  "Applied AI",
  "Tools & Pipelines",
  "Web & Business Systems",
] as const;
export type Category = (typeof categories)[number];
type Media = { src: string; alt: string; caption?: string };
export type ProjectCapture = { title: string; summary?: string } & (
  { src: string; captions?: string; poster?: string } | { driveId: string }
);

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  categories: Category[];
  technologies: string[];
  role: string;
  status: string;
  featured: boolean;
  visibility: "published";
  kind: "Portfolio demonstration" | "Professional project";
  cover?: Media;
  team?: string;
  gallery?: Media[];
  videos?: ProjectCapture[];
  architecture?: string[];
  results?: string;
  demo?: string;
  links?: ProfessionalLink[];
  code?: { label: string; value: string };
  comparison?: { before: Media; after: Media };
  details: { heading: string; text: string }[];
};

export const demonstrations: Project[] = [
  {
    id: "core",
    slug: "intelligence-core",
    title: "Intelligence Core",
    kind: "Portfolio demonstration",
    summary:
      "A procedural neural sculpture for the web, built from a single spatial network and layered orbital geometry.",
    description:
      "The sculpture turns a small geometric system into an interactive introduction to intelligence, engineering, immersive worlds and innovation.",
    categories: ["Tools & Pipelines"],
    technologies: ["Three.js", "React Three Fiber", "GSAP"],
    role: "Original visualization built for this portfolio",
    status: "Interactive demo",
    featured: true,
    visibility: "published",
    cover: {
      src: "/visuals/core.webp",
      alt: "A lavender spherical network surrounded by tilted orbital rings",
    },
    demo: "/#intelligence-core",
    architecture: [
      "Procedural geometry",
      "React Three Fiber scene",
      "Scroll and pointer input",
      "Visibility-aware rendering",
    ],
    results:
      "The hero exports with an inline-accessible page structure and a static image that remains available when the 3D scene is unavailable.",
    details: [
      {
        heading: "Problem & objective",
        text: "Give the portfolio a recognizable visual identity while keeping navigation and professional context immediately available.",
      },
      {
        heading: "Technical challenge",
        text: "Maintain a coherent appearance across WebGL, reduced motion and a static fallback.",
      },
      {
        heading: "Implementation",
        text: "Sample the surface of a sphere, connect close vertices and layer a metallic mesh, a wireframe and three inclined orbital paths. ScrollTrigger controls the progression through four distinct configurations.",
      },
      {
        heading: "Lessons & future work",
        text: "A deterministic network makes the fallback and interactive scene easier to align. A future iteration could evaluate the scene on a broader range of GPUs.",
      },
    ],
  },
  {
    id: "twin",
    slug: "digital-twin-sandbox",
    title: "Digital Twin Sandbox",
    kind: "Portfolio demonstration",
    summary:
      "An interactive braking model that makes physical and predicted stopping distances visible side by side.",
    description:
      "Compare two simplified friction assumptions under the same starting speed. The sandbox translates a difference in parameters into a difference in behavior.",
    categories: ["Real-Time 3D & XR"],
    technologies: ["TypeScript", "React", "Three.js"],
    role: "Original conceptual demonstration built for this portfolio",
    status: "Conceptual demo",
    featured: true,
    visibility: "published",
    cover: {
      src: "/visuals/twin.svg",
      alt: "Two labeled trajectories on a schematic road with different endpoints",
    },
    demo: "/research/#sandbox",
    architecture: [
      "Physical parameters",
      "Model assumptions",
      "Trajectory comparison",
      "Counterfactual evaluation",
    ],
    results:
      "The simplified model calculates both stopping distances and makes their difference visible as an accessible numeric result.",
    details: [
      {
        heading: "Problem & objective",
        text: "Make model mismatch observable using a single, adjustable scenario.",
      },
      {
        heading: "Technical challenge",
        text: "A discrepancy can be consistent with several causes. This sandbox fixes the inputs except for friction so the comparison is interpretable within this example.",
      },
      {
        heading: "Implementation",
        text: "Both tracks use constant braking deceleration on a level road. The sliders update the numeric result, the 2D trajectory and the optional 3D view from the same inputs.",
      },
      {
        heading: "Lessons & future work",
        text: "Explicit assumptions make a comparison easier to interpret. More realistic studies could evaluate additional parameters and uncertainty.",
      },
    ],
  },
  {
    id: "static",
    slug: "static-portfolio",
    title: "Static Portfolio Architecture",
    kind: "Portfolio demonstration",
    summary:
      "A route-based publishing system for technical case studies, interactive demos and recruiter-facing content.",
    description:
      "A typed content model powers pre-rendered routes while client-side interaction stays scoped to the features that need it.",
    categories: ["Web & Business Systems"],
    technologies: ["Next.js", "TypeScript", "Playwright"],
    role: "Original architecture built for this portfolio",
    status: "Technical case study",
    featured: false,
    visibility: "published",
    cover: {
      src: "/visuals/system.svg",
      alt: "Three modular blocks connected by a stepped publishing flow",
    },
    architecture: [
      "Typed public content",
      "Static route generation",
      "Export checks",
      "GitHub Pages artifact",
    ],
    results:
      "Direct case-study URLs are emitted as standalone static HTML and served from the export directory during browser tests.",
    details: [
      {
        heading: "Problem & objective",
        text: "Make technical content shareable and keep hosting compatible with a static file server.",
      },
      {
        heading: "Technical challenge",
        text: "Deep links, images and metadata have to resolve on both root deployments and project subpaths.",
      },
      {
        heading: "Implementation",
        text: "The App Router generates published paths at build time. Public assets use a common base-path helper and the static export is checked before upload.",
      },
      {
        heading: "Lessons & future work",
        text: "Source-level separation makes confidential material easier to exclude. Future work will focus on integrating approved evidence as it becomes available.",
      },
    ],
  },
];

export const projects = [...professionalProjects, ...demonstrations];
export { professionalProjects };

export function projectPath(slug: string) {
  return "/work/" + slug + "/";
}
