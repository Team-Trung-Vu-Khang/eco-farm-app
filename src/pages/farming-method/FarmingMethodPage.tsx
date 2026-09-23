import PageWrapper from "@/components/PageWrapper";
import { ProductionMethodTabContent } from "./components/ProductionMethodTabContent";

/**
 * TODO(chăn nuôi / thủy sản): hiện chỉ hỗ trợ trồng trọt nên bỏ luôn thanh tab.
 * Khi mở rộng sang LIVESTOCK / AQUACULTURE thì khôi phục title/description của PageWrapper
 * ("Danh mục phương pháp sản xuất") và dựng lại Tabs với 3 domain:
 *   <Tabs value={activeTab} onValueChange={...}>
 *     <TabsList className="grid w-full grid-cols-3 mb-6">
 *       <TabsTrigger value="CROP"><Leaf /> Trồng trọt</TabsTrigger>
 *       <TabsTrigger value="LIVESTOCK"><PawPrint /> Chăn nuôi</TabsTrigger>
 *       <TabsTrigger value="AQUACULTURE"><Waves /> Nuôi trồng thủy sản</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="CROP">...</TabsContent>
 *     <TabsContent value="LIVESTOCK">
 *       <ProductionMethodTabContent
 *         domainCode="LIVESTOCK"
 *         title="Phương pháp Chăn nuôi"
 *         description="Quản lý các phương pháp sản xuất áp dụng trong chăn nuôi"
 *       />
 *     </TabsContent>
 *     <TabsContent value="AQUACULTURE">
 *       <ProductionMethodTabContent
 *         domainCode="AQUACULTURE"
 *         title="Phương pháp Thủy sản"
 *         description="Quản lý các phương pháp sản xuất áp dụng trong nuôi trồng thủy sản"
 *       />
 *     </TabsContent>
 *   </Tabs>
 */
const FarmingMethodPage = () => {
  return (
    <PageWrapper>
      <ProductionMethodTabContent
        domainCode="CROP"
        title="Phương pháp Trồng trọt"
        description="Quản lý các phương pháp sản xuất áp dụng trong trồng trọt"
      />
    </PageWrapper>
  );
};

export default FarmingMethodPage;
