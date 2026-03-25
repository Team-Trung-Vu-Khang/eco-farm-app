import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { getFeatureIssues, METRIC_CONFIG } from "../utils";
import type { SelectedSoilFeature, SoilPlanForm } from "../types";

interface SoilPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  onFormChange: (field: keyof SoilPlanForm, value: string) => void;
  planForm: SoilPlanForm;
  selectedFeature: SelectedSoilFeature | null;
}

export function SoilPlanDialog({
  open,
  onOpenChange,
  onSubmit,
  onFormChange,
  planForm,
  selectedFeature,
}: SoilPlanDialogProps) {
  const issues = selectedFeature ? getFeatureIssues(selectedFeature) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo kế hoạch cải tạo đất</DialogTitle>
          <DialogDescription>
            Lập kế hoạch dựa trên phân tích số liệu của khu vực{" "}
            <strong>{selectedFeature?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        {selectedFeature && (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Vấn đề chính</Label>
              <div className="rounded-md border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                <ul className="list-disc space-y-1 pl-4">
                  {issues.map(({ metric, analysis }) => (
                    <li key={metric}>
                      <strong>{METRIC_CONFIG[metric].label}:</strong>{" "}
                      {analysis.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hành động đề xuất</Label>
              <Textarea
                className="h-24"
                value={planForm.customAction}
                onChange={(event) =>
                  onFormChange("customAction", event.target.value)
                }
                placeholder="Nhập các hành động cải tạo..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày bắt đầu dự kiến</Label>
                <Input
                  type="date"
                  value={planForm.startDate}
                  onChange={(event) =>
                    onFormChange("startDate", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Người phụ trách</Label>
                <Select
                  value={planForm.assignedTo}
                  onValueChange={(value) => onFormChange("assignedTo", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân sự" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Nguyễn Văn A</SelectItem>
                    <SelectItem value="2">Trần Thị B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSubmit}>Xác nhận tạo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
