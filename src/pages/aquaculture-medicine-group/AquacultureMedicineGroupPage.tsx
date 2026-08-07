import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Activity, Fish, TestTube } from "lucide-react";
import { MedicineCategoryTabContent } from "../shared-medicine-group/components/MedicineCategoryTabContent";

type AquacultureMedicineTab = "function" | "target_species" | "control_residue";

const AquacultureMedicineGroupPage = () => {
  const [activeTab, setActiveTab] = useState<AquacultureMedicineTab>("function");

  return (
    <PageWrapper
      title="Danh mục Thuốc (Nuôi trồng thủy sản)"
      description="Quản lý phân loại thuốc thủy sản theo công dụng, đối tượng sử dụng và mức độ kiểm soát & dư lượng"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as AquacultureMedicineTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="function" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Công dụng
          </TabsTrigger>
          <TabsTrigger value="target_species" className="flex items-center gap-2">
            <Fish className="w-4 h-4" />
            Đối tượng sử dụng
          </TabsTrigger>
          <TabsTrigger value="control_residue" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Mức độ kiểm soát & dư lượng
          </TabsTrigger>
        </TabsList>

        <TabsContent value="function">
          <MedicineCategoryTabContent
            catalog="aquaculture-medicine-functions"
            title="Phân loại theo Công dụng"
            description="Ví dụ: Thuốc kháng sinh, Kháng nấm, Xử lý môi trường,..."
          />
        </TabsContent>
        <TabsContent value="target_species">
          <MedicineCategoryTabContent
            catalog="aquaculture-medicine-target-species"
            title="Phân loại theo Đối tượng sử dụng"
            description="Ví dụ: Tôm, Cá, Nhuyễn thể,..."
          />
        </TabsContent>
        <TabsContent value="control_residue">
          <MedicineCategoryTabContent
            catalog="aquaculture-medicine-control-residues"
            title="Phân loại theo Mức độ kiểm soát & dư lượng"
            description="Ví dụ: Kháng sinh, Hóa chất xử lý nước, Vaccine,..."
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default AquacultureMedicineGroupPage;
