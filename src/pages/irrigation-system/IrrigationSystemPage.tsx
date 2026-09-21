import PageWrapper from "@/components/PageWrapper";
// TODO: Tạm ẩn tabs lĩnh vực, mặc định chỉ còn "Trồng trọt" (CROP)
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@Team-Trung-Vu-Khang/eco-shared-ui";
// import { Leaf, Waves } from "lucide-react";
// import { useState } from "react";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { IrrigationSystemTabContent } from "./components/IrrigationSystemTabContent";
import { useIrrigationSystemPage } from "./hooks/useIrrigationSystemPage";

// type ProductionDomain = "CROP" | "AQUACULTURE";

export default function IrrigationSystemPage() {
  // const [activeTab, setActiveTab] = useState<ProductionDomain>("CROP");
  const page = useIrrigationSystemPage("CROP");

  return (
    <PageWrapper
      title="Danh mục phương pháp tưới tiêu"
      description="Quản lý phương pháp tưới tiêu cho trồng trọt"
      actions={
        <Button onClick={page.handleAdd} data-testid="add-crop-method">
          <Plus className="w-4 h-4 mr-2" />
          Thêm phương pháp
        </Button>
      }
    >
      {/* TODO: Tạm ẩn tabs lĩnh vực (Trồng trọt / Nuôi trồng thủy sản).
          Khi cần bật lại: bọc bằng <Tabs>/<TabsList>/<TabsTrigger>, và với mỗi
          tab gọi useIrrigationSystemPage(<domainCode>) rồi truyền xuống
          <IrrigationSystemTabContent page={...} />. */}

      <IrrigationSystemTabContent page={page} />
    </PageWrapper>
  );
}
