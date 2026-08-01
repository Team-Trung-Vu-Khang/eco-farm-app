import PageWrapper from "@/components/PageWrapper";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Workflow } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { CultivationRegionDetailView } from "./components/CultivationRegionDetailView";
import { useCultivationRegionDetailPage } from "./hooks/useCultivationRegionDetailPage";

const CultivationRegionDetailPage = () => {
  const { title, description } = useCultivationRegionDetailPage();
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  return (
    <PageWrapper
      title={title}
      description={description}
      actions={
        <Button
          variant="outline"
          className="gap-2"
          onClick={() =>
            setLocation(`/cultivation-region/${params.id}/workflow`)
          }
        >
          <Workflow className="h-4 w-4" />
          Workflow
        </Button>
      }
    >
      <CultivationRegionDetailView />
    </PageWrapper>
  );
};

export { CultivationRegionDetailView } from "./components/CultivationRegionDetailView";
export default CultivationRegionDetailPage;
