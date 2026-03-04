import { useState, memo } from "react";
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
} from "@tankhang1/eco-shared-ui";
import {
  CheckCircle2,
  Clock,
  Leaf,
  Package,
  Plus,
  Search,
  StickyNote,
  ToggleLeft,
  ToggleRight,
  User,
  Users,
  Wrench,
  X,
} from "lucide-react";
import {
  MATERIAL_TYPES,
  MATERIAL_OPTIONS,
  MATERIAL_UNITS,
  TASK_OPTIONS,
  LABOR_OPTIONS,
} from "../mocks";
import type { MaterialAllocation, TaskAllocation } from "../types";
import usePersonnelStore from "../../../stores/usePersonnelStore";

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
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newItem, setNewItem] = useState({
      name: "",
      qty: "",
      unit: "kg",
      type: "Phân bón",
    });

    // true  = chọn cụ thể số lượng + nhân sự (mặc định)
    // false = chọn định lượng nhân sự (LABOR_OPTIONS cũ)
    const [specificPersonnel, setSpecificPersonnel] = useState(true);
    const [isPersonnelDialogOpen, setIsPersonnelDialogOpen] = useState(false);

    const [newTask, setNewTask] = useState({
      name: "",
      desc: "",
      labor: "",
      count: "1",
      assignedPersonnel: [] as string[],
      duration: "",
    });

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
        duration: newTask.duration,
      });
      setNewTask({
        name: "",
        desc: "",
        labor: "",
        count: "1",
        assignedPersonnel: [],
        duration: "",
      });
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
                  Nhân sự & Cách thức
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
                <div className="flex gap-2 pt-3 border-t mt-auto">
                  <Select
                    value={newItem.type}
                    onValueChange={(v) => {
                      const defaultUnit =
                        MATERIAL_UNITS[v as keyof typeof MATERIAL_UNITS]?.[0] ||
                        "kg";
                      setNewItem({
                        ...newItem,
                        type: v,
                        name: "",
                        unit: defaultUnit,
                      });
                    }}
                  >
                    <SelectTrigger className="w-[120px] h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIAL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={newItem.name}
                    onValueChange={(v) => {
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
                  >
                    <SelectTrigger className="h-9 text-xs flex-1">
                      <SelectValue placeholder="Chọn vật tư..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        MATERIAL_OPTIONS[
                          newItem.type as keyof typeof MATERIAL_OPTIONS
                        ] || []
                      ).map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-1">
                    <Input
                      placeholder="SL"
                      type="number"
                      className="h-9 text-sm"
                      value={newItem.qty}
                      onChange={(e) =>
                        setNewItem({ ...newItem, qty: e.target.value })
                      }
                    />
                    <Select
                      value={newItem.unit}
                      onValueChange={(v) => setNewItem({ ...newItem, unit: v })}
                    >
                      <SelectTrigger className="h-9 text-xs px-2 w-20">
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
                  <Button
                    size="sm"
                    className="h-9 w-9 p-0 bg-slate-900 hover:bg-slate-800"
                    onClick={handleAddMaterial}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* TAB: TASKS */}
              <TabsContent value="tasks" className="flex-1 space-y-4">
                <div className="space-y-2 min-h-[120px]">
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
                        className="bg-slate-50 p-3 rounded-md text-sm space-y-1 group hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-slate-800">
                            {t.name}
                          </span>
                          <button
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onRemoveTask(t.id)}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {t.description && (
                          <p className="text-slate-600 text-xs italic flex items-start gap-1">
                            <StickyNote className="w-3 h-3 mt-0.5" />
                            {t.description}
                          </p>
                        )}
                        <div className="flex gap-3 mt-1 pt-1 border-t border-slate-200/50 flex-wrap">
                          {t.labor && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] h-5 bg-blue-50 text-blue-700 border-blue-100 px-1.5 max-w-[220px] truncate"
                            >
                              <Users className="w-3 h-3 mr-1 shrink-0" />{" "}
                              {t.labor}
                            </Badge>
                          )}
                          {t.duration && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] h-5 bg-amber-50 text-amber-700 border-amber-100 px-1.5"
                            >
                              <Clock className="w-3 h-3 mr-1" /> {t.duration}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Task Form */}
                <div className="space-y-2 pt-3 border-t mt-auto text-sm">
                  <div className="flex gap-2">
                    <Select
                      value={newTask.name}
                      onValueChange={(v) => setNewTask({ ...newTask, name: v })}
                    >
                      <SelectTrigger className="h-9 flex-1 font-medium">
                        <SelectValue placeholder="Chọn công việc..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      className="h-9 px-3 bg-slate-900 hover:bg-slate-800"
                      onClick={handleAddTask}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Thêm
                    </Button>
                  </div>

                  <Input
                    placeholder="Mô tả kỹ thuật (VD: Cày sâu 30cm, phơi đất 5 ngày)..."
                    className="h-9 text-muted-foreground"
                    value={newTask.desc}
                    onChange={(e) =>
                      setNewTask({ ...newTask, desc: e.target.value })
                    }
                  />

                  {/* Personnel mode toggle */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-medium text-slate-500">
                      Chọn nhân sự cụ thể
                    </span>
                    <button
                      type="button"
                      onClick={() => setSpecificPersonnel((v) => !v)}
                      className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                      style={{
                        color: specificPersonnel ? "#2563eb" : "#94a3b8",
                      }}
                    >
                      {specificPersonnel ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                      {specificPersonnel ? "Bật" : "Tắt"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {specificPersonnel ? (
                      <div className="col-span-2 space-y-1.5">
                        {/* Number of workers */}
                        <div className="relative">
                          <Users className="w-3.5 h-3.5 absolute left-2.5 top-2.5 z-10 text-slate-400" />
                          <Input
                            type="number"
                            min={1}
                            placeholder="Số lượng người"
                            className="h-9 pl-8 text-sm"
                            value={newTask.count}
                            onChange={(e) =>
                              setNewTask({ ...newTask, count: e.target.value })
                            }
                          />
                        </div>

                        {/* Personnel picker trigger button */}
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-9 justify-start text-left font-normal text-sm"
                          onClick={() => setIsPersonnelDialogOpen(true)}
                        >
                          <User className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                          {newTask.assignedPersonnel.length > 0 ? (
                            <span className="text-slate-700">
                              Đã chọn{" "}
                              <span className="font-semibold text-blue-600">
                                {newTask.assignedPersonnel.length}
                              </span>{" "}
                              nhân sự
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              Chọn nhân sự...
                            </span>
                          )}
                        </Button>

                        {/* Selected chips */}
                        {newTask.assignedPersonnel.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {newTask.assignedPersonnel.map((name) => (
                              <span
                                key={name}
                                className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 font-medium"
                              >
                                {name}
                                <button
                                  type="button"
                                  onClick={() => togglePersonnel(name)}
                                  className="hover:text-blue-900"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <Users className="w-3.5 h-3.5 absolute left-2.5 top-3 z-10 text-slate-400" />
                        <Select
                          value={newTask.labor}
                          onValueChange={(v) =>
                            setNewTask({ ...newTask, labor: v })
                          }
                        >
                          <SelectTrigger className="h-9 pl-8">
                            <SelectValue placeholder="Nhân sự" />
                          </SelectTrigger>
                          <SelectContent>
                            {LABOR_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Duration - full width in specific mode */}
                    <div
                      className={`relative ${specificPersonnel ? "col-span-2" : ""}`}
                    >
                      <Clock className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                      <Input
                        placeholder="Thời gian (ngày/giờ)"
                        className="h-9 pl-8"
                        type="datetime-local"
                        value={newTask.duration}
                        onChange={(e) =>
                          setNewTask({ ...newTask, duration: e.target.value })
                        }
                      />
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

            <ScrollArea className="h-[300px] px-3">
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
