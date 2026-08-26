import PageWrapper from "@/components/PageWrapper";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { CultivationRegionDetailView } from "./components/CultivationRegionDetailView";
import { useCultivationRegionDetailPage } from "./hooks/useCultivationRegionDetailPage";

const CultivationRegionDetailPage = () => {
  const { title, description } = useCultivationRegionDetailPage();
  const [, setLocation] = useLocation();

  return (
    <PageWrapper
      title={title}
      description={description}
      actions={
        <Button variant="outline" onClick={() => setLocation("/cultivation-region")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      <CultivationRegionDetailView />
    </PageWrapper>
  );
};

export { CultivationRegionDetailView } from "./components/CultivationRegionDetailView";
export default CultivationRegionDetailPage;
