import {
  FormDialog,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { PesticideCategoryFormData } from "../types";

interface PesticideCategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  title: string;
  codeLabel: string;
  nameLabel: string;
  codePlaceholder: string;
  namePlaceholder: string;
  descriptionPlaceholder: string;
  formData: PesticideCategoryFormData;
  setFormData: (data: PesticideCategoryFormData) => void;
  onSubmit: () => void;
}

export function PesticideCategoryFormDialog({
  open,
  onOpenChange,
  isEdit,
  title,
  codeLabel,
  nameLabel,
  codePlaceholder,
  namePlaceholder,
  descriptionPlaceholder,
  formData,
  setFormData,
  onSubmit,
}: PesticideCategoryFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? `Chỉnh sửa ${title}` : `Thêm ${title} mới`}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">{codeLabel}</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder={codePlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">{nameLabel}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={namePlaceholder}
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
            placeholder={descriptionPlaceholder}
            rows={3}
          />
        </div>
      </div>
    </FormDialog>
  );
}
