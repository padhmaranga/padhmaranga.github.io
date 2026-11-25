import { ExperienceContent } from "@/components/sections";
import { PageHeading } from "@/components/ui";
import { meta } from "@/lib/site";

export const metadata = meta(
  "Experience",
  "Employment history and individual technical contributions.",
  "/experience/",
);
export default function Page() {
  return (
    <div className="wrap inner-page">
      <PageHeading label="Experience" title="Professional experience">
        <p>Employment history and individual technical contributions.</p>
      </PageHeading>
      <ExperienceContent />
    </div>
  );
}
