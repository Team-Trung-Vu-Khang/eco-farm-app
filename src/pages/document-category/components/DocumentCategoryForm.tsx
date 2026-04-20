import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  type DocumentCategory,
  type EntityType,
  ENTITY_TYPE_LABELS,
} from "../data/constants";

interface DocumentCategoryFormProps {
  formData: Omit<DocumentCategory, "id" | "createdAt">;
  onChange: (data: Partial<Omit<DocumentCategory, "id" | "createdAt">>) => void;
  isEdit?: boolean;
}

const ENTITY_TYPES: EntityType[] = ["enterprise", "farm", "cooperative", "product", "region"];

export const DocumentCategoryForm: React.FC<DocumentCategoryFormProps> = ({
  formData,
  onChange,
  isEdit = false,
}) => {
  const toggleEntityType = (type: EntityType) => {
    const next = formData.entityTypes.includes(type)
      ? formData.entityTypes.filter((t) => t !== type)
      : [...formData.entityTypes, type];
    onChange({ entityTypes: next });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Basic Information */}
      <Card className="md:col-span-8 shadow-sm">
        <CardHeader className="border-b bg-slate-50/30">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Mã tài liệu <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ví dụ: GDKD, VIETGAP..."
                value={formData.code}
                onChange={(e) => onChange({ code: e.target.value })}
                disabled={isEdit}
                className={cn("h-11", isEdit && "bg-slate-50 font-mono font-bold")}
              />
              {isEdit && (
                <p className="text-[10px] text-slate-400 font-medium">Không thể thay đổi mã tài liệu sau khi tạo.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Tên tài liệu <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ví dụ: Giấy phép đăng ký kinh doanh..."
                value={formData.name}
                onChange={(e) => onChange({ name: e.target.value })}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500">
              Mô tả chi tiết
            </Label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Nhập mô tả mục đích hoặc yêu cầu của loại tài liệu này..."
              value={formData.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t">
            <Label className="text-xs font-bold uppercase text-slate-500 block mb-4">
              Áp dụng cho đối tượng <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {ENTITY_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={formData.entityTypes.includes(type)}
                    onCheckedChange={() => toggleEntityType(type)}
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {ENTITY_TYPE_LABELS[type]}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-3 italic">
              * Vui lòng chọn ít nhất một đối tượng áp dụng.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Configuration & Status */}
      <div className="md:col-span-4 space-y-6">
        <Card className="shadow-sm border-primary/10">
          <CardHeader className="border-b bg-primary/5">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">
              Cấu hình tài liệu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Bắt buộc tải lên</Label>
                  <p className="text-[10px] text-slate-500">Yêu cầu người dùng phải upload</p>
                </div>
                <Checkbox
                  checked={formData.required}
                  onCheckedChange={(val) => onChange({ required: !!val })}
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Cho phép nhiều file</Label>
                  <p className="text-[10px] text-slate-500">Có thể upload nhiều hơn 1 tệp</p>
                </div>
                <Checkbox
                  checked={formData.allowMultiple}
                  onCheckedChange={(val) => onChange({ allowMultiple: !!val })}
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Quản lý hết hạn</Label>
                  <p className="text-[10px] text-slate-500">Theo dõi thời hạn hiệu lực</p>
                </div>
                <Checkbox
                  checked={formData.hasExpiry}
                  onCheckedChange={(val) => onChange({ hasExpiry: !!val })}
                  className="h-5 w-5"
                />
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Trạng thái hoạt động
              </Label>
              <Select
                value={formData.status}
                onValueChange={(val: "active" | "inactive") =>
                  onChange({ status: val })
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Đang hoạt động</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      <span>Ngưng hoạt động</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
