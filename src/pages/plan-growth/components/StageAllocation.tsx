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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  RemoteAutoCompleteSelect,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  Clock,
  Leaf,
  Package,
  Plus,
  Search,
  StickyNote,
  User,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { memo, useMemo, useState } from "react";
import usePersonnelStore from "../../../stores/usePersonnelStore";
import type { SupplyItemResponse } from "@/features/farm-supply/types";
import type { GeographicalSelection } from "../types";
import type { MaterialAllocation, TaskAllocation } from "../types";
import type { CropSupplyCatalog, CropSupplyType } from "../hooks/useCropSupplyCatalog";
import { useTaskCategorySearch } from "@/features/task-category/hooks/useTaskCategory";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { FarmWorkDurationUnit } from "@/features/farm-workflow/types/farm-workflow.type";
import {
  getSupplyTypeOptions,
  isEquipmentSupplyType,
  mapSupplyItemToOption,
  useRemoteSupplySearch,
} from "@/shared/hooks/useRemoteSupplySearch";
import {
  groupMaterialAllocations,
  isEquipmentAllocation,
} from "../utils/material-allocations";

const DURATION_UNIT_OPTIONS: { value: string; label: string; api: FarmWorkDurationUnit }[] = [
  { value: "phút", label: "Phút", api: "MINUTE" },
  { value: "giờ", label: "Giờ", api: "HOUR" },
  { value: "ngày", label: "Ngày", api: "DAY" },
  { value: "tuần", label: "Tuần", api: "WEEK" },
];

