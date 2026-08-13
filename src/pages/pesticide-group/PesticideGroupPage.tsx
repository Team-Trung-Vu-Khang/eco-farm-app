import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertTriangle, Droplet, Leaf, Activity, Beaker } from "lucide-react";
import { MedicineCategoryTabContent } from "../shared-medicine-group/components/MedicineCategoryTabContent";

export type PesticideGroupTab =
  | "target_pest"
  | "origin"
  | "toxicity_level"
  | "mode_of_action"
  | "formulation";

const PesticideGroupPage = () => {
  const [activeTab, setActiveTab] = useState<PesticideGroupTab>("target_pest");

  return (
    <PageWrapper
      title="Danh mục Thuốc BVTV (Dành cho trồng trọt)"
      description="Quản lý phân loại thuốc bảo vệ thực vật theo đối tượng, nguồn gốc, mức độ độc hại, cơ chế tác động và dạng bào chế"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as PesticideGroupTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="target_pest" className="flex items-center gap-2">
            <Droplet className="w-4 h-4" />
            Công dụng thuốc
          </TabsTrigger>
          <TabsTrigger value="origin" className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Nguồn gốc
          </TabsTrigger>
          <TabsTrigger
            value="toxicity_level"
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Độc tính
          </TabsTrigger>
          <TabsTrigger
            value="mode_of_action"
            className="flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Cơ chế tác động
          </TabsTrigger>
          <TabsTrigger value="formulation" className="flex items-center gap-2">
            <Beaker className="w-4 h-4" />
            Dạng bào chế
          </TabsTrigger>
        </TabsList>

        <TabsContent value="target_pest">
          <MedicineCategoryTabContent
            domainCode="CROP"
            classification="target_group"
            title="Công dụng thuốc"
            description="Ví dụ: Thuốc trừ sâu, Thuốc trừ nấm, Thuốc trừ cỏ..."
          />
        </TabsContent>
        <TabsContent value="origin">
          <MedicineCategoryTabContent
            domainCode="CROP"
            classification="origin"
            title="Nguồn gốc"
            description="Ví dụ: Hóa học tổng hợp, Sinh học, Thảo mộc..."
          />
        </TabsContent>
        <TabsContent value="toxicity_level">
          <MedicineCategoryTabContent
            domainCode="CROP"
            classification="toxicity"
            title="Mức độ độc hại"
            description="Theo chuẩn WHO (Ia, Ib, II, III, U)"
          />
        </TabsContent>
        <TabsContent value="mode_of_action">
          <MedicineCategoryTabContent
            domainCode="CROP"
            classification="mode_of_action"
            title="Cơ chế tác động"
            description="Ví dụ: Vị độc, Tiếp xúc, Nội hấp..."
          />
        </TabsContent>
        <TabsContent value="formulation">
          <MedicineCategoryTabContent
            domainCode="CROP"
            classification="dosage_form"
            title="Dạng bào chế"
            description="Ví dụ: Nhũ dầu (EC), Huyền phù (SC), Bột (WP)..."
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default PesticideGroupPage;
