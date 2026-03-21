import type { ContactGroup } from "@/stores/useContactStore";
import {
  FormDialog,
  Label,
  Input,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface GroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: ContactGroup | null;
  formData: Omit<ContactGroup, "id" | "createdAt" | "contactCount">;
  setFormData: (
    data: Omit<ContactGroup, "id" | "createdAt" | "contactCount">,
  ) => void;
  onSubmit: () => void;
}

export function GroupFormDialog({
  open,
  onOpenChange,
  editItem,
  formData,
  setFormData,
  onSubmit,
}: GroupFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa nhóm danh bạ" : "Thêm nhóm danh bạ mới"}
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
              placeholder="VD: KH, NCC, DT..."
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
              placeholder="VD: Khách hàng, Nhà cung cấp..."
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
            placeholder="Mô tả chi tiết về nhóm danh bạ..."
            rows={3}
          />
        </div>
      </div>
    </FormDialog>
  );
}
