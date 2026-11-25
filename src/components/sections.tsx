import {
  BrainCircuit,
  CodeXml,
  Gamepad2,
  Layers3,
  Workflow,
} from "lucide-react";
import Image from "next/image";
import {
  disciplines,
  education,
  experience,
  products,
  profile,
  skillGroups,
  storefront,
} from "@/content/profile";
import { professionalProjects, projectPath } from "@/content/projects";
import { publicAsset } from "@/lib/site";
import { CopyEmail } from "./contact-actions";
import { Action, CvLink, ExternalLink, Tags } from "./ui";

const icons = [Gamepad2, Layers3, BrainCircuit, Workflow, CodeXml];

export function Disciplines() {
  return (
    <div className="disciplines">
      {disciplines.map((item, index) => {
        const Icon = icons[index];
        return (
          <article key={item.title} className="discipline" data-reveal>
            <Icon size={25} strokeWidth={1.5} aria-hidden />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        );
      })}
    </div>
  );
}

export function AboutContent({
  showPortrait = true,
}: {
  showPortrait?: boolean;
}) {
  return (
    <div className="editorial-grid">
      <div>
        <p className="lede">{profile.bio}</p>
        <p>
          I started with Unity mobile games and C# gameplay, moved into
          client-facing web and mobile software, and now build Unreal
          multiplayer systems and AI-driven character experiences.
        </p>
        <p>
          I use concrete checks to guide the work. I reproduce replicated
          gameplay issues across clients, turn repeated Blender exports into
          repeatable steps, and build renewal or quotation workflows around the
          way people use them.
        </p>
        <p>
          I’m pursuing an MSc in Artificial Intelligence at Kingston University.
        </p>
        <div className="actions about-actions">
          <Action href="/skills/" variant="text">
            Technical skills
          </Action>
          <Action href="/writing/" variant="text">
            Read my writing
          </Action>
        </div>
      </div>
      <div>
        {showPortrait && profile.portrait && (
          <Image
            className="about-portrait"
            src={publicAsset(profile.portrait.src)}
            width={profile.portrait.width}
            height={profile.portrait.height}
            alt={profile.portrait.alt}
          />
        )}
        <dl className="profile-facts">
          <div>
            <dt>Based in</dt>
            <dd>{profile.location}</dd>
          </div>
          <div>
            <dt>Languages</dt>
            <dd>{profile.languages.join(" and ")}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function ExperienceContent() {
  return (
    <div className="timeline">
      {experience.map((item, index) => (
        <details key={item.company} open={index === 0}>
          <summary>
            <strong>{item.title}</strong>
            <span>
              {item.company} · {item.location} · {item.dates}
            </span>
          </summary>
          <div className="record-body">
            <ul>
              {[...item.responsibilities, ...item.contributions].map(
                (entry) => (
                  <li key={entry}>{entry}</li>
                ),
              )}
            </ul>
            <Tags items={item.technologies} />
            <div className="actions">
              {item.projects.flatMap((slug) => {
                const project = professionalProjects.find(
                  (entry) => entry.slug === slug,
                );
                return project
                  ? [
                      <Action key={slug} href={projectPath(slug)}>
                        {project.title}
                      </Action>,
                    ]
                  : [];
              })}
              {item.link && (
                <ExternalLink href={item.link.url}>
                  {item.link.label}
                </ExternalLink>
              )}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

export function SkillsContent() {
  return (
    <div className="timeline skills-map">
      {skillGroups.map((group) => (
        <details key={group.name}>
          <summary>
            <strong>{group.name}</strong>
            <span>{group.context}</span>
          </summary>
          <div className="record-body">
            <Tags items={group.skills} />
            <Action href={projectPath(group.project)} variant="text">
              Related case study
            </Action>
          </div>
        </details>
      ))}
    </div>
  );
}

export function EducationContent() {
  return (
    <div className="timeline">
      {education.map((item) => (
        <details key={item.title} open={item.status === "In progress"}>
          <summary>
            <strong>{item.title}</strong>
            <span>
              {item.institution} · {item.status} · {item.dates}
            </span>
          </summary>
          {item.notes && (
            <div className="record-body">
              <p>{item.notes}</p>
            </div>
          )}
        </details>
      ))}
    </div>
  );
}

export function ProductsContent() {
  return (
    <>
      <ul className="release-list">
        {products.map((item) => (
          <li key={item.url}>
            <ExternalLink href={item.url}>
              {item.name}
              <span className="sr-only"> on the App Store</span>
            </ExternalLink>
          </li>
        ))}
      </ul>
      <div className="actions">
        <ExternalLink href={storefront}>
          Visit the Apple developer storefront
        </ExternalLink>
      </div>
    </>
  );
}

export function ContactContent({ home = false }: { home?: boolean }) {
  const Heading = home ? "h2" : "h1";
  return (
    <div className="contact-panel">
      <p className="eyebrow">Contact</p>
      <Heading>
        Let’s talk about <em>your project.</em>
      </Heading>
      <p>
        I’m based in the {profile.location}. Get in touch about gameplay
        systems, real-time 3D, applied AI, or software engineering roles.
      </p>
      {profile.email && (
        <p>
          <a href={"mailto:" + profile.email}>{profile.email}</a>
        </p>
      )}
      <div className="actions">
        {profile.links.map((link) => (
          <ExternalLink key={link.url} href={link.url}>
            {link.label}
          </ExternalLink>
        ))}
        {profile.email && (
          <>
            <a
              className="action action-primary"
              href={"mailto:" + profile.email}
            >
              Email me
            </a>
            <CopyEmail email={profile.email} />
          </>
        )}
        <CvLink />
        <Action href="/recruiter/">Recruiter overview</Action>
      </div>
    </div>
  );
}

export function RecruiterContent() {
  return (
    <>
      <div className="actions">
        <CvLink />
        <Action href="/work/" variant="primary">
          View projects
        </Action>
        {profile.links.map((link) => (
          <ExternalLink href={link.url} key={link.url}>
            {link.label}
          </ExternalLink>
        ))}
      </div>
      <section className="content-block">
        <h2>Technical focus</h2>
        <p className="lede">{profile.bio}</p>
        <Tags items={disciplines.map((item) => item.title)} />
      </section>
      <section className="content-block">
        <h2>Selected projects</h2>
        <ul className="recruiter-list">
          {professionalProjects
            .filter((entry) => entry.featured)
            .map((entry) => (
              <li key={entry.id}>
                <Action href={projectPath(entry.slug)} variant="text">
                  {entry.title}
                </Action>
                <p>{entry.summary}</p>
              </li>
            ))}
        </ul>
      </section>
      <section className="content-block">
        <h2>Professional experience</h2>
        <ExperienceContent />
      </section>
      <section className="content-block">
        <h2>Education</h2>
        <EducationContent />
      </section>
    </>
  );
}
