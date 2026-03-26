import type { Dispatch, SetStateAction } from "react";
import {
  Badge,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ClipboardList,
  Clock,
  FileCheck,
  Info,
  StickyNote,
  Wrench,
} from "lucide-react";
import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { AllocationItem } from "../../../stores/useAmendmentPlanStore";
import type { Regimen } from "../../../stores/useRegimenStore";
import type { AmendmentPlanFormData, AmendmentProcess } from "../types";
import { AMENDMENT_PROCESSES } from "../utils";
import { AmendmentPlanStageAllocation } from "./AmendmentPlanStageAllocation";

interface AmendmentPlanProcessStepProps {
  formData: AmendmentPlanFormData;
  handleAddAllocation: (item: Omit<AllocationItem, "id">) => void;
  handleProcessChange: (id: string) => void;
  handleRemoveAllocation: (id: number) => void;
  regimens: Regimen[];
  selectedProcess?: AmendmentProcess;
  setFormData: Dispatch<SetStateAction<AmendmentPlanFormData>>;
}

export function AmendmentPlanProcessStep({
  formData,
  handleAddAllocation,
  handleProcessChange,
  handleRemoveAllocation,
  regimens,
  selectedProcess,
  setFormData,
}: AmendmentPlanProcessStepProps) {
  const treatmentRegimens = regimens.filter(
    (regimen) => regimen.type === "cai-tao-dat",
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-4">
        <Label className="text-base font-bold text-slate-800">
          Mục đích kế hoạch
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-left transition-all",
              formData.purpose === "amendment"
                ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md"
                : "border-slate-100 bg-white text-slate-500 hover:border-slate-200",
            )}
            onClick={() =>
              setFormData((current) => ({ ...current, purpose: "amendment" }))
            }
            type="button"
          >
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                formData.purpose === "amendment"
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-400",
              )}
            >
              <Wrench className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">Cải tạo đất</p>
              <p className="mt-1 text-[10px] opacity-60">
                Sử dụng quy trình cải tạo chuẩn
              </p>
            </div>
          </button>

          <button
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-left transition-all",
              formData.purpose === "treatment"
                ? "border-blue-500 bg-blue-50 text-blue-900 shadow-md"
                : "border-slate-100 bg-white text-slate-500 hover:border-slate-200",
            )}
            onClick={() =>
              setFormData((current) => ({ ...current, purpose: "treatment" }))
            }
            type="button"
          >
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                formData.purpose === "treatment"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-400",
              )}
            >
              <StickyNote className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">Xử lý/Điều trị</p>
              <p className="mt-1 text-[10px] opacity-60">
                Áp dụng phác đồ cải tạo đặc biệt
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ngày bắt đầu</Label>
          <Input
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                startDate: event.target.value,
              }))
            }
            type="date"
            value={formData.startDate}
          />
        </div>
        <div className="space-y-2">
          <Label>Ngày kết thúc</Label>
          <Input
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                endDate: event.target.value,
              }))
            }
            type="date"
            value={formData.endDate}
          />
        </div>
      </div>

      {formData.purpose === "amendment" ? (
        <div className="animation-slide-up space-y-4">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Quy trình áp dụng
          </Label>
          <Select onValueChange={handleProcessChange} value={formData.processId}>
            <SelectTrigger className="h-14 border-emerald-100 bg-emerald-50/20 focus:ring-emerald-500">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <SelectValue placeholder="Chọn quy trình cải tạo..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              {AMENDMENT_PROCESSES.map((process) => (
                <SelectItem className="py-3" key={process.id} value={process.id}>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-900">
                      {process.name}
                    </span>
                    <span className="text-[10px] font-normal text-slate-500">
                      {process.type} • {process.duration} ngày
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {formData.purpose === "amendment" && selectedProcess && (
        <div className="space-y-4">
          <div className="flex gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-white text-emerald-500 shadow-sm">
              <Info className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-900">
                Lộ trình các giai đoạn
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {selectedProcess.stages.map((stage, index) => (
                  <div key={stage} className="flex items-center gap-1.5">
                    <Badge
                      className="border-emerald-100 bg-white text-[10px] font-bold text-emerald-700"
                      variant="secondary"
                    >
                      {stage}
                    </Badge>
                    {index < selectedProcess.stages.length - 1 && (
                      <span className="text-slate-300">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="animation-fade-in space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold text-slate-700">
                Phân bổ nguồn lực theo giai đoạn
              </Label>
              <Badge className="text-[10px]" variant="outline">
                {formData.selectedStages.length} giai đoạn
              </Badge>
            </div>

            <div className="space-y-4">
              {formData.selectedStages.map((stage, index) => (
                <AmendmentPlanStageAllocation
                  index={index}
                  items={formData.allocations.filter(
                    (item) => item.stage === stage,
                  )}
                  key={stage}
                  onAdd={handleAddAllocation}
                  onRemove={handleRemoveAllocation}
                  stageName={stage}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {formData.purpose === "treatment" ? (
        <div className="animation-slide-up space-y-4">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Phác đồ xử lý
          </Label>
          <Select
            onValueChange={(value) => {
              const regimen = treatmentRegimens.find((item) => item.id === value);
              setFormData((current) => ({
                ...current,
                regimenId: value,
                selectedStages: regimen ? [regimen.name] : [],
              }));
            }}
            value={formData.regimenId}
          >
            <SelectTrigger className="h-14 border-blue-100 bg-blue-50/20 focus:ring-blue-500">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                  <FileCheck className="h-4 w-4" />
                </div>
                <SelectValue placeholder="Chọn phác đồ xử lý..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              {treatmentRegimens.map((regimen) => (
                <SelectItem key={regimen.id} value={regimen.id}>
                  <div className="flex flex-col gap-0.5 py-1">
                    <span className="font-bold text-slate-900">
                      {regimen.name}
                    </span>
                    <span className="text-[10px] font-normal text-slate-500">
                      {regimen.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {formData.regimenId && (
            <div className="flex gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-white text-blue-500 shadow-sm">
                <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-900">
                  Tính chất phác đồ
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-blue-700">
                  Phác đồ này được thiết kế để xử lý vấn đề hiện trạng. Bạn có
                  thể phân bổ chi tiết vật tư ở bước tiếp theo.
                </p>
              </div>
            </div>
          )}

          {formData.regimenId && (
            <div className="animation-fade-in space-y-4 border-t pt-4">
              <Label className="text-sm font-bold text-slate-700">
                Phân bổ nguồn lực điều trị
              </Label>
              {formData.selectedStages.map((stage, index) => (
                <AmendmentPlanStageAllocation
                  index={index}
                  items={formData.allocations.filter(
                    (item) => item.stage === stage,
                  )}
                  key={stage}
                  onAdd={handleAddAllocation}
                  onRemove={handleRemoveAllocation}
                  stageName={stage}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
