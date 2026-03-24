import {
  FormDialog,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { PesticideToxicityFormData, PesticideWhoClass } from "../types";

interface PesticideToxicityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: PesticideToxicityFormData;
  setFormData: (data: PesticideToxicityFormData) => void;
  onSubmit: () => void;
}

export function PesticideToxicityFormDialog({
  open,
  onOpenChange,
  isEdit,
  formData,
  setFormData,
  onSubmit,
}: PesticideToxicityFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        isEdit
          ? "Chỉnh sửa phân loại độ độc tính"
          : "Thêm phân loại độ độc tính mới"
      }
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Mã phân loại</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="VD: WHO_IA, WHO_IB..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Tên phân loại</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Rất độc, Độc..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="whoClass">Nhóm WHO</Label>
            <Select
              value={formData.whoClass}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  whoClass: value as PesticideWhoClass,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhóm WHO" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ia">Ia - Rất độc</SelectItem>
                <SelectItem value="Ib">Ib - Độc</SelectItem>
                <SelectItem value="II">II - Nguy hiểm</SelectItem>
                <SelectItem value="III">III - Cẩn thận</SelectItem>
                <SelectItem value="IV">IV - Ít độc</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="colorBand">Màu băng</Label>
            <div className="flex gap-2">
              <input
                type="color"
                id="colorBand"
                value={formData.colorBand}
                onChange={(e) =>
                  setFormData({ ...formData, colorBand: e.target.value })
                }
                className="w-20 h-10 rounded border cursor-pointer"
              />
              <Input
                value={formData.colorBand}
                onChange={(e) =>
                  setFormData({ ...formData, colorBand: e.target.value })
                }
                placeholder="#EF4444"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ld50Range">Ngưỡng LD50</Label>
          <Input
            id="ld50Range"
            value={formData.ld50Range}
            onChange={(e) =>
              setFormData({ ...formData, ld50Range: e.target.value })
            }
            placeholder="VD: LD50 < 5 mg/kg (rắn) hoặc < 20 mg/kg (lỏng)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Mô tả chi tiết về mức độ độc tính..."
            rows={3}
          />
        </div>
      </div>
    </FormDialog>
  );
}
