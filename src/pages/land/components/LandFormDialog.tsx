import type { ChangeEvent } from "react";
import {
  FormDialog,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Land } from "../../../stores/useLandStore";
import {
  INVALID_IMAGE_PLACEHOLDER,
  type LandFormData,
} from "../data/land.constants";

interface LandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: Land | null;
  formData: LandFormData;
  onFormDataChange: (data: Partial<LandFormData>) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export default function LandFormDialog({
  open,
  onOpenChange,
  editItem,
  formData,
  onFormDataChange,
  onImageUpload,
  onSubmit,
}: LandFormDialogProps) {
  return (
    <FormDialog
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa loại đất" : "Thêm loại đất mới"}
      onSubmit={onSubmit}
    >
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Mã loại đất</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => onFormDataChange({ code: e.target.value })}
            placeholder="VD: DAT001"
            data-testid="input-code"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Tên loại đất</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFormDataChange({ name: e.target.value })}
            placeholder="VD: Đất phù sa"
            data-testid="input-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Hình ảnh</Label>
          <div className="flex flex-col gap-4">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              data-testid="input-image"
            />
            <div className="text-sm text-gray-500">Hoặc nhập URL hình ảnh:</div>
            <Input
              value={formData.image}
              onChange={(e) => onFormDataChange({ image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          {formData.image && (
            <div className="relative mt-2 h-40 w-full">
              <img
                src={formData.image}
                alt="Preview"
                className="h-full w-full rounded-md border object-cover"
                onError={(e) => {
                  e.currentTarget.src = INVALID_IMAGE_PLACEHOLDER;
                }}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onFormDataChange({ description: e.target.value })}
            placeholder="Mô tả chi tiết về loại đất"
            rows={3}
            data-testid="input-description"
          />
        </div>
      </div>
    </FormDialog>
  );
}
