import { memo, useState } from "react";
import {
  Badge,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Clock,
  Leaf,
  Package,
  Plus,
  StickyNote,
  Users,
  Wrench,
  X,
} from "lucide-react";
import type { AllocationItem } from "../../../stores/useAmendmentPlanStore";
import {
  LABOR_OPTIONS,
  MATERIAL_OPTIONS,
  MATERIAL_TYPES,
  MATERIAL_UNITS,
  TASK_OPTIONS,
} from "../utils";

interface AmendmentPlanStageAllocationProps {
  stageName: string;
  index: number;
  items: AllocationItem[];
  onAdd: (item: Omit<AllocationItem, "id">) => void;
  onRemove: (id: number) => void;
}

export const AmendmentPlanStageAllocation = memo(
  ({
    stageName,
    index,
    items,
    onAdd,
    onRemove,
  }: AmendmentPlanStageAllocationProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newItem, setNewItem] = useState({
      name: "",
      qty: "",
      unit: "kg",
      type: "Phân bón",
    });
    const [newTask, setNewTask] = useState({
      name: "",
      desc: "",
      labor: "",
      duration: "",
    });

    const materials = items.filter((item) => item.type === "material");
    const tasks = items.filter((item) => item.type === "task");

    const handleAddMaterial = () => {
      if (!newItem.name || !newItem.qty) return;

      onAdd({
        stage: stageName,
        type: "material",
        name: newItem.name,
        detail: `${newItem.qty} ${newItem.unit}`,
      });
      setNewItem({
        name: "",
        qty: "",
        unit: "kg",
        type: "Phân bón",
      });
    };

    const handleAddTask = () => {
      if (!newTask.name) return;

      onAdd({
        stage: stageName,
        type: "task",
        name: newTask.name,
        detail: newTask.labor || "1 người",
        subDetail: newTask.duration || "1 ngày",
        labor: newTask.labor || "1 người",
        duration: newTask.duration || "1 ngày",
      });
      setNewTask({
        name: "",
        desc: "",
        labor: "",
        duration: "",
      });
    };

    return (
      <div className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200">
        <div
          className="flex cursor-pointer items-center justify-between border-b bg-slate-50 px-4 py-3 hover:bg-slate-100"
          onClick={() => setIsExpanded((current) => !current)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold shadow-sm transition-colors ${
                isExpanded
                  ? "bg-amber-600 text-white"
                  : "border bg-white text-slate-500"
              }`}
            >
              {index + 1}
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">{stageName}</h4>
              <div className="mt-0.5 flex gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Package className="h-3 w-3" /> {materials.length} vật tư
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1">
                  <Wrench className="h-3 w-3" /> {tasks.length} công việc
                </span>
              </div>
            </div>
          </div>
          <div
            className={`transform transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <StickyNote className="h-4 w-4 text-slate-400" />
          </div>
        </div>

        {isExpanded && (
          <div className="animation-fade-in border-t border-slate-100 p-4">
            <Tabs defaultValue="materials">
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="materials">
                  <Leaf className="mr-2 h-3.5 w-3.5 text-green-600" />
                  Vật tư xử lý
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  <Wrench className="mr-2 h-3.5 w-3.5 text-blue-600" />
                  Hoạt động thi công
                </TabsTrigger>
              </TabsList>

              <TabsContent value="materials" className="space-y-3">
                {materials.length === 0 && (
                  <p className="rounded border border-dashed py-4 text-center text-xs text-slate-400">
                    Chưa có vật tư
                  </p>
                )}

                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between rounded bg-slate-50 p-2 text-sm"
                  >
                    <span className="font-medium">{material.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-white">
                        {material.detail}
                      </Badge>
                      <button
                        onClick={() => onRemove(material.id)}
                        className="text-slate-400 hover:text-red-500"
                        type="button"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="mt-2 flex flex-1 gap-2 border-t pt-2">
                  <Select
                    value={newItem.type}
                    onValueChange={(value) => {
                      const defaultUnit = MATERIAL_UNITS[value]?.[0] || "kg";
                      setNewItem((current) => ({
                        ...current,
                        type: value,
                        name: "",
                        unit: defaultUnit,
                      }));
                    }}
                  >
                    <SelectTrigger className="h-9 w-[120px] text-xs">
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
                    onValueChange={(value) => {
                      const item = (MATERIAL_OPTIONS[newItem.type] || []).find(
                        (option) => option.value === value,
                      );
                      setNewItem((current) => ({
                        ...current,
                        name: value,
                        unit: item?.unit || current.unit,
                      }));
                    }}
                  >
                    <SelectTrigger className="h-9 w-full text-xs">
                      <SelectValue placeholder="Chọn vật tư..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(MATERIAL_OPTIONS[newItem.type] || []).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    className="h-9 text-xs"
                    onChange={(event) =>
                      setNewItem((current) => ({
                        ...current,
                        qty: event.target.value,
                      }))
                    }
                    placeholder="SL"
                    type="number"
                    value={newItem.qty}
                  />

                  <Select
                    value={newItem.unit}
                    onValueChange={(value) =>
                      setNewItem((current) => ({ ...current, unit: value }))
                    }
                  >
                    <SelectTrigger className="h-9 w-24 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(MATERIAL_UNITS[newItem.type] || ["kg"]).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    className="h-9 bg-slate-800 px-2"
                    onClick={handleAddMaterial}
                    size="sm"
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-3">
                {tasks.length === 0 && (
                  <p className="rounded border border-dashed py-4 text-center text-xs text-slate-400">
                    Chưa có công việc
                  </p>
                )}

                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded bg-slate-50 p-2 text-sm"
                  >
                    <span className="font-medium">{task.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {task.detail}
                      </Badge>
                      {task.subDetail && (
                        <Badge
                          variant="outline"
                          className="bg-white text-[10px]"
                        >
                          {task.subDetail}
                        </Badge>
                      )}
                      <button
                        onClick={() => onRemove(task.id)}
                        className="text-slate-400 hover:text-red-500"
                        type="button"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="mt-2 space-y-2 border-t pt-2">
                  <div className="flex gap-2">
                    <Select
                      value={newTask.name}
                      onValueChange={(value) =>
                        setNewTask((current) => ({ ...current, name: value }))
                      }
                    >
                      <SelectTrigger className="h-9 flex-1 text-xs">
                        <SelectValue placeholder="Chọn hoạt động..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      className="h-9 bg-slate-800 px-3"
                      onClick={handleAddTask}
                      size="sm"
                      type="button"
                    >
                      <Plus className="h-4 w-4" /> Thêm
                    </Button>
                  </div>

                  <Input
                    className="h-9 text-xs text-muted-foreground"
                    onChange={(event) =>
                      setNewTask((current) => ({
                        ...current,
                        desc: event.target.value,
                      }))
                    }
                    placeholder="Mô tả kỹ thuật..."
                    value={newTask.desc}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Users className="absolute left-2.5 top-3 z-10 h-3.5 w-3.5 text-slate-400" />
                      <Select
                        value={newTask.labor}
                        onValueChange={(value) =>
                          setNewTask((current) => ({
                            ...current,
                            labor: value,
                          }))
                        }
                      >
                        <SelectTrigger className="h-9 pl-8 text-xs">
                          <SelectValue placeholder="Nhân sự" />
                        </SelectTrigger>
                        <SelectContent>
                          {LABOR_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="relative">
                      <Clock className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        className="h-9 pl-8 text-xs"
                        onChange={(event) =>
                          setNewTask((current) => ({
                            ...current,
                            duration: event.target.value,
                          }))
                        }
                        placeholder="Thời gian"
                        value={newTask.duration}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    );
  },
);

AmendmentPlanStageAllocation.displayName = "AmendmentPlanStageAllocation";
