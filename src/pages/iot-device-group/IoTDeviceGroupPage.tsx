import { useMemo } from "react";
import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  DataTable,
  DeleteDialog,
  Separator,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Download,
  Layers3,
  Plus,
  RadioTower,
  ShieldCheck,
  TriangleAlert,
  Wifi,
} from "lucide-react";
import { useLocation } from "wouter";
import { IoTDeviceGroupFormDialog } from "./components/IoTDeviceGroupFormDialog";
import { getIoTDeviceGroupColumns } from "./data/columns";
import { useIoTDeviceGroupPage } from "./hooks/useIoTDeviceGroupPage";

export default function IoTDeviceGroupPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const {
    data,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    getActualDeviceCount,
    stats,
  } = useIoTDeviceGroupPage();

  const columns = useMemo(
    () =>
      getIoTDeviceGroupColumns({
        getActualDeviceCount,
      }),
    [getActualDeviceCount],
  );

  const handleExport = () => {
    toast({
      title: "Đang xuất dữ liệu",
      description: "Danh sách nhóm IoT đang được chuẩn bị tải xuống...",
    });
  };

  return (
    <AdminLayout
      isDev={true}
      title="Nhóm thiết bị IoT"
      description="Phân nhóm cảm biến, bộ điều khiển và gateway theo chức năng triển khai"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button variant="outline" onClick={() => setLocation("/iot-device")}>
            <RadioTower className="mr-2 h-4 w-4" />
            Thiết bị IoT
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm nhóm
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-none shadow-sm ring-1 ring-slate-200/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <Layers3 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tổng nhóm
                </p>
                <div className="text-2xl font-black text-slate-900">
                  {stats.totalGroups}
                </div>
                <p className="text-xs text-slate-500">
                  {stats.activeGroups} nhóm đang hoạt động
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-slate-200/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Wifi className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Thiết bị thực tế
                </p>
                <div className="text-2xl font-black text-slate-900">
                  {stats.actualDevices}
                </div>
                <p className="text-xs text-slate-500">
                  {stats.onlineDevices} thiết bị online
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-slate-200/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                <ShieldCheck className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Dung lượng kế hoạch
                </p>
                <div className="text-2xl font-black text-slate-900">
                  {stats.plannedDevices}
                </div>
                <p className="text-xs text-slate-500">
                  Thiết bị dự kiến trên toàn hệ thống
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-slate-200/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50">
                <TriangleAlert className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Cảnh báo
                </p>
                <div className="text-2xl font-black text-slate-900">
                  {stats.alertDevices}
                </div>
                <p className="text-xs text-slate-500">
                  Thiết bị low battery hoặc error
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <Card className="xl:col-span-12 border-none shadow-sm ring-1 ring-slate-200/60">
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-row flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-slate-100 text-slate-600"
                    >
                      Master data
                    </Badge>
                    <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
                      IoT hierarchy
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Danh sách nhóm thiết bị
                  </h2>
                  <p className="text-sm text-slate-500">
                    Quản lý cấu trúc nhóm để đồng bộ phân quyền, cảnh báo và
                    theo dõi thiết bị.
                  </p>
                </div>
                <div className="flex flex-row flex-wrap items-center gap-2 lg:shrink-0">
                  <Button variant="outline" onClick={handleExport}>
                    Xuất báo cáo
                  </Button>
                  <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm nhóm mới
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Tỷ lệ sử dụng
                  </p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      {stats.plannedDevices
                        ? Math.round(
                            (stats.actualDevices / stats.plannedDevices) * 100,
                          )
                        : 0}
                      %
                    </span>
                    <span className="pb-1 text-xs text-slate-500">
                      {stats.actualDevices}/{stats.plannedDevices} thiết bị
                    </span>
                  </div>
                </div>
                <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Trạng thái vận hành
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      {stats.activeGroups}/{stats.totalGroups}
                    </span>
                    <span className="text-xs text-slate-500">nhóm active</span>
                  </div>
                </div>
                <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Gợi ý
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Ưu tiên giữ nhóm cảm biến và gateway luôn hoạt động để đảm
                    bảo dữ liệu realtime.
                  </p>
                </div>
              </div>

              <DataTable
                columns={columns}
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchPlaceholder="Tìm kiếm theo mã nhóm, tên nhóm hoặc loại thiết bị..."
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <IoTDeviceGroupFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={!!editItem}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nhóm thiết bị IoT này?"
      />
    </AdminLayout>
  );
}
