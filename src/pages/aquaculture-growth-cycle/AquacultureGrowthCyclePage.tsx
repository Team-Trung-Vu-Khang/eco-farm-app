import type { GrowthCycle } from "@/pages/growth-cycle/types/types";
import { useDialogBugWorkaround } from "@/shared/hooks/useDialogBugWorkaround";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  Dialog,
  DialogContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CalendarDays, Layers3, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { createAquacultureGrowthCycleColumns } from "./data/columns";
import { aquacultureGrowthCycles } from "./data/mocks";

const AquacultureGrowthCyclePage = () => {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GrowthCycle | null>(null);
  const [deleteItem, setDeleteItem] = useState<GrowthCycle | null>(null);
  const [cycles, setCycles] = useState(() => aquacultureGrowthCycles);

  useDialogBugWorkaround([detailOpen, deleteOpen]);

  const aquacultureCycles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return cycles.filter((cycle) => {
      if (!keyword) return true;

      return [
        cycle.id,
        cycle.name,
        cycle.cropName,
        cycle.cropId,
        cycle.variety || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [cycles, search]);

  const columns = useMemo(
    () =>
      createAquacultureGrowthCycleColumns({
        onView: (item) => {
          setSelectedItem(item);
          setDetailOpen(true);
        },
        onEdit: (item) =>
          setLocation(`/aquaculture-growth-cycle/${item.id}/edit`),
        onDelete: (item) => {
          setDeleteItem(item);
          setDeleteOpen(true);
        },
      }),
    [setLocation],
  );

  const handleConfirmDelete = () => {
    if (!deleteItem) return;
    setCycles((current) => current.filter((item) => item.id !== deleteItem.id));
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return (
    <AdminLayout
      isDev={true}
      title="Chu kỳ nuôi thủy sản"
      description="Quản lý các chu kỳ phát triển cho vật nuôi và thủy sản"
      actions={
        <Link href="/aquaculture-growth-cycle/create">
          <Button
            size="sm"
            className="h-9 px-3 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      {aquacultureCycles.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/30 p-10 text-center">
          <h3 className="text-lg font-semibold">Chưa có chu kỳ thủy sản</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Bạn có thể tạo thêm các chu kỳ thủy sản để quản lý riêng nhóm dữ
            liệu này.
          </p>
        </div>
      ) : (
        <DataTable
          data={aquacultureCycles as GrowthCycle[]}
          selectable={false}
          columns={columns}
          searchPlaceholder="Tìm kiếm chu kỳ thủy sản..."
          searchable
          onSearch={setSearch}
        />
      )}

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedItem ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
                      Chi tiết chu kỳ thủy hải sản
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {selectedItem.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {selectedItem.cropName ||
                        selectedItem.cropId ||
                        "Chưa xác định"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      selectedItem.scope === "crop" ? "default" : "secondary"
                    }
                  >
                    {selectedItem.scope === "crop"
                      ? "Theo loài nuôi"
                      : "Theo giống"}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Thông tin chung
                  </p>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Mã chu kỳ</span>
                      <span className="font-medium">{selectedItem.id}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Loài nuôi</span>
                      <span className="font-medium">
                        {selectedItem.cropName || selectedItem.cropId || "-"}
                      </span>
                    </div>
                    {selectedItem.variety && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          Giống / dòng
                        </span>
                        <span className="font-medium">
                          {selectedItem.variety}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">
                        Số giai đoạn
                      </span>
                      <span className="font-medium">
                        {selectedItem.stages.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">
                        Tổng thời gian
                      </span>
                      <span className="font-medium">
                        {selectedItem.totalDays || 0} ngày
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Mốc cập nhật
                  </p>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Tạo lúc</span>
                      <span className="font-medium">
                        {new Date(selectedItem.createdAt).toLocaleString(
                          "vi-VN",
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Cập nhật</span>
                      <span className="font-medium">
                        {new Date(selectedItem.updatedAt).toLocaleString(
                          "vi-VN",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  <Layers3 className="h-3.5 w-3.5" />
                  Danh sách giai đoạn
                </div>
                <div className="space-y-2">
                  {selectedItem.stages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                          <CalendarDays className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            Giai đoạn {index + 1}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {stage.name}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-semibold">
                        {stage.duration}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
};

export default AquacultureGrowthCyclePage;
