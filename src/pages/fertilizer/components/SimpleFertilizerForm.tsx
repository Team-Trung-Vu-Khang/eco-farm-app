import { useMasterData } from "@/features/master-data";
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
import {
  ArrowLeft,
  CalendarClock,
  FileText,
  Image as ImageIcon,
  Info,
  Leaf,
  Package,
  Upload,
} from "lucide-react";
import type { FertilizerFormData } from "../types/types";
import { originOptions, packagingUnitOptions } from "../data/constants";

const UNIT_OPTIONS = ["Bao", "Gói", "Thùng", "Chai", "Can", "Tấn", "Kg"];

interface SimpleFertilizerFormProps {
  formData: FertilizerFormData;
  updateField: (field: keyof FertilizerFormData, value: any) => void;
  handleComplete: () => void;
  goBack: () => void;
  completeLabel?: string;
}

export default function SimpleFertilizerForm({
  formData,
  updateField,
  handleComplete,
  goBack,
  completeLabel = "Hoàn tất & Lưu",
}: SimpleFertilizerFormProps) {
  // Fetch fertilizer groups from master data (same as advanced form)
  const { items: fertilizerGroups } = useMasterData("fertilizer-groups");

  const isValid = Boolean(formData.name);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Banner info */}
      <div className="flex items-start gap-4 p-4 bg-green-50 text-green-900 rounded-xl border border-green-100">
        <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
          <Leaf className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold">Thông tin cơ bản</h3>
          <p className="text-sm text-green-700 mt-0.5">
            Nhập nhanh những thông tin cần thiết nhất. Bật{" "}
            <span className="font-bold">Thông tin chuyên sâu</span> để khai báo đầy đủ thành phần,
            hướng dẫn sử dụng, an toàn pháp lý và nhà cung cấp.
          </p>
        </div>
      </div>

      {/* ── Hình ảnh ── */}
      <div className="space-y-3">
        <Label className="flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-slate-400" />
          Hình ảnh sản phẩm
        </Label>
        {formData.imageUrl ? (
          <div className="relative group w-full max-w-[200px]">
            <img
              src={formData.imageUrl}
              alt="product"
              className="w-full rounded-xl border object-cover aspect-square"
            />
            <button
              type="button"
              onClick={() => updateField("imageUrl", "")}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[160px] gap-3">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="font-medium text-slate-700 text-sm">Tải lên ảnh sản phẩm</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kéo thả hoặc click để chọn — PNG, JPG tối đa 5MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                updateField("imageUrl", url);
              }}
            />
          </label>
        )}
      </div>

      {/* ── Nhóm phân bón ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <Package className="w-4 h-4 text-slate-400" />
          Nhóm phân bón
        </Label>
        <Select
          value={formData.fertilizerOriginGroup}
          onValueChange={(val) => {
            updateField("fertilizerOriginGroup", val);
            // Sync legacy originId field if there's a match
            const matchedOption = originOptions.find((o) => o.label === val);
            if (matchedOption) {
              updateField("originId", matchedOption.id);
            }
          }}
        >
          <SelectTrigger className="text-left h-auto py-2">
            <SelectValue placeholder="Chọn nhóm phân bón từ danh mục..." />
          </SelectTrigger>
          <SelectContent>
            {fertilizerGroups.map((g) => (
              <SelectItem key={g.id} value={g.name}>
                <div className="flex flex-col">
                  <span className="font-medium">{g.name}</span>
                  {g.description && (
                    <span className="text-xs text-muted-foreground truncate max-w-[400px]">
                      {g.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Tên phân bón ── */}
      <div className="space-y-2">
        <Label required className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-400" />
          Tên phân bón
        </Label>
        <Input
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="VD: NPK 20-20-15 Đầu Trâu, Phân hữu cơ vi sinh Sông Gianh..."
        />
      </div>

      {/* ── Quy cách đóng gói ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <Package className="w-4 h-4 text-slate-400" />
          Quy cách đóng gói
        </Label>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="number"
              min={0}
              placeholder="Số lượng (VD: 50)"
              value={formData.nutrientContent}
              onChange={(e) => updateField("nutrientContent", e.target.value)}
            />
          </div>
          <div className="w-36">
            <Select
              value={formData.physicalForm}
              onValueChange={(v) => updateField("physicalForm", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Đơn vị" />
              </SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          VD: 50 Bao, 25 Kg, 10 Can… Bổ sung thêm quy cách chi tiết ở chế độ chuyên sâu.
        </p>
      </div>

      {/* ── Hạn sử dụng ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <CalendarClock className="w-4 h-4 text-slate-400" />
          Hạn sử dụng
        </Label>
        <Input
          value={formData.applicationStage}
          onChange={(e) => updateField("applicationStage", e.target.value)}
          placeholder="VD: 2 năm, 18 tháng, 12/2026..."
        />
      </div>

      {/* ── Ghi chú ── */}
      <div className="space-y-2">
        <Label>Ghi chú</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Ghi chú nội bộ, lưu ý khi sử dụng hoặc bảo quản..."
          rows={3}
        />
      </div>

      {/* ── Info card ── */}
      <Card className="bg-amber-50/50 border-amber-100">
        <CardContent className="p-4 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Chế độ cơ bản giúp tạo nhanh phân bón với thông tin tối thiểu. Bật{" "}
            <span className="font-bold">Thông tin chuyên sâu</span> để khai báo đầy đủ thành phần
            dinh dưỡng, hướng dẫn sử dụng, an toàn pháp lý và nhà cung cấp.
          </p>
        </CardContent>
      </Card>

      {/* ── Sticky footer ── */}
      <div className="sticky bottom-0 left-0 right-0 flex items-center justify-between gap-3 bg-white/95 backdrop-blur border-t border-slate-100 pt-4 pb-2 -mx-4 px-4">
        <Button type="button" variant="outline" onClick={goBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <Button
          type="button"
          disabled={!isValid}
          onClick={handleComplete}
          className="font-bold"
        >
          {completeLabel}
        </Button>
      </div>
    </div>
  );
}
