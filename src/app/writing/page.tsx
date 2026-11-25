import { writing } from "@/content/writing";
import { ExternalLink, PageHeading } from "@/components/ui";
import { meta } from "@/lib/site";

export const metadata = meta(
  "Writing",
  "Articles on Unreal and WebGL simulation, robotics digital twins, and XR in education.",
  "/writing/",
);

export default function WritingPage() {
  return (
    <div className="wrap inner-page">
      <PageHeading label="Articles" title="Writing">
        <p>
          I write about real-time simulation, digital twins, and how XR can
          support engineering and education.
        </p>
      </PageHeading>
      <ul className="writing-list">
        {writing.map((article) => (
          <li key={article.url}>
            <article>
              <p className="eyebrow">{article.topic}</p>
              <h2>{article.title}</h2>
              <p>{article.summary}</p>
            </article>
            <ExternalLink href={article.url}>
              Read on LinkedIn
              <span className="sr-only">{" — " + article.title}</span>
            </ExternalLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
