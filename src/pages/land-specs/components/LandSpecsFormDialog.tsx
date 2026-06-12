import {
  FormDialog,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { LandSpecsFormData } from "../types/types";

interface LandSpecsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: LandSpecsFormData;
  setFormData: (value: LandSpecsFormData) => void;
  onSubmit: () => void;
}

export function LandSpecsFormDialog({
  open,
  onOpenChange,
  isEdit,
  formData,
  setFormData,
  onSubmit,
}: LandSpecsFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa thông số địa hình" : "Thêm thông số địa hình mới"}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Mã thông số</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(event) =>
              setFormData({ ...formData, code: event.target.value })
            }
            placeholder="VD: aspect"
            data-testid="input-code"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Tên thông số</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(event) =>
              setFormData({ ...formData, name: event.target.value })
            }
            placeholder="VD: Hướng dốc"
            data-testid="input-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(event) =>
              setFormData({ ...formData, description: event.target.value })
            }
            placeholder="Mô tả chi tiết về thông số địa hình"
            rows={3}
            data-testid="input-description"
          />
        </div>
      </div>
    </FormDialog>
  );
}
