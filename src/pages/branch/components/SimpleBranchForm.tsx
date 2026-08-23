import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import AddressSearchInput from "@/components/AddressSearchInput";
import { useGeoProvinces, useGeoWards } from "@/features/master-data";
import { Building2, FileText, MapPin } from "lucide-react";
import type { Enterprise } from "@/pages/enterprise/data/constants";
import { BranchEnterpriseSelector } from "./steps/BranchEnterpriseSelector";
import type { BranchFormData } from "../types/types";

interface SimpleBranchFormProps {
  formData: BranchFormData;
  updateFormData: (updates: Partial<BranchFormData>) => void;
  enterprises: Enterprise[];
  onComplete: () => void;
  isEdit?: boolean;
  isSaving?: boolean;
}

export function SimpleBranchForm({
  formData,
  updateFormData,
  enterprises,
  onComplete,
  isEdit = false,
  isSaving = false,
}: SimpleBranchFormProps) {
  const provincesQuery = useGeoProvinces({
    params: { page: 0, size: 100, status: "active" },
  });
  const selectedProvince = provincesQuery.items.find(
    (province) =>
      province.code === formData.city ||
      province.name === formData.city ||
      province.fullName === formData.city,
  );
  const wardsQuery = useGeoWards({
    params: {
      provinceCode: selectedProvince?.code || "",
      page: 0,
      size: 100,
      status: "active",
    },
    enabled: Boolean(selectedProvince?.code),
  });
  const selectedWard = wardsQuery.items.find(
    (ward) =>
      ward.code === formData.ward ||
      ward.name === formData.ward ||
      ward.fullName === formData.ward ||
      ward.code === formData.district ||
      ward.name === formData.district ||
      ward.fullName === formData.district,
  );
  const isValid = Boolean(
    formData.enterpriseId.trim() &&
      formData.name.trim() &&
      formData.address.trim(),
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-blue-900">
        <div className="rounded-xl bg-white p-2 shadow-sm">
          <Building2 className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold">Chế độ đơn giản</h3>
          <p className="text-sm text-blue-700">
            {isEdit
              ? "Cập nhật nhanh thông tin cần thiết của chi nhánh."
              : "Nhập nhanh thông tin cần thiết để tạo chi nhánh."}
          </p>
        </div>
      </div>

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
            />
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <FileText className="h-4 w-4 text-emerald-600" />
              Thông tin chi nhánh
            </div>
            <div className="space-y-2">
              <Label required>Tên chi nhánh</Label>
              <Input value={formData.name} onChange={(event) => updateFormData({ name: event.target.value })} placeholder="VD: Chi nhánh Hà Nội" />
            </div>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <FileText className="h-4 w-4 text-emerald-600" />
              Thông tin thuế
            </div>
            <div className="space-y-2">
              <Label>Mã số thuế</Label>
              <Input value={formData.taxCode} onChange={(event) => updateFormData({ taxCode: event.target.value })} placeholder="Nhập mã số thuế" />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ thuế</Label>
              <Input value={formData.taxAddress} onChange={(event) => updateFormData({ taxAddress: event.target.value })} placeholder="Địa chỉ đăng ký thuế" />
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
                <Select value={selectedProvince?.code || ""} onValueChange={(value) => {
                  const province = provincesQuery.items.find((item) => item.code === value);
                  updateFormData({ city: province?.fullName || province?.name || value, district: "", ward: "" });
                }}>
                  <SelectTrigger><SelectValue placeholder="Chọn tỉnh / thành phố" /></SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {provincesQuery.items.map((province) => <SelectItem key={province.code} value={province.code}>{province.fullName || province.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phường / Xã</Label>
                <Select value={selectedWard?.code || ""} onValueChange={(value) => {
                  const ward = wardsQuery.items.find((item) => item.code === value);
                  const name = ward?.fullName || ward?.name || value;
                  updateFormData({ ward: name, district: name });
                }} disabled={!selectedProvince?.code}>
                  <SelectTrigger><SelectValue placeholder="Chọn phường / xã" /></SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {wardsQuery.items.map((ward) => <SelectItem key={ward.code} value={ward.code}>{ward.fullName || ward.name}</SelectItem>)}
                  </SelectContent>
                </Select>
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
