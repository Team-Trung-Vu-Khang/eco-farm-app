import PageWrapper from "@/components/PageWrapper";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Workflow } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { AquacultureRegionDetailView } from "./components/AquacultureRegionDetailView";
import { useAquacultureRegionDetailPage } from "./hooks/useAquacultureRegionDetailPage";

const AquacultureRegionDetailPage = () => {
  const detailMeta = useAquacultureRegionDetailPage();
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  return (
    <PageWrapper
      title={detailMeta.title}
      description={detailMeta.description}
      actions={
        <Button
          variant="outline"
          className="gap-2"
          onClick={() =>
            setLocation(`/aquaculture-region/${params.id}/workflow`)
          }
        >
          <Workflow className="h-4 w-4" />
          Workflow
        </Button>
      }
    >
      <AquacultureRegionDetailView basePath="/aquaculture-region" />
    </PageWrapper>
  );
};

export { AquacultureRegionDetailView } from "./components/AquacultureRegionDetailView";
export default AquacultureRegionDetailPage;
