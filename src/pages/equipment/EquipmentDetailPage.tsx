import {
  AdminLayout,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, Edit } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import useEquipmentStore from "../../stores/useEquipmentStore";
import { EquipmentDetailHeader } from "./components/detail/EquipmentDetailHeader";
import { EquipmentDetailSidebar } from "./components/detail/EquipmentDetailSidebar";
import {
  DocsTab,
  InfoTab,
  MaintenanceTab,
  UsageTab,
} from "./components/detail/EquipmentDetailTabs";

const EquipmentDetailPage = () => {
  const [, params] = useRoute("/equipment/:id");
  const [, setLocation] = useLocation();
  const id = params?.id ? Number(params.id) : 0;

  const getEquipmentById = useEquipmentStore((state) => state.getEquipmentById);
  const item = getEquipmentById(id);

  if (!item) {
    return (
      <AdminLayout isDev={true} title="Chi tiết thiết bị">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin thiết bị.
          </p>
          <Button onClick={() => setLocation("/equipment")}>
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isDev={true}
      title="Chi tiết thiết bị"
      description={`Thông tin và lịch sử bảo dưỡng của ${item.name}`}
      actions={
        <Button onClick={() => setLocation(`/equipment/${id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </Button>
      }
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/equipment")}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <EquipmentDetailHeader item={item} />

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="info">Thông tin</TabsTrigger>
              <TabsTrigger value="history">Lịch sử dùng</TabsTrigger>
              <TabsTrigger value="maintenance">Bảo trì</TabsTrigger>
              <TabsTrigger value="docs">Tài liệu</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6 space-y-6">
              <InfoTab item={item} />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <UsageTab />
            </TabsContent>

            <TabsContent value="maintenance" className="mt-6">
              <MaintenanceTab />
            </TabsContent>

            <TabsContent value="docs" className="mt-6">
              <DocsTab equipmentCode={item.code} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <EquipmentDetailSidebar />
        </div>
      </div>
    </AdminLayout>
  );
};

export default EquipmentDetailPage;
