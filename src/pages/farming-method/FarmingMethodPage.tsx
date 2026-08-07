import PageWrapper from "@/components/PageWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Leaf, PawPrint, Waves } from "lucide-react";
import { useState } from "react";
import { ProductionMethodTabContent } from "./components/ProductionMethodTabContent";

type ProductionDomain = "CROP" | "LIVESTOCK" | "AQUACULTURE";

const FarmingMethodPage = () => {
  const [activeTab, setActiveTab] = useState<ProductionDomain>("CROP");

  return (
    <PageWrapper
      title="Danh mục phương pháp sản xuất"
      description="Quản lý phương pháp sản xuất theo từng lĩnh vực (Trồng trọt, Chăn nuôi, Thủy sản)"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ProductionDomain)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="CROP" className="gap-2">
            <Leaf className="w-4 h-4" />
            Trồng trọt
          </TabsTrigger>
          <TabsTrigger value="LIVESTOCK" className="gap-2">
            <PawPrint className="w-4 h-4" />
            Chăn nuôi
          </TabsTrigger>
          <TabsTrigger value="AQUACULTURE" className="gap-2">
            <Waves className="w-4 h-4" />
            Nuôi trồng thủy sản
          </TabsTrigger>
        </TabsList>

        <TabsContent value="CROP">
          <ProductionMethodTabContent
            domainCode="CROP"
            title="Phương pháp Trồng trọt"
            description="Quản lý các phương pháp sản xuất áp dụng trong trồng trọt"
          />
        </TabsContent>

        <TabsContent value="LIVESTOCK">
          <ProductionMethodTabContent
            domainCode="LIVESTOCK"
            title="Phương pháp Chăn nuôi"
            description="Quản lý các phương pháp sản xuất áp dụng trong chăn nuôi"
          />
        </TabsContent>

        <TabsContent value="AQUACULTURE">
          <ProductionMethodTabContent
            domainCode="AQUACULTURE"
            title="Phương pháp Thủy sản"
            description="Quản lý các phương pháp sản xuất áp dụng trong nuôi trồng thủy sản"
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default FarmingMethodPage;