export const StageAllocation = memo(
  ({
    stageName,
    cycleName,
    index,
    allocations,
    tasks,
    onAddMaterial,
    onRemoveMaterial,
    onAddTask,
    onRemoveTask,
    masterSelections = [],
    isDetail = true,
    supplyCatalog,
  }: {
    stageName: string;
    cycleName?: string | null;
    index: number;
    allocations: MaterialAllocation[];
    tasks: TaskAllocation[];
    onAddMaterial: (item: Omit<MaterialAllocation, "id">) => void;
    onRemoveMaterial: (id: number) => void;
    onAddTask: (item: Omit<TaskAllocation, "id">) => void;
    onRemoveTask: (id: number) => void;
    regions?: any[];
    masterSelections?: GeographicalSelection[];
    enterpriseId?: string;
    isDetail?: boolean;
    supplyCatalog: CropSupplyCatalog;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newItem, setNewItem] = useState({
      name: "",
      qty: "",
      unitBaseId: "",
      selectedMaterial: null as SupplyItemResponse | null,
      searchValue: "",
      type:
        getSupplyTypeOptions("CROP")[1]?.value ||
        getSupplyTypeOptions("CROP")[0]?.value ||
        "fertilizer",
    });

    const specificPersonnel = isDetail;
    const [isPersonnelDialogOpen, setIsPersonnelDialogOpen] = useState(false);

    const [newTask, setNewTask] = useState({
      name: "",
      taskCategoryId: "",
      desc: "",
      labor: "",
      count: "1",
      assignedPersonnel: [] as string[],
      geographicalSelections: masterSelections,
      taskSearchValue: "",
    });

    const [durationValue, setDurationValue] = useState("");
    const [durationUnit, setDurationUnit] = useState("ngày");

    const { personnel } = usePersonnelStore();
    const [personnelSearch, setPersonnelSearch] = useState("");
    const debouncedTaskSearch = useDebounce(newTask.taskSearchValue.trim(), 300);
    const { items: taskCategories, isFetching: isFetchingTaskCategories } =
      useTaskCategorySearch({
        params: {
          domainCode: "CROP",
          keyword: debouncedTaskSearch || undefined,
        },
      });

    const filteredPersonnel = personnelSearch.trim()
      ? personnel.filter((p) =>
          p.fullName.toLowerCase().includes(personnelSearch.toLowerCase()),
        )
      : personnel;

    const selectedTypeOption = supplyCatalog.typeOptions.find(
      (option) => option.value === newItem.type,
    );
    const { items: searchedMaterials, isFetching } = useRemoteSupplySearch(
      "CROP",
      newItem.type,
      newItem.searchValue,
    );
    const selectedMaterial = newItem.selectedMaterial;
    const materialOptions = searchedMaterials.map(mapSupplyItemToOption);
    if (
      selectedMaterial &&
      !materialOptions.some((option) => option.value === String(selectedMaterial.id))
    ) {
      materialOptions.unshift(mapSupplyItemToOption(selectedMaterial));
    }
    const packagingVariantOptions =
      !isEquipmentSupplyType(newItem.type)
        ? selectedMaterial?.packagingVariants || []
        : [];
    const selectedPackagingVariant = packagingVariantOptions.find(
      (variant) => String(variant.unitBase?.id) === newItem.unitBaseId,
    );
    const selectedEquipmentUnitBase =
      selectedMaterial?.packagingVariants?.[0]?.unitBase;
    const groupedAllocations = useMemo(
      () => groupMaterialAllocations(allocations),
      [allocations],
    );
    const maxPackagingQuantity = selectedPackagingVariant?.quantity;
    const exceedsPackagingQuantity =
      maxPackagingQuantity != null &&
      Number(newItem.qty) > maxPackagingQuantity;

    const handleAddMaterial = () => {
      if (!selectedMaterial || !newItem.qty) return;
      if (!isEquipmentSupplyType(newItem.type) && !selectedPackagingVariant?.unitBase)
        return;
      onAddMaterial({
        stageId: stageName,
        materialCategory: selectedTypeOption?.label || newItem.type,
        materialType: selectedTypeOption?.label || newItem.type,
        materialName: selectedMaterial.name,
        quantity: newItem.qty,
        unit: isEquipmentSupplyType(newItem.type)
          ? "Cái / Chiếc"
          : selectedPackagingVariant?.unitBase?.name || "",
        supplyItemId: selectedMaterial.id,
        unitBaseId: isEquipmentSupplyType(newItem.type)
          ? 6
          : selectedPackagingVariant?.unitBase?.id,
      });
      setNewItem({
        name: "",
        qty: "",
        unitBaseId: "",
        selectedMaterial: null,
        searchValue: "",
        type: newItem.type,
      });
    };

    const handleAddTask = () => {
      if (!newTask.name) return;

      let laborValue = "";
      if (specificPersonnel) {
        const count =
          parseInt(newTask.count) || newTask.assignedPersonnel.length;
        const names = newTask.assignedPersonnel.join(", ");
        laborValue = names ? `${count} người: ${names}` : `${count} người`;
      } else {
        laborValue = newTask.labor;
      }

      const headcount = specificPersonnel
        ? parseInt(newTask.count) || newTask.assignedPersonnel.length
        : parseInt(laborValue.replace(/\D/g, ""), 10);
      const durationUnitApi = DURATION_UNIT_OPTIONS.find(
        (option) => option.value === durationUnit,
      )?.api;

      onAddTask({
        stageId: stageName,
        name: newTask.name,
        description: newTask.desc,
        labor: laborValue,
        duration: durationValue ? `${durationValue} ${durationUnit}` : "",
        geographicalSelections: newTask.geographicalSelections,
        taskCategoryId: newTask.taskCategoryId
          ? Number(newTask.taskCategoryId)
          : undefined,
        headcount: Number.isFinite(headcount) && headcount > 0 ? headcount : undefined,
        durationValue: durationValue ? Number(durationValue) : undefined,
        durationUnit: durationValue ? durationUnitApi : undefined,
      });

      // Reset form but keep master selections as default for next task
      setNewTask({
        name: "",
        taskCategoryId: "",
        desc: "",
        labor: "",
        count: "1",
        assignedPersonnel: [],
        geographicalSelections: masterSelections || [],
        taskSearchValue: "",
      });
      setDurationValue("");
      setDurationUnit("ngày");
      setPersonnelSearch("");
    };

    const togglePersonnel = (name: string) => {
      setNewTask((prev) => ({
        ...prev,
        assignedPersonnel: prev.assignedPersonnel.includes(name)
          ? prev.assignedPersonnel.filter((n) => n !== name)
          : [...prev.assignedPersonnel, name],
      }));
    };

    return (
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col transition-all duration-200">
        {/* Header - Click to Toggle */}
        <div
          className="bg-slate-50 px-4 py-3 border-b flex justify-between items-center cursor-pointer hover:bg-slate-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${isExpanded ? "bg-blue-600 text-white" : "bg-white border text-slate-500"}`}
            >
              {index + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-800">{stageName}</h4>
                {cycleName && (
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100 font-normal py-0 px-1.5 h-4"
                  >
                    {cycleName}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Leaf className="w-3 h-3" /> {allocations.length} vật tư
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {tasks.length} công việc
                </span>
              </div>
            </div>
          </div>
          <div
            className={`transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-400"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Content Tabs - Collapsible */}
        {isExpanded && (
          <div className="p-4 flex-1 flex flex-col animation-fade-in border-t border-slate-100">
            <Tabs defaultValue="materials" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100 p-1 rounded-lg">
                <TabsTrigger
                  value="materials"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Leaf className="w-3.5 h-3.5 mr-2 text-green-600" />
                  Vật tư & Thiết bị
                </TabsTrigger>
                <TabsTrigger
                  value="tasks"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Users className="w-3.5 h-3.5 mr-2 text-blue-600" />
                  Nhân lực & Phạm vi
                </TabsTrigger>
              </TabsList>

              {/* TAB: MATERIALS */}
              <TabsContent value="materials" className="flex-1 space-y-4">
                <div className="space-y-2 min-h-[120px]">
                  {groupedAllocations.length === 0 ? (
                    <div className="text-center py-6 border border-dashed rounded-lg bg-slate-50/50">
                      <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">
                        Chưa có vật tư phân bổ
                      </p>
                    </div>
                  ) : (
                    groupedAllocations.map((a) => (
                      <div
                        key={a.id}
                        className="flex justify-between items-center bg-slate-50 p-2.5 rounded-md text-sm group hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-white text-xs font-normal"
                          >
                            {a.materialType}
                          </Badge>
                          <span className="font-medium text-slate-700">
                            {a.materialName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border">
                            {a.unit ? `${a.quantity} ${a.unit}` : a.quantity}
                          </span>
                          <button
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onRemoveMaterial(a.id)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Material Form */}
                <div className="border-t mt-auto pt-3">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-medium text-slate-500">
                      Chọn định mức vật tư & thiết bị
                    </span>
                  </div>
                  <div className="space-y-2">
                    {/* Row 1: Selections (Material Type & Name) */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-4">
                        <Select
                          value={newItem.type}
                          onValueChange={(v) => {
                            setNewItem({
                              ...newItem,
                              type: v as CropSupplyType,
                              name: "",
                              unitBaseId: "",
                            });
                          }}
                        >
                          <SelectTrigger className="w-full h-9 text-xs bg-slate-50/50">
                            <SelectValue placeholder="Loại..." />
                          </SelectTrigger>
                          <SelectContent>
                            {supplyCatalog.typeOptions.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-8">
                        <RemoteAutoCompleteSelect
                          options={materialOptions}
                          value={newItem.name}
                          onChange={(v) => {
                            const item = materialOptions.find(
                              (option) => option.value === v,
                            )?.item;
                            const firstVariant = item?.packagingVariants?.[0];
                            setNewItem({
                              ...newItem,
                              name: v,
                              selectedMaterial: item ?? null,
                              unitBaseId:
                                !isEquipmentSupplyType(newItem.type) &&
                                firstVariant?.unitBase?.id
                                  ? String(firstVariant.unitBase.id)
                                  : "",
                            });
                          }}
                          onSearch={(value) =>
                            setNewItem((prev) => ({
                              ...prev,
                              searchValue: value,
                            }))
                          }
                          placeholder="Chọn vật tư cụ thể..."
                          searchPlaceholder="Tìm vật tư..."
                          emptyText={
                            isFetching
                              ? "Đang tải danh sách vật tư..."
                              : "Không tìm thấy vật tư."
                          }
                          loading={isFetching}
                        />
                      </div>
                    </div>

                    {/* Row 2: Configuration (Quantity, Unit & Add Button) */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className={isEquipmentSupplyType(newItem.type) ? "col-span-9" : "col-span-5"}>
                        <Input
                          placeholder="Số lượng"
                          type="number"
                          className="h-9 text-sm px-2 bg-white"
                          value={newItem.qty}
                          onChange={(e) =>
                            setNewItem({ ...newItem, qty: e.target.value })
                          }
                        />
                      </div>
                      {!isEquipmentSupplyType(newItem.type) && (
                        <div className="col-span-4">
                          <Select
                            value={newItem.unitBaseId}
                            onValueChange={(v) =>
                              setNewItem({ ...newItem, unitBaseId: v })
                            }
                            disabled={packagingVariantOptions.length === 0}
                          >
                            <SelectTrigger className="h-9 text-xs px-2 w-full bg-white">
                              <SelectValue placeholder="Đơn vị..." />
                            </SelectTrigger>
                            <SelectContent>
                              {packagingVariantOptions.map((variant) => (
                                <SelectItem
                                  key={variant.unitBase?.id ?? variant.unitBase?.name}
                                  value={String(variant.unitBase?.id)}
                                >
                                  {variant.unitBase?.name ||
                                    variant.packagingType?.name ||
                                    ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="col-span-3">
                        <Button
                          size="sm"
                          className="h-9 w-full p-0 bg-slate-900 hover:bg-slate-800 shadow-sm font-bold flex items-center justify-center gap-1.5"
                          onClick={handleAddMaterial}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          THÊM
                        </Button>
                      </div>
                    </div>
                    {exceedsPackagingQuantity && (
                      <p className="text-[11px] text-amber-600 mt-1">
                        Số lượng vượt quá định mức đóng gói (
                        {maxPackagingQuantity} {selectedPackagingVariant?.unitBase?.name}
                        /{selectedPackagingVariant?.packagingType?.name})
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* TAB: TASKS */}
              <TabsContent
                value="tasks"
                className="flex-1 flex flex-col min-h-0"
              >
                <ScrollArea className="flex-1 -mx-1 px-1">
                  <div className="space-y-2 pb-4">
                    {tasks.length === 0 ? (
                      <div className="text-center py-6 border border-dashed rounded-lg bg-slate-50/50">
                        <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">
                          Chưa thiết lập công việc
                        </p>
                      </div>
                    ) : (
                      tasks.map((t) => (
                        <div
                          key={t.id}
                          className="bg-white border border-slate-200/60 p-3 rounded-xl hover:border-emerald-200/50 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 text-sm truncate">
                                  {t.name}
                                </span>
                                <button
                                  className="text-slate-300 hover:text-red-500 transition-colors shrink-0"
                                  onClick={() => onRemoveTask(t.id)}
                                >
                                  <X className="w-3 h-3.5" />
                                </button>
                              </div>
                              {t.description && (
                                <p className="text-slate-500 text-[11px] italic flex items-start gap-1 mt-0.5 line-clamp-1">
                                  <StickyNote className="w-2.5 h-2.5 mt-1 shrink-0" />
                                  {t.description}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              {t.labor && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] h-5 bg-blue-50/50 text-blue-600 border-blue-100/50 px-2 font-medium"
                                >
                                  <Users className="w-3 h-3 mr-1 shrink-0" />
                                  {t.labor}
                                </Badge>
                              )}
                              {t.duration && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] h-5 bg-amber-50/50 text-amber-600 border-amber-100/50 px-2 font-medium"
                                >
                                  <Clock className="w-3 h-3 mr-1 shrink-0" />
                                  {t.duration}
                                </Badge>
                              )}
                            </div>
                          </div>

                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Add Task Form */}
                <div className="space-y-2 pt-3 border-t mt-auto text-sm shrink-0">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <RemoteAutoCompleteSelect
                        options={taskCategories.map((category) => ({
                          value: String(category.id),
                          label: category.name,
                        }))}
                        value={newTask.taskCategoryId}
                        onChange={(v) => {
                          const category = taskCategories.find(
                            (item) => String(item.id) === v,
                          );
                          setNewTask({
                            ...newTask,
                            taskCategoryId: v,
                            name: category?.name || newTask.name,
                          });
                        }}
                        onSearch={(value) =>
                          setNewTask((prev) => ({
                            ...prev,
                            taskSearchValue: value,
                          }))
                        }
                        loading={isFetchingTaskCategories}
                        placeholder="Chọn công việc..."
                        searchPlaceholder="Tìm công việc..."
                        emptyText="Không tìm thấy công việc."
                      />
                    </div>
                    <Button
                      size="sm"
                      className="h-9 px-3 bg-slate-900 hover:bg-slate-800"
                      onClick={handleAddTask}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Thêm
                    </Button>
                  </div>

                  <Input
                    placeholder="Mô tả kỹ thuật..."
                    className="h-9 text-xs"
                    value={newTask.desc}
                    onChange={(e) =>
                      setNewTask({ ...newTask, desc: e.target.value })
                    }
                  />

                  {/* Personnel and Duration Row */}
                  <div className="grid grid-cols-2 gap-2">
                    {specificPersonnel ? (
                      <div className="col-span-2 space-y-1.5">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <Users className="w-3.5 h-3.5 absolute left-2.5 top-2.5 z-10 text-slate-400" />
                            <Input
                              type="number"
                              min={1}
                              placeholder="Số người"
                              className="h-9 pl-8 text-sm"
                              value={newTask.count}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  count: e.target.value,
                                })
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-9 justify-start text-left font-normal text-xs px-2 truncate"
                            onClick={() => setIsPersonnelDialogOpen(true)}
                          >
                            <User className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                            {newTask.assignedPersonnel.length > 0 ? (
                              <span>
                                Đã chọn{" "}
                                <span className="font-bold text-primary">
                                  {newTask.assignedPersonnel.length}
                                </span>
                              </span>
                            ) : (
                              "Chọn nhân sự..."
                            )}
                          </Button>
                        </div>

                        {newTask.assignedPersonnel.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {newTask.assignedPersonnel.map((name) => (
                              <Badge
                                key={name}
                                variant="secondary"
                                className="text-[10px] bg-blue-50 text-blue-700 h-5"
                              >
                                {name}
                                <X
                                  className="w-2.5 h-2.5 ml-1 cursor-pointer"
                                  onClick={() => togglePersonnel(name)}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <Users className="w-3.5 h-3.5 absolute left-2.5 top-3 z-10 text-slate-400" />
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="Số"
                          className="h-9 pl-8 pr-12 text-xs bg-slate-50/50"
                          value={
                            newTask.labor
                              ? newTask.labor.replace(/\D/g, "")
                              : ""
                          }
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setNewTask({
                              ...newTask,
                              labor: val ? `${val} người` : "",
                            });
                          }}
                        />
                        <span
                          className={cn(
                            "absolute top-[12px] text-[10px] text-muted-foreground uppercase pointer-events-none",
                            !!(newTask.labor
                              ? newTask.labor.replace(/\D/g, "")
                              : "")
                              ? "right-7"
                              : "right-3",
                          )}
                        >
                          người
                        </span>
                      </div>
                    )}

                    <div
                      className={`relative flex gap-1 ${specificPersonnel ? "col-span-2" : ""}`}
                    >
                      <div className="relative flex-1">
                        <Clock className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400 z-10" />
                        <Input
                          placeholder="T.lượng"
                          className="h-9 pl-8 text-xs bg-white"
                          type="number"
                          value={durationValue}
                          onChange={(e) => setDurationValue(e.target.value)}
                        />
                      </div>
                      <Select
                        value={durationUnit}
                        onValueChange={setDurationUnit}
                      >
                        <SelectTrigger className="h-9 w-18 text-[10px] px-1 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DURATION_UNIT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Personnel Selection Dialog */}
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
                Chọn nhân sự thực hiện
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
                {filteredPersonnel.map((p) => {
                  const isSelected = newTask.assignedPersonnel.includes(
                    p.fullName,
                  );
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
                onClick={() => {
                  setIsPersonnelDialogOpen(false);
                  setPersonnelSearch("");
                }}
              >
                Xác nhận ({newTask.assignedPersonnel.length} người)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
);
