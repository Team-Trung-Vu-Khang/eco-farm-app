import {
  Badge,
  Button,
  Calendar,
  Card,
  CardContent,
  Checkbox,
  Input,
  Label,
  Textarea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { vi } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  ClipboardList,
  Info,
  RefreshCw,
  X,
} from "lucide-react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import {
  formatLocalISODate,
  getRepeatDatesText,
  parseLocalISODate,
} from "../../plan/utils/task";
import type { TaskCreateFormData } from "../TaskCreatePage";

const PRIORITY_OPTIONS = [
  {
    id: "low",
    label: "Thấp",
    active: "bg-emerald-500",
    text: "text-emerald-700",
    border: "border-emerald-500",
    bg: "bg-emerald-50/50",
  },
  {
    id: "medium",
    label: "Trung bình",
    active: "bg-amber-500",
    text: "text-amber-700",
    border: "border-amber-500",
    bg: "bg-amber-50/50",
  },
  {
    id: "high",
    label: "Cao",
    active: "bg-rose-500",
    text: "text-rose-700",
    border: "border-rose-500",
    bg: "bg-rose-50/50",
  },
] as const;

interface SimpleTaskFormProps {
  formData: TaskCreateFormData;
  setFormData: Dispatch<SetStateAction<TaskCreateFormData>>;
  handleComplete: () => void;
  goBack: () => void;
  completeLabel?: string;
}

export default function SimpleTaskForm({
  formData,
  setFormData,
  handleComplete,
  goBack,
  completeLabel = "Hoàn tất & Khởi tạo",
}: SimpleTaskFormProps) {
  const mainSubtask = formData.tasks[0];
  const isRepeating = Boolean(mainSubtask?.isRepeating);
  const repeatDates = mainSubtask?.repeatDates || [];

  const updateSubtask = (
    patch: Partial<{
      isRepeating: boolean;
      repeatDates: string[];
    }>,
  ) => {
    setFormData((prev) => {
      const existing = prev.tasks[0] || {
        id: Date.now(),
        stageId: "",
        name: prev.name,
        description: prev.description,
        geographicalSelections: [],
      };
      return {
        ...prev,
        tasks: [{ ...existing, ...patch }],
      };
    });
  };

  const toggleRepeating = (checked: boolean) => {
    if (!checked) {
      setFormData((prev) => ({ ...prev, tasks: [] }));
      return;
    }
    updateSubtask({ isRepeating: true, repeatDates });
  };

  const isValid =
    Boolean(formData.name) &&
    Boolean(formData.startDate) &&
    Boolean(formData.endDate) &&
    (!isRepeating || repeatDates.length > 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 p-4 bg-blue-50 text-blue-900 rounded-lg border border-blue-100">
        <div className="bg-white p-2 rounded-full shadow-sm">
          <ClipboardList className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold">Chế độ đơn giản</h3>
          <p className="text-sm text-blue-700">
            Nhập nhanh những thông tin cần thiết nhất để tạo công việc. Chuyển
            sang chế độ chi tiết bất cứ lúc nào để gắn với kế hoạch, vật tư và
            phạm vi cụ thể.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label required>Công việc</Label>
        <Input
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="VD: Bón phân thúc đợt 1"
        />
      </div>

      <div className="space-y-2">
        <Label>Mức độ ưu tiên</Label>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITY_OPTIONS.map((opt) => {
            const isActive = formData.priority === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, priority: opt.id }))
                }
                className={cn(
                  "cursor-pointer p-3 rounded-xl border-2 transition-all text-center",
                  isActive
                    ? `${opt.border} ${opt.bg} ${opt.text} shadow-sm`
                    : "border-slate-100 bg-white hover:border-slate-200",
                )}
              >
                <span
                  className={cn(
                    "inline-block w-2 h-2 rounded-full mr-2 align-middle",
                    isActive ? opt.active : "bg-slate-300",
                  )}
                />
                <span className="text-xs font-bold align-middle">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Label required>Thời gian bắt đầu - kết thúc / lặp lại</Label>

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
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
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
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
          <Checkbox
            id="simple-task-repeat"
            checked={isRepeating}
            onCheckedChange={(checked) => toggleRepeating(!!checked)}
          />
          <Label
            htmlFor="simple-task-repeat"
            className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw
              className={cn("w-3.5 h-3.5", isRepeating && "text-blue-500")}
            />
            Lặp lại công việc
          </Label>
        </div>

        {isRepeating && (
          <div className="space-y-3 p-3 bg-white rounded-xl border border-blue-100">
            <div className="flex w-full items-center justify-between">
              <p className="text-xs font-bold text-slate-700">
                Chọn các ngày lặp lại
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[11px] text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                disabled={repeatDates.length === 0}
                onClick={() => updateSubtask({ repeatDates: [] })}
              >
                <X className="w-3 h-3 mr-1" />
                Xóa
              </Button>
            </div>
            <Calendar
              mode="multiple"
              locale={vi}
              selected={repeatDates.map(parseLocalISODate)}
              onSelect={(dates) =>
                updateSubtask({
                  repeatDates: (dates || []).map(formatLocalISODate),
                })
              }
              disabled={{
                before: new Date(new Date().setHours(0, 0, 0, 0)),
              }}
              className="mx-auto w-1/2 bg-white"
              style={{ "--cell-size": "3.25rem" } as CSSProperties}
            />
            <div className="pt-2 border-t border-blue-100/50">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-medium text-blue-700 italic">
                  {getRepeatDatesText(repeatDates)}
                </p>
                {repeatDates.length > 0 && (
                  <Badge
                    variant="outline"
                    className="shrink-0 bg-white text-[10px] font-bold text-blue-700 border-blue-200"
                  >
                    {repeatDates.length} ngày
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Mô tả</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Mô tả ngắn gọn công việc cần thực hiện..."
          rows={2}
        />
      </div>

      <Card className="bg-amber-50/50 border-amber-100">
        <CardContent className="p-4 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Chế độ đơn giản tạo công việc phát sinh, không gắn kế hoạch, vật tư
            hay phạm vi canh tác cụ thể. Chuyển sang chế độ chi tiết để bổ sung.
          </p>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 left-0 right-0 flex items-center justify-between gap-3 bg-white/95 backdrop-blur border-t border-slate-100 pt-4 pb-2 -mx-4 px-4">
        <Button type="button" variant="outline" onClick={goBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <Button
          type="button"
          disabled={!isValid}
          onClick={handleComplete}
          className="font-bold"
        >
          {completeLabel}
        </Button>
      </div>
    </div>
  );
}
