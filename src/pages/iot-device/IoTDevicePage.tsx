import {
  AdminLayout,
  Button,
  DataTable,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useLocation } from "wouter";
import useIoTDeviceStore from "../../stores/useIoTDeviceStore";
import { getDeviceColumns } from "./data/columns";

export default function IoTDevicePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { devices } = useIoTDeviceStore();

  const columns = useMemo(
    () =>
      getDeviceColumns({
        onNameClick: (device) => setLocation(`/iot-device/${device.id}`),
      }),
    [setLocation],
  );

  const handleAdd = () => {
    setLocation("/iot-device/create");
  };

  const handleExport = () => {
    toast({
      title: "Đang xuất dữ liệu",
      description: "Danh sách thiết bị đang được chuẩn bị tải về...",
    });
  };

  return (
    <AdminLayout
      title="Quản lý thiết bị IoT"
      description="Giám sát trạng thái và dữ liệu từ hệ thống cảm biến, bộ điều khiển"
      actions={
        <div className="flex items-center gap-2">
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Đăng ký thiết bị
          </Button>
        </div>
      }
    >
      <div className="h-full min-h-150">
        <DataTable
          columns={columns}
          data={devices}
          searchPlaceholder="Tìm kiếm theo tên, IMEI hoặc MAC..."
          onView={(item) => setLocation(`/iot-device/${item.id}`)}
          onEdit={(item) => setLocation(`/iot-device/${item.id}/edit`)}
        />
      </div>
    </AdminLayout>
  );
}
