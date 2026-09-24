import PageWrapper from "@/components/PageWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FlaskConical, Layers, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { ByProductGroupTabContent } from "./components/ByProductGroupTabContent";

type ByProductGroupTab = "origin" | "physico_chemical" | "toxicity_regulation";

const ByProductGroupPage = () => {
  const [activeTab, setActiveTab] = useState<ByProductGroupTab>("origin");

  return (
    <PageWrapper
      title="Danh mục nhóm phụ phẩm"
      description="Quản lý phân loại danh mục nhóm phụ phẩm theo 3 nhóm: Nguồn gốc, Sinh học (Lý - Hóa) và Mức độ độc hại & quy chuẩn quản lý."
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ByProductGroupTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="origin" className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4" />
            Nguồn gốc
          </TabsTrigger>
          <TabsTrigger
            value="physico_chemical"
            className="flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            Sinh học (Lý - Hóa)
          </TabsTrigger>
          <TabsTrigger
            value="toxicity_regulation"
            className="flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            Độc hại & Quy chuẩn quản lý
          </TabsTrigger>
        </TabsList>

        <TabsContent value="origin">
          <ByProductGroupTabContent
            classification="origin"
            title="Nhóm Nguồn gốc"
            description="Phân loại phụ phẩm theo nguồn gốc xuất xứ (phụ phẩm thực vật, phụ phẩm động vật, phụ phẩm vi sinh/sinh học, phụ phẩm chế biến nông công nghiệp...)."
          />
        </TabsContent>

        <TabsContent value="physico_chemical">
          <ByProductGroupTabContent
            classification="physico_chemical"
            title="Nhóm Sinh học (Lý - Hóa)"
            description="Phân loại phụ phẩm theo đặc tính sinh học, lý - hóa (dạng lỏng, dạng rắn, bột/hạt, hoai mục, lên men, nước thải xử lý, nguyên liệu giá thể...)."
          />
        </TabsContent>

        <TabsContent value="toxicity_regulation">
          <ByProductGroupTabContent
            classification="toxicity_regulation"
            title="Nhóm Mức độ độc hại và Quy chuẩn quản lý"
            description="Phân loại phụ phẩm theo mức độ an toàn, độc hại và các quy định/tiêu chuẩn lưu hành, quản lý chất thải trong nông nghiệp."
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default ByProductGroupPage;
