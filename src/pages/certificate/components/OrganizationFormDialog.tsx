import {
  FormDialog,
  Label,
  Input,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  CertificationOrganization,
  OrganizationFormData,
} from "../types/types";

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: CertificationOrganization | null;
  formData: OrganizationFormData;
  setFormData: (data: OrganizationFormData) => void;
  onSubmit: () => void;
}

export function OrganizationFormDialog({
  open,
  onOpenChange,
  editItem,
  formData,
  setFormData,
  onSubmit,
}: OrganizationFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa tổ chức" : "Thêm tổ chức mới"}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="orgCode">Mã tổ chức</Label>
            <Input
              id="orgCode"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="VD: ORG001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgName">Tên tổ chức</Label>
            <Input
              id="orgName"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Bộ Nông nghiệp..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Địa chỉ trụ sở..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Điện thoại</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="024 xxxx xxxx"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="contact@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orgDescription">Mô tả</Label>
          <Textarea
            id="orgDescription"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Mô tả về tổ chức..."
            rows={3}
          />
        </div>
      </div>
    </FormDialog>
  );
}
