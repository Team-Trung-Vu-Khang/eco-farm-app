import PageWrapper from "@/components/PageWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Award, Compass, DollarSign } from "lucide-react";
import { useState } from "react";
import { MaterialGroupTabContent } from "./components/MaterialGroupTabContent";

type MaterialGroupTab = "technology_level" | "value_chain" | "financial_aspect";

const MaterialGroupPage = () => {
  const [activeTab, setActiveTab] =
    useState<MaterialGroupTab>("technology_level");

  return (
    <PageWrapper
      title="Danh mục nhóm vật tư"
      description="Quản lý phân loại nhóm vật tư và thiết bị trong chuỗi giá trị nông nghiệp"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as MaterialGroupTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger
            value="technology_level"
            className="flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            Mức độ Công nghệ
          </TabsTrigger>
          <TabsTrigger value="value_chain" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Chuỗi giá trị
          </TabsTrigger>
          <TabsTrigger
            value="financial_aspect"
            className="flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Khía cạnh Tài chính
          </TabsTrigger>
        </TabsList>

        <TabsContent value="technology_level">
          <MaterialGroupTabContent
            classification="technology_level"
            title="Mức độ Công nghệ"
            description="Ví dụ: Dụng cụ thủ công (Cuốc, xẻng), Máy móc cơ giới (Máy cày, máy bơm), Thiết bị thông minh (Drone, cảm biến IoT)..."
          />
        </TabsContent>

        <TabsContent value="value_chain">
          <MaterialGroupTabContent
            classification="value_chain"
            title="Chuỗi giá trị"
            description="Ví dụ: Chuẩn bị đất (máy cày), Gieo cấy (máy sạ), Chăm sóc (máy phun thuốc), Thu hoạch (máy gặt), Bảo quản sau thu hoạch..."
          />
        </TabsContent>

        <TabsContent value="financial_aspect">
          <MaterialGroupTabContent
            classification="financial_aspect"
            title="Khía cạnh Tài chính"
            description="Ví dụ: CAPEX (Chi phí đầu tư thiết bị cố định), OPEX (Chi phí vận hành, bảo dưỡng thường xuyên)..."
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default MaterialGroupPage;
