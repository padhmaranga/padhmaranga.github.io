import { Action, PageHeading } from "@/components/ui";
export default function NotFound() {
  return (
    <div className="wrap inner-page">
      <PageHeading label="404" title="Page not found">
        <p>
          The page may have moved. You can return home or browse the portfolio.
        </p>
      </PageHeading>
      <div className="actions">
        <Action href="/" variant="primary">
          Back home
        </Action>
        <Action href="/work/">Explore work</Action>
      </div>
    </div>
  );
}
