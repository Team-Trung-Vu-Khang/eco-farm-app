import {
  Badge,
  Button,
  Combobox,
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
import { memo, useState } from "react";
import usePersonnelStore from "../../../stores/usePersonnelStore";
import type { GeographicalSelection } from "../types";
import {
  MATERIAL_OPTIONS,
  MATERIAL_TYPES,
  MATERIAL_UNITS,
  TASK_OPTIONS,
} from "../data/mocks";
import type { MaterialAllocation, TaskAllocation } from "../types";

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
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newItem, setNewItem] = useState({
      name: "",
      qty: "",
      unit: "kg",
      type: "Phân bón",
    });

    const specificPersonnel = isDetail;
    const [isPersonnelDialogOpen, setIsPersonnelDialogOpen] = useState(false);

    const [newTask, setNewTask] = useState({
      name: "",
      desc: "",
      labor: "",
      count: "1",
      assignedPersonnel: [] as string[],
      geographicalSelections: masterSelections,
    });

    const [durationValue, setDurationValue] = useState("");
    const [durationUnit, setDurationUnit] = useState("ngày");

    const { personnel } = usePersonnelStore();
    const [personnelSearch, setPersonnelSearch] = useState("");

    const filteredPersonnel = personnelSearch.trim()
      ? personnel.filter((p) =>
          p.fullName.toLowerCase().includes(personnelSearch.toLowerCase()),
        )
      : personnel;

    const handleAddMaterial = () => {
      if (!newItem.name || !newItem.qty) return;
      onAddMaterial({
        stageId: stageName,
        materialCategory: newItem.type,
        materialType: newItem.type,
        materialName: newItem.name,
        quantity: newItem.qty,
        unit: newItem.unit,
      });
      setNewItem({ name: "", qty: "", unit: "kg", type: "Phân bón" });
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

      onAddTask({
        stageId: stageName,
        name: newTask.name,
        description: newTask.desc,
        labor: laborValue,
        duration: durationValue ? `${durationValue} ${durationUnit}` : "",
        geographicalSelections: newTask.geographicalSelections,
      });

      // Reset form but keep master selections as default for next task
      setNewTask({
        name: "",
        desc: "",
        labor: "",
        count: "1",
        assignedPersonnel: [],
        geographicalSelections: masterSelections || [],
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
                  {allocations.length === 0 ? (
                    <div className="text-center py-6 border border-dashed rounded-lg bg-slate-50/50">
                      <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">
                        Chưa có vật tư phân bổ
                      </p>
                    </div>
                  ) : (
                    allocations.map((a) => (
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
                            {a.quantity} {a.unit}
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
                            const defaultUnit =
                              MATERIAL_UNITS[
                                v as keyof typeof MATERIAL_UNITS
                              ]?.[0] || "kg";
                            setNewItem({
                              ...newItem,
                              type: v,
                              name: "",
                              unit: defaultUnit,
                            });
                          }}
                        >
                          <SelectTrigger className="w-full h-9 text-xs bg-slate-50/50">
                            <SelectValue placeholder="Loại..." />
                          </SelectTrigger>
                          <SelectContent>
                            {MATERIAL_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-8">
                        <Combobox
                          options={(
                            MATERIAL_OPTIONS[
                              newItem.type as keyof typeof MATERIAL_OPTIONS
                            ] || []
                          ).map((opt) => ({
                            value: opt.value,
                            label: opt.label,
                          }))}
                          value={newItem.name}
                          onChange={(v) => {
                            const category =
                              MATERIAL_OPTIONS[
                                newItem.type as keyof typeof MATERIAL_OPTIONS
                              ] || [];
                            const item = category.find((i) => i.value === v);
                            setNewItem({
                              ...newItem,
                              name: v,
                              unit: item?.unit || newItem.unit,
                            });
                          }}
                          placeholder="Chọn vật tư cụ thể..."
                          searchPlaceholder="Tìm vật tư..."
                          emptyText="Không tìm thấy vật tư."
                          className="h-9 text-xs w-full bg-slate-50/50"
                        />
                      </div>
                    </div>

                    {/* Row 2: Configuration (Quantity, Unit & Add Button) */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-5">
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
                      <div className="col-span-4">
                        <Select
                          value={newItem.unit}
                          onValueChange={(v) =>
                            setNewItem({ ...newItem, unit: v })
                          }
                        >
                          <SelectTrigger className="h-9 text-xs px-2 w-full bg-white">
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
                      </div>
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
                    <Combobox
                      options={TASK_OPTIONS.map((opt) => ({
                        value: opt.value,
                        label: opt.label,
                      }))}
                      value={newTask.name}
                      onChange={(v) => setNewTask({ ...newTask, name: v })}
                      placeholder="Chọn công việc..."
                      searchPlaceholder="Tìm công việc..."
                      emptyText="Không tìm thấy công việc."
                      className="h-9 flex-1 font-medium bg-slate-50/50"
                    />
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
                          <SelectItem value="phút">Phút</SelectItem>
                          <SelectItem value="giờ">Giờ</SelectItem>
                          <SelectItem value="ngày">Ngày</SelectItem>
                          <SelectItem value="tuần">Tuần</SelectItem>
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
