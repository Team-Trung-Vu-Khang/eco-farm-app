import { AdminLayout } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CultivationRegionDetailView } from "./components/CultivationRegionDetailView";
import { useCultivationRegionDetailPage } from "./hooks/useCultivationRegionDetailPage";

const CultivationRegionDetailPage = () => {
  const { title, description } = useCultivationRegionDetailPage();

  return (
    <AdminLayout isRice title={title} description={description}>
      <CultivationRegionDetailView />
    </AdminLayout>
  );
};

export { CultivationRegionDetailView } from "./components/CultivationRegionDetailView";
export default CultivationRegionDetailPage;
