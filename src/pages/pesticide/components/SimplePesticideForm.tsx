import { farmSupplyApi } from "@/features/farm-supply";
import { useMasterData } from "@/features/master-data";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  RemoteAutoCompleteSelect,
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
  Loader2,
  Package,
  Plus,
  Shield,
  Tags,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { commonHashtags } from "../data/constants";
import type { PesticideDomain, PesticideFormData } from "../types";

const DOMAIN_LABELS: Record<
  PesticideDomain,
  { item: string; groupLabel: string }
> = {
  cultivation: { item: "Thuốc BVTV", groupLabel: "Nhóm thuốc BVTV" },
  animal: { item: "Thuốc / Vaccine", groupLabel: "Nhóm thuốc chăn nuôi" },
  aquaculture: { item: "Thuốc / Hóa chất", groupLabel: "Nhóm thuốc thủy sản" },
};

// Predefined measurement units
const MEASURE_UNIT_OPTIONS = [
  "ml",
  "L",
  "g",
  "kg",
  "viên",
  "ống",
  "vỉ",
  "tấn",
  "m",
  "mm",
  "cc",
  "IU",
];

// Predefined packaging formats
const PACKAGING_OPTIONS = [
  "Chai",
  "Lọ",
  "Gói",
  "Hộp",
  "Bao",
  "Bì",
  "Can",
  "Thùng",
  "Túi",
  "Vỉ",
  "Ống",
  "Chậu",
  "Khay",
];

interface SimplePesticideFormProps {
  formData: PesticideFormData;
  domain: PesticideDomain;
  onFormFieldChange: <K extends keyof PesticideFormData>(
    field: K,
    value: PesticideFormData[K],
  ) => void;
  handleComplete: () => void;
  goBack: () => void;
  completeLabel?: string;
  loading?: boolean;
}

