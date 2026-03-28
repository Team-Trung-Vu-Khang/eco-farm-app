import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Clock, Info, Plus, Trash } from "lucide-react";
import { processTypeOptions } from "../data/createTreatment.constants";
import type { CreateTreatmentFormData } from "../types/createTreatment.types";

interface CreateTreatmentProcessStepProps {
  formData: CreateTreatmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<CreateTreatmentFormData>>;
  onAddStep: () => void;
  onRemoveStep: (id: string) => void;
}

export function CreateTreatmentProcessStep({
  formData,
  setFormData,
  onAddStep,
  onRemoveStep,
}: CreateTreatmentProcessStepProps) {
  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Quy trình thực hiện</h3>
          <Button
            size="sm"
            variant="secondary"
            className="gap-2"
            onClick={onAddStep}
          >
            <Plus className="w-4 h-4" />
            Thêm bước
          </Button>
        </div>

        <div className="space-y-4">
          {formData.steps.map((step, idx) => (
            <Card
              key={step.id}
              className="relative border-2 focus-within:border-primary/50 transition-all"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <h4 className="font-bold">Bước {idx + 1}</h4>
                  </div>
                  {formData.steps.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-destructive"
                      onClick={() => onRemoveStep(step.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Tên hành động (VD: Phun lần 1)"
                    value={step.title}
                    onChange={(event) => {
                      const newSteps = [...formData.steps];
                      newSteps[idx].title = event.target.value;
                      setFormData({ ...formData, steps: newSteps });
                    }}
                  />
                  <Select
                    value={step.type}
                    onValueChange={(value) => {
                      const newSteps = [...formData.steps];
                      newSteps[idx].type = value;
                      setFormData({ ...formData, steps: newSteps });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {processTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Thời điểm (VD: Ngày 1)"
                    value={step.day}
                    onChange={(event) => {
                      const newSteps = [...formData.steps];
                      newSteps[idx].day = event.target.value;
                      setFormData({ ...formData, steps: newSteps });
                    }}
                  />
                  <Input
                    placeholder="Mô tả kỹ thuật..."
                    value={step.description}
                    onChange={(event) => {
                      const newSteps = [...formData.steps];
                      newSteps[idx].description = event.target.value;
                      setFormData({ ...formData, steps: newSteps });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-[400px]">
        <Card className="bg-sky-50/50 border-sky-100">
          <CardContent className="p-6 space-y-4">
            <h4 className="font-bold text-sky-900">Hướng dẫn xây dựng</h4>
            <div className="space-y-4 text-sm text-sky-800/80 leading-relaxed">
              <div className="flex gap-3">
                <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <p>
                  <span className="font-bold text-sky-900">Phác đồ chuẩn</span>{" "}
                  nên bắt đầu bằng các biện pháp canh tác (rút nước, tỉa cành)
                  trước khi dùng thuốc.
                </p>
              </div>
              <div className="flex gap-3">
                <Clock className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <p>
                  Ghi rõ <span className="font-bold text-sky-900">thời điểm</span>{" "}
                  (Ngày 1, Ngày 3...) để hệ thống tự động nhắc nhở nông dân.
                </p>
              </div>
              <div className="pt-2 border-t border-sky-200/50">
                <p className="text-xs italic">
                  Ví dụ: <br /> Bước 1: Cắt nước (Ngày 1) <br /> Bước 2: Phun
                  thuốc lần 1 (Ngày 1) <br /> Bước 3: Kiểm tra vết bệnh (Ngày 5)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
