import { EducationContent } from "@/components/sections";
import { PageHeading } from "@/components/ui";
import { meta } from "@/lib/site";

export const metadata = meta(
  "Education",
  "Academic qualifications, ongoing study and professional certifications.",
  "/education/",
);
export default function Page() {
  return (
    <div className="wrap inner-page">
      <PageHeading label="Education" title="Education & certifications">
        <p>
          Academic qualifications, ongoing study and professional
          certifications.
        </p>
      </PageHeading>
      <EducationContent />
    </div>
  );
}
