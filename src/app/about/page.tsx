import { AboutContent, Disciplines } from "@/components/sections";
import { PageHeading } from "@/components/ui";
import { meta } from "@/lib/site";

export const metadata = meta(
  "About",
  "Engineering practice and career interests across software, AI and real-time 3D.",
  "/about/",
);
export default function Page() {
  return (
    <div className="wrap inner-page">
      <PageHeading label="About" title="Where disciplines meet">
        <p>
          Engineering practice and career interests across software, AI and
          real-time 3D.
        </p>
      </PageHeading>
      <AboutContent />
      <Disciplines />
    </div>
  );
}
