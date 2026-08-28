import PageWrapper from "@/components/PageWrapper";
import { CultivationRegionDetailView } from "./components/CultivationRegionDetailView";
import { useAnimalHusbandryRegionDetailPage } from "./hooks/useAnimalHusbandryRegionDetailPage";

const AnimalHusbandryRegionDetailPage = () => {
  const { title, description } = useAnimalHusbandryRegionDetailPage();

  return (
    <PageWrapper
      title={title}
      description={description}
    >
      <CultivationRegionDetailView />
    </PageWrapper>
  );
};

export { CultivationRegionDetailView } from "./components/CultivationRegionDetailView";
export default AnimalHusbandryRegionDetailPage;
