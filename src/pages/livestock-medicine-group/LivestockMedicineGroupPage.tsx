import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Activity, Beaker, ShieldAlert } from "lucide-react";
import { MedicineCategoryTabContent } from "../shared-medicine-group/components/MedicineCategoryTabContent";

type LivestockMedicineTab = "function" | "administration_route" | "control_level";

const LivestockMedicineGroupPage = () => {
  const [activeTab, setActiveTab] = useState<LivestockMedicineTab>("function");

  return (
    <PageWrapper
      title="Danh mục Thuốc (Chăn nuôi)"
      description="Quản lý phân loại thuốc chăn nuôi theo công dụng, cách dùng và mức độ kiểm soát"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as LivestockMedicineTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="function" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Công dụng
          </TabsTrigger>
          <TabsTrigger value="administration_route" className="flex items-center gap-2">
            <Beaker className="w-4 h-4" />
            Cách dùng
          </TabsTrigger>
          <TabsTrigger value="control_level" className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Mức độ kiểm soát
          </TabsTrigger>
        </TabsList>

        <TabsContent value="function">
          <MedicineCategoryTabContent
            catalog="livestock-medicine-functions"
            title="Phân loại theo Công dụng"
            description="Ví dụ: Vaccine, Thuốc kháng sinh, Thuốc kháng viêm,..."
          />
        </TabsContent>
        <TabsContent value="administration_route">
          <MedicineCategoryTabContent
            catalog="livestock-medicine-administration-routes"
            title="Phân loại theo Cách dùng"
            description="Ví dụ: Tiêm, Uống, Bôi ngoài da,..."
          />
        </TabsContent>
        <TabsContent value="control_level">
          <MedicineCategoryTabContent
            catalog="livestock-medicine-control-levels"
            title="Phân loại theo Mức độ kiểm soát"
            description="Ví dụ: Thuốc OTC, Thuốc kê đơn, Thuốc cấm/hạn chế,..."
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default LivestockMedicineGroupPage;
