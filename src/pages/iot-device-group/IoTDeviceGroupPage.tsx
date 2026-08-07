import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Eye, Network, Plus } from "lucide-react";
import { useState } from "react";
import IoTPerceptionLayerPage from "./IoTPerceptionLayerPage";
import IoTNetworkLayerPage from "./IoTNetworkLayerPage";
import { IoTDeviceGroupFormDialog } from "./components/IoTDeviceGroupFormDialog";
import { useIoTDeviceGroupPage } from "./hooks/useIoTDeviceGroupPage";

type IoTDeviceGroupTab = "perception_layer" | "network_layer";

export default function IoTDeviceGroupPage() {
  const [activeTab, setActiveTab] =
    useState<IoTDeviceGroupTab>("perception_layer");

  const {
    formOpen,
    setFormOpen,
    editItem,
    handleAdd,
    handleEdit,
    handleSubmit,
  } = useIoTDeviceGroupPage();

  const handleStaticEdit = (item: any) => {
    handleEdit({
      id: Math.floor(Math.random() * 1000000), // Fake ID for static item
      code: item.id || item.code || "",
      name: item.label || item.name || "",
      description: item.description || "",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any);
  };

  return (
    <PageWrapper
      title="Nhóm thiết bị IOT"
      description="Quản lý danh sách các nhóm thiết bị IOT (Master Data) theo từng lớp kiến trúc"
      actions={
        <Button onClick={handleAdd} data-testid="add-iot-device-group">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm
        </Button>
      }
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
          <IoTPerceptionLayerPage onEdit={handleStaticEdit} />
        </TabsContent>

        <TabsContent value="network_layer">
          <IoTNetworkLayerPage onEdit={handleStaticEdit} />
        </TabsContent>
      </Tabs>

      <IoTDeviceGroupFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        onSubmit={handleSubmit}
      />
    </PageWrapper>
  );
}
