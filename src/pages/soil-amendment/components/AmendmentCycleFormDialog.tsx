import {
  Badge,
  Button,
  FormDialog,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Search, X } from "lucide-react";
import { getActivityConfig, PREDEFINED_ACTIVITIES } from "../data/amendmentCycleData";
import type {
  ActivityType,
  AmendmentCycle,
  AmendmentCycleFormData,
} from "../types/amendment-cycle";

interface AmendmentCycleFormDialogProps {
  activitySearch: string;
  customActivityType: ActivityType;
  editItem: AmendmentCycle | null;
  filteredActivities: typeof PREDEFINED_ACTIVITIES;
  formData: AmendmentCycleFormData;
  isActivityListOpen: boolean;
  onAddCustomActivity: () => void;
  onOpenChange: (open: boolean) => void;
  onRemoveActivity: (index: number) => void;
  onSave: () => void;
  open: boolean;
  setActivitySearch: (value: string) => void;
  setCustomActivityType: (value: ActivityType) => void;
  setFormData: React.Dispatch<React.SetStateAction<AmendmentCycleFormData>>;
  setIsActivityListOpen: (open: boolean) => void;
  addActivity: (activity: { text: string; type: ActivityType }) => void;
}

export function AmendmentCycleFormDialog({
  activitySearch,
  addActivity,
  customActivityType,
  editItem,
  filteredActivities,
  formData,
  isActivityListOpen,
  onAddCustomActivity,
  onOpenChange,
  onRemoveActivity,
  onSave,
  open,
  setActivitySearch,
  setCustomActivityType,
  setFormData,
  setIsActivityListOpen,
}: AmendmentCycleFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa chu kỳ" : "Tạo chu kỳ mới"}
      onSubmit={onSave}
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tên chu kỳ</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((current) => ({ ...current, title: e.target.value }))
              }
              placeholder="VD: Ngắn hạn"
            />
          </div>
          <div className="space-y-2">
            <Label>Loại</Label>
            <Select
              value={formData.type}
              onValueChange={(value: AmendmentCycle["type"]) =>
                setFormData((current) => ({ ...current, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Ngắn hạn</SelectItem>
                <SelectItem value="medium">Trung hạn</SelectItem>
                <SelectItem value="long">Dài hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Thời gian ước tính</Label>
          <Input
            value={formData.duration}
            onChange={(e) =>
              setFormData((current) => ({ ...current, duration: e.target.value }))
            }
            placeholder="VD: 1 vụ - 1 năm"
          />
        </div>

        <div className="space-y-2">
          <Label>Điều kiện áp dụng</Label>
          <Input
            value={formData.condition}
            onChange={(e) =>
              setFormData((current) => ({ ...current, condition: e.target.value }))
            }
            placeholder="VD: Đất thoái hóa nhẹ..."
          />
        </div>

        <div className="space-y-2">
          <Label>Kết quả dự kiến</Label>
          <Input
            value={formData.outcome}
            onChange={(e) =>
              setFormData((current) => ({ ...current, outcome: e.target.value }))
            }
            placeholder="VD: Hiệu quả thấy rõ sau 1-2 vụ"
          />
        </div>

        <div className="space-y-2">
          <Label>Danh sách hoạt động</Label>
          <div className="relative z-50">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={activitySearch}
                  onChange={(e) => {
                    setActivitySearch(e.target.value);
                    setIsActivityListOpen(true);
                  }}
                  onFocus={() => setIsActivityListOpen(true)}
                  placeholder="Tìm kiếm hoặc nhập hoạt động mới..."
                  className="pl-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAddCustomActivity();
                    }
                  }}
                />
              </div>
            </div>

            {isActivityListOpen && activitySearch && (
              <div className="absolute z-50 mt-1 max-h-[200px] w-full overflow-y-auto rounded-md border bg-white p-1 shadow-lg">
                {filteredActivities.map((activity) => {
                  const { color, icon: Icon, label } = getActivityConfig(
                    activity.type,
                  );

                  return (
                    <button
                      key={activity.text}
                      type="button"
                      className="flex w-full items-center justify-between rounded px-3 py-2 text-left hover:bg-slate-50"
                      onClick={() => addActivity(activity)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-1 ${color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{activity.text}</div>
                          <div className="text-xs text-muted-foreground">
                            {label}
                          </div>
                        </div>
                      </div>
                      <Check className="h-4 w-4 text-muted-foreground" />
                    </button>
                  );
                })}

                {filteredActivities.length === 0 && (
                  <div className="space-y-3 px-3 py-4">
                    <p className="text-sm text-muted-foreground">
                      Không có hoạt động mẫu phù hợp. Thêm hoạt động tùy chỉnh:
                    </p>
                    <div className="flex gap-2">
                      <Select
                        value={customActivityType}
                        onValueChange={(value: ActivityType) =>
                          setCustomActivityType(value)
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="biological">Sinh học</SelectItem>
                          <SelectItem value="chemical">Hóa học</SelectItem>
                          <SelectItem value="mechanical">Cơ giới</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={onAddCustomActivity}>
                        Thêm mới
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-slate-50">
            <ScrollArea className="h-[180px]">
              {formData.activities && formData.activities.length > 0 ? (
                <ul className="space-y-2 p-3">
                  {formData.activities.map((activity, index) => {
                    const { color, icon: Icon, label } = getActivityConfig(
                      activity.type,
                    );

                    return (
                      <li
                        key={`${activity.text}-${index}`}
                        className="flex items-center justify-between rounded-md border bg-white px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full p-1 ${color}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{activity.text}</div>
                            <Badge variant="outline" className="mt-1 text-[10px]">
                              {label}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => onRemoveActivity(index)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-sm text-muted-foreground opacity-60">
                  <Search className="mb-2 h-8 w-8 opacity-20" />
                  <p>Tìm kiếm và chọn các hoạt động mẫu</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </FormDialog>
  );
}
