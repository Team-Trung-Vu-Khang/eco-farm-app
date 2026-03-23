import {
  FormDialog,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { GroupCropFormData } from "../hooks/useGroupCropPage";

interface GroupCropFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: GroupCropFormData;
  setFormData: (data: GroupCropFormData) => void;
  onSubmit: () => void;
}

export const GroupCropFormDialog = ({
  open,
  onOpenChange,
  isEdit,
  formData,
  setFormData,
  onSubmit,
}: GroupCropFormDialogProps) => {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        isEdit ? "Chỉnh sửa nhóm cây trồng" : "Thêm mới nhóm cây trồng"
      }
      size="xl"
      onSubmit={onSubmit}
    >
      <div className="space-y-6 pt-2 pb-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="code" className="font-semibold">
              Mã nhóm cây *
            </Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="VD: CC001"
              className="focus-visible:ring-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="biological" className="font-semibold">
              Đặc tính sinh học
            </Label>
            <Input
              id="biological"
              value={formData.biological}
              onChange={(e) =>
                setFormData({ ...formData, biological: e.target.value })
              }
              placeholder="VD: Cây lâu năm"
              className="focus-visible:ring-green-500"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name" className="font-semibold">
            Tên nhóm cây *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="VD: Cây có múi"
            className="focus-visible:ring-green-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="font-semibold">
            Ghi chú
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Nhập ghi chú chi tiết về nhóm cây..."
            rows={4}
            className="resize-none focus-visible:ring-green-500"
          />
        </div>
      </div>
    </FormDialog>
  );
};
