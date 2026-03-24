import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CalendarIcon,
  CheckCircle2,
  MapPin,
  Plus,
  Search,
  User,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { memo, useState } from "react";
import GeographicalSelector from "./GeographicalSelector";
import type {
  GeographicalSelection,
  MaterialAllocation,
  TaskAllocation,
} from "../types";
import { MATERIAL_OPTIONS, MATERIAL_UNITS, TASK_OPTIONS } from "../data/mocks";

export const TaskStageAllocation = memo(
  ({
    stageName,
    cycleName,
    allocations: materials,
    tasks,
    onAddMaterial,
    onRemoveMaterial,
    onAddTask,
    onRemoveTask,
    onUpdateTask,
    regions = [],
    masterSelections = [],
    enterpriseId = "",
    availableTasks,
    availableMaterials,
    personnel = [],
    disableScopeSelection = true,
  }: {
    stageName: string;
    cycleName?: string | null;
    allocations: MaterialAllocation[];
    tasks: TaskAllocation[];
    onAddMaterial: (item: Omit<MaterialAllocation, "id">) => void;
    onRemoveMaterial: (id: number) => void;
    onAddTask: (item: Omit<TaskAllocation, "id">) => void;
    onRemoveTask: (id: number) => void;
    onUpdateTask?: (id: number, path: Partial<TaskAllocation>) => void;
    regions?: any[];
    personnel?: any[];
    masterSelections?: GeographicalSelection[];
    enterpriseId?: string;
    availableTasks?: TaskAllocation[];
    availableMaterials?: MaterialAllocation[];
    disableScopeSelection?: boolean;
  }) => {
    // When the user clicks "Thêm" for the stage, we add a blank task
    const handleAddBlankTask = () => {
      onAddTask({
        stageId: stageName,
        name: "",
        description: "",
        labor: "",
        duration: "",
        geographicalSelections: masterSelections || [],
      });
    };

    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col mb-4">
        {/* Header */}
        <div className="bg-slate-900 px-5 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <h4 className="font-black text-lg">Giai đoạn {stageName}</h4>
            {cycleName && (
              <Badge className="bg-white/20 text-white border-none font-bold">
                {cycleName}
              </Badge>
            )}
            <span className="text-xs text-slate-400 font-medium ml-2">
              ({tasks.length} công việc)
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-slate-700 text-white hover:bg-slate-800 hover:text-white"
            onClick={handleAddBlankTask}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm
          </Button>
        </div>

        {/* List of Blocks */}
        <div className="p-4 space-y-6 bg-slate-50">
          {tasks.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">
                Chưa có công việc nào. Bấm "Thêm" để tạo mới.
              </p>
            </div>
          ) : (
            tasks.map((task, idx) => {
              const taskMaterials = materials.filter(
                (m) => m.taskId === task.id,
              );
              return (
                <TaskBlock
                  key={task.id || idx}
                  task={task}
                  materials={taskMaterials}
                  onUpdateTask={onUpdateTask}
                  onRemoveTask={onRemoveTask}
                  onAddMaterial={onAddMaterial}
                  onRemoveMaterial={onRemoveMaterial}
                  regions={regions}
                  personnel={personnel}
                  enterpriseId={enterpriseId}
                  stageName={stageName}
                  availableTasks={availableTasks}
                  availableMaterials={availableMaterials}
                  disableScopeSelection={disableScopeSelection}
                />
              );
            })
          )}
        </div>
      </div>
    );
  },
);

