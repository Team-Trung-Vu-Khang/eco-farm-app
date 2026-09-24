import { useState } from "react";
import { RemoteMultiSelect } from "@/components/RemoteMultiSelect";
import {
  Badge,
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
  Package,
  Plus,
  Tags,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import type { BiologicalProductFormData } from "../types/types";
import { commonHashtags } from "../data/constants";
import { useQuery } from "@tanstack/react-query";
import { farmSupplyApi } from "@/features/farm-supply";
import { useMasterData } from "@/features/master-data";

import { normalizeSku } from "@/shared/lib/sku";
import { useDebounce } from "@/shared/hooks/useDebounce";

interface SimpleBiologicalProductFormProps {
  formData: BiologicalProductFormData;
  updateField: (
    field: keyof BiologicalProductFormData,
    value: BiologicalProductFormData[keyof BiologicalProductFormData],
  ) => void;
  handleComplete: () => void;
  goBack: () => void;
  completeLabel?: string;
  loading?: boolean;
}

export default function SimpleBiologicalProductForm({
  formData,
  updateField,
  handleComplete,
  goBack,
  completeLabel = "Hoàn tất & Lưu",
  loading,
}: SimpleBiologicalProductFormProps) {
  const isEdit = window.location.pathname.includes("/edit");

  const [groupSearch, setGroupSearch] = useState("");
  const [enzymeSearch, setEnzymeSearch] = useState("");
  const [carrierSearch, setCarrierSearch] = useState("");
  const [bioExtractSearch, setBioExtractSearch] = useState("");
  const [supplementSearch, setSupplementSearch] = useState("");

  const debouncedGroupSearch = useDebounce(groupSearch, 300);
  const debouncedEnzymeSearch = useDebounce(enzymeSearch, 300);
  const debouncedCarrierSearch = useDebounce(carrierSearch, 300);
  const debouncedBioExtractSearch = useDebounce(bioExtractSearch, 300);
  const debouncedSupplementSearch = useDebounce(supplementSearch, 300);

  const { items: biologicalProductGroups, loading: isGroupLoading } =
    useMasterData("biological-product-groups", {
      params: {
        keyword: debouncedGroupSearch.trim() || undefined,
        size: 100,
      },
    });
  const { items: loadedEnzymes, loading: isEnzymeLoading } = useMasterData(
    "biological-product-groups",
    {
      params: {
        classification: "enzyme",
        keyword: debouncedEnzymeSearch.trim() || undefined,
        size: 100,
      },
    },
  );
  const { items: loadedCarriers, loading: isCarrierLoading } = useMasterData(
    "biological-product-groups",
    {
      params: {
        classification: "carrier",
        keyword: debouncedCarrierSearch.trim() || undefined,
        size: 100,
      },
    },
  );
  const { items: loadedBioExtracts, loading: isBioExtractLoading } =
    useMasterData("biological-product-groups", {
      params: {
        classification: "bio_extract",
        keyword: debouncedBioExtractSearch.trim() || undefined,
        size: 100,
      },
    });
  const { items: loadedSupplements, loading: isSupplementLoading } =
    useMasterData("biological-product-groups", {
      params: {
        classification: "supplement",
        keyword: debouncedSupplementSearch.trim() || undefined,
        size: 100,
      },
    });

  const biologicalProductGroupOptions = (biologicalProductGroups || []).map(
    (g) => ({
      label: g.name,
      value: g.name,
    }),
  );

  const enzymeOptions = (loadedEnzymes || []).map((g) => ({
    label: g.name,
    value: g.name,
  }));
  const carrierOptions = (loadedCarriers || []).map((g) => ({
    label: g.name,
    value: g.name,
  }));
  const bioExtractOptions = (loadedBioExtracts || []).map((g) => ({
    label: g.name,
    value: g.name,
  }));
  const supplementOptions = (loadedSupplements || []).map((g) => ({
    label: g.name,
    value: g.name,
  }));
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

  const packagingList = (packagingTypes ?? []).map((p) => p.name);

  const unitList = (baseUnits ?? []).map((u) => u.name);

  const [configMode, setConfigMode] = useState<"SPEC" | "BASE_UNIT">("SPEC");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [packaging, setPackaging] = useState("");

  const packagingSpecsArr = formData.packagingSpecs || [];

  const addPackagingSpec = () => {
    let spec = "";
    if (configMode === "SPEC") {
      const trimmedQty = quantity.trim();
      if (!packaging || !trimmedQty || !unit) return;
      spec = `${packaging} ${trimmedQty} ${unit}`;
    } else {
      if (!unit) return;
      spec = `${unit}`;
    }
    if (!packagingSpecsArr.includes(spec)) {
      updateField("packagingSpecs", [...packagingSpecsArr, spec]);
    }
    setQuantity("");
    setUnit("");
    setPackaging("");
  };

  const removePackagingSpec = (value: string) => {
    updateField(
      "packagingSpecs",
      packagingSpecsArr.filter((v) => v !== value),
    );
  };

  const isValid = Boolean(formData.name);
  const [paramHashtag, setParamHashtag] = useState("");

  const onAddHashtag = () => {
    const tag = paramHashtag.trim();
    if (tag && !formData.hashtags.includes(tag)) {
      updateField("hashtags", [...formData.hashtags, tag]);
      setParamHashtag("");
    }
  };

  const onRemoveHashtag = (tag: string) => {
    updateField(
      "hashtags",
      formData.hashtags.filter((t) => t !== tag),
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
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
                updateField("imageUrl", "");
                updateField("imageFile", null);
              }}
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
                updateField("imageUrl", url);
                updateField("imageFile", file);
              }}
            />
          </label>
        )}
      </div>

      {/* ── Mã SKU ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-400" />
          Mã sản phẩm / SKU
        </Label>
        <Input
          value={formData.code}
          disabled={isEdit}
          clearable={!isEdit}
          onChange={(e) => updateField("code", normalizeSku(e.target.value))}
          placeholder="Để trống để tự động tạo"
        />
      </div>

      {/* ── Tên chế phẩm sinh học ── */}
      <div className="space-y-2">
        <Label required className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-400" />
          Tên chế phẩm sinh học
        </Label>
        <Input
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="VD: Chế phẩm Trichoderma, Chế phẩm EM gốc..."
        />
      </div>

      {/* ── Phân loại chế phẩm vi sinh / sinh học ── */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">Enzyme</Label>
            <RemoteMultiSelect
              options={enzymeOptions}
              value={formData.enzymes || []}
              onChange={(vals) => updateField("enzymes", vals)}
              onSearch={setEnzymeSearch}
              placeholder="Chọn enzyme..."
              searchPlaceholder="Tìm enzyme..."
              emptyText="Không có dữ liệu"
              loading={isEnzymeLoading}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              Chất mang / Dung môi
            </Label>
            <RemoteMultiSelect
              options={carrierOptions}
              value={formData.carriers || []}
              onChange={(vals) => updateField("carriers", vals)}
              onSearch={setCarrierSearch}
              placeholder="Chọn chất mang / dung môi..."
              searchPlaceholder="Tìm chất mang / dung môi..."
              emptyText="Không có dữ liệu"
              loading={isCarrierLoading}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              Chiết xuất sinh học
            </Label>
            <RemoteMultiSelect
              options={bioExtractOptions}
              value={formData.bioExtracts || []}
              onChange={(vals) => updateField("bioExtracts", vals)}
              onSearch={setBioExtractSearch}
              placeholder="Chọn chiết xuất sinh học..."
              searchPlaceholder="Tìm chiết xuất sinh học..."
              emptyText="Không có dữ liệu"
              loading={isBioExtractLoading}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              Dinh dưỡng bổ sung
            </Label>
            <RemoteMultiSelect
              options={supplementOptions}
              value={formData.supplements || []}
              onChange={(vals) => updateField("supplements", vals)}
              onSearch={setSupplementSearch}
              placeholder="Chọn dinh dưỡng bổ sung..."
              searchPlaceholder="Tìm dinh dưỡng bổ sung..."
              emptyText="Không có dữ liệu"
              loading={isSupplementLoading}
            />
          </div>
        </div>
      </div>

      {/* ── Cấu hình Quy cách đóng gói & Đơn vị vật tư ── */}
      <div className="space-y-3">
        <Label className="flex items-center gap-1.5 font-semibold">
          <Package className="w-4 h-4 text-slate-400" />
          Cấu hình Quy cách đóng gói &amp; Đơn vị vật tư
        </Label>

        {/* Mode switch */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-xl text-xs font-medium gap-1">
            <button
              type="button"
              onClick={() => setConfigMode("SPEC")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                configMode === "SPEC"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Quy cách đầy đủ (Chai 500ml, Bao 25kg...)
            </button>
            <button
              type="button"
              onClick={() => setConfigMode("BASE_UNIT")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                configMode === "BASE_UNIT"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Không rõ quy cách (Chỉ chọn đơn vị cơ bản kg, l...)
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-end">
          {configMode === "SPEC" ? (
            <>
              <div className="flex-1 space-y-1 min-w-[130px]">
                <Label className="text-xs text-muted-foreground">
                  Loại đóng gói
                </Label>
                <Select value={packaging} onValueChange={setPackaging}>
                  <SelectTrigger className="text-left h-auto py-2">
                    <SelectValue placeholder="Loại (Chai, Bao...)" />
                  </SelectTrigger>
                  <SelectContent>
                    {packagingList.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-28 space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Số lượng
                </Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="VD: 500, 25"
                  min={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPackagingSpec();
                    }
                  }}
                />
              </div>

              <div className="flex-1 space-y-1 min-w-[120px]">
                <Label className="text-xs text-muted-foreground">
                  Đơn vị cơ sở
                </Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="text-left h-auto py-2">
                    <SelectValue placeholder="Đơn vị (ml, kg...)" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitList.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">
                Đơn vị cơ sở
              </Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="text-left h-auto py-2">
                  <SelectValue placeholder="Chọn đơn vị cơ sở (kg, lít, ml, viên...)" />
                </SelectTrigger>
                <SelectContent>
                  {unitList.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            type="button"
            onClick={addPackagingSpec}
            disabled={
              configMode === "SPEC"
                ? !packaging || !quantity.trim() || !unit
                : !unit
            }
            className="mb-0 shrink-0"
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm
          </Button>
        </div>

        {packagingSpecsArr.length > 0 && (
          <div className="bg-slate-50 rounded-xl border p-3 mt-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Đã thêm ({packagingSpecsArr.length} quy cách):
            </p>
            <div className="flex flex-wrap gap-2">
              {packagingSpecsArr.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1 bg-white border border-slate-200 text-slate-700 shadow-2xs flex items-center gap-1.5"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removePackagingSpec(tag)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Hạn sử dụng ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <CalendarClock className="w-4 h-4 text-slate-400" />
          Hạn sử dụng
        </Label>
        <Input
          value={formData.shelfLife}
          onChange={(e) => updateField("shelfLife", e.target.value)}
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
                    : updateField("hashtags", [...formData.hashtags, tag])
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
            Chế độ cơ bản giúp tạo nhanh chế phẩm sinh học với thông tin tối
            thiểu. Bật <span className="font-bold">Thông tin chuyên sâu</span>{" "}
            để khai báo đầy đủ thành phần vi sinh, hướng dẫn sử dụng, an toàn
            pháp lý và nhà cung cấp.
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
          disabled={!isValid || loading}
          onClick={handleComplete}
          className="font-bold"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {completeLabel}
        </Button>
      </div>
    </div>
  );
}
