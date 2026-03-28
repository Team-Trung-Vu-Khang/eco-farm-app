import {
  FormDialog,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { TerrainFormData } from "../types/types";

interface TerrainFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: TerrainFormData;
  setFormData: (value: TerrainFormData) => void;
  onSubmit: () => void;
}

export function TerrainFormDialog({
  open,
  onOpenChange,
  isEdit,
  formData,
  setFormData,
  onSubmit,
}: TerrainFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa địa hình" : "Thêm địa hình mới"}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Mã địa hình</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(event) =>
              setFormData({ ...formData, code: event.target.value })
            }
            placeholder="VD: DH001"
            data-testid="input-code"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Tên địa hình</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(event) =>
              setFormData({ ...formData, name: event.target.value })
            }
            placeholder="VD: Đồng bằng"
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
            placeholder="Mô tả chi tiết về loại địa hình"
            rows={3}
            data-testid="input-description"
          />
        </div>
      </div>
    </FormDialog>
  );
}
