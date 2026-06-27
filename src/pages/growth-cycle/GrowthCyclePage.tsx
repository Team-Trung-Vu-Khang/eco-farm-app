import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  Dialog,
  DialogContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Link } from "wouter";
import { Fish, Leaf, PawPrint, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useGrowthCyclePage } from "./hooks/useGrowthCyclePage";
import { growthCycleColumns } from "./data/columns";
import GrowthCycleDetailPage from "./GrowthCycleDetailPage";
import { useDialogBugWorkaround } from "@/shared/hooks/useDialogBugWorkaround";

const GrowthCyclePage = () => {
  const [activeTab, setActiveTab] = useState<"plant" | "animal">("plant");
  const {
    growthCycles,
    detailOpen,
    setDetailOpen,
    selectedId,
    handleView,
    deleteOpen,
    setDeleteOpen,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    loading,
  } = useGrowthCyclePage();

  useDialogBugWorkaround([deleteOpen, detailOpen]);

  const plantCycles = useMemo(
    () =>
      growthCycles.filter((cycle) => (cycle.cycleType ?? "plant") === "plant"),
    [growthCycles],
  );

  const animalCycles = useMemo(
    () =>
      growthCycles.filter((cycle) => (cycle.cycleType ?? "plant") === "animal"),
    [growthCycles],
  );

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý chu kỳ sinh trưởng"
      description="Quản lý riêng chu kỳ thực vật và vật nuôi/thủy sản trong cùng một không gian"
      actions={
        <Link href="/growth-cycle/create">
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
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "plant" | "animal")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="plant" className="gap-2">
            <Leaf className="w-4 h-4" />
            Thực vật
          </TabsTrigger>
          <TabsTrigger value="animal" className="gap-2">
            <PawPrint className="w-4 h-4" />
            Vật nuôi / Thủy sản
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plant">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-green-500 animate-spin" />
              <span className="text-sm">
                Đang tải danh sách chu kỳ thực vật...
              </span>
            </div>
          ) : (
            <DataTable
              data={plantCycles}
              selectable={false}
              columns={growthCycleColumns}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchPlaceholder="Tìm kiếm chu kỳ thực vật..."
            />
          )}
        </TabsContent>

        <TabsContent value="animal">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
              <span className="text-sm">
                Đang tải danh sách chu kỳ vật nuôi / thủy sản...
              </span>
            </div>
          ) : animalCycles.length > 0 ? (
            <DataTable
              data={animalCycles}
              selectable={false}
              columns={growthCycleColumns}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchPlaceholder="Tìm kiếm chu kỳ vật nuôi / thủy sản..."
            />
          ) : (
            <div className="rounded-2xl border border-dashed bg-muted/30 p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm">
                <Fish className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">
                Chưa có chu kỳ vật nuôi / thủy sản
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Tab này đã sẵn sàng để quản lý các chu kỳ cho gia súc, gia cầm
                hoặc thủy sản khi bạn thêm dữ liệu mới.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedId && <GrowthCycleDetailPage id={selectedId} />}
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

export default GrowthCyclePage;
