import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Action,
  ExternalLink,
  JsonLd,
  PageHeading,
  Tags,
} from "@/components/ui";
import { DriveVideo } from "@/components/drive-video";
import { localMediaReview } from "@/content/local-media-review";
import { ProjectCard } from "@/components/project-card";
import { projects, projectPath } from "@/content/projects";
import { absolute, indexable, meta, publicAsset } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project
    ? meta(project.title, project.summary, projectPath(project.slug))
    : {};
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const stored = projects.find((item) => item.slug === slug);
  if (!stored) notFound();
  const project = { ...stored, ...(await localMediaReview(slug)) };
  const related = projects
    .filter((item) => item.id !== project.id && item.kind === project.kind)
    .sort(
      (a, b) =>
        b.categories.filter((item) => project.categories.includes(item))
          .length -
        a.categories.filter((item) => project.categories.includes(item)).length,
    )
    .slice(0, 2);

  return (
    <article className="wrap inner-page">
      {indexable && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.summary,
            url: absolute(projectPath(project.slug)),
            image: project.cover && absolute(project.cover.src),
            keywords: project.technologies.join(", "),
          }}
        />
      )}
      <Action href="/work/" variant="text">
        All case studies
      </Action>
      <PageHeading label={project.kind} title={project.title}>
        <p>{project.summary}</p>
        {!!project.videos?.length && (
          <a className="action action-text" href="#project-capture">
            Watch the project capture
          </a>
        )}
      </PageHeading>
      {project.cover && (
        <figure className={"case-hero project-" + project.id}>
          <Image
            src={
              project.cover.src.startsWith("data:")
                ? project.cover.src
                : publicAsset(project.cover.src)
            }
            width={1200}
            height={660}
            alt={project.cover.alt}
            loading="eager"
          />
          {project.cover.caption && (
            <figcaption>{project.cover.caption}</figcaption>
          )}
        </figure>
      )}
      <div className="case-layout">
        <div className="case-content">
          <section>
            <h2>Overview</h2>
            <p>{project.description}</p>
          </section>
          {project.videos?.map((video, index) => (
            <section
              key={video.title}
              id={index === 0 ? "project-capture" : undefined}
            >
              <h2>{video.title}</h2>
              {"driveId" in video ? (
                <DriveVideo driveId={video.driveId} title={video.title} />
              ) : (
                <video
                  controls
                  playsInline
                  preload="none"
                  src={publicAsset(video.src)}
                  poster={video.poster && publicAsset(video.poster)}
                  aria-label={video.title}
                >
                  {video.captions && (
                    <track
                      src={publicAsset(video.captions)}
                      kind="captions"
                      srcLang="en"
                      label="English"
                      default
                    />
                  )}
                </video>
              )}
              {video.summary && <p className="capture-note">{video.summary}</p>}
            </section>
          ))}
          {project.details.map((entry) => (
            <section key={entry.heading}>
              <h2>{entry.heading}</h2>
              <p>{entry.text}</p>
            </section>
          ))}
          {project.architecture?.length ? (
            <section>
              <h2>System architecture</h2>
              <ol className="architecture">
                {project.architecture.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
          ) : null}
          {project.results && (
            <section>
              <h2>Results</h2>
              <p>{project.results}</p>
            </section>
          )}
          {project.gallery?.length ? (
            <section>
              <h2>Gallery</h2>
              <div className="projects-grid">
                {project.gallery.map((item) => (
                  <figure key={item.src}>
                    <Image
                      src={publicAsset(item.src)}
                      width={720}
                      height={440}
                      alt={item.alt}
                    />
                    {item.caption && <figcaption>{item.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}
          {project.code && (
            <section>
              <h2>{project.code.label}</h2>
              <pre>
                <code>{project.code.value}</code>
              </pre>
            </section>
          )}
          {project.comparison && (
            <section>
              <h2>Before and after</h2>
              <div className="projects-grid">
                {[project.comparison.before, project.comparison.after].map(
                  (item, index) => (
                    <figure key={item.src}>
                      <Image
                        src={publicAsset(item.src)}
                        width={720}
                        height={440}
                        alt={item.alt}
                      />
                      <figcaption>
                        {item.caption ?? (index === 0 ? "Before" : "After")}
                      </figcaption>
                    </figure>
                  ),
                )}
              </div>
            </section>
          )}
        </div>
        <aside className="case-facts" aria-label="Project details">
          <dl>
            <dt>Status</dt>
            <dd>{project.status}</dd>
            <dt>Role</dt>
            <dd>{project.role}</dd>
            {project.team && (
              <>
                <dt>Team</dt>
                <dd>{project.team}</dd>
              </>
            )}
            <dt>Categories</dt>
            <dd>{project.categories.join(" · ")}</dd>
            {project.technologies.length > 0 && (
              <>
                <dt>Technologies</dt>
                <dd>
                  <Tags items={project.technologies} />
                </dd>
              </>
            )}
          </dl>
          {project.demo && (
            <Action href={project.demo} variant="primary">
              Open demo
            </Action>
          )}
          {project.links?.map((item) => (
            <ExternalLink href={item.url} key={item.url}>
              {item.label}
            </ExternalLink>
          ))}
        </aside>
      </div>
      <section className="content-block">
        <h2>Related case studies</h2>
        <div className="projects-grid">
          {related.map((item) => (
            <ProjectCard key={item.id} project={item} />
          ))}
        </div>
      </section>
    </article>
  );
}
