export type ProfessionalLink = { label: string; url: string };

const linkedin = "https://www.linkedin.com/in/padhmaranga-madhurshika/";
export const storefront =
  "https://apps.apple.com/sa/developer/padhmaranga-madhurshika/id1396402406";

type Profile = {
  name: string;
  initials: string;
  title: string;
  introduction: string;
  bio: string;
  location: string;
  languages: string[];
  email?: string;
  cv?: string;
  portrait?: { src: string; alt: string; width: number; height: number };
  links: ProfessionalLink[];
  years?: number;
  identityVerified: boolean;
};

export const profile: Profile = {
  name: "Padhmaranga Rajarathne",
  initials: "PR",
  title: "Senior Game Developer & Software Engineer",
  introduction:
    "I build multiplayer gameplay, real-time 3D experiences, and AI-powered character systems with Unreal Engine, Unity, C++, C#, and Python.",
  bio: "I’m a UAE-based software engineer with 8+ years across game development, interactive 3D, and business applications. I’ve worked on Unreal multiplayer systems, Unity WebGL character tools, browser-based AR, and conversational AI for digital characters. I also build Python tools for 3D production and have delivered ERP and CRM features across web and mobile.",
  location: "United Arab Emirates",
  languages: ["English", "Sinhala"],
  years: 8,
  portrait: {
    src: "/images/padhmaranga-rajarathne.webp",
    alt: "Padhmaranga Rajarathne wearing glasses and a slate-blue jacket",
    width: 960,
    height: 960,
  },
  identityVerified: true,
  links: [{ label: "Connect on LinkedIn", url: linkedin }],
};

export const experience: {
  company: string;
  title: string;
  dates: string;
  location: string;
  responsibilities: string[];
  contributions: string[];
  technologies: string[];
  projects: string[];
  link?: ProfessionalLink;
}[] = [
  {
    company: "Inceptive Public Relations Management LLC (Inceptive Studio)",
    title: "Senior Game Developer and Software Engineer",
    dates: "February 2022–Present",
    location: "Dubai, UAE",
    responsibilities: [
      "Build real-time experiences with Unreal C++ and Blueprints and browser-based 3D with Unity WebGL.",
    ],
    contributions: [
      "Implemented multiplayer sessions, lobbies, real-time chat, interactions, and replication across characters, vehicles, tools, and world objects.",
      "Contributed inventory, economy, and runtime customization systems to a team-built Unreal alpha.",
      "Built browser character customization and animation controls, web AR placement, and Python tooling for character production.",
      "Led R&D on a real-time character assistant using OpenAI and Inworld AI, and enabled Multi-User Editing for parallel level and Blueprint work.",
    ],
    technologies: [
      "Unreal Engine",
      "C++",
      "Blueprints",
      "Unity WebGL",
      "Python",
      "OpenAI APIs",
      "Inworld AI",
    ],
    projects: [
      "unreal-multiplayer-gameplay",
      "unity-webgl-character-customizer",
      "conversational-character-assistant",
    ],
  },
  {
    company: "CeylonX Corporation Pvt Ltd",
    title: "Full Stack Developer",
    dates: "April 2020–February 2022",
    location: "Colombo, Sri Lanka",
    responsibilities: [
      "Delivered custom ERP, CRM, and mobile features with React, PHP, MySQL, and Flutter.",
    ],
    contributions: [
      "Implemented customer records, agreement tracking, and renewal notifications for an electronic-waste management client and contributed to the Flutter application.",
      "Built sales workflows for quotations and invoicing, aging analysis, customer follow-up, notifications, and event management.",
    ],
    technologies: ["React", "PHP", "MySQL", "Flutter"],
    projects: ["e-waste-crm-mobile", "sales-crm-workflows"],
    link: {
      label: "CeylonX company portfolio",
      url: "https://ceylonx.co/portfolio/",
    },
  },
  {
    company: "Kodex Play Interactive Pvt Ltd",
    title: "Mobile Game Developer",
    dates: "January 2018–March 2020",
    location: "Sri Lanka",
    responsibilities: [
      "Contributed C# gameplay programming and level design to Koombiyo: The Game.",
    ],
    contributions: [
      "Worked across 20+ hyper-casual Unity titles, spanning gameplay, asset integration, AdMob, release activities, App Store Optimization, and keyword research.",
    ],
    technologies: ["Unity", "C#", "AdMob", "App Store Optimization"],
    projects: ["koombiyo", "hyper-casual-mobile-series"],
  },
];

