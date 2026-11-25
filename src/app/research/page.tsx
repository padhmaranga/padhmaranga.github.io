import { Sandbox } from "@/components/research/sandbox";
import { Action, PageHeading, Tags } from "@/components/ui";
import { research } from "@/content/research";
import { meta } from "@/lib/site";

export const metadata = meta("Research", research.summary, "/research/");
export default function ResearchPage() {
  return (
    <div className="wrap inner-page">
      <PageHeading label="Research & innovation" title={research.title}>
        <p>{research.summary}</p>
      </PageHeading>
      <Tags items={research.themes} />
      <section className="content-block" aria-labelledby="pipeline">
        <h2 id="pipeline">From simulation to diagnosis</h2>
        <ol className="research-pipeline">
          {research.stages.map((stage) => (
            <li key={stage.title}>
              <details>
                <summary>{stage.title}</summary>
                <p>{stage.text}</p>
              </details>
            </li>
          ))}
        </ol>
      </section>
      <Sandbox />
      <div className="content-block">
        <Action href="/work/digital-twin-sandbox/" variant="text">
          Read the sandbox case study
        </Action>
      </div>
    </div>
  );
}
