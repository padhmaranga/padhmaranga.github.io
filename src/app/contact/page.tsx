import { ContactContent } from "@/components/sections";
import { meta } from "@/lib/site";
export const metadata = meta(
  "Contact",
  "Connect about software engineering, AI, simulation and technical research.",
  "/contact/",
);
export default function ContactPage() {
  return (
    <div className="wrap inner-page">
      <ContactContent />
    </div>
  );
}
