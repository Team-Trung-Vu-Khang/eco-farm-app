import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Plus, Calendar, MapPin, Sprout } from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import usePlanStore, { type Plan } from "../../stores/usePlanStore";

export default function PlanPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Zustand store
  const plans = usePlanStore((state) => state.plans);
  const deletePlan = usePlanStore((state) => state.deletePlan);
  const getStatistics = usePlanStore((state) => state.getStatistics);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const columns: Column<Plan>[] = [
    { key: "code", label: "Mã" },
    { key: "name", label: "Tên kế hoạch" },
    { key: "seasonName", label: "Mùa vụ" },
    {
      key: "crop",
      label: "Cây trồng",

      render: (_, row) => {
        return (
          <span>
            {row.crop} {row.variety ? "- " + row.variety : ""}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (_, row) => {
        const statusConfig = {
          active: { label: "Đang thực hiện", variant: "default" as const },
          completed: { label: "Hoàn thành", variant: "secondary" as const },
          draft: { label: "Bản nháp", variant: "outline" as const },
          cancelled: { label: "Đã hủy", variant: "destructive" as const },
        };
        const config =
          statusConfig[row.status as keyof typeof statusConfig] ||
          statusConfig.draft;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    { key: "startDate", label: "Bắt đầu" },
    { key: "endDate", label: "Kết thúc" },
  ];

  const handleEdit = (item: any) => {
    setLocation(`/plan/${item.id}/edit`);
  };

  const handleDelete = (item: any) => {
    setDeleteItem({ id: item.id, name: item.name });
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deletePlan(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa kế hoạch" });
    }
    setDeleteOpen(false);
  };

  const statistics = getStatistics();
  const activeCount = statistics.active;
  const draftCount = statistics.draft;
  const completedCount = statistics.completed;

  return (
    <AdminLayout
      title="Quản lý  canh tác"
      description="Lập và quản lý kế hoạch theo mùa vụ"
      actions={
        <Link href="/plan/create">
          <Button data-testid="add-plan">
            <Plus className="w-4 h-4 mr-2" />
            Thêm kế hoạch
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Đang thực hiện</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{draftCount}</p>
              <p className="text-sm text-muted-foreground">Bản nháp</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">
                {completedCount}
              </p>
              <p className="text-sm text-muted-foreground">Hoàn thành</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={plans}
        onView={(item) => setLocation(`/plan/${item.id}`)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm kế hoạch..."
        filters={[
          {
            key: "status",
            label: "Trạng thái",
            options: [
              { label: "Đang thực hiện", value: "active" },
              { label: "Bản nháp", value: "draft" },
              { label: "Hoàn thành", value: "completed" },
              { label: "Đã hủy", value: "cancelled" },
            ],
          },
          {
            key: "seasonName",
            label: "Mùa vụ",
            options: [
              { label: "Vụ Xuân 2025", value: "Vụ Xuân 2025" },
              { label: "Vụ Hè 2025", value: "Vụ Hè 2025" },
              { label: "Vụ Thu 2025", value: "Vụ Thu 2025" },
            ],
          },
          {
            key: "crop",
            label: "Cây trồng",
            options: [
              { label: "Sầu riêng", value: "Sầu riêng" },
              { label: "Xoài", value: "Xoài" },
              { label: "Bưởi", value: "Bưởi" },
            ],
          },
        ]}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
