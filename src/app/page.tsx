import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { education, profile, skillGroups } from "@/content/profile";
import { professionalProjects } from "@/content/projects";
import {
  AboutContent,
  ContactContent,
  ExperienceContent,
} from "@/components/sections";
import { ProjectCard } from "@/components/project-card";
import { Action, CvLink, JsonLd, SectionHeading } from "@/components/ui";
import { Core } from "@/components/three/core";
import { HeroField } from "@/components/three/hero-field";

function Letters({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <span className="line" aria-hidden="true">
      {Array.from(text).map((char, index) => (
        <span
          key={index}
          className="char"
          style={{ "--i": index + offset } as CSSProperties}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
import { absolute, indexable, publicAsset } from "@/lib/site";

export default function Home() {
  const study = education.find((item) => item.status === "In progress");
  const stack = skillGroups.flatMap((group) => group.skills.slice(0, 3));
  return (
    <>
      {indexable && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: absolute("/"),
            mainEntity: {
              "@type": "Person",
              name: profile.name,
              jobTitle: profile.title,
              url: absolute("/"),
              image: profile.portrait && absolute(profile.portrait.src),
              sameAs: profile.links.map((item) => item.url),
            },
          }}
        />
      )}
      <section
        className="hero portrait-hero wrap"
        id="home"
        aria-labelledby="hero-title"
      >
        <HeroField />
        <div className="hero-copy">
          <p className="eyebrow hero-identity">
            <span /> {profile.location}
          </p>
          <h1 id="hero-title" aria-label="Padhmaranga Rajarathne.">
            <Letters text="Padhmaranga" />{" "}
            <Letters text="Rajarathne." offset={11} />
          </h1>
          <p className="hero-role">{profile.title}</p>
          <p className="hero-intro">{profile.introduction}</p>
          <div className="actions">
            <Action href="/work/" variant="primary">
              View Projects
            </Action>
            <Action href="/contact/">Contact</Action>
            <CvLink />
          </div>
        </div>
        {profile.portrait && (
          <figure className="hero-portrait">
            <Image
              src={publicAsset(profile.portrait.src)}
              width={profile.portrait.width}
              height={profile.portrait.height}
              alt={profile.portrait.alt}
              loading="eager"
              fetchPriority="high"
            />
            <span className="portrait-glare" aria-hidden="true" />
          </figure>
        )}
        <div className="hero-bottom">
          <a href="#work" className="scroll-link">
            <span>
              <ArrowDown size={14} aria-hidden />
            </span>{" "}
            Selected work
          </a>
          <p>
            Unreal Engine <span> / </span> Unity <span> / </span> Applied AI
          </p>
        </div>
      </section>
      <div className="marquee">
        <ul className="marquee-track" aria-label="Core stack">
          {[...stack, ...stack].map((item, index) => (
            <li key={index} aria-hidden={index >= stack.length || undefined}>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <section className="wrap section work-section" id="work">
        <SectionHeading label="Portfolio" title="Selected projects">
          <Action href="/work/" variant="text">
            View all projects
          </Action>
        </SectionHeading>
        <div className="projects-grid featured-projects">
          {professionalProjects
            .filter((project) => project.featured)
            .sort((a, b) => Number(Boolean(b.cover)) - Number(Boolean(a.cover)))
            .map((project) => (
              <div key={project.id}>
                <ProjectCard project={project} />
              </div>
            ))}
        </div>
      </section>
      <section
        className="wrap portfolio-links"
        aria-label="Public releases and writing"
      >
        <Action href="/products/" variant="text">
          App Store releases
        </Action>
        <Action href="/writing/" variant="text">
          Writing on simulation and XR
        </Action>
      </section>
      <section className="wrap section" id="about">
        <SectionHeading
          label="About"
          title="From gameplay to intelligent characters"
        >
          <Action href="/about/" variant="text">
            More about me
          </Action>
        </SectionHeading>
        <AboutContent showPortrait={false} />
        {study && (
          <p className="study-line">
            {study.title}, {study.institution} · {study.status} ·{" "}
            <Action href="/education/" variant="text">
              Education
            </Action>
          </p>
        )}
      </section>
      <section className="wrap section" id="experience">
        <SectionHeading label="Background" title="Professional experience">
          <Action href="/experience/" variant="text">
            Experience timeline
          </Action>
        </SectionHeading>
        <ExperienceContent />
      </section>
      <section
        className="wrap section"
        id="intelligence-core"
        aria-labelledby="lab-heading"
      >
        <div className="core-feature">
          <div>
            <p className="eyebrow">Engineering lab</p>
            <h2 id="lab-heading">Interactive experiments</h2>
            <p>
              Explore a procedural neural sculpture, a braking simulation, and
              other browser-based engineering experiments.
            </p>
            <Action href="/lab/">Open the lab</Action>
          </div>
          <Core />
        </div>
      </section>
      <section className="wrap section" id="contact">
        <ContactContent home />
      </section>
    </>
  );
}