export const education: {
  title: string;
  institution: string;
  status: "In progress" | "Completed";
  dates: string;
  notes?: string;
}[] = [
  {
    title: "MSc Artificial Intelligence",
    institution: "Kingston University",
    status: "In progress",
    dates: "September 2026–Present · Expected July 2027",
    notes: "Delivered through ESOFT, Colombo.",
  },
  {
    title: "PCJT Software Engineer III, SCQF Level 9",
    institution: "Scottish Qualifications Authority",
    status: "Completed",
    dates: "May 2021",
    notes: "Studied at Java Institute for Advanced Technology, Colombo.",
  },
  {
    title: "Professional Higher Diploma in Software Engineering, SCQF Level 8",
    institution: "Scottish Qualifications Authority",
    status: "Completed",
    dates: "March 2021",
    notes: "Studied at Java Institute for Advanced Technology, Colombo.",
  },
  {
    title: "Professional Diploma in Software Engineering, SCQF Level 7",
    institution: "Scottish Qualifications Authority",
    status: "Completed",
    dates: "July 2018",
    notes: "Studied at Java Institute for Advanced Technology, Colombo.",
  },
];

const storeEntries = [
  ["Magnet Forge", "magnet-forge", "6820222053"],
  [
    "Tuk Tuk Choon Pan: Street Food",
    "tuk-tuk-choon-pan-street-food",
    "6736861301",
  ],
  ["Little Bulldozer", "little-bulldozer", "1506345998"],
  ["Little Scientist", "little-scientist", "1497871671"],
  ["The KITT Game Official", "the-kitt-game-official", "1435602107"],
  ["KDH Legends: Game", "kdh-legends-game", "1428950593"],
  ["Tuk Tuk Sri Lankan Riders", "tuk-tuk-sri-lankan-riders", "1396402407"],
];

export const products = storeEntries.map(([name, slug, id]) => ({
  name,
  url: "https://apps.apple.com/sa/app/" + slug + "/id" + id,
}));

export const disciplines = [
  {
    title: "Games & gameplay",
    text: "Build and debug networked gameplay, from Unreal lobbies and replication to Unity C# gameplay and level design.",
  },
  {
    title: "Real-time 3D & XR",
    text: "Deliver interactive characters through Unity WebGL and mobile-browser AR.",
  },
  {
    title: "Applied AI",
    text: "Connect conversational models to the behavior of real-time 3D characters and NPCs.",
  },
  {
    title: "Tools & pipelines",
    text: "Use Python and Blender to generate character variants and make rendering and export repeatable.",
  },
  {
    title: "Web & business systems",
    text: "Turn agreements, renewals, quotations, and invoicing into workflows teams can use.",
  },
];

export const skillGroups = [
  {
    name: "Unreal Engine & C++",
    context: "Multiplayer gameplay and collaborative editing",
    skills: [
      "C++",
      "Blueprints",
      "Replication",
      "Sessions and lobbies",
      "Real-time chat",
      "Inventory",
      "Animation retargeting",
      "ODK",
      "Multi-User Editing",
      "UEFN exposure",
    ],
    project: "unreal-multiplayer-gameplay",
  },
  {
    name: "Unity & C#",
    context: "Mobile games and browser-based character tools",
    skills: [
      "C#",
      "Unity WebGL",
      "Level design",
      "Animation controls",
      "Asset optimization",
      "AdMob",
      "ASO",
    ],
    project: "unity-webgl-character-customizer",
  },
  {
    name: "Applied AI",
    context: "Conversational characters and R&D",
    skills: [
      "OpenAI APIs",
      "Inworld AI",
      "NPC dialogue",
      "Contextual interactions",
      "External service integration",
    ],
    project: "conversational-character-assistant",
  },
  {
    name: "Simulation & XR",
    context: "Interactive characters and spatial placement",
    skills: [
      "Real-time 3D",
      "Mobile browser AR",
      "Character animation",
      "Spatial placement",
      "Multiplayer environments",
    ],
    project: "web-ar-character-simulation",
  },
  {
    name: "Python & 3D production",
    context: "Character production and repeatable export",
    skills: [
      "Python",
      "Blender Python API",
      "Structured metadata",
      "Batch rendering",
      "FBX",
      "GLB",
      "glTF",
    ],
    project: "blender-python-pipeline",
  },
  {
    name: "Web, backend & mobile",
    context: "ERP, CRM and business workflows",
    skills: [
      "React",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "PHP",
      "SQL",
      "MySQL",
      "PostgreSQL",
      "REST APIs",
      "Flutter",
      "Next.js familiarity",
    ],
    project: "e-waste-crm-mobile",
  },
  {
    name: "Engineering delivery",
    context: "Collaboration, testing and infrastructure",
    skills: [
      "Git",
      "Agile / Scrum",
      "CI/CD",
      "AWS",
      "Azure",
      "Docker",
      "Codex",
      "Claude",
      "Cursor",
    ],
    project: "unreal-multi-user-editing",
  },
];
