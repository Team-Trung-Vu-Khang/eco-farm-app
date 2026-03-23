import {
  FormDialog,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { FertilizerGroupFormData } from "../hooks/useFertilizerGroupPage";

interface FertilizerGroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: FertilizerGroupFormData;
  setFormData: (data: FertilizerGroupFormData) => void;
  onSubmit: () => void;
}

export const FertilizerGroupFormDialog = ({
  open,
  onOpenChange,
  isEdit,
  formData,
  setFormData,
  onSubmit,
}: FertilizerGroupFormDialogProps) => {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa nhóm phân bón" : "Thêm nhóm phân bón mới"}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Mã nhóm</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="VD: ORGANIC, NPK..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Tên nhóm</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Phân hữu cơ..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Mô tả chi tiết về nhóm phân bón..."
            rows={3}
          />
        </div>
      </div>
    </FormDialog>
  );
};
