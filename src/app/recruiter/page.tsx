import { RecruiterContent } from "@/components/sections";
import { PageHeading } from "@/components/ui";
import { profile } from "@/content/profile";
import { meta } from "@/lib/site";

export const metadata = meta(
  "Recruiter overview",
  profile.title,
  "/recruiter/",
);
export default function Page() {
  return (
    <div className="wrap inner-page">
      <PageHeading label="Recruiter overview" title={profile.name}>
        <p>{profile.title}</p>
      </PageHeading>
      <RecruiterContent />
    </div>
  );
}
