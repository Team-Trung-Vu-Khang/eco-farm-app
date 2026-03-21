import { useState } from "react";
import { useLocation } from "wouter";
import {
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  Sprout,
  ClipboardCheck,
  ArrowUpRight,
  Eye,
  List,
  Edit,
  Trash2,
} from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  DataTable,
  DeleteDialog,
  useToast,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useAmendmentPlanStore, {
  type AmendmentPlan,
} from "../../stores/useAmendmentPlanStore";

const getStatusConfig = (status: string) => {
  switch (status) {
    case "planning":
      return {
        label: "Đang lập kế hoạch",
        variant: "outline" as const,
        className: "text-blue-600 border-blue-200 bg-blue-50",
      };
    case "in_progress":
      return {
        label: "Đang thực hiện",
        variant: "default" as const,
        className: "bg-green-600 hover:bg-green-700",
      };
    case "completed":
      return {
        label: "Hoàn thành",
        variant: "secondary" as const,
        className: "bg-slate-100 text-slate-600",
      };
    case "cancelled":
      return {
        label: "Đã hủy",
        variant: "destructive" as const,
        className: "",
      };
    default:
      return {
        label: "Không xác định",
        variant: "outline" as const,
        className: "",
      };
  }
};

export default function AmendmentPlanPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Zustand store
  const plans = useAmendmentPlanStore((state) => state.plans);
  const deletePlan = useAmendmentPlanStore((state) => state.deletePlan);
  const getStatistics = useAmendmentPlanStore((state) => state.getStatistics);

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Dialog States
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  // Selection States
  const [selectedItem, setSelectedItem] = useState<AmendmentPlan | null>(null);

  const columns: Column<AmendmentPlan>[] = [
    {
      key: "code",
      label: "Mã",
      render: (val) => (
        <span className="font-mono text-xs font-medium text-slate-500">
          {val}
        </span>
      ),
    },
    {
      key: "name",
      label: "Tên kế hoạch",
      render: (val, item) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{val}</span>
          <span
            className="text-xs text-slate-500 truncate max-w-[200px]"
            title={item.target_issue}
          >
            {item.target_issue}
          </span>
        </div>
      ),
    },
    {
      key: "zone",
      label: "Khu vực",
      render: (val) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sm">{val}</span>
        </div>
      ),
    },
    {
      key: "technician",
      label: "Phụ trách",
      render: (val) => <span className="text-sm text-slate-700">{val}</span>,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (val) => {
        const config = getStatusConfig(val as string);
        return (
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "startDate",
      label: "Tiến độ",
      render: (_, item) => (
        <div className="text-xs text-slate-500 flex flex-col gap-0.5">
          <div className="flex justify-between items-center gap-2">
            <span>BĐ:</span>
            <span className="font-medium">{item.startDate}</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span>KT:</span>
            <span className="font-medium">{item.endDate}</span>
          </div>
        </div>
      ),
    },
    {
      key: "id",
      label: "Hành động",
      render: (_, item) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
            onClick={() => handleViewDetail(item as AmendmentPlan)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
            onClick={() => handleEdit(item as AmendmentPlan)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            onClick={() => handleDelete(item as AmendmentPlan)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Handlers
  const handleAdd = () => {
    setLocation("/amendment-plan/create");
  };

  const handleEdit = (item: AmendmentPlan) => {
    setLocation(`/amendment-plan/${item.id}/edit`);
  };

  const handleDelete = (item: AmendmentPlan) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleViewDetail = (item: AmendmentPlan) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      deletePlan(selectedItem.id);
      toast({ title: "Thành công", description: "Đã xóa kế hoạch" });
    }
    setDeleteOpen(false);
  };

  // Dashboard Stats
  const stats = getStatistics();

  return (
    <AdminLayout
      title="Kế hoạch cải tạo đất"
      description="Lập và theo dõi tiến độ các dự án cải tạo đất theo từng khu vực"
      actions={
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 mr-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
              title="Xem danh sách"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "calendar" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
              title="Xem lịch biểu"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={handleAdd} className="shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Lập kế hoạch
          </Button>
        </div>
      }
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.planning}
              </p>
              <p className="text-xs text-slate-500 font-medium uppercase">
                Đang lập
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.inProgress}
              </p>
              <p className="text-xs text-slate-500 font-medium uppercase">
                Đang thực hiện
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.completed}
              </p>
              <p className="text-xs text-slate-500 font-medium uppercase">
                Hoàn thành
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalArea} ha
              </p>
              <p className="text-xs text-slate-500 font-medium uppercase">
                Tổng diện tích
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === "list" ? (
        <DataTable
          columns={columns}
          data={plans}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Tìm kiếm kế hoạch, khu vực, vấn đề..."
          filters={[
            {
              key: "status",
              label: "Trạng thái",
              options: [
                { label: "Đang lập KH", value: "planning" },
                { label: "Đang thực hiện", value: "in_progress" },
                { label: "Hoàn thành", value: "completed" },
                { label: "Đã hủy", value: "cancelled" },
              ],
            },
            {
              key: "zone",
              label: "Khu vực",
              options: [
                { label: "Vùng A - Cà Mau", value: "Vùng A - Cà Mau" },
                { label: "Vùng B - Long An", value: "Vùng B - Long An" },
                { label: "Vùng C - Đồng Nai", value: "Vùng C - Đồng Nai" },
              ],
            },
            {
              key: "technician",
              label: "Phụ trách",
              options: [
                { label: "Nguyễn Văn A", value: "Nguyễn Văn A" },
                { label: "Trần Thị B", value: "Trần Thị B" },
                { label: "Lê Văn C", value: "Lê Văn C" },
              ],
            },
          ]}
        />
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          {/* Timeline Header */}
          <div className="border-b bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Lịch biểu thực hiện
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Xem tiến độ các kế hoạch cải tạo theo thời gian
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
                  <span className="text-slate-600">Đang lập</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500"></div>
                  <span className="text-slate-600">Đang thực hiện</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-slate-300"></div>
                  <span className="text-slate-600">Hoàn thành</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="p-6 overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Month Headers */}
              <div className="flex mb-4 pb-2 border-b">
                <div className="w-48 flex-shrink-0"></div>
                <div className="flex-1 grid grid-cols-12 gap-1">
                  {[
                    "T1",
                    "T2",
                    "T3",
                    "T4",
                    "T5",
                    "T6",
                    "T7",
                    "T8",
                    "T9",
                    "T10",
                    "T11",
                    "T12",
                  ].map((month, idx) => (
                    <div
                      key={idx}
                      className="text-center text-xs font-medium text-slate-500"
                    >
                      {month}
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Rows */}
              <div className="space-y-3">
                {plans.map((plan) => {
                  const startDate = new Date(plan.startDate);
                  const endDate = new Date(plan.endDate);
                  const startMonth = startDate.getMonth();
                  const endMonth = endDate.getMonth();
                  const duration = endMonth - startMonth + 1;

                  const statusColors = {
                    planning: "bg-blue-100 border-blue-300 text-blue-700",
                    in_progress: "bg-green-500 text-white border-green-600",
                    completed: "bg-slate-300 text-slate-700 border-slate-400",
                    cancelled: "bg-red-100 border-red-300 text-red-700",
                  };

                  return (
                    <div
                      key={plan.id}
                      className="flex items-center group hover:bg-slate-50 -mx-2 px-2 py-1 rounded transition-colors"
                    >
                      {/* Plan Info */}
                      <div className="w-48 flex-shrink-0 pr-4">
                        <div
                          className="text-sm font-medium text-slate-900 truncate"
                          title={plan.name}
                        >
                          {plan.name}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{plan.zone}</span>
                        </div>
                      </div>

                      {/* Timeline Bar */}
                      <div className="flex-1 relative h-12">
                        <div className="absolute inset-0 grid grid-cols-12 gap-1">
                          {Array.from({ length: 12 }).map((_, idx) => (
                            <div
                              key={idx}
                              className="border-r border-slate-100 last:border-r-0"
                            ></div>
                          ))}
                        </div>

                        {/* Progress Bar */}
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 h-8 rounded border-2 ${statusColors[plan.status]} flex items-center px-2 shadow-sm cursor-pointer hover:shadow-md transition-all`}
                          style={{
                            left: `${(startMonth / 12) * 100}%`,
                            width: `${(duration / 12) * 100}%`,
                            minWidth: "60px",
                          }}
                          onClick={() => handleViewDetail(plan)}
                          title={`${plan.name}\n${plan.startDate} → ${plan.endDate}`}
                        >
                          <div className="flex items-center justify-between w-full text-xs font-medium">
                            <span className="truncate">{plan.code}</span>
                            <span className="ml-1 opacity-75">
                              {plan.area}ha
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleViewDetail(plan)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {plans.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Chưa có kế hoạch nào</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Footer */}
          <div className="border-t bg-slate-50 px-6 py-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Hiển thị {plans.length} kế hoạch</span>
              <span>Năm 2025</span>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Form */}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa kế hoạch"
        description="Bạn có chắc chắn muốn xóa kế hoạch cải tạo này?"
      />

      {/* View Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {selectedItem?.name}
              <Badge
                variant={
                  selectedItem
                    ? getStatusConfig(selectedItem.status).variant
                    : "outline"
                }
                className=""
              >
                {selectedItem ? getStatusConfig(selectedItem.status).label : ""}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 py-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border">
                  <div className="text-xs text-slate-500 uppercase font-medium mb-1">
                    Diện tích
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {selectedItem.area} ha
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border">
                  <div className="text-xs text-slate-500 uppercase font-medium mb-1">
                    Ngân sách
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {selectedItem.budget} Tr.đ
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border">
                  <div className="text-xs text-slate-500 uppercase font-medium mb-1">
                    Thời gian
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {selectedItem.startDate} - {selectedItem.endDate}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <span className="text-slate-500 w-24 inline-block">
                      Mã kế hoạch:
                    </span>
                    <span className="font-mono font-medium">
                      {selectedItem.code}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 w-24 inline-block">
                      Khu vực:
                    </span>
                    <span className="font-medium">{selectedItem.zone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 w-24 inline-block">
                      Phụ trách:
                    </span>
                    <span className="font-medium">
                      {selectedItem.technician}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 w-24 inline-block">
                      Mục tiêu:
                    </span>
                    <span className="font-medium text-amber-700">
                      {selectedItem.target_issue}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setDetailOpen(false)}>
                  Đóng
                </Button>
                <Button
                  onClick={() => {
                    setDetailOpen(false);
                    handleEdit(selectedItem);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
