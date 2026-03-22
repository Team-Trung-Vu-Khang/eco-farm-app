import {
  FormDialog,
  Label,
  Input,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  isEdit,
  formData,
  setFormData,
  onSubmit,
}: DepartmentFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Mã phòng ban *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="VD: PB-KD"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Tên phòng ban *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: Phòng Kinh Doanh"
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
            placeholder="Mô tả chức năng của phòng ban..."
            rows={4}
          />
        </div>
      </div>
    </FormDialog>
  );
}
