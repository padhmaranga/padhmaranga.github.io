import { ProductsContent } from "@/components/sections";
import { PageHeading } from "@/components/ui";
import { meta } from "@/lib/site";

export const metadata = meta(
  "App Store Releases",
  "Games listed under my Apple developer storefront.",
  "/products/",
);

export default function ProductsPage() {
  return (
    <div className="wrap inner-page">
      <PageHeading label="Published games" title="App Store Releases">
        <p>
          Games listed under my Apple developer storefront. Each link opens the
          original listing.
        </p>
      </PageHeading>
      <ProductsContent />
    </div>
  );
}
