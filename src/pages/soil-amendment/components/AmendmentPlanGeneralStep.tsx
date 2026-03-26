import type { Dispatch, SetStateAction } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ClipboardList, Users } from "lucide-react";
import type { Personnel } from "../../../stores/usePersonnelStore";
import type { AmendmentPlanFormData } from "../types";

interface AmendmentPlanGeneralStepProps {
  formData: AmendmentPlanFormData;
  personnel: Personnel[];
  seasons: { id: string; name: string }[];
  setFormData: Dispatch<SetStateAction<AmendmentPlanFormData>>;
  setPersonnelDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export function AmendmentPlanGeneralStep({
  formData,
  personnel,
  seasons,
  setFormData,
  setPersonnelDialogOpen,
}: AmendmentPlanGeneralStepProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="mb-6 flex items-center gap-4 rounded-lg border border-amber-100 bg-amber-50 p-4 text-amber-900">
        <div className="rounded-full bg-white p-2 shadow-sm">
          <ClipboardList className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold">Thiết lập kế hoạch cải tạo</h3>
          <p className="text-sm text-amber-700">
            Xác định mục tiêu, phạm vi và người phụ trách để bắt đầu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Mã kế hoạch <span className="text-red-500">*</span>
          </Label>
          <Input
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                code: event.target.value,
              }))
            }
            placeholder="VD: CT-2024-001"
            value={formData.code}
          />
        </div>
        <div className="space-y-2">
          <Label>Mức độ ưu tiên</Label>
          <Select
            onValueChange={(value) =>
              setFormData((current) => ({ ...current, priority: value }))
            }
            value={formData.priority}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Thấp</SelectItem>
              <SelectItem value="medium">Trung bình</SelectItem>
              <SelectItem value="high">Cao</SelectItem>
              <SelectItem value="urgent">Khẩn cấp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Tên kế hoạch <span className="text-red-500">*</span>
        </Label>
        <Input
          onChange={(event) =>
            setFormData((current) => ({
              ...current,
              name: event.target.value,
            }))
          }
          placeholder="VD: Cải tạo đất phèn khu vực A1"
          value={formData.name}
        />
      </div>

      <div className="space-y-2">
        <Label>
          Mùa vụ <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={(value) =>
            setFormData((current) => ({ ...current, seasonId: value }))
          }
          value={formData.seasonId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn mùa vụ..." />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((season) => (
              <SelectItem key={season.id} value={season.id}>
                {season.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">
            Phụ trách kỹ thuật
          </Label>
          <div
            className="group flex h-11 cursor-pointer items-center justify-between rounded-md border-2 border-slate-100 bg-slate-50/50 p-3 transition-all hover:border-primary/40 hover:bg-primary/5"
            onClick={() => setPersonnelDialogOpen(true)}
          >
            {formData.technician ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 shrink-0 border-2 border-white shadow-sm">
                  <AvatarImage
                    src={
                      personnel.find(
                        (item) => item.fullName === formData.technician,
                      )?.avatar
                    }
                  />
                  <AvatarFallback className="bg-primary/10 text-[8px] font-bold text-primary">
                    {formData.technician.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[120px] truncate text-sm font-bold text-slate-800">
                  {formData.technician}
                </span>
              </div>
            ) : (
              <span className="pl-1 text-sm font-medium text-slate-400">
                Chọn...
              </span>
            )}
            <Users className="h-4 w-4 text-slate-400 transition-colors group-hover:text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Kinh phí dự trù (VNĐ)</Label>
          <Input
            className="h-11"
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                budget: event.target.value,
              }))
            }
            placeholder="0"
            type="number"
            value={formData.budget}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Mô tả chi tiết</Label>
        <Textarea
          onChange={(event) =>
            setFormData((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          rows={3}
          value={formData.description}
        />
      </div>
    </div>
  );
}
