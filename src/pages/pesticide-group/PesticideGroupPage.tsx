import {
  AdminLayout,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertTriangle, Droplet, Leaf } from "lucide-react";
import { useState } from "react";
import PesticideOriginPage from "./PesticideOriginPage";
import PesticidePurposePage from "./PesticidePurposePage";
import PesticideToxicityPage from "./PesticideToxicityPage";
import type { PesticideGroupTab } from "./types";

const PesticideGroupPage = () => {
  const [activeTab, setActiveTab] = useState<PesticideGroupTab>("purpose");

  return (
    <AdminLayout
      isDev={true}
      title="Danh mục thuốc BVTV"
      description="Quản lý phân loại thuốc bảo vệ thực vật theo công dụng, độ độc tính và nguồn gốc"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as PesticideGroupTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="purpose" className="flex items-center gap-2">
            <Droplet className="w-4 h-4" />
            Công dụng
          </TabsTrigger>
          <TabsTrigger value="toxicity" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Độ độc tính
          </TabsTrigger>
          <TabsTrigger value="origin" className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Nguồn gốc
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purpose">
          <PesticidePurposePage />
        </TabsContent>

        <TabsContent value="toxicity">
          <PesticideToxicityPage />
        </TabsContent>

        <TabsContent value="origin">
          <PesticideOriginPage />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default PesticideGroupPage;
