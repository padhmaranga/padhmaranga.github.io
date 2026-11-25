import { Portfolio } from "@/components/portfolio";
import { Action, PageHeading } from "@/components/ui";
import { professionalProjects } from "@/content/projects";
import { meta } from "@/lib/site";

export const metadata = meta(
  "Projects",
  "Case studies in gameplay, real-time 3D, applied AI, production tooling, and business software.",
  "/work/",
);

export default function WorkPage() {
  return (
    <div className="wrap inner-page">
      <PageHeading label="Portfolio" title="Projects">
        <p>
          Explore what I built, the engineering decisions behind it, and my
          contribution to each team’s work.
        </p>
      </PageHeading>
      <Portfolio projects={professionalProjects} />
      <div className="content-block">
        <Action href="/lab/" variant="text">
          Explore interactive lab demos
        </Action>
      </div>
    </div>
  );
}
