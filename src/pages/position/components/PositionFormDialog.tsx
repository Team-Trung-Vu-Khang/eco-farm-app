import {
  Combobox,
  FormDialog,
  Input,
  Label,
  MultiSelect,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo } from "react";
import usePositionStore from "@/stores/usePositionStore";
import usePositionGroupStore from "@/stores/usePositionGroupStore";
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
  const allPositionGroups = usePositionGroupStore((s) => s.positionGroups);

  const positionGroups = useMemo(
    () => allPositionGroups.filter((g) => g.status === "active"),
    [allPositionGroups],
  );

  const groupOptions = useMemo(
    () => positionGroups.map((g) => ({ label: g.name, value: g.name })),
    [positionGroups],
  );

  const responsibilityOptions = useMemo(
    () => positions.map((p) => ({ label: p.name, value: p.name })),
    [positions],
  );

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
            Nhóm chức vụ/chức danh <span className="text-red-500 ml-1">*</span>
          </Label>
          <Combobox
            options={groupOptions}
            value={formData.group}
            onChange={(value) => setFormData({ ...formData, group: value })}
            placeholder="Chọn nhóm chức vụ"
            searchPlaceholder="Tìm nhóm chức vụ..."
            emptyText="Không tìm thấy nhóm chức vụ"
          />
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
