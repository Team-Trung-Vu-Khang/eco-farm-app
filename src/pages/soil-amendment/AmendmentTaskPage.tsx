import { useState } from "react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { LayoutGrid, List, Plus } from "lucide-react";
import useAmendmentTaskStore, {
  type AmendmentTask,
} from "../../stores/useAmendmentTaskStore";
import { AmendmentTaskDetailDialog } from "./components/AmendmentTaskDetailDialog";
import { AmendmentTaskFormDialog } from "./components/AmendmentTaskFormDialog";
import { AmendmentTaskKanban } from "./components/AmendmentTaskKanban";
import { AmendmentTaskStats } from "./components/AmendmentTaskStats";
import { createAmendmentTaskColumns } from "./data/amendmentTaskColumns";
import {
  amendmentTaskFilters,
  MATERIAL_UNITS,
  mockRegions,
} from "./data/amendmentTaskData";

export default function AmendmentTaskPage() {
  const { toast } = useToast();
  const tasks = useAmendmentTaskStore((state) => state.tasks);
  const addTask = useAmendmentTaskStore((state) => state.addTask);
  const updateTask = useAmendmentTaskStore((state) => state.updateTask);
  const deleteTask = useAmendmentTaskStore((state) => state.deleteTask);
  const getStatistics = useAmendmentTaskStore((state) => state.getStatistics);

  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AmendmentTask | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [newMaterial, setNewMaterial] = useState({
    type: "fertilizer" as "fertilizer" | "pesticide" | "tool" | "other",
    name: "",
    quantity: "",
    unit: "kg",
  });
  const [formData, setFormData] = useState<Partial<AmendmentTask>>({
    code: "",
    name: "",
    plan: "",
    zone: "",
    method: "",
    assignedType: "individual",
    assignedTo: "",
    startDate: "",
    endDate: "",
    priority: "medium",
    materials: [],
    equipment: [],
    targetArea: 0,
    notes: "",
  });

  const columns = createAmendmentTaskColumns((task) => handleViewDetail(task));

  const handleAdd = () => {
    setSelectedItem(null);
    setSelectedRegion("");
    setFormData({
      code: "",
      name: "",
      plan: "",
      zone: "",
      method: "",
      assignedType: "individual",
      assignedTo: "",
      startDate: "",
      endDate: "",
      priority: "medium",
      materials: [],
      equipment: [],
      targetArea: 0,
      notes: "",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: AmendmentTask) => {
    setSelectedItem(item);
    setFormData({ ...item });
    const region = mockRegions.find((entry) =>
      entry.zones.some((zone) => zone.name === item.zone),
    );
    setSelectedRegion(region?.name || "");
    setFormOpen(true);
  };

  const handleDelete = (item: AmendmentTask) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  function handleViewDetail(item: AmendmentTask) {
    setSelectedItem(item);
    setDetailOpen(true);
  }

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.quantity) return;

    setFormData((current) => ({
      ...current,
      materials: [
        ...(current.materials || []),
        {
          id: Date.now(),
          name: newMaterial.name,
          quantity: Number(newMaterial.quantity),
          unit: newMaterial.unit,
          type: newMaterial.type,
        },
      ],
    }));

    setNewMaterial((current) => ({
      ...current,
      name: "",
      quantity: "",
      unit: MATERIAL_UNITS[current.type][0],
    }));
  };

  const handleRemoveMaterial = (id: number) => {
    setFormData((current) => ({
      ...current,
      materials: (current.materials || []).filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = () => {
    if (selectedItem) {
      updateTask(selectedItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật công việc cải tạo",
      });
    } else {
      addTask(formData as Omit<AmendmentTask, "id" | "createdAt">);
      toast({
        title: "Thành công",
        description: "Đã tạo công việc mới",
      });
    }

    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      deleteTask(selectedItem.id);
      toast({ title: "Thành công", description: "Đã xóa công việc" });
    }

    setDeleteOpen(false);
  };

  const stats = getStatistics();

  return (
    <AdminLayout
      isRice
      title="Công việc cải tạo đất"
      description="Quản lý và theo dõi các công việc cải tạo đất theo kế hoạch"
      actions={
        <div className="flex items-center gap-2">
          <div className="mr-2 flex rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md p-1.5 transition-all ${viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              title="Xem danh sách"
              type="button"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`rounded-md p-1.5 transition-all ${viewMode === "kanban" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              title="Xem Kanban"
              type="button"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={handleAdd} className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Tạo công việc
          </Button>
        </div>
      }
    >
      <AmendmentTaskStats stats={stats} />

      {viewMode === "list" ? (
        <DataTable
          columns={columns}
          data={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Tìm kiếm công việc, phương pháp..."
          filters={amendmentTaskFilters}
        />
      ) : (
        <AmendmentTaskKanban onViewDetail={handleViewDetail} tasks={tasks} />
      )}

      <AmendmentTaskFormDialog
        formData={formData}
        handleAddMaterial={handleAddMaterial}
        handleRemoveMaterial={handleRemoveMaterial}
        handleSubmit={handleSubmit}
        newMaterial={newMaterial}
        onOpenChange={setFormOpen}
        open={formOpen}
        selectedItem={selectedItem}
        selectedRegion={selectedRegion}
        setFormData={setFormData}
        setNewMaterial={setNewMaterial}
        setSelectedRegion={setSelectedRegion}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa công việc"
        description="Bạn có chắc chắn muốn xóa công việc cải tạo này?"
      />

      <AmendmentTaskDetailDialog
        onEdit={handleEdit}
        onOpenChange={setDetailOpen}
        open={detailOpen}
        selectedItem={selectedItem}
      />
    </AdminLayout>
  );
}
