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
import type {
  AmendmentMethod,
  AmendmentMethodFormData,
  CostLevel,
  DifficultyLevel,
  MethodStatus,
  MethodType,
} from "../types/amendment-method";

interface AmendmentMethodFormDialogProps {
  formData: AmendmentMethodFormData;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  open: boolean;
  selectedItem: AmendmentMethod | null;
  setFormData: React.Dispatch<React.SetStateAction<AmendmentMethodFormData>>;
}

export function AmendmentMethodFormDialog({
  formData,
  onOpenChange,
  onSubmit,
  open,
  selectedItem,
  setFormData,
}: AmendmentMethodFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={selectedItem ? "Cập nhật phương pháp" : "Thêm phương pháp mới"}
      onSubmit={onSubmit}
      size="lg"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="mb-2 border-b pb-1 text-sm font-semibold text-slate-900">
            Thông tin chung
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">
                Mã <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    code: e.target.value,
                  }))
                }
                placeholder="VD: BP01"
                className="bg-slate-50 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên phương pháp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                placeholder="VD: Bón vôi bột"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phân loại</Label>
              <Select
                value={formData.type}
                onValueChange={(value: MethodType) =>
                  setFormData((current) => ({ ...current, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="biological">Sinh học</SelectItem>
                  <SelectItem value="chemical">Hóa học</SelectItem>
                  <SelectItem value="mechanical">Cơ giới</SelectItem>
                  <SelectItem value="cultural">Canh tác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value: MethodStatus) =>
                  setFormData((current) => ({ ...current, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang áp dụng</SelectItem>
                  <SelectItem value="inactive">Ngưng áp dụng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="mb-2 border-b pb-1 text-sm font-semibold text-slate-900">
            Thông số kỹ thuật
          </h4>
          <div className="space-y-2">
            <Label htmlFor="target">Vấn đề / Đối tượng xử lý</Label>
            <Input
              id="target"
              value={formData.target}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  target: e.target.value,
                }))
              }
              placeholder="VD: Đất chua, mặn, bạc màu..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ước tính chi phí</Label>
              <Select
                value={formData.cost}
                onValueChange={(value: CostLevel) =>
                  setFormData((current) => ({ ...current, cost: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thấp">Thấp</SelectItem>
                  <SelectItem value="trung bình">Trung bình</SelectItem>
                  <SelectItem value="cao">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Độ khó kỹ thuật</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: DifficultyLevel) =>
                  setFormData((current) => ({ ...current, difficulty: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dễ">Dễ (Nông dân tự làm)</SelectItem>
                  <SelectItem value="trung bình">
                    Trung bình (Cần hướng dẫn)
                  </SelectItem>
                  <SelectItem value="khó">Khó (Cần chuyên gia)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="mb-2 border-b pb-1 text-sm font-semibold text-slate-900">
            Chi tiết thực hiện
          </h4>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả & Nguyên lý</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  description: e.target.value,
                }))
              }
              placeholder="Mô tả chi tiết nguyên lý hoạt động..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="implementation">Quy trình thực hiện</Label>
            <Textarea
              id="implementation"
              value={formData.implementation}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  implementation: e.target.value,
                }))
              }
              placeholder="Các bước triển khai cụ thể..."
              className="min-h-[100px] font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </FormDialog>
  );
}
