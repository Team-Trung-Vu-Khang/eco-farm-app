import PageWrapper from "@/components/PageWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Beaker, Box, Calendar, Leaf } from "lucide-react";
import { useState } from "react";
import { FertilizerGroupTabContent } from "./components/FertilizerGroupTabContent";

type FertilizerGroupTab =
  | "nutritional_content"
  | "origin"
  | "application_stage"
  | "physical_form";

const FertilizerGroupPage = () => {
  const [activeTab, setActiveTab] = useState<FertilizerGroupTab>(
    "nutritional_content",
  );

  return (
    <PageWrapper
      title="Danh mục phân bón"
      description="Quản lý phân loại phân bón theo thành phần, nguồn gốc, giai đoạn và hình thái"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as FertilizerGroupTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger
            value="nutritional_content"
            className="flex items-center gap-2"
          >
            <Beaker className="w-4 h-4" />
            Thành phần dinh dưỡng
          </TabsTrigger>
          <TabsTrigger value="origin" className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Nguồn gốc
          </TabsTrigger>
          <TabsTrigger
            value="application_stage"
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Giai đoạn tác động
          </TabsTrigger>
          <TabsTrigger
            value="physical_form"
            className="flex items-center gap-2"
          >
            <Box className="w-4 h-4" />
            Hình thái vật lý
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nutritional_content">
          <FertilizerGroupTabContent
            classification="nutrient_composition"
            title="Thành phần dinh dưỡng"
            description="Ví dụ: Đa lượng (NPK), Trung lượng (Canxi, Magie), Vi lượng (Đồng, Kẽm)..."
          />
        </TabsContent>

        <TabsContent value="origin">
          <FertilizerGroupTabContent
            classification="origin"
            title="Nguồn gốc"
            description="Ví dụ: Hóa học (Vô cơ), Hữu cơ (Phân chuồng, Phân xanh), Sinh học (Vi sinh)..."
          />
        </TabsContent>

        <TabsContent value="application_stage">
          <FertilizerGroupTabContent
            classification="effect_stage"
            title="Giai đoạn tác động"
            description="Ví dụ: Bón lót (cải tạo đất trước gieo), Bón thúc đẻ nhánh, Bón nuôi quả..."
          />
        </TabsContent>

        <TabsContent value="physical_form">
          <FertilizerGroupTabContent
            classification="physical_form"
            title="Hình thái vật lý"
            description="Ví dụ: Dạng hạt, Dạng bột, Dạng lỏng (phun lá, tưới gốc)..."
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default FertilizerGroupPage;