export default function SimplePesticideForm({
  formData,
  domain,
  onFormFieldChange,
  handleComplete,
  goBack,
  completeLabel = "Hoàn tất & Lưu",
  loading,
}: SimplePesticideFormProps) {
  const isEdit = window.location.pathname.includes("/edit");
  const labels = DOMAIN_LABELS[domain];
  const isValid = Boolean(formData.name);
  const [paramHashtag, setParamHashtag] = useState("");
  const [groupSearch, setGroupSearch] = useState("");

  const domainCode =
    domain === "cultivation"
      ? "CROP"
      : domain === "animal"
        ? "LIVESTOCK"
        : "AQUACULTURE";
  const classification = domain === "cultivation" ? "target_group" : "usage";
  const debouncedGroupSearch = useDebounce(groupSearch, 300);

  // Dynamic API Fetching
  const { data: packagingTypes } = useQuery({
    queryKey: ["packaging-types"],
    queryFn: () => farmSupplyApi.listPackagingTypes(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: baseUnits } = useQuery({
    queryKey: ["base-units"],
    queryFn: () => farmSupplyApi.listBaseUnits(),
    staleTime: 5 * 60 * 1000,
  });

  const { items: remoteGroups, loading: isLoadingGroups } = useMasterData(
    "medicine-groups",
    {
      params: {
        domainCode,
        classification,
        keyword: debouncedGroupSearch.trim() || undefined,
        status: "active",
        page: 0,
        size: 20,
      },
    },
  );

  const packagingList =
    packagingTypes && packagingTypes.length > 0
      ? packagingTypes.map((p) => p.name)
      : PACKAGING_OPTIONS;

  const unitList =
    baseUnits && baseUnits.length > 0
      ? baseUnits.map((u) => u.name)
      : MEASURE_UNIT_OPTIONS;

  const groupOptions = remoteGroups.map((group) => ({
    label: group.name,
    value: group.name,
  }));

  const onAddHashtag = () => {
    const tag = paramHashtag.trim();
    if (tag && !formData.hashtags.includes(tag)) {
      onFormFieldChange("hashtags", [...formData.hashtags, tag]);
      setParamHashtag("");
    }
  };

  const onRemoveHashtag = (tag: string) => {
    onFormFieldChange(
      "hashtags",
      formData.hashtags.filter((t) => t !== tag),
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Banner info */}
      <div className="flex items-start gap-4 p-4 bg-blue-50 text-blue-900 rounded-xl border border-blue-100">
        <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold">Thông tin cơ bản</h3>
          <p className="text-sm text-blue-700 mt-0.5">
            Nhập nhanh những thông tin cần thiết nhất. Bật{" "}
            <span className="font-bold">Thông tin chuyên sâu</span> để khai báo
            đầy đủ hoạt chất, liều lượng, pháp lý và nhà cung cấp.
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
              onClick={() => {
                onFormFieldChange("imageUrl", "");
                onFormFieldChange("imageFile", null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[160px] gap-3">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="font-medium text-slate-700 text-sm">
                Tải lên ảnh sản phẩm
              </p>
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
                onFormFieldChange("imageUrl", url);
                onFormFieldChange("imageFile", file);
              }}
            />
          </label>
        )}
      </div>

      {/* ── Phân loại + Tên ── */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-slate-400" />
            {labels.groupLabel}
          </Label>
          <RemoteAutoCompleteSelect
            options={groupOptions}
            value={formData.group}
            onChange={(value) => onFormFieldChange("group", value)}
            onSearch={setGroupSearch}
            placeholder={`Chọn nhóm ${labels.item.toLowerCase()}...`}
            searchPlaceholder="Tìm nhóm thuốc BVTV..."
            emptyText="Không tìm thấy nhóm thuốc BVTV"
            loading={isLoadingGroups}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" />
            Mã sản phẩm / Mã SKU
          </Label>
          <Input
            value={formData.code}
            disabled={isEdit}
            clearable={!isEdit}
            onChange={(e) => onFormFieldChange("code", e.target.value)}
            placeholder="Để trống để tự động tạo"
          />
        </div>

        <div className="space-y-2">
          <Label required className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" />
            Tên {labels.item}
          </Label>
          <Input
            value={formData.name}
            onChange={(e) => onFormFieldChange("name", e.target.value)}
            placeholder={`VD: Actara 25WG, Baytril 10%, Bio-Clean...`}
          />
        </div>
      </div>

      {/* ── Quy cách đóng gói ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <Package className="w-4 h-4 text-slate-400" />
          Quy cách đóng gói
        </Label>
        <div className="flex gap-3">
          <div className="w-32">
            <Select
              value={formData.packaging}
              onValueChange={(v) => onFormFieldChange("packaging", v)}
            >
              <SelectTrigger className="text-left h-auto py-2">
                <SelectValue placeholder="Quy cách" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {packagingList.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Input
              type="number"
              min={0}
              placeholder="Giá trị (VD: 500)"
              value={formData.quantity}
              onChange={(e) => onFormFieldChange("quantity", e.target.value)}
            />
          </div>
          <div className="w-28">
            <Select
              value={formData.unit}
              onValueChange={(v) => onFormFieldChange("unit", v)}
            >
              <SelectTrigger className="text-left h-auto py-2">
                <SelectValue placeholder="Đơn vị" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {unitList.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          VD: Chai 500 ml, Bao 25 kg, Vỉ 10 viên… Bổ sung thêm quy cách chi tiết
          ở chế độ chuyên sâu.
        </p>
      </div>

      {/* ── Hạn sử dụng ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <CalendarClock className="w-4 h-4 text-slate-400" />
          Hạn sử dụng
        </Label>
        <Input
          value={formData.shelfLife}
          onChange={(e) => onFormFieldChange("shelfLife", e.target.value)}
          placeholder="VD: 2 năm, 18 tháng, 12/2026..."
        />
      </div>

      {/* ── Ghi chú ── */}
      <div className="space-y-2">
        <Label>Ghi chú</Label>
        <Textarea
          value={formData.note}
          onChange={(e) => onFormFieldChange("note", e.target.value)}
          placeholder="Ghi chú nội bộ, lưu ý khi sử dụng hoặc bảo quản..."
          rows={3}
        />
      </div>

      {/* Card: Hashtags */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Tags className="w-5 h-5 text-primary" />
          Hashtags
        </h3>
        <div className="space-y-3">
          <Label>Thêm Hashtag</Label>
          <div className="flex gap-2">
            <Input
              value={paramHashtag}
              onChange={(e) => setParamHashtag(e.target.value)}
              placeholder="Nhập hashtag..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddHashtag();
                }
              }}
            />
            <Button type="button" onClick={onAddHashtag} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {commonHashtags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={`cursor-pointer transition-all ${
                  formData.hashtags.includes(tag)
                    ? "bg-primary/10 border-primary text-primary"
                    : "hover:bg-slate-100"
                }`}
                onClick={() =>
                  formData.hashtags.includes(tag)
                    ? onRemoveHashtag(tag)
                    : onFormFieldChange("hashtags", [...formData.hashtags, tag])
                }
              >
                #{tag}
              </Badge>
            ))}
            {formData.hashtags
              .filter((tag) => !commonHashtags.includes(tag))
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  #{tag}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => onRemoveHashtag(tag)}
                  />
                </Badge>
              ))}
          </div>
        </div>
      </div>

      {/* ── Info card ── */}
      <Card className="bg-amber-50/50 border-amber-100">
        <CardContent className="p-4 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Chế độ cơ bản giúp tạo nhanh {labels.item.toLowerCase()} với thông
            tin tối thiểu. Bật{" "}
            <span className="font-bold">Thông tin chuyên sâu</span> để khai báo
            đầy đủ hoạt chất, liều lượng, an toàn pháp lý và nhà cung cấp.
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
          className="font-bold"
          onClick={handleComplete}
          disabled={!isValid || loading}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {completeLabel}
        </Button>
      </div>
    </div>
  );
}
