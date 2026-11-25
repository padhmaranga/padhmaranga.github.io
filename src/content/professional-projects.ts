import type { Project } from "./projects";

type ProfessionalProject = Omit<
  Project,
  "kind" | "visibility" | "id" | "featured"
> & { featured?: boolean };
const inceptive = "Inceptive Studio";
const ceylonx = "CeylonX Corporation";
const kodex = "Kodex Play Interactive";

const records: ProfessionalProject[] = [
  {
    slug: "unreal-multiplayer-gameplay",
    title: "Unreal Multiplayer Gameplay Systems",
    featured: true,
    team: inceptive,
    summary:
      "Sessions, lobbies, chat, and replicated interactions for a shared Unreal world.",
    description:
      "I worked on the player journey from joining a session to interacting with the world alongside other clients. The goal was to make shared actions behave consistently for everyone in the session.",
    categories: ["Games & Gameplay", "Real-Time 3D & XR"],
    technologies: ["Unreal Engine", "C++", "Blueprints", "Visual Studio"],
    role: "Multiplayer gameplay engineer",
    status: "Development",
    cover: {
      src: "/projects/unreal-multiplayer/showcase.webp",
      alt: "A player character stands on a trail in the in-house Unreal multiplayer build",
      caption: "Stage 1 in-house multiplayer showcase still from slide 3.",
    },
    videos: [
      {
        driveId: "1BIKn6RFSg-SReR0Xl0EKtOJoldJ5zmNF",
        title: "Stage 1 in-house Unreal multiplayer showcase",
        summary:
          "This development recording shows the in-house multiplayer game used to test player systems and shared interactions.",
      },
    ],
    details: [
      {
        heading: "Session and lobby flow",
        text: "I built session controls, lobby transitions, matchmaking-related logic, and real-time player chat.",
      },
      {
        heading: "Replicated gameplay",
        text: "I implemented locomotion and interaction for characters, vehicles, tools, and world objects. I debugged interactions across clients to check that the same action produced consistent shared state.",
      },
    ],
    architecture: [
      "Player enters a session",
      "Lobby and chat flow",
      "Gameplay interaction",
      "Replicated world state",
    ],
    results:
      "The project connected session flow with gameplay interactions that could be exercised across multiple clients.",
  },
  {
    slug: "unity-webgl-character-customizer",
    title: "Unity WebGL Character Customizer",
    featured: true,
    team: inceptive,
    summary:
      "An in-browser tool for assembling modular 3D characters and previewing animations.",
    description:
      "I built a browser-based tool for changing character appearance, selecting modular assets, and previewing or triggering animations.",
    categories: ["Real-Time 3D & XR", "Tools & Pipelines"],
    technologies: ["Unity", "C#", "WebGL"],
    role: "Interactive 3D developer",
    status: "Browser demo",
    cover: {
      src: "/projects/dashbo/character-hub.webp",
      alt: "The DashBo character hub shows a 3D character above a row of activity previews",
      caption: "DashBo character hub still from slide 12.",
    },
    videos: [
      {
        driveId: "1uNnXro_Z3ZXvlJjugu6FIIeKc_zAticQ",
        title: "DashBo Unity WebGL character hub",
        summary:
          "The slide 12 recording shows the DashBo web hub for viewing and interacting with characters.",
      },
    ],
    details: [
      {
        heading: "A reusable character structure",
        text: "I built appearance and animation controls around modular asset variations so additional character options could fit the same interface.",
      },
      {
        heading: "Browser delivery",
        text: "I optimized assets, compression, and the Unity WebGL build for browser loading and runtime performance.",
      },
    ],
    results:
      "The tool made appearance and animation choices available in a single browser workflow and supported additional character options.",
  },
  {
    slug: "conversational-character-assistant",
    title: "Conversational 3D Character Assistant",
    featured: true,
    team: inceptive,
    summary:
      "An Unreal R&D showcase that connects a conversational assistant to a real-time character.",
    description:
      "I led R&D on a digital character that could respond conversationally and explore interactions tied to application context and external services.",
    categories: ["Applied AI", "Real-Time 3D & XR"],
    technologies: ["Unreal Engine", "OpenAI APIs", "Inworld AI"],
    role: "R&D lead and integration engineer",
    status: "R&D showcase",
    cover: {
      src: "/projects/character-assistant/showcase.webp",
      alt: "The Unreal assistant demo is staged in a dim interior with workshop lighting",
      caption: "Assistant demo environment from slide 6.",
    },
    gallery: [
      {
        src: "/projects/character-assistant/character.webp",
        alt: "A close view of the 3D assistant character in the Unreal scene",
        caption: "Assistant character detail from slide 5.",
      },
    ],
    videos: [
      {
        driveId: "1xr31STcE61oxGjDg3LLm6hFKqq7Ox8sH",
        title: "Conversational 3D Character Assistant demo",
        summary:
          "The R&D recording paired with the 3D character assistant in slide 6.",
      },
    ],
    details: [
      {
        heading: "Engine and service integration",
        text: "I connected conversational behavior to an Unreal character and explored ways to turn contextual requests into interactions with external applications, including smart-home actions.",
      },
      {
        heading: "Character behavior",
        text: "The prototype provided a place to evaluate how an assistant’s response could be presented as part of a real-time character interaction.",
      },
    ],
    architecture: [
      "User interaction",
      "Conversational AI",
      "Context or external workflow",
      "Unreal character response",
    ],
    results:
      "The work produced a public-facing R&D showcase for a conversational 3D assistant.",
    links: [
      {
        label: "Watch the assistant showcase on LinkedIn",
        url: "https://www.linkedin.com/posts/padhmaranga-madhurshika_ai-3dassistant-unrealengine-activity-7394656965077037056-RAkt",
      },
    ],
  },
  {
    slug: "web-ar-character-simulation",
    title: "Web AR Character Simulation",
    featured: true,
    team: inceptive,
    summary:
      "A mobile-browser experience that places an interactive digital character into physical space.",
    description:
      "I built an AR character experience around mobile-browser delivery so people could see and interact with a digital character in their own surroundings.",
    categories: ["Real-Time 3D & XR"],
    technologies: ["Web AR", "Real-time 3D"],
    role: "Interactive 3D developer",
    status: "Prototype",
    cover: {
      src: "/projects/web-ar/still.webp",
      alt: "An animated character appears to stand on a real desk beside a computer",
      caption: "Still from the supplied mobile AR recording.",
    },
    videos: [
      {
        src: "/projects/web-ar/preview.mp4",
        poster: "/projects/web-ar/still.webp",
        captions: "/projects/web-ar/preview.en.vtt",
        title: "Mobile AR placement capture",
        summary:
          "The camera moves around a physical desk as the overlaid character stays aligned to the surface.",
      },
    ],
    details: [
      {
        heading: "Placement and alignment",
        text: "I worked on placement, scale, and position alignment so the character could sit plausibly in the physical scene.",
      },
      {
        heading: "Mobile interaction",
        text: "I focused on real-time interaction and a browser-based flow suitable for lightweight demos across devices.",
      },
    ],
    results:
      "The prototype demonstrated the character in physical space through a mobile device.",
    links: [
      {
        label: "Watch the full Web AR recording on Google Drive",
        url: "https://drive.google.com/file/d/12A4JkMNdznWtIO7P3d7WWhbZX7bgDHXJ/view",
      },
    ],
  },
  {
    slug: "motionbridge",
    title: "MotionBridge",
    team: inceptive,
    summary:
      "A real-time Unreal pipeline that maps body movement to a digital character.",
    description:
      "I built a live motion-to-character workflow for digital presence, streaming, and interactive character experiences.",
    categories: ["Real-Time 3D & XR", "Tools & Pipelines"],
    technologies: [
      "Unreal Engine",
      "C++",
      "Blueprints",
      "MediaPipe4U",
      "Live Link",
      "VRM4U",
    ],
    role: "Real-time character systems developer",
    status: "Technical demo",
    cover: {
      src: "/projects/motionbridge/motion-preview.webp",
      alt: "A digital character poses against a green background during a live motion preview",
      caption: "MotionBridge character preview from slide 8.",
    },
    videos: [
      {
        driveId: "15cVSgqv5jATC6SaGe4DngJvXaiyARAgK",
        title: "MotionBridge live character mapping",
        summary:
          "The recording paired with the motion capture and character mapping system in slide 8.",
      },
    ],
    details: [
      {
        heading: "Live motion input",
        text: "I used MediaPipe4U for live body tracking and Live Link to bring motion updates into Unreal.",
      },
      {
        heading: "Character mapping",
        text: "I implemented avatar motion handling with VRM4U and supported workflows using FBX, GLB, and VRM assets.",
      },
    ],
  },
  {
    slug: "blender-python-pipeline",
    title: "Blender Python Character Pipeline",
    featured: true,
    team: inceptive,
    summary:
      "An internal Blender add-on that automates character variants, renders, and animation exports.",
    description:
      "I built a generator and Blender add-on to make repeated 3D character production and export steps easier to run consistently.",
    categories: ["Tools & Pipelines", "Real-Time 3D & XR"],
    technologies: ["Python", "Blender Python API", "FBX", "GLB", "glTF"],
    role: "Production tools developer",
    status: "Internal tool",
    cover: {
      src: "/projects/blender-pipeline/variants.webp",
      alt: "A grid of rendered characters with different clothing and color variations",
      caption: "Character output examples from slide 11.",
    },
    gallery: [
      {
        src: "/projects/blender-pipeline/variant-batch.webp",
        alt: "A second batch of character variants rendered with different background colors",
        caption: "Additional rendered variants from the Blender pipeline.",
      },
      {
        src: "/projects/blender-pipeline/export-samples.webp",
        alt: "A grid of sample renders showing an asset in multiple variations",
        caption: "Sample asset outputs shown alongside the character renders.",
      },
    ],
    details: [
      {
        heading: "Structured character variants",
        text: "I converted 2D character metadata into a 3D production representation and generated variants from trait combinations.",
      },
      {
        heading: "Batch rendering and export",
        text: "I automated PNG and JPEG renders, animation exports, and delivery of assets as FBX, GLB, and glTF.",
      },
    ],
    architecture: [
      "Trait metadata",
      "Variant generation",
      "Batch rendering or animation export",
      "Delivery formats",
    ],
    results:
      "The add-on produced a repeatable build and export workflow around shared metadata.",
  },
  {
    slug: "e-waste-crm-mobile",
    title: "Electronic-Waste Management CRM & Mobile App",
    featured: true,
    team: ceylonx,
    summary:
      "A shared workflow for customer records, agreements, and scheduled renewal notifications.",
    description:
      "As part of a CeylonX team, I worked on a CRM that helped an electronic-waste management client manage records and track agreements across a web and mobile workflow.",
    categories: ["Web & Business Systems"],
    technologies: ["React", "PHP", "MySQL", "Flutter"],
    role: "Full-stack and mobile contributor",
    status: "Client delivery",
    details: [
      {
        heading: "Customer and agreement workflows",
        text: "I developed CRM features for customer data, agreement tracking, and scheduled renewal notifications, and contributed to the associated Flutter application.",
      },
    ],
    results:
      "The team delivered a shared way to manage customer and agreement records, with renewal notifications built into the process.",
  },
  {
    slug: "unreal-alpha-gameplay",
    title: "Unreal Multiplayer World | Alpha Gameplay Systems",
    status: "Alpha",
    team: inceptive,
    summary:
      "Inventory, purchase logic, and runtime character customization for a team-built multiplayer alpha.",
    description:
      "On the alpha development team, I contributed player-facing systems in a customized Unreal Engine environment using Blueprints.",
    categories: ["Games & Gameplay", "Real-Time 3D & XR"],
    technologies: ["Unreal Engine", "Blueprints"],
    role: "Alpha development team contributor",
    details: [
      {
        heading: "Inventory and economy",
        text: "I implemented item acquisition, inventory management and UI, and purchase logic backed by data-driven configuration.",
      },
      {
        heading: "Modular appearance",
        text: "I integrated runtime character appearance changes with UI and refined interactions across the systems.",
      },
    ],
    results:
      "The alpha incorporated connected inventory, purchases, and customization as part of the team’s gameplay work.",
  },
  {
    slug: "smart-npc-digital-library",
    title: "Smart NPC | Digital Library",
    status: "Public demo",
    team: inceptive,
    summary:
      "A librarian NPC that supports open-ended player conversations inside an Unreal scene.",
    description:
      "I developed the dialogue system for a demonstrated virtual librarian. The scenario let players talk to a character without relying on a fixed dialogue tree.",
    categories: ["Applied AI", "Games & Gameplay"],
    technologies: ["Unreal Engine", "Conversational AI"],
    role: "NPC systems developer",
    details: [
      {
        heading: "Dialogue in the scene",
        text: "I integrated conversational AI and worked on how the librarian’s dialogue behaved and was presented inside the Unreal experience.",
      },
    ],
    results:
      "The public library demo illustrates the system in a specific, playable character scenario.",
    links: [
      {
        label: "Watch the Digital Library demo on LinkedIn",
        url: "https://www.linkedin.com/posts/padhmaranga-madhurshika_ai-unrealengine-gamedevelopment-activity-7394627149778853888-EDxs",
      },
    ],
  },
  {
    slug: "unreal-multi-user-editing",
    title: "Unreal Multi-User Editing",
    status: "Team workflow",
    team: inceptive,
    summary:
      "A shared Unreal editing workflow for parallel level and Blueprint work.",
    description:
      "I enabled Unreal’s Multi-User Editing tools to support collaboration inside the same project.",
    categories: ["Tools & Pipelines", "Games & Gameplay"],
    technologies: ["Unreal Engine", "Multi-User Editing", "Blueprints"],
    role: "Workflow implementation",
    details: [
      {
        heading: "Collaborative authoring",
        text: "I set up the shared editing workflow so teammates could work in parallel across levels and Blueprints.",
      },
    ],
    results:
      "The team could collaborate in the same project during level and Blueprint work.",
  },
  {
    slug: "sales-crm-workflows",
    title: "Sales & CRM Workflows for a Branding Agency",
    status: "Client delivery",
    team: ceylonx,
    summary:
      "Quotations, invoices, aging analysis, and follow-up flows for a branding business.",
    description:
      "As part of the CeylonX team, I built sales and customer-management features that translated existing business processes into a usable application workflow.",
    categories: ["Web & Business Systems"],
    technologies: ["PHP", "React", "Relational data"],
    role: "Full-stack developer",
    details: [
      {
        heading: "Sales operations",
        text: "I implemented quotation-based invoicing, aging analysis, customer records, email and reminders, and event-management features.",
      },
    ],
    results:
      "The work brought customer follow-up and core sales operations into the same workflow.",
  },
  {
    slug: "koombiyo",
    title: "Koombiyo: The Game",
    status: "Game project",
    team: kodex,
    summary:
      "C# gameplay and level design for a third-person open-world Unity title.",
    description:
      "I contributed to a team-developed game inspired by the Sri Lankan television series Koombiyo.",
    categories: ["Games & Gameplay"],
    technologies: ["Unity", "C#"],
    role: "Gameplay and level design contributor",
    details: [
      {
        heading: "Contribution",
        text: "I contributed C# gameplay programming and level design within the game’s third-person, open-world format.",
      },
    ],
    results:
      "My contributions formed part of the team’s gameplay and level work.",
  },
  {
    slug: "hyper-casual-mobile-series",
    title: "Hyper-Casual Mobile Game Series",
    status: "Mobile game work",
    team: kodex,
    summary:
      "Gameplay, builds, AdMob, and store discovery work across 20+ Unity titles.",
    description:
      "I worked across a series of hyper-casual Unity games, contributing to stages from gameplay and asset integration through launch preparation.",
    categories: ["Games & Gameplay"],
    technologies: ["Unity", "C#", "AdMob", "App Store Optimization"],
    role: "Mobile game developer",
    details: [
      {
        heading: "Production and release",
        text: "My work across the series included implementing gameplay, integrating assets, supporting AdMob and releases, and working on keyword research and App Store Optimization.",
      },
    ],
    results:
      "The series gave me experience across 20+ mobile projects. My developer storefront is listed separately with each title’s public attribution.",
    demo: "/products/",
  },
  {
    slug: "gameseo",
    title: "GameSEO | Mobile Game Market Intelligence",
    status: "Product launch",
    team: "GameSEO team",
    summary:
      "A team product for exploring mobile game rankings, keywords, publishers, competitors, and market trends.",
    description:
      "I publicly introduced GameSEO with the team. The product serves mobile game developers, publishers, and marketers researching the mobile game market.",
    categories: ["Web & Business Systems", "Games & Gameplay"],
    technologies: [],
    role: "Public product launch contributor",
    details: [
      {
        heading: "Product scope",
        text: "The product brings together mobile game rankings, keyword performance, publisher and competitor research, and market trends.",
      },
    ],
    results:
      "The launch announcement documents the original GameSEO product. The original site now directs visitors to AppSEO for app and game market intelligence.",
    links: [
      {
        label: "View the GameSEO transition notice",
        url: "https://gameseo.net/",
      },
      {
        label: "Read the GameSEO launch announcement",
        url: "https://www.linkedin.com/posts/padhmaranga-madhurshika_gameseo-gamedevelopment-mobilegames-activity-7475109498613997568-qv62",
      },
    ],
  },
];

export const professionalProjects: Project[] = records.map((record) => ({
  ...record,
  id: record.slug,
  featured: record.featured ?? false,
  visibility: "published",
  kind: "Professional project",
}));
