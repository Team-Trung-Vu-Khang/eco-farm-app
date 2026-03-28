import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText } from "lucide-react";
import type { BranchEnterpriseOption, BranchFormData } from "../../types/types";

interface BasicInfoStepProps {
  formData: BranchFormData;
  updateFormData: (updates: Partial<BranchFormData>) => void;
  enterprises: BranchEnterpriseOption[];
  isEdit: boolean;
}

export function BasicInfoStep({
  formData,
  updateFormData,
  enterprises,
  isEdit,
}: BasicInfoStepProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">
            Mã chi nhánh <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => updateFormData({ code: e.target.value })}
            placeholder="VD: CN001"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">
            Tên chi nhánh <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="VD: Chi nhánh Miền Nam"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="enterprise">
            Đơn vị sở hữu <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.enterpriseId}
            onValueChange={(value) => {
              const enterprise = enterprises.find((e) => e.id === value);
              updateFormData({
                enterpriseId: value,
                enterpriseName: enterprise?.name || "",
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Đơn vị sở hữu" />
            </SelectTrigger>
            <SelectContent>
              {enterprises.map((enterprise) => (
                <SelectItem key={enterprise.id} value={enterprise.id}>
                  {enterprise.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isEdit && (
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") =>
                updateFormData({ status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Thông tin thuế</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="taxCode">Mã số thuế chi nhánh</Label>
            <Input
              id="taxCode"
              value={formData.taxCode}
              onChange={(e) => updateFormData({ taxCode: e.target.value })}
              placeholder="VD: 0123456789-001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxAddress">Địa chỉ thuế</Label>
            <Input
              id="taxAddress"
              value={formData.taxAddress}
              onChange={(e) => updateFormData({ taxAddress: e.target.value })}
              placeholder="Địa chỉ đăng ký thuế"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
