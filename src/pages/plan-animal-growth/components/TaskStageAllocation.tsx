import {
  Badge,
  Button,
  Checkbox,
  Combobox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CalendarIcon,
  CheckCircle2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  User,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { memo, useMemo, useState } from "react";
import { ANIMAL_MATERIAL_OPTIONS, ANIMAL_TASK_OPTIONS } from "../data/animalGrowthMocks";
import type {
  GeographicalSelection,
  MaterialAllocation,
  TaskAllocation,
} from "../types";
import { DAYS_OF_WEEK, getFrequencyText } from "../utils/task";
import GeographicalSelector from "./GeographicalSelector";

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
    onUpdateMaterial,
  }: {
    stageName: string;
    cycleName?: string | null;
    allocations: MaterialAllocation[];
    tasks: TaskAllocation[];
    onAddMaterial: (item: Omit<MaterialAllocation, "id">) => void;
    onRemoveMaterial: (id: number) => void;
    onUpdateMaterial?: (id: number, path: Partial<MaterialAllocation>) => void;
    onAddTask: (item: Omit<TaskAllocation, "id">) => void;
    onRemoveTask: (id: number) => void;
    onUpdateTask?: (id: number, path: Partial<TaskAllocation>) => void;
    regions?: any[];
    personnel?: any[];
    masterSelections?: GeographicalSelection[];
    enterpriseId?: string;
    availableTasks?: TaskAllocation[];
    availableMaterials?: MaterialAllocation[];
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
                  onUpdateMaterial={onUpdateMaterial}
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
  onUpdateMaterial,
}: any) => {
  const [isPersonnelDialogOpen, setIsPersonnelDialogOpen] = useState(false);
  const [personnelSearch, setPersonnelSearch] = useState("");
  const filteredPersonnel = personnelSearch.trim()
    ? personnel.filter((p: any) =>
        p.fullName.toLowerCase().includes(personnelSearch.toLowerCase()),
      )
    : personnel;

  const [exceedWarning, setExceedWarning] = useState<{
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  const [confirmedExceedValues, setConfirmedExceedValues] = useState<
    Record<number, string>
  >({});

  const [materialSearch, setMaterialSearch] = useState("");

  const allowedRegions = useMemo(() => {
    const planTask = availableTasks?.find((t: any) => t.name === task.name);
    if (
      !planTask ||
      !planTask.geographicalSelections ||
      planTask.geographicalSelections.length === 0
    ) {
      return regions;
    }

    const isAllowed = (
      type: "region" | "area" | "plot",
      rid: string,
      aid?: string,
      pid?: string,
    ) => {
      return planTask.geographicalSelections.some((s: any) => {
        if (s.regionId !== rid) return false;
        if (s.type === "region") return true;
        if (s.type === "area" && aid && s.areaId === aid) {
          return type === "area" || type === "plot";
        }
        if (
          s.type === "plot" &&
          aid &&
          pid &&
          s.areaId === aid &&
          s.plotId === pid
        ) {
          return true;
        }
        return false;
      });
    };

    return regions
      .map((r: any) => {
        const rid = String(r.id);
        const regionAllowed = isAllowed("region", rid);
        const hasVisibleArea = r.subAreas?.some((a: any) => {
          const aid = String(a.id);
          const areaAllowed = isAllowed("area", rid, aid);
          const hasVisiblePlot = a.plots?.some((p: any) =>
            isAllowed("plot", rid, aid, String(p.id)),
          );
          return areaAllowed || hasVisiblePlot;
        });

        if (regionAllowed || hasVisibleArea) {
          if (regionAllowed) return r;

          const filteredAreas = r.subAreas
            ?.map((a: any) => {
              const aid = String(a.id);
              const areaAllowed = isAllowed("area", rid, aid);
              const filteredPlots = a.plots?.filter((p: any) =>
                isAllowed("plot", rid, aid, String(p.id)),
              );

              if (areaAllowed || filteredPlots?.length > 0) {
                return areaAllowed ? a : { ...a, plots: filteredPlots };
              }
              return null;
            })
            .filter(Boolean);

          return { ...r, subAreas: filteredAreas };
        }
        return null;
      })
      .filter(Boolean);
  }, [regions, availableTasks, task.name]);

  const groupedMaterials =
    (availableMaterials || []).length > 0
      ? availableMaterials.reduce((acc: any, m: any) => {
          if (!acc[m.materialCategory]) acc[m.materialCategory] = [];
          if (
            !acc[m.materialCategory].find((i: any) => i.name === m.materialName)
          ) {
            acc[m.materialCategory].push({
              name: m.materialName,
              unit: m.unit,
              maxQty: m.quantity,
              category: m.materialCategory,
            });
          }
          return acc;
        }, {})
      : Object.entries(ANIMAL_MATERIAL_OPTIONS).reduce((acc: any, [cat, opts]) => {
          acc[cat] = opts.map((o) => ({
            name: o.value,
            unit: o.unit,
            category: cat,
          }));
          return acc;
        }, {});

  const filteredGroupedMaterials = Object.entries(groupedMaterials).reduce(
    (acc: any, [cat, items]: [string, any]) => {
      const filteredItems = items.filter((item: any) =>
        item.name.toLowerCase().includes(materialSearch.toLowerCase()),
      );
      if (filteredItems.length > 0) {
        acc[cat] = filteredItems;
      }
      return acc;
    },
    {},
  );

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
    const currentLimitStr = task.labor ? task.labor.split(":")[0].trim() : "";

    if (isRemoving) {
      // Removing is always allowed
      currentList.splice(currentList.indexOf(name), 1);
      const laborStr =
        currentList.length > 0
          ? `${currentLimitStr}: ${currentList.join(", ")}`
          : currentLimitStr;
      onUpdateTask?.(task.id, { labor: laborStr });
      return;
    }

    // Extract the max personnel count directly from the preserved limit string
    const maxPersonnel = currentLimitStr
      ? parseInt(currentLimitStr.replace(/\D/g, ""), 10)
      : NaN;

    const newList = [...currentList, name];

    if (!isNaN(maxPersonnel) && newList.length > maxPersonnel) {
      setExceedWarning({
        message: `Kế hoạch quy định tối đa ${maxPersonnel} nhân sự cho công việc này. Bạn đang thêm đến ${newList.length} người. Bạn có muốn tiếp tục không?`,
        onConfirm: () => {
          const laborStr =
            newList.length > 0
              ? `${currentLimitStr}: ${newList.join(", ")}`
              : currentLimitStr;
          onUpdateTask?.(task.id, { labor: laborStr });
        },
      });
      return;
    }

    const laborStr =
      newList.length > 0
        ? `${currentLimitStr}: ${newList.join(", ")}`
        : currentLimitStr;
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
          {/* Task Combobox */}
          <div>
            <Combobox
              options={
                availableTasks
                  ? availableTasks.map((t: any) => ({
                      value: t.name,
                      label: t.name,
                    }))
                  : (ANIMAL_TASK_OPTIONS as any[])
              }
              value={task.name}
              onChange={(val) => {
                const selectedTask = availableTasks?.find(
                  (t: any) => t.name === val,
                );
                onUpdateTask?.(task.id, {
                  name: val,
                  liter: selectedTask?.liter,
                  labor: selectedTask?.labor || "",
                  geographicalSelections:
                    selectedTask?.geographicalSelections || [],
                });
              }}
              placeholder="Danh sách công việc trong kế hoạch"
              searchPlaceholder="Tìm kiếm công việc..."
              className="w-full font-bold bg-slate-50 border-slate-200"
            />
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

            <Button
              variant="outline"
              className="w-full justify-center bg-slate-50 text-slate-700 hover:bg-slate-100"
              onClick={() => setIsPersonnelDialogOpen(true)}
            >
              <Users className="w-4 h-4 mr-2" />
              Chọn nhân sự
            </Button>

            {/* Scope */}
            <div className="space-y-1.5">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Phạm vi:
                </span>
                <GeographicalSelector
                  regions={allowedRegions}
                  disabled={false}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-1 border-t border-slate-100 mt-2">
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
                              className={cn(
                                "text-[9px] py-0.5 px-1.5 h-auto min-h-4 font-medium border-slate-100 shadow-none whitespace-normal wrap-break-word inline-flex items-center text-left",
                                item.type === "region"
                                  ? "bg-emerald-50/30 text-emerald-600 border-emerald-100/30"
                                  : item.type === "area"
                                    ? "bg-blue-50/30 text-blue-500 border-blue-100/30"
                                    : "bg-white text-slate-400 border-slate-100",
                              )}
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

          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw
                  className={cn(
                    "w-4 h-4 text-slate-400",
                    task.isRepeating && "text-blue-500",
                  )}
                />
                <Label
                  htmlFor={`repeat-${task.id}`}
                  className="text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Lặp lại công việc
                </Label>
              </div>
              <Checkbox
                id={`repeat-${task.id}`}
                checked={task.isRepeating}
                onCheckedChange={(checked) =>
                  onUpdateTask?.(task.id, { isRepeating: !!checked })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Ngày bắt đầu
                </span>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                  <Input
                    type="date"
                    className="pl-10 h-10 text-sm bg-slate-50 border-slate-200"
                    value={task.startDate || ""}
                    onChange={(e) =>
                      syncDates(e.target.value, task.endDate || "")
                    }
                  />
                </div>
              </div>

              {!task.isRepeating ? (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Ngày kết thúc
                  </span>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <Input
                      type="date"
                      className="pl-10 h-10 text-sm bg-slate-50 border-slate-200"
                      value={task.endDate || ""}
                      onChange={(e) =>
                        syncDates(task.startDate || "", e.target.value)
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Số tuần lặp lại
                  </span>
                  <div className="relative">
                    <Input
                      type="number"
                      min={1}
                      className="h-10 text-sm bg-slate-50 border-slate-200 font-bold"
                      value={task.repeatWeeks || ""}
                      placeholder="Số tuần..."
                      onChange={(e) =>
                        onUpdateTask?.(task.id, {
                          repeatWeeks: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {task.isRepeating && (
              <div className="space-y-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-wrap gap-2 justify-between">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = (task.repeatDays || []).includes(
                      day.value,
                    );
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => {
                          const currentDays = task.repeatDays || [];
                          const newDays = isSelected
                            ? currentDays.filter((d: number) => d !== day.value)
                            : [...currentDays, day.value];
                          onUpdateTask?.(task.id, { repeatDays: newDays });
                        }}
                        className={cn(
                          "w-8 h-8 rounded-full text-[10px] font-bold transition-all border",
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500",
                        )}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-blue-100/50">
                  <p className="text-[11px] font-medium text-blue-700 italic">
                    {getFrequencyText(
                      task.repeatDays || [],
                      task.repeatWeeks || 0,
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Material Info */}
        <div className="p-0 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 mt-1">
            <div className="relative pr-5">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
              <Input
                placeholder="Tìm kiếm vật tư..."
                className="pl-10 h-9 text-sm bg-white"
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 max-h-[400px]">
            <div className="p-5 space-y-6">
              {Object.entries(filteredGroupedMaterials).length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <p className="text-sm italic">
                    {materialSearch
                      ? "Không tìm thấy vật tư phù hợp"
                      : "Không có vật tư khả dụng"}
                  </p>
                </div>
              ) : (
                Object.entries(filteredGroupedMaterials).map(
                  ([category, items]: [string, any]) => (
                    <div key={category} className="space-y-3">
                      <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200 pb-1">
                        {category}
                      </h5>
                      <div className="grid grid-cols-1 gap-2">
                        {items.map((item: any) => {
                          const allocation = materials.find(
                            (m: any) => m.materialName === item.name,
                          );
                          const isSelected = !!allocation;

                          return (
                            <div
                              key={item.name}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                                isSelected
                                  ? "bg-white border-blue-200 shadow-sm"
                                  : "bg-transparent border-slate-100 opacity-60 hover:opacity-100",
                              )}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    onAddMaterial({
                                      stageId: stageName,
                                      taskId: task.id,
                                      materialCategory: category,
                                      materialType: category,
                                      materialName: item.name,
                                      quantity: "0",
                                      unit: item.unit,
                                    });
                                  } else if (allocation) {
                                    onRemoveMaterial(allocation.id);
                                  }
                                }}
                              />

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-700 truncate">
                                  {item.name}
                                </p>
                                {item.maxQty && (
                                  <p className="text-[10px] text-slate-400">
                                    Định mức: {item.maxQty} {item.unit}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 w-32 shrink-0">
                                <Input
                                  type="number"
                                  placeholder="SL"
                                  min={0}
                                  className={cn(
                                    "h-8 text-right font-bold bg-white",
                                    allocation &&
                                      item.maxQty &&
                                      Number(allocation.quantity) >
                                        Number(item.maxQty)
                                      ? "text-rose-500 border-rose-200"
                                      : "text-emerald-600 border-slate-200",
                                  )}
                                  value={isSelected ? allocation.quantity : ""}
                                  disabled={!isSelected}
                                  onChange={(e) => {
                                    let val = e.target.value;
                                    if (Number(val) < 0) val = "0";
                                    if (allocation && onUpdateMaterial) {
                                      onUpdateMaterial(allocation.id, {
                                        quantity: val,
                                      });
                                    }
                                  }}
                                  onBlur={(e) => {
                                    const newVal = e.target.value;
                                    if (isSelected && item.maxQty) {
                                      const isExceeded =
                                        Number(newVal) > Number(item.maxQty);
                                      if (isExceeded) {
                                        if (
                                          confirmedExceedValues[
                                            allocation.id
                                          ] !== newVal
                                        ) {
                                          setExceedWarning({
                                            message: `Số lượng "${item.name}" là ${newVal} ${item.unit}, vượt quá định mức kế hoạch là ${item.maxQty} ${item.unit}. Bạn có muốn tiếp tục không?`,
                                            onConfirm: () => {
                                              setConfirmedExceedValues(
                                                (prev) => ({
                                                  ...prev,
                                                  [allocation.id]: newVal,
                                                }),
                                              );
                                            },
                                            onCancel: () => {
                                              if (onUpdateMaterial) {
                                                onUpdateMaterial(
                                                  allocation.id,
                                                  {
                                                    quantity: item.maxQty,
                                                  },
                                                );
                                              }
                                            },
                                          });
                                        }
                                      } else {
                                        // Clear confirmation if it was previously exceeded and now within quota
                                        if (
                                          confirmedExceedValues[allocation.id]
                                        ) {
                                          setConfirmedExceedValues((prev) => {
                                            const next = { ...prev };
                                            delete next[allocation.id];
                                            return next;
                                          });
                                        }
                                      }
                                    }
                                  }}
                                />
                                <span className="text-[10px] font-bold text-slate-400 w-8">
                                  {item.unit}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
          </ScrollArea>
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
              {exceedWarning?.message}
            </p>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  exceedWarning?.onCancel?.();
                  setExceedWarning(null);
                }}
              >
                Hủy bỏ
              </Button>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => {
                  exceedWarning?.onConfirm();
                  setExceedWarning(null);
                }}
              >
                Tiếp tục
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