const TaskBlock = ({
  task,
  materials,
  onUpdateTask,
  onRemoveTask,
  onAddMaterial,
  onRemoveMaterial,
  regions,
  personnel,
  enterpriseId,
  stageName,
  availableTasks,
  availableMaterials,
  disableScopeSelection,
}: any) => {
  const [isPersonnelDialogOpen, setIsPersonnelDialogOpen] = useState(false);
  const [personnelSearch, setPersonnelSearch] = useState("");
  const filteredPersonnel = personnelSearch.trim()
    ? personnel.filter((p: any) =>
        p.fullName.toLowerCase().includes(personnelSearch.toLowerCase()),
      )
    : personnel;

  const [newItem, setNewItem] = useState({
    name: "",
    qty: "",
    unit: "kg",
    type: "Phân bón",
    maxQty: undefined as string | undefined,
  });

  const [exceedWarning, setExceedWarning] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const doAddMaterial = () => {
    onAddMaterial({
      stageId: stageName,
      taskId: task.id,
      materialCategory: newItem.type,
      materialType: newItem.type,
      materialName: newItem.name,
      quantity: newItem.qty,
      unit: newItem.unit,
    });
    setNewItem({
      name: "",
      qty: "",
      unit: "kg",
      type: "Phân bón",
      maxQty: undefined,
    });
  };

  const handleAddMaterialToTask = () => {
    if (!newItem.name || !newItem.qty) return;

    if (newItem.maxQty) {
      // Sum existing qty of same material name across all materials in this stage
      const existingTotal = materials
        .filter((m: any) => m.materialName === newItem.name)
        .reduce((sum: number, m: any) => sum + Number(m.quantity || 0), 0);
      const newTotal = existingTotal + Number(newItem.qty);

      if (newTotal > Number(newItem.maxQty)) {
        setExceedWarning({
          message: `Tổng số lượng của "${newItem.name}" sẽ là ${
            newTotal
          } ${newItem.unit}, vượt quá định mức kế hoạch là ${newItem.maxQty} ${newItem.unit}. Bạn có muốn tiếp tục không?`,
          onConfirm: doAddMaterial,
        });
        return;
      }
    }

    doAddMaterial();
  };

  const getSelectionSummary = (selections: GeographicalSelection[]) => {
    if (!selections || selections.length === 0) return [];
    const summary: {
      regionId: string;
      regionName: string;
      items: {
        type: "region" | "area" | "plot";
        id: string;
        name: string;
        parentName?: string;
      }[];
    }[] = [];

    selections.forEach((sel) => {
      const region = (regions || []).find(
        (r: any) => String(r.id) === String(sel.regionId),
      );
      if (!region) return;
      let regionGroup = summary.find((s) => s.regionId === String(region.id));
      if (!regionGroup) {
        regionGroup = {
          regionId: String(region.id),
          regionName: region.name,
          items: [],
        };
        summary.push(regionGroup);
      }
      if (sel.type === "region") {
        regionGroup.items.push({
          type: "region",
          id: String(region.id),
          name: `Toàn bộ ${region.name}`,
        });
      } else if (sel.type === "area") {
        const area = region.subAreas?.find(
          (a: any) => String(a.id) === String(sel.areaId),
        );
        if (area)
          regionGroup.items.push({
            type: "area",
            id: String(area.id),
            name: area.name,
          });
      } else if (sel.type === "plot") {
        const area = region.subAreas?.find(
          (a: any) => String(a.id) === String(sel.areaId),
        );
        const plot = area?.plots?.find(
          (p: any) => String(p.id) === String(sel.plotId),
        );
        if (plot)
          regionGroup.items.push({
            type: "plot",
            id: String(plot.id),
            name: plot.name,
            parentName: area?.name,
          });
      }
    });
    return summary;
  };

  const syncDates = (newStart: string, newEnd: string) => {
    if (!newStart || !newEnd) {
      onUpdateTask?.(task.id, { startDate: newStart, endDate: newEnd });
      return;
    }

    // Get the plan-configured duration
    const planTask = availableTasks?.find((t: any) => t.name === task.name);
    const planDurationRaw: string = planTask?.duration || "";
    const maxDays = planDurationRaw
      ? parseInt(planDurationRaw.replace(/\D/g, ""), 10)
      : NaN;

    // Calculate duration in days: (end - start) + 1
    const s = new Date(newStart);
    const e = new Date(newEnd);
    const diffTime = e.getTime() - s.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const performUpdate = () => {
      onUpdateTask?.(task.id, {
        startDate: newStart,
        endDate: newEnd,
        duration: `${diffDays} ngày`,
      });
    };

    if (!isNaN(maxDays) && diffDays > maxDays) {
      setExceedWarning({
        message: `Kế hoạch quy định thời gian thực hiện là ${maxDays} ngày. Bạn đang chọn khoảng thời gian ${diffDays} ngày. Bạn có muốn tiếp tục không?`,
        onConfirm: performUpdate,
      });
      return;
    }

    performUpdate();
  };

  const assignedPersonnelList = (task.labor || "").includes(":")
    ? task.labor.split(":")[1].trim().split(", ").filter(Boolean)
    : [];

  const togglePersonnel = (name: string) => {
    const currentList = [...assignedPersonnelList];
    const isRemoving = currentList.includes(name);

    if (isRemoving) {
      // Removing is always allowed
      currentList.splice(currentList.indexOf(name), 1);
      const laborStr =
        currentList.length > 0
          ? `${currentList.length} người: ${currentList.join(", ")}`
          : "";
      onUpdateTask?.(task.id, { labor: laborStr });
      return;
    }

    // Get the plan-configured max personnel count from the selected task's labor field
    const planTask = availableTasks?.find((t: any) => t.name === task.name);
    const planLaborRaw: string = planTask?.labor || "";
    // Parse numbers like "3", "3 người", "3 nhân sự"
    const maxPersonnel = planLaborRaw
      ? parseInt(planLaborRaw.replace(/\D/g, ""), 10)
      : NaN;

    const newList = [...currentList, name];

    if (!isNaN(maxPersonnel) && newList.length > maxPersonnel) {
      setExceedWarning({
        message: `Kế hoạch quy định tối đa ${maxPersonnel} nhân sự cho công việc này. Bạn đang thêm đến ${newList.length} người. Bạn có muốn tiếp tục không?`,
        onConfirm: () => {
          const laborStr =
            newList.length > 0
              ? `${newList.length} người: ${newList.join(", ")}`
              : "";
          onUpdateTask?.(task.id, { labor: laborStr });
        },
      });
      return;
    }

    const laborStr =
      newList.length > 0
        ? `${newList.length} người: ${newList.join(", ")}`
        : "";
    onUpdateTask?.(task.id, { labor: laborStr });
  };

  return (
    <div className="border shadow-sm rounded-xl overflow-hidden bg-white relative animate-in fade-in slide-in-from-bottom-2">
      <button
        type="button"
        className="absolute top-0 cursor-pointer right-0 text-slate-300 transition-colors z-10 bg-red-500 p-1 rounded-bl-md"
        onClick={() => onRemoveTask(task.id)}
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Left Side: Task Info */}
        <div className="p-5 space-y-5">
          {/* Task Select */}
          <div>
            <Select
              value={task.name}
              onValueChange={(val) => {
                const selectedTask = availableTasks?.find(
                  (t: any) => t.name === val,
                );
                onUpdateTask?.(task.id, {
                  name: val,
                  liter: selectedTask?.liter,
                  labor: selectedTask?.labor || "",
                  geographicalSelections:
                    selectedTask?.geographicalSelections ||
                    task.geographicalSelections,
                });
              }}
            >
              <SelectTrigger className="w-full font-bold bg-slate-50 border-slate-200">
                <SelectValue placeholder="Danh sách công việc trong kế hoạch" />
              </SelectTrigger>
              <SelectContent>
                {(availableTasks
                  ? availableTasks.map((t: any) => ({
                      value: t.name,
                      label: t.name,
                    }))
                  : TASK_OPTIONS
                ).map((opt: any) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            {/* Personnel assigned */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nhân sự
                </span>
                {assignedPersonnelList.length === 0 && (
                  <span className="text-[10px] text-amber-500 italic">
                    Chưa phân công
                  </span>
                )}
              </div>
              {assignedPersonnelList.length > 0 && (
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {assignedPersonnelList.map((name: string) => {
                    const person = personnel.find(
                      (p: any) => p.fullName === name,
                    );
                    return (
                      <div
                        key={name}
                        className="flex items-center justify-between p-2 rounded-xl border bg-slate-50/50 border-slate-100 group hover:border-blue-200 transition-all animation-in fade-in"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 overflow-hidden rounded-full border bg-white flex items-center justify-center shrink-0">
                            {person?.avatar ? (
                              <img
                                src={person.avatar}
                                alt={name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 truncate">
                            {name}
                          </span>
                        </div>
                        <button
                          onClick={() => togglePersonnel(name)}
                          className="h-6 w-6 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Scope */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Phạm vi:
                </span>
                <GeographicalSelector
                  regions={regions}
                  disabled={disableScopeSelection}
                  enterpriseId={enterpriseId}
                  existingSelections={task.geographicalSelections || []}
                  onConfirm={(selections: any) =>
                    onUpdateTask?.(task.id, {
                      geographicalSelections: selections,
                    })
                  }
                />
              </div>
              {(() => {
                const summary = getSelectionSummary(
                  task.geographicalSelections || [],
                );
                if (summary.length === 0) {
                  return (
                    <p className="text-[10px] text-slate-400 italic">
                      Chưa chọn phạm vi
                    </p>
                  );
                }
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-1 border-t border-slate-100 mt-1">
                    {summary.map((group) => (
                      <div
                        key={group.regionId}
                        className="flex flex-col gap-1 border-l border-slate-100 pl-2 py-0.5"
                      >
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                          <MapPin className="w-2.5 h-2.5 text-slate-300" />
                          {group.regionName}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {group.items.map((item, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className={`text-[9px] py-0 px-1.5 h-4 font-medium border-slate-100 shadow-none ${
                                item.type === "region"
                                  ? "bg-emerald-50/30 text-emerald-600 border-emerald-100/30"
                                  : item.type === "area"
                                    ? "bg-blue-50/30 text-blue-500 border-blue-100/30"
                                    : "bg-white text-slate-400 border-slate-100"
                              }`}
                            >
                              {item.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full justify-center bg-slate-50 text-slate-700 hover:bg-slate-100"
            onClick={() => setIsPersonnelDialogOpen(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Chọn nhân sự
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="date"
                className="pl-10 h-10 text-sm"
                value={task.startDate || ""}
                onChange={(e) => syncDates(e.target.value, task.endDate || "")}
              />
            </div>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="date"
                className="pl-10 h-10 text-sm"
                value={task.endDate || ""}
                onChange={(e) =>
                  syncDates(task.startDate || "", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Right Side: Material Info */}
        <div className="p-5 flex flex-col bg-slate-50/50 mt-3">
          <div className="flex-1 space-y-4">
            {/* Added Materials List */}
            {materials.length > 0 && (
              <div className="space-y-2 mb-4">
                {materials.map((m: any) => (
                  <div
                    key={m.id}
                    className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded-lg"
                  >
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                        {m.materialType} :
                      </span>
                      <span className="text-sm font-bold text-slate-800 truncate">
                        {m.materialName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block leading-none w-full">
                          Số lượng
                        </span>
                        <span className="text-sm font-black text-emerald-600">
                          {m.quantity} {m.unit}
                        </span>
                      </div>
                      <button
                        className="text-slate-300 hover:text-red-500 transition-colors"
                        onClick={() => onRemoveMaterial(m.id)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Material Addition Form */}
            <div className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-12 xl:col-span-5">
                <span className="text-xs font-bold text-slate-600 mb-1 block">
                  Danh sách vật tư
                </span>
                <Select
                  value={newItem.name}
                  onValueChange={(val) => {
                    const groupedMaterials = availableMaterials
                      ? availableMaterials.reduce((acc: any, m: any) => {
                          if (!acc[m.materialCategory])
                            acc[m.materialCategory] = [];
                          acc[m.materialCategory].push({
                            value: m.materialName,
                            label: m.materialName,
                            type: m.materialCategory,
                            unit: m.unit,
                            maxQty: m.quantity,
                          });
                          return acc;
                        }, {})
                      : Object.entries(MATERIAL_OPTIONS).reduce(
                          (acc: any, [cat, opts]) => {
                            acc[cat] = opts.map((o) => ({ ...o, type: cat }));
                            return acc;
                          },
                          {},
                        );

                    const found = Object.values(
                      groupedMaterials,
                    ).flat() as any[];
                    const sel = found.find((i: any) => i.value === val);

                    if (sel) {
                      setNewItem({
                        ...newItem,
                        name: val,
                        type: sel.type,
                        unit: sel.unit,
                        maxQty: sel.maxQty,
                        qty: "", // Reset quantity on select
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-white h-10">
                    <SelectValue
                      placeholder={
                        availableMaterials?.length === 0
                          ? "Không có vật tư trong kế hoạch"
                          : "Chọn vật tư..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(
                      availableMaterials
                        ? availableMaterials.reduce((acc: any, m: any) => {
                            if (!acc[m.materialCategory])
                              acc[m.materialCategory] = [];
                            acc[m.materialCategory].push({
                              value: m.materialName,
                              label: m.materialName,
                            });
                            return acc;
                          }, {})
                        : MATERIAL_OPTIONS,
                    ).map(([cat, opts]: [string, any]) => (
                      <optgroup label={cat} key={cat}>
                        {opts.map((o: any) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </optgroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-6 xl:col-span-3">
                <span className="text-xs font-bold text-slate-600 mb-1 block">
                  Số lượng
                </span>
                <Input
                  type="number"
                  placeholder="SL"
                  className="h-10 bg-white"
                  value={newItem.qty}
                  max={newItem.maxQty}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (
                      newItem.maxQty &&
                      Number(val) > Number(newItem.maxQty)
                    ) {
                      val = newItem.maxQty;
                    }
                    setNewItem({ ...newItem, qty: val });
                  }}
                />
                {newItem.maxQty && (
                  <span className="text-[10px] text-slate-400 absolute mt-1">
                    Tối đa: {newItem.maxQty}
                  </span>
                )}
              </div>

              <div className="col-span-6 xl:col-span-4 flex gap-2 items-end">
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-600 mb-1 block">
                    Quy cách
                  </span>
                  {newItem.maxQty ? (
                    // Locked to plan-configured unit
                    <div className="h-10 bg-slate-100 border border-slate-200 rounded-md flex items-center px-3 text-sm font-medium text-slate-600 cursor-not-allowed select-none">
                      {newItem.unit}
                      {/* <span className="ml-auto text-[9px] text-slate-400 uppercase tracking-wider">Kế hoạch</span> */}
                    </div>
                  ) : (
                    <Select
                      value={newItem.unit}
                      onValueChange={(v) => setNewItem({ ...newItem, unit: v })}
                    >
                      <SelectTrigger className="h-10 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          MATERIAL_UNITS[
                            newItem.type as keyof typeof MATERIAL_UNITS
                          ] || ["kg"]
                        ).map((u) => (
                          <SelectItem key={u} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <Button
                  onClick={handleAddMaterialToTask}
                  className="h-10 w-10 p-0 mb-0 bg-slate-900 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personnel Dialog Modal for this block */}
      <Dialog
        open={isPersonnelDialogOpen}
        onOpenChange={(open) => {
          setIsPersonnelDialogOpen(open);
          if (!open) setPersonnelSearch("");
        }}
      >
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader className="p-5 pb-3">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4 text-primary" />
              Chọn nhân sự cho ({task.name || "Công việc"})
            </DialogTitle>
          </DialogHeader>

          <div className="px-5 pb-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Tìm theo tên..."
                className="pl-9 h-9 text-sm"
                value={personnelSearch}
                onChange={(e) => setPersonnelSearch(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-75 px-3">
            <div className="space-y-1 pb-2">
              {filteredPersonnel.length === 0 && (
                <p className="text-sm text-slate-400 italic text-center py-8">
                  Không tìm thấy nhân sự
                </p>
              )}
              {filteredPersonnel.map((p: any) => {
                const isSelected = assignedPersonnelList.includes(p.fullName);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePersonnel(p.fullName)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-primary/5 border-primary/20"
                        : "bg-white border-transparent hover:border-slate-200"
                    }`}
                  >
                    <div className="h-9 w-9 overflow-hidden rounded-full border bg-slate-100 flex items-center justify-center shrink-0">
                      {p.avatar ? (
                        <img
                          src={p.avatar}
                          alt={p.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {p.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {p.position}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          <DialogFooter className="p-4 bg-slate-50 border-t">
            <Button
              className="w-full"
              onClick={() => setIsPersonnelDialogOpen(false)}
            >
              Xác nhận ({assignedPersonnelList.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Exceed Quantity Confirmation Dialog */}
      {exceedWarning && (
        <Dialog
          open={!!exceedWarning}
          onOpenChange={() => setExceedWarning(null)}
        >
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-amber-600">
                <span className="text-lg">⚠️</span> Vượt định mức
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-slate-600 px-1 pb-2">
              {exceedWarning.message}
            </p>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setExceedWarning(null)}>
                Hủy bỏ
              </Button>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => {
                  exceedWarning.onConfirm();
                  setExceedWarning(null);
                }}
              >
                Tiếp tục thêm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
