import PageWrapper from "@/components/PageWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Eye, Network } from "lucide-react";
import { useState } from "react";
import { IoTDeviceGroupTabContent } from "./components/IoTDeviceGroupTabContent";

type IoTDeviceGroupTab = "perception_layer" | "network_layer";

export default function IoTDeviceGroupPage() {
  const [activeTab, setActiveTab] =
    useState<IoTDeviceGroupTab>("perception_layer");

  return (
    <PageWrapper
      title="Nhóm thiết bị IOT"
      description="Quản lý danh sách các nhóm thiết bị IOT (Master Data) theo từng lớp kiến trúc"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as IoTDeviceGroupTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger
            value="perception_layer"
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Lớp cảm nhận (Perception)
          </TabsTrigger>
          <TabsTrigger
            value="network_layer"
            className="flex items-center gap-2"
          >
            <Network className="w-4 h-4" />
            Lớp mạng (Network)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perception_layer">
          <IoTDeviceGroupTabContent
            classification="perception"
            title="Lớp cảm nhận (Perception)"
            description="Các thiết bị phần cứng thu thập dữ liệu trực tiếp tại hiện trường (Node thiết bị)."
          />
        </TabsContent>

        <TabsContent value="network_layer">
          <IoTDeviceGroupTabContent
            classification="network"
            title="Lớp mạng & Truyền tải (Network)"
            description="Các công nghệ và giao thức truyền tải dữ liệu từ hiện trường về máy chủ."
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
