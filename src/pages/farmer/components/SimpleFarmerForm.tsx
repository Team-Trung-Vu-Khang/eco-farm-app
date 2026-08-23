import { useAddressOptions } from "@/features/master-data";
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
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ImagePlus, MapPin, Upload } from "lucide-react";
import { useRef } from "react";
import type { FarmerFormData } from "../types";

interface SimpleFarmerFormProps {
  formData: FarmerFormData;
  onChange: (field: keyof FarmerFormData, value: string) => void;
  onImageUpload: (file: File) => void;
  onComplete: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

export default function SimpleFarmerForm({
  formData,
  onChange,
  onImageUpload,
  onComplete,
  isEdit = false,
  isSubmitting = false,
}: SimpleFarmerFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { provinces, wards, isLoadingProvinces, isLoadingWards } =
    useAddressOptions(formData.province);
  const isValid = Boolean(
    formData.code.trim() &&
      formData.name.trim() &&
      formData.province?.trim() &&
      formData.ward?.trim() &&
      formData.address.trim() &&
      formData.phone.trim(),
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-amber-900">
        <h3 className="font-semibold">Chế độ đơn giản</h3>
        <p className="text-sm text-amber-700">
          {isEdit
            ? "Cập nhật nhanh các thông tin cần thiết của nông hộ."
            : "Nhập nhanh các thông tin cần thiết để tạo nông hộ."}
        </p>
      </div>
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white">
              {formData.image ? (
                <img src={formData.image} alt="Hình ảnh nông hộ" className="h-full w-full object-contain" />
              ) : (
                <ImagePlus className="h-7 w-7 text-slate-300" />
              )}
            </div>
            <div className="flex-1"><Label>Logo / hình ảnh</Label><p className="mt-1 text-xs text-slate-500">JPG hoặc PNG, tối đa 5MB.</p></div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) onImageUpload(file); e.target.value = ""; }} />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2"><Upload className="h-4 w-4" />Tải hình ảnh</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label required>Mã nông hộ</Label><Input value={formData.code} onChange={(e) => onChange("code", e.target.value)} placeholder="VD: NH001" /></div>
            <div className="space-y-2"><Label required>Tên nông hộ</Label><Input value={formData.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Nhập tên nông hộ" /></div>
            <div className="space-y-2"><Label>Mã số thuế</Label><Input value={formData.taxCode} onChange={(e) => onChange("taxCode", e.target.value)} placeholder="Nhập mã số thuế" /></div>
            <div className="space-y-2"><Label required>Số điện thoại</Label><Input value={formData.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="Nhập số điện thoại" /></div>
          </div>
          <div className="space-y-4 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800"><MapPin className="h-4 w-4 text-emerald-600" />Địa chỉ nông hộ</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label required>Tỉnh thành</Label><Select value={formData.province || ""} onValueChange={(value) => { onChange("province", value); onChange("ward", ""); }}><SelectTrigger><SelectValue placeholder={isLoadingProvinces ? "Đang tải..." : "Chọn tỉnh thành"} /></SelectTrigger><SelectContent className="max-h-60 overflow-y-auto">{provinces.map((item) => <SelectItem key={item.code} value={item.code}>{item.fullName || item.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label required>Phường xã</Label><Select value={formData.ward || ""} onValueChange={(value) => onChange("ward", value)} disabled={!formData.province}><SelectTrigger><SelectValue placeholder={isLoadingWards ? "Đang tải..." : "Chọn phường xã"} /></SelectTrigger><SelectContent className="max-h-60 overflow-y-auto">{wards.map((item) => <SelectItem key={item.code} value={item.code}>{item.fullName || item.name}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label required>Địa chỉ chi tiết</Label><Input value={formData.address} onChange={(e) => onChange("address", e.target.value)} placeholder="Số nhà, đường, thôn/xóm..." /></div>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-5"><Label>Ghi chú</Label><Textarea value={formData.description || ""} onChange={(e) => onChange("description", e.target.value)} rows={4} placeholder="Nhập ghi chú về nông hộ..." /></div>
          <Button type="button" onClick={onComplete} disabled={!isValid || isSubmitting} className="h-12 w-full rounded-xl text-base font-bold">{isEdit ? "Cập nhật nông hộ" : "Tạo mới nông hộ"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
