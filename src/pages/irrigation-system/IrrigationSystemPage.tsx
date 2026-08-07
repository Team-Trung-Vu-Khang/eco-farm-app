import PageWrapper from "@/components/PageWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Leaf, Waves } from "lucide-react";
import { useState } from "react";
import { IrrigationSystemTabContent } from "./components/IrrigationSystemTabContent";

type ProductionDomain = "CROP" | "AQUACULTURE";

export default function IrrigationSystemPage() {
  const [activeTab, setActiveTab] = useState<ProductionDomain>("CROP");

  return (
    <PageWrapper
      title="Danh mục phương pháp bổ trợ (Tưới tiêu / Hình thức nuôi)"
      description="Quản lý phương pháp tưới tiêu cho trồng trọt hoặc hình thức nuôi cho thủy sản"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ProductionDomain)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="CROP" className="gap-2">
            <Leaf className="w-4 h-4" />
            Trồng trọt (Tưới tiêu)
          </TabsTrigger>
          <TabsTrigger value="AQUACULTURE" className="gap-2">
            <Waves className="w-4 h-4" />
            Nuôi trồng thủy sản (Hình thức nuôi)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="CROP">
          <IrrigationSystemTabContent
            domainCode="CROP"
            title="Phương pháp Tưới tiêu"
            description="Quản lý các phương pháp tưới tiêu áp dụng trong trồng trọt"
          />
        </TabsContent>

        <TabsContent value="AQUACULTURE">
          <IrrigationSystemTabContent
            domainCode="AQUACULTURE"
            title="Hình thức Nuôi trồng thủy sản"
            description="Quản lý các hình thức nuôi áp dụng trong thủy sản"
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
