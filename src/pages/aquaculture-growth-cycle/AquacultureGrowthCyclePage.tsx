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
import { useMemo } from "react";
import { Link } from "wouter";
import { createAquacultureGrowthCycleColumns } from "./data/columns";
import { useAquacultureGrowthCyclePage } from "./hooks/useAquacultureGrowthCyclePage";

const AquacultureGrowthCyclePage = () => {
  const {
    growthCycles,
    loading,
    error,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    detailOpen,
    setDetailOpen,
    selectedId,
    setSelectedId,
    deleteOpen,
    setDeleteOpen,
    deleteItem,
    setDeleteItem,
    handleConfirmDelete,
    filters,
    handleFilterChange,
  } = useAquacultureGrowthCyclePage();

  useDialogBugWorkaround([detailOpen, deleteOpen]);

  const columns = useMemo(
    () =>
      createAquacultureGrowthCycleColumns({
        onView: (item) => {
          setSelectedId(item.id);
          setDetailOpen(true);
        },
        onEdit: (item) => {
          // handled by Link actions or location navigation
        },
        onDelete: (item) => {
          setDeleteItem(item);
          setDeleteOpen(true);
        },
      }),
    [setSelectedId, setDetailOpen, setDeleteItem, setDeleteOpen],
  );

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return growthCycles.find((item) => item.id === selectedId) || null;
  }, [selectedId, growthCycles]);

  if (error) {
    return (
      <AdminLayout
        isDev={true}
        title="Chu kỳ nuôi thủy sản"
        description="Quản lý các chu kỳ phát triển cho vật nuôi và thủy sản"
      >
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
          <p className="font-semibold">Lỗi tải dữ liệu</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </AdminLayout>
    );
  }

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
      <div className="w-full">
        <DataTable
          data={growthCycles}
          selectable={false}
          columns={columns}
          searchPlaceholder="Tìm kiếm chu kỳ thủy sản..."
          searchable
          onSearch={handleSearch}
          pageSize={pageSize}
          currentIndex={currentIndex}
          totalElements={response?.totalElements}
          totalPages={response?.totalPages}
          onPageSize={setPageSize}
          onIndexChange={setCurrentIndex}
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />
      </div>

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
                      <span className="font-medium">
                        {selectedItem.id.replace(/^(foundation-|user-)/, "")}
                      </span>
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
                        {selectedItem.createdAt
                          ? new Date(selectedItem.createdAt).toLocaleString(
                              "vi-VN",
                            )
                          : "---"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Cập nhật</span>
                      <span className="font-medium">
                        {selectedItem.updatedAt
                          ? new Date(selectedItem.updatedAt).toLocaleString(
                              "vi-VN",
                            )
                          : "---"}
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
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                            <CalendarDays className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              Giai đoạn {index + 1}: {stage.name}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="font-semibold">
                          {stage.duration}
                        </Badge>
                      </div>

                      {stage.usePdf && stage.pdfFile?.url && (
                        <div className="mt-2 rounded-xl bg-slate-50 p-3 text-xs border">
                          <span className="text-muted-foreground">
                            Tài liệu kỹ thuật:{" "}
                          </span>
                          <a
                            href={stage.pdfFile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {stage.pdfFile.name}
                          </a>
                        </div>
                      )}

                      {!stage.usePdf && stage.content && (
                        <div
                          className="prose prose-sm max-w-none mt-2 text-slate-700 border-t pt-3"
                          dangerouslySetInnerHTML={{ __html: stage.content }}
                        />
                      )}
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
