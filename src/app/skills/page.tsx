import { SkillsContent } from "@/components/sections";
import { PageHeading } from "@/components/ui";
import { meta } from "@/lib/site";

export const metadata = meta(
  "Skills",
  "Explore the tools and concepts demonstrated in the portfolio.",
  "/skills/",
);
export default function Page() {
  return (
    <div className="wrap inner-page">
      <PageHeading label="Skills" title="Technical expertise">
        <p>Explore the tools and concepts demonstrated in the portfolio.</p>
      </PageHeading>
      <SkillsContent />
    </div>
  );
}
