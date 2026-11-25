import { SiteLink as Link } from "@/components/site-link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { projectPath, type Project } from "@/content/projects";
import { publicAsset } from "@/lib/site";
import { Tags } from "./ui";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={
        "project-card project-" +
        project.id +
        (project.cover ? "" : " project-text")
      }
    >
      <Link href={projectPath(project.slug)} className="project-link">
        {project.cover && (
          <div className="project-art">
            <Image
              src={publicAsset(project.cover.src)}
              width={720}
              height={440}
              alt={project.cover.alt}
              sizes="(max-width: 720px) 100vw, 50vw"
            />
            <span className="project-status">{project.status}</span>
          </div>
        )}
        <div className="project-body">
          <div>
            {!project.cover && (
              <p className="project-state">{project.status}</p>
            )}
            <p className="eyebrow">{project.categories[0]}</p>
            <h3>{project.title}</h3>
          </div>
          <span className="round-arrow" aria-hidden="true">
            <ArrowUpRight size={20} />
          </span>
          <p>{project.summary}</p>
        </div>
      </Link>
      <div className="project-extra">
        {project.technologies.length > 0 && (
          <Tags items={project.technologies} />
        )}
        <p>
          {project.role}
          {project.team && " · " + project.team}
        </p>
      </div>
    </article>
  );
}
