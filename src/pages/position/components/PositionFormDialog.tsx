import {
  FormDialog,
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { POSITION_GROUPS } from "../data/constants";
import usePositionStore from "../../../stores/usePositionStore";
import type { PositionFormData } from "../types/types";

interface PositionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: PositionFormData;
  setFormData: (data: PositionFormData) => void;
  onSubmit: () => void;
}

export function PositionFormDialog({
  open,
  onOpenChange,
  isEdit,
  formData,
  setFormData,
  onSubmit,
}: PositionFormDialogProps) {
  const positions = usePositionStore((state) => state.positions);

  const responsibilityOptions = positions.map((p) => ({
    label: p.name,
    value: p.name,
  }));

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa chức vụ" : "Thêm chức vụ mới"}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">
              Mã vai trò <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="VD: POS-GD"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên vai trò <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Giám Đốc"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="group">
            Nhóm chức vụ/chức danh{" "}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={formData.group}
            onValueChange={(value) =>
              setFormData({ ...formData, group: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn nhóm chức vụ" />
            </SelectTrigger>
            <SelectContent>
              {POSITION_GROUPS.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Danh sách trách nhiệm</Label>
          <MultiSelect
            options={responsibilityOptions}
            value={formData.responsibilities ?? []}
            placeholder="Chọn các trách nhiệm..."
            emptyText="Không tìm thấy vai trò"
            searchPlaceholder="Tìm vai trò..."
            onChange={(values) =>
              setFormData({ ...formData, responsibilities: values })
            }
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
            placeholder="Mô tả trách nhiệm và quyền hạn của chức vụ..."
            rows={4}
          />
        </div>
      </div>
    </FormDialog>
  );
}
