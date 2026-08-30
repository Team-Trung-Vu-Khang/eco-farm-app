import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AddressRemoteCombobox } from "@/components/AddressRemoteCombobox";
import AddressSearchInput from "@/components/AddressSearchInput";
import { Building2, FileText, MapPin } from "lucide-react";
import type { Enterprise } from "@/pages/enterprise/data/constants";
import { BranchEnterpriseSelector } from "./steps/BranchEnterpriseSelector";
import type { BranchFormData } from "../types/types";

interface SimpleBranchFormProps {
  formData: BranchFormData;
  updateFormData: (updates: Partial<BranchFormData>) => void;
  enterprises: Enterprise[];
  enterpriseSearchTerm?: string;
  onEnterpriseSearch?: (value: string) => void;
  onLoadMoreEnterprises?: () => void;
  hasMoreEnterprises?: boolean;
  enterprisesLoading?: boolean;
  onComplete: () => void;
  isEdit?: boolean;
  isSaving?: boolean;
}

export function SimpleBranchForm({
  formData,
  updateFormData,
  enterprises,
  enterpriseSearchTerm,
  onEnterpriseSearch,
  onLoadMoreEnterprises,
  hasMoreEnterprises,
  enterprisesLoading,
  onComplete,
  isEdit = false,
  isSaving = false,
}: SimpleBranchFormProps) {
  const isValid = Boolean(
    formData.enterpriseId.trim() &&
      formData.name.trim() &&
      formData.address.trim(),
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardContent className="space-y-6 p-6">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Building2 className="h-4 w-4 text-emerald-600" />
              Đơn vị sở hữu
            </div>
            <BranchEnterpriseSelector
              enterprises={enterprises}
              selectedId={formData.enterpriseId}
              onSelect={(id) => updateFormData({ enterpriseId: id })}
              searchTerm={enterpriseSearchTerm}
              onSearch={onEnterpriseSearch}
              onLoadMore={onLoadMoreEnterprises}
              hasMore={hasMoreEnterprises}
              loading={enterprisesLoading}
            />
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <FileText className="h-4 w-4 text-emerald-600" />
              Thông tin chi nhánh
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label required>Tên chi nhánh</Label>
                <Input value={formData.name} onChange={(event) => updateFormData({ name: event.target.value })} placeholder="VD: Chi nhánh Hà Nội" />
              </div>
              <div className="space-y-2">
                <Label>Mã số thuế</Label>
                <Input value={formData.taxCode} onChange={(event) => updateFormData({ taxCode: event.target.value })} placeholder="Nhập mã số thuế" />
              </div>
            </div>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Địa chỉ chi tiết
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tỉnh / Thành phố</Label>
                <AddressRemoteCombobox
                  type="province"
                  value={formData.city}
                  onChange={(value) =>
                    updateFormData({ city: value, district: "", ward: "" })
                  }
                  placeholder="Chọn Tỉnh / Thành Phố"
                  searchPlaceholder="Tìm tỉnh thành..."
                />
              </div>
              <div className="space-y-2">
                <Label>Phường / Xã</Label>
                <AddressRemoteCombobox
                  type="ward"
                  value={formData.ward}
                  onChange={(value) =>
                    updateFormData({ ward: value, district: value })
                  }
                  provinceCode={formData.city}
                  placeholder={
                    formData.city
                      ? "Chọn Phường / Xã"
                      : "Chọn Tỉnh / Thành Phố trước"
                  }
                  searchPlaceholder="Tìm phường xã..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label required>Địa chỉ chi tiết</Label>
              <AddressSearchInput
                value={formData.address}
                onChange={(value) => updateFormData({ address: value })}
                onSelectLocation={({ address, latitude, longitude }) => updateFormData({ address, latitude, longitude })}
                latitude={formData.latitude}
                longitude={formData.longitude}
                placeholder="Số nhà, đường, thôn/xóm..."
              />
            </div>
          </section>

          <Button type="button" onClick={onComplete} disabled={!isValid || isSaving} className="h-12 w-full rounded-xl text-base font-bold">
            {isEdit ? "Cập nhật chi nhánh" : "Tạo mới chi nhánh"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
