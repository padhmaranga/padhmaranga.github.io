import { Lab } from "@/components/lab";
import { Action, PageHeading } from "@/components/ui";
import { meta } from "@/lib/site";

export const metadata = meta(
  "Engineering lab",
  "Interactive sketches for neural networks, simulation and software systems.",
  "/lab/",
);

export default function LabPage() {
  return (
    <div className="wrap inner-page">
      <PageHeading label="Engineering lab" title="Small experiments">
        <p>
          Explore one engineering idea at a time. The models use illustrative
          parameters and run in your browser.
        </p>
      </PageHeading>
      <Lab />
      <div className="actions about-actions">
        <Action href="/#intelligence-core">Intelligence Core</Action>
        <Action href="/work/static-portfolio/">Portfolio architecture</Action>
      </div>
    </div>
  );
}
