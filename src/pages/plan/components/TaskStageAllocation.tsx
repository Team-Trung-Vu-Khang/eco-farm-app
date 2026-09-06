import {
  Badge,
  Button,
  Calendar,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { vi } from "date-fns/locale";
import {
  CalendarIcon,
  CheckCircle2,
  Plus,
  RefreshCw,
  Search,
  User,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { memo, useState, type CSSProperties } from "react";
import { MATERIAL_OPTIONS, TASK_OPTIONS } from "../data/mocks";
import type {
  GeographicalSelection,
  MaterialAllocation,
  TaskAllocation,
} from "../types";
import {
  formatLocalISODate,
  getRepeatDatesText,
  isRepeatDateAllowed,
  parseLocalISODate,
} from "../utils/task";

function getStageDisplayName(stageName: string) {
  const [, displayName] = stageName.match(/^api-stage-\d+:(.+)$/) || [];
  return displayName || stageName;
}

function getStageLabelFromKey(stageKey?: string | null) {
  if (!stageKey) return "";
  const separatorIndex = stageKey.indexOf(":");
  return separatorIndex >= 0 ? stageKey.slice(separatorIndex + 1) : stageKey;
}

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
    masterSelections = [],
    availableTasks,
    availableTasksOnly = false,
    availableTaskCategories = [],
    availableMaterials,
    availableMaterialsOnly = false,
    showTaskPicker = true,
    personnel = [],
    onUpdateMaterial,
    stageOptions,
    stageOptionsRequired = false,
    allowAddRemove = true,
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
    availableTasksOnly?: boolean;
    availableTaskCategories?: Array<{
      id: number;
      name: string;
      code?: string;
    }>;
    availableMaterials?: MaterialAllocation[];
    availableMaterialsOnly?: boolean;
    showTaskPicker?: boolean;
    /** When provided, each task block gets its own "Giai đoạn" picker instead
     * of inheriting `stageName` for every task in this block. */
    stageOptions?: string[];
    /** Requires a task to have an explicit stage picked from `stageOptions`
     * before it's considered complete. */
    stageOptionsRequired?: boolean;
    /** When false, hides the "Thêm"/task-count header controls and the
     * per-task remove button — used when a task can only ever hold one
     * fixed work item (e.g. editing an existing task). */
    allowAddRemove?: boolean;
  }) => {
    const displayStageName = getStageDisplayName(stageName);

    // When the user clicks "Thêm" for the stage, we add a blank task
    const handleAddBlankTask = () => {
      onAddTask({
        stageId: stageName,
        name: "",
        description: "",
        labor: "",
        duration: "",
        priority: "medium",
        geographicalSelections: masterSelections || [],
      });
    };

    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col mb-4">
        {/* Header */}
        <div className="bg-slate-900 px-5 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <h4 className="font-black text-lg">
              Giai đoạn {displayStageName}
            </h4>
            {cycleName && (
              <Badge className="bg-white/20 text-white border-none font-bold">
                {cycleName}
              </Badge>
            )}
            {allowAddRemove && (
              <span className="text-xs text-slate-400 font-medium ml-2">
                ({tasks.length} công việc)
              </span>
            )}
          </div>
          {allowAddRemove && (
            <div className="flex items-center gap-2">
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
          )}
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
                  personnel={personnel}
                  stageName={stageName}
                  availableTasks={availableTasks}
                  availableTasksOnly={availableTasksOnly}
                  availableTaskCategories={availableTaskCategories}
                  availableMaterials={availableMaterials}
                  availableMaterialsOnly={availableMaterialsOnly}
                  showTaskPicker={showTaskPicker}
                  onUpdateMaterial={onUpdateMaterial}
                  stageOptions={stageOptions}
                  stageOptionsRequired={stageOptionsRequired}
                  allowAddRemove={allowAddRemove}
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
  personnel,
  stageName,
  availableTasks,
  availableTasksOnly = false,
  availableTaskCategories = [],
  availableMaterials,
  availableMaterialsOnly = false,
  showTaskPicker = true,
  onUpdateMaterial,
  stageOptions,
  stageOptionsRequired = false,
  allowAddRemove = true,
}: any) => {
  const [isPersonnelDialogOpen, setIsPersonnelDialogOpen] = useState(false);
  const [personnelSearch, setPersonnelSearch] = useState("");
  const [personnelGroupFilter, setPersonnelGroupFilter] = useState("all");
  const getPersonnelGroups = (person: any): string[] => {
    if (Array.isArray(person.teams)) {
      return person.teams.map((team: any) => team?.name).filter(Boolean);
    }
    if (person.teamName) return [person.teamName];
    if (typeof person.team === "string") return [person.team];
    if (person.team?.name) return [person.team.name];
    return [];
  };

  const personnelGroupOptions: string[] = Array.from(
    new Set(personnel.flatMap((person: any) => getPersonnelGroups(person))),
  ).filter((group): group is string => Boolean(group));

  const filteredPersonnel = personnel.filter((person: any) => {
    const search = personnelSearch.trim().toLowerCase();
    const groups = getPersonnelGroups(person);
    const matchesSearch =
      !search ||
      person.fullName?.toLowerCase().includes(search) ||
      person.position?.toLowerCase().includes(search);
    const matchesGroup =
      personnelGroupFilter === "all" || groups.includes(personnelGroupFilter);

    return matchesSearch && matchesGroup;
  });

  const [exceedWarning, setExceedWarning] = useState<{
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  const [materialSearch, setMaterialSearch] = useState("");
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState("all");

  const materialCategoryLabels: Record<string, string> = {
    all: "Tất cả loại",
    medicine: "Thuốc BVTV",
    fertilizer: "Phân bón",
    material: "Vật tư khác",
    equipment: "Thiết bị",
  };

  const groupedMaterials =
    availableMaterialsOnly || (availableMaterials || []).length > 0
      ? (availableMaterials || []).reduce((acc: any, m: any) => {
          if (!acc[m.materialCategory]) acc[m.materialCategory] = [];
          if (
            !acc[m.materialCategory].find((i: any) => i.name === m.materialName)
          ) {
            acc[m.materialCategory].push({
              name: m.materialName,
              unit: m.unit,
              maxQty: m.quantity,
              category: m.materialCategory,
              supplyItemId: m.supplyItemId,
              unitBaseId: m.unitBaseId,
              unitOptions: m.unitOptions,
              availableQuantity: m.availableQuantity,
            });
          }
          return acc;
        }, {})
      : Object.entries(MATERIAL_OPTIONS).reduce((acc: any, [cat, opts]) => {
          acc[cat] = opts.map((o) => ({
            name: o.value,
            unit: o.unit,
            category: cat,
          }));
          return acc;
        }, {});

  const filteredGroupedMaterials = Object.entries(groupedMaterials)
    .filter(
      ([category]) =>
        materialCategoryFilter === "all" || category === materialCategoryFilter,
    )
    .reduce((acc: any, [cat, items]: [string, any]) => {
      const filteredItems = items.filter((item: any) =>
        item.name.toLowerCase().includes(materialSearch.toLowerCase()),
      );
      if (filteredItems.length > 0) {
        acc[cat] = filteredItems;
      }
      return acc;
    }, {});

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
      const repeatDates = (task.repeatDates || []).filter(
        (date: string) =>
          !newStart || date >= newStart,
      );
      onUpdateTask?.(task.id, {
        startDate: newStart,
        endDate: newEnd,
        duration: `${diffDays} ngày`,
        repeatDates,
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
      {allowAddRemove && (
        <button
          type="button"
          className="absolute top-0 cursor-pointer right-0 text-slate-300 transition-colors z-10 bg-red-500 p-1 rounded-bl-md"
          onClick={() => onRemoveTask(task.id)}
        >
          <X className="w-5 h-5 text-white" />
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Left Side: Task Info */}
        <div className="p-5 space-y-5">
          {/* Task Combobox */}
          <div>
            {showTaskPicker ? (
              <Combobox
                options={
                  availableTasksOnly
                    ? (availableTasks || []).map((t: any) => ({
                        value: t.name,
                        label: t.name,
                      }))
                    : availableTasks && availableTasks.length > 0
                    ? availableTasks.map((t: any) => ({
                        value: t.name,
                        label: t.name,
                      }))
                    : availableTaskCategories.length > 0
                      ? availableTaskCategories.map((category: any) => ({
                          value: category.name,
                          label: category.code
                            ? `${category.code} - ${category.name}`
                            : category.name,
                        }))
                      : (TASK_OPTIONS as any[])
                }
                value={task.taskCategoryName || task.name}
                onChange={(val) => {
                  const selectedTask = availableTasks?.find(
                    (t: any) => t.name === val,
                  );
                  const selectedCategory = availableTaskCategories.find(
                    (category: any) => category.name === val,
                  );
                  onUpdateTask?.(task.id, {
                    name: val,
                    taskCategoryName: selectedCategory?.name || val,
                    sourceWorkItemId: selectedTask?.id,
                    taskCategoryId:
                      selectedTask?.taskCategoryId ?? selectedCategory?.id,
                    liter: selectedTask?.liter,
                    labor: selectedTask?.labor || "",
                    geographicalSelections:
                      selectedTask?.geographicalSelections || [],
                  });
                }}
                placeholder="Danh sách hạng mục công việc trong kế hoạch"
                searchPlaceholder="Tìm kiếm công việc..."
                className="w-full font-bold bg-slate-50 border-slate-200"
              />
            ) : (
              <Input
                value={task.name}
                readOnly
                placeholder="Tên công việc"
                className="w-full font-bold bg-slate-50 border-slate-200"
              />
            )}
          </div>

          {Array.isArray(stageOptions) && stageOptions.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Giai đoạn {stageOptionsRequired && (
                    <span className="text-red-500">*</span>
                  )}
                </span>
                {stageOptionsRequired && !stageOptions.includes(task.stageId) && (
                  <span className="text-[10px] text-amber-500 italic">
                    Chưa chọn giai đoạn
                  </span>
                )}
              </div>
              <Select
                value={stageOptions.includes(task.stageId) ? task.stageId : ""}
                onValueChange={(value) =>
                  onUpdateTask?.(task.id, { stageId: value })
                }
              >
                <SelectTrigger
                  className={cn(
                    "bg-slate-50 border-slate-200",
                    stageOptionsRequired &&
                      !stageOptions.includes(task.stageId) &&
                      "border-amber-400",
                  )}
                >
                  <SelectValue placeholder="Chọn giai đoạn cho công việc này..." />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map((stageKey: string) => (
                    <SelectItem key={stageKey} value={stageKey}>
                      {getStageLabelFromKey(stageKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
                    const groups = person ? getPersonnelGroups(person) : [];
                    return (
                      <div
                        key={name}
                        className="flex items-center justify-between p-2 rounded-xl border bg-slate-50/50 border-slate-100 group hover:border-blue-200 transition-all animation-in fade-in"
                      >
                        <div className="flex min-w-0 items-center gap-2">
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
                          <div className="min-w-0">
                            <span className="block truncate text-[11px] font-bold text-slate-700">
                              {name}
                            </span>
                            {groups.length > 0 && (
                              <span className="block truncate text-[10px] font-medium text-emerald-500">
                                {groups.join(", ")}
                              </span>
                            )}
                          </div>
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
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Độ ưu tiên
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  {
                    id: "low",
                    label: "Thấp",
                    activeClass:
                      "bg-emerald-500 text-white border-emerald-500",
                    inactiveClass:
                      "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
                  },
                  {
                    id: "medium",
                    label: "Thường",
                    activeClass: "bg-amber-500 text-white border-amber-500",
                    inactiveClass:
                      "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100",
                  },
                  {
                    id: "high",
                    label: "Cao",
                    activeClass: "bg-rose-500 text-white border-rose-500",
                    inactiveClass:
                      "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100",
                  },
                ] as const
              ).map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => onUpdateTask?.(task.id, { priority: p.id })}
                  className={cn(
                    "cursor-pointer px-2 py-2 rounded-xl border-2 text-center text-[10px] font-black uppercase transition-all",
                    (task.priority || "medium") === p.id
                      ? p.activeClass
                      : p.inactiveClass,
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Textarea
              value={task.description || ""}
              onChange={(e) =>
                onUpdateTask?.(task.id, { description: e.target.value })
              }
              placeholder="Mô tả chi tiết công việc..."
              rows={3}
              className="bg-slate-50 border-slate-200 text-sm"
            />
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
                  onUpdateTask?.(task.id, {
                    isRepeating: !!checked,
                    repeatDates: checked ? task.repeatDates : [],
                  })
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
            </div>

            {task.isRepeating && (
              <div className="space-y-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-700">
                    Chọn ngày bắt đầu các lần lặp tiếp theo
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[11px] text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                    disabled={(task.repeatDates || []).length === 0}
                    onClick={() => onUpdateTask?.(task.id, { repeatDates: [] })}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Xóa
                  </Button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Mỗi ngày đã chọn sẽ tạo một task con khi task hiện tại hoàn tất.
                </p>
                <Calendar
                  mode="multiple"
                  locale={vi}
                  selected={(task.repeatDates || []).map(parseLocalISODate)}
                  onSelect={(dates) =>
                    onUpdateTask?.(task.id, {
                      repeatDates: (dates || [])
                        .map(formatLocalISODate)
                        .filter(
                          (date, _, all) =>
                            isRepeatDateAllowed(
                              date,
                              task.startDate || "",
                              task.endDate || "",
                              all.filter((other) => other !== date),
                            ),
                        ),
                    })
                  }
                  disabled={(date) => {
                    const localDate = formatLocalISODate(date);
                    return (
                      localDate <= (task.endDate || "") ||
                      ((task.repeatDates || []).includes(localDate)
                        ? false
                        : !isRepeatDateAllowed(
                            localDate,
                            task.startDate || "",
                            task.endDate || "",
                            task.repeatDates || [],
                          ))
                    );
                  }}
                  className="mx-auto w-full bg-white"
                  style={{ "--cell-size": "3.25rem" } as CSSProperties}
                />
                <div className="pt-2 border-t border-blue-100/50">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-medium text-blue-700 italic">
                      {getRepeatDatesText(task.repeatDates || [])}
                    </p>
                    {(task.repeatDates || []).length > 0 && (
                      <Badge
                        variant="outline"
                        className="shrink-0 bg-white text-[10px] font-bold text-blue-700 border-blue-200"
                      >
                        {(task.repeatDates || []).length} ngày
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Material Info */}
        <div className="p-0 flex flex-col bg-slate-50/50">
          <div className="px-4 pb-4 pt-9 border-b border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
              <Input
                placeholder="Tìm kiếm vật tư..."
                className="pl-10 h-9 text-sm bg-white w-full"
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
              />
            </div>
            <Select
              value={materialCategoryFilter}
              onValueChange={setMaterialCategoryFilter}
            >
              <SelectTrigger className="h-9 bg-white text-sm">
                <SelectValue placeholder="Lọc theo loại vật tư" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {materialCategoryLabels.all}
                </SelectItem>
                {Object.keys(groupedMaterials).map((category) => (
                  <SelectItem key={category} value={category}>
                    {materialCategoryLabels[category] || category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-b border-slate-200 bg-white/80 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Vật tư đã chọn
              </h5>
              <Badge
                variant="outline"
                className="h-5 border-emerald-100 bg-emerald-50 text-[10px] font-bold text-emerald-600"
              >
                {materials.length} vật tư
              </Badge>
            </div>

            {materials.length === 0 ? (
              <p className="mt-3 text-xs italic text-slate-400">
                Chưa chọn vật tư nào
              </p>
            ) : (
              <div className="mt-3 max-h-36 space-y-2 overflow-y-auto pr-1">
                {materials.map((material: any) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-700">
                        {material.materialName || material.name}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400">
                        {material.materialCategory || material.materialType}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-lg bg-white px-2 py-1 text-xs font-black text-emerald-700 shadow-sm">
                        {material.quantity || 0} {material.unit}
                      </span>
                      <button
                        type="button"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
                        onClick={() => onRemoveMaterial(material.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                                      supplyItemId: item.supplyItemId,
                                      unitBaseId: item.unitBaseId,
                                      unitOptions: item.unitOptions,
                                      availableQuantity: item.availableQuantity,
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
                                {isSelected && (
                                  <p className="text-[10px] text-amber-600">
                                    Còn lại:{" "}
                                    {Math.max(
                                      (item.availableQuantity ?? 0) -
                                        (Number(allocation.quantity) || 0),
                                      0,
                                    )}{" "}
                                    {item.unit}
                                  </p>
                                )}
                                {!isSelected && item.maxQty && (
                                  <p className="text-[10px] text-slate-400">
                                    Định mức: {item.maxQty} {item.unit}
                                  </p>
                                )}
                                {isSelected &&
                                  (item.unitOptions?.length ?? 0) === 0 && (
                                    <p className="text-[10px] font-medium text-red-500">
                                      Chưa setup đơn vị
                                    </p>
                                  )}
                              </div>

                              <div className="flex items-center gap-2 w-40 shrink-0">
                                {isSelected && item.unitOptions?.length > 0 && (
                                  <Select
                                    value={String(
                                      allocation.unitBaseId ??
                                        item.unitOptions[0].id,
                                    )}
                                    onValueChange={(value) => {
                                      const selectedUnit =
                                        item.unitOptions.find(
                                          (unitOption: any) =>
                                            String(unitOption.id) === value,
                                        );
                                      if (selectedUnit && onUpdateMaterial) {
                                        onUpdateMaterial(allocation.id, {
                                          unit: selectedUnit.name,
                                          unitBaseId: selectedUnit.id,
                                        });
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="h-8 min-w-20 bg-white text-[10px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {item.unitOptions.map(
                                        (unitOption: any) => (
                                          <SelectItem
                                            key={unitOption.id}
                                            value={String(unitOption.id)}
                                          >
                                            {unitOption.name}
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                )}
                                <Input
                                  type="number"
                                  placeholder="SL"
                                  min={0}
                                  className={cn(
                                    "h-8 w-20 min-w-0 text-right font-bold bg-white",
                                    "text-emerald-600 border-slate-200",
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
                                />
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
          if (!open) {
            setPersonnelSearch("");
            setPersonnelGroupFilter("all");
          }
        }}
      >
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader className="p-5 pb-3">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4 text-primary" />
              Chọn nhân sự cho ({task.name || "Công việc"})
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 px-5 pb-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Tìm theo tên..."
                className="pl-10 h-9 text-sm"
                value={personnelSearch}
                onChange={(e) => setPersonnelSearch(e.target.value)}
              />
            </div>
            <Select
              value={personnelGroupFilter}
              onValueChange={setPersonnelGroupFilter}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Lọc theo nhóm" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                <SelectItem value="all">Tất cả nhóm</SelectItem>
                {personnelGroupOptions.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                      {getPersonnelGroups(p).length > 0 && (
                        <p className="text-[10px] text-emerald-500 truncate">
                          {getPersonnelGroups(p).join(", ")}
                        </p>
                      )}
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
