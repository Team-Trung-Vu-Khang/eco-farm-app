import { useState } from "react";
import { RemoteMultiSelect } from "@/components/RemoteMultiSelect";
import { useDebounce } from "@/shared/hooks/useDebounce";
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
  Image as ImageIcon,
  Info,
  Plus,
  Settings,
  Tag,
  Tags,
  Upload,
  Wrench,
  X,
  Loader2,
  Cpu,
} from "lucide-react";
import { useMasterData } from "@/features/master-data";
import { useQuery } from "@tanstack/react-query";
import { farmSupplyApi } from "@/features/farm-supply";
import type { EquipmentFormData } from "../types";
import { maintenanceIntervals } from "../data/constants";

export type EquipmentDomain = "cultivation" | "animal" | "aquaculture";

const DOMAIN_LABELS: Record<EquipmentDomain, string> = {
  cultivation: "Thiết bị canh tác",
  animal: "Thiết bị chăn nuôi",
  aquaculture: "Thiết bị thủy sản",
};

import { normalizeSku } from "@/shared/lib/sku";

interface SimpleEquipmentFormProps {
  formData: EquipmentFormData;
  isEdit: boolean;
  domain: EquipmentDomain;
  updateField: (field: keyof EquipmentFormData, value: any) => void;
  handleComplete: () => void;
  goBack: () => void;
  completeLabel?: string;
  loading?: boolean;
}

const commonHashtags = [
  "CoGioiHoa",
  "TietKiemNangLuong",
  "CongNgheMoi",
  "BenBi",
  "HieuSuatCao",
  "AnToanVanHanh",
];

export default function SimpleEquipmentForm({
  formData,
  domain,
  isEdit,
  updateField,
  handleComplete,
  goBack,
  completeLabel = "Hoàn tất & Lưu",
  loading,
}: SimpleEquipmentFormProps) {
  const [machineTypeSearch, setMachineTypeSearch] = useState("");
  const [techSearch, setTechSearch] = useState("");
  const [assetSearch, setAssetSearch] = useState("");
  const [chainSearch, setChainSearch] = useState("");

  const debouncedMachineTypeSearch = useDebounce(machineTypeSearch, 300);

  const { items: equipmentToolGroups, loading: isEquipmentLoading } =
    useMasterData("equipment-tool-groups", {
      params: {
        keyword: debouncedMachineTypeSearch.trim() || undefined,
        size: 100,
      },
    });

  const { data: apiGroups, isLoading: isGroupsLoading } = useQuery({
    queryKey: ["equipment-groups", domain],
    queryFn: () => farmSupplyApi.getClassificationGroups("equipment"),
    staleTime: 5 * 60 * 1000,
  });

  const equipmentToolGroupOptions = (equipmentToolGroups || []).map((g) => ({
    label: g.name,
    value: g.name,
  }));

  const technologyLevelOptions = (
    apiGroups?.filter((item) => item.classification === "technology_level") ??
    []
  )
    .filter((item) =>
      techSearch.trim()
        ? item.name.toLowerCase().includes(techSearch.toLowerCase())
        : true,
    )
    .map((item) => ({ label: item.name, value: item.code }));

  const financialManagementOptions = (
    apiGroups?.filter((item) => item.classification === "financial_aspect") ??
    []
  )
    .filter((item) =>
      assetSearch.trim()
        ? item.name.toLowerCase().includes(assetSearch.toLowerCase())
        : true,
    )
    .map((item) => ({ label: item.name, value: item.code }));

  const valueChainOptions = (
    apiGroups?.filter((item) => item.classification === "value_chain") ?? []
  )
    .filter((item) =>
      chainSearch.trim()
        ? item.name.toLowerCase().includes(chainSearch.toLowerCase())
        : true,
    )
    .map((item) => ({ label: item.name, value: item.code }));

  const domainLabel = DOMAIN_LABELS[domain];
  const isValid = Boolean(formData.machineName || formData.name);
  const [paramHashtag, setParamHashtag] = useState("");

  const onAddHashtag = () => {
    const tag = paramHashtag.trim();
    const current = formData.hashtags || [];
    if (tag && !current.includes(tag)) {
      updateField("hashtags", [...current, tag]);
      setParamHashtag("");
    }
  };

  const onRemoveHashtag = (tag: string) => {
    const current = formData.hashtags || [];
    updateField(
      "hashtags",
      current.filter((t) => t !== tag),
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* ── Hình ảnh ── */}
      <div className="space-y-3">
        <Label className="flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-slate-400" />
          Hình ảnh thiết bị
        </Label>
        {formData.productImage ? (
          <div className="relative group w-full max-w-[200px]">
            <img
              src={formData.productImage}
              alt="equipment"
              className="w-full rounded-xl border object-cover aspect-square"
            />
            <button
              type="button"
              onClick={() => {
                updateField("productImage", "");
                updateField("imageFile", null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[160px] gap-3">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="font-medium text-slate-700 text-sm">
                Tải lên ảnh thiết bị
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
                updateField("productImage", url);
                updateField("imageFile", file);
              }}
            />
          </label>
        )}
      </div>

      {/* ── Mã SKU ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <Wrench className="w-4 h-4 text-slate-400" />
          Mã sản phẩm / Mã SKU {isEdit ? "" : " (Không bắt buộc)"}
        </Label>
        <Input
          disabled={isEdit}
          clearable={!isEdit}
          value={formData.sku || ""}
          onChange={(e) => {
            const val = normalizeSku(e.target.value);
            updateField("sku", val);
            updateField("code", val);
          }}
          placeholder="VD: SKU-KUBOTA-L5018"
        />
        <p className="text-xs text-muted-foreground">
          Nếu để trống, hệ thống sẽ tự động tạo mã SKU ngẫu nhiên khi lưu.
        </p>
      </div>

      {/* ── Tên máy móc ── */}
      <div className="space-y-2">
        <Label required className="flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-slate-400" />
          Tên máy móc / thiết bị
        </Label>
        <Input
          value={formData.machineName || formData.name || ""}
          onChange={(e) => {
            updateField("machineName", e.target.value);
            updateField("name", e.target.value);
          }}
          placeholder="VD: Máy cày Kubota L5018, Drone DJI Agras T40..."
        />
      </div>

      {/* ── Phân loại ── */}
      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Tag className="h-5 w-5 text-primary" />
          Phân loại thiết bị
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Mức độ Công nghệ</Label>
            <RemoteMultiSelect
              options={technologyLevelOptions}
              value={
                formData.technologyLevelGroups &&
                formData.technologyLevelGroups.length > 0
                  ? formData.technologyLevelGroups
                  : formData.technologyLevelGroup
                    ? [formData.technologyLevelGroup]
                    : []
              }
              onChange={(vals) => {
                updateField("technologyLevelGroups", vals);
                updateField("technologyLevelGroup", vals[0] || "");
                updateField("technologyLevelId", vals[0] || "");
              }}
              onSearch={setTechSearch}
              placeholder="Chọn mức độ công nghệ (chọn nhiều)..."
              searchPlaceholder="Tìm mức độ công nghệ..."
              emptyText="Không tìm thấy mức độ công nghệ"
              loading={isGroupsLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Khía cạnh Tài chính</Label>
            <RemoteMultiSelect
              options={financialManagementOptions}
              value={
                formData.assetManagementGroups &&
                formData.assetManagementGroups.length > 0
                  ? formData.assetManagementGroups
                  : formData.assetManagementGroup
                    ? [formData.assetManagementGroup]
                    : []
              }
              onChange={(vals) => {
                updateField("assetManagementGroups", vals);
                updateField("assetManagementGroup", vals[0] || "");
                updateField("financialManagementId", vals[0] || "");
              }}
              onSearch={setAssetSearch}
              placeholder="Chọn khía cạnh tài chính (chọn nhiều)..."
              searchPlaceholder="Tìm khía cạnh tài chính..."
              emptyText="Không tìm thấy khía cạnh tài chính"
              loading={isGroupsLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Chuỗi giá trị</Label>
            <RemoteMultiSelect
              options={valueChainOptions}
              value={formData.valueChainGroup || []}
              onChange={(vals) => {
                updateField("valueChainGroup", vals);
                updateField("valueChainId", vals[0] || "");
              }}
              onSearch={setChainSearch}
              placeholder="Chọn chuỗi giá trị (chọn nhiều)..."
              searchPlaceholder="Tìm chuỗi giá trị..."
              emptyText="Không tìm thấy chuỗi giá trị"
              loading={isGroupsLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Loại {domainLabel.toLowerCase()}</Label>
            <RemoteMultiSelect
              options={equipmentToolGroupOptions}
              value={
                Array.isArray(formData.machineType)
                  ? formData.machineType
                  : formData.machineType
                    ? [formData.machineType]
                    : []
              }
              onChange={(vals) => updateField("machineType", vals)}
              onSearch={setMachineTypeSearch}
              placeholder={`Chọn loại ${domainLabel.toLowerCase()} (chọn nhiều)...`}
              searchPlaceholder="Tìm loại thiết bị..."
              emptyText="Không tìm thấy loại thiết bị"
              loading={isEquipmentLoading}
            />
          </div>
        </div>
      </div>

      {/* ── Ghi chú ── */}
      <div className="space-y-2">
        <Label>Ghi chú</Label>
        <Textarea
          value={formData.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Ghi chú về tình trạng, đặc điểm hoặc lưu ý sử dụng thiết bị..."
          rows={3}
        />
      </div>

      {/* ── Vận hành & Bảo dưỡng ── */}
      <div className="space-y-3">
        <Label className="flex items-center gap-1.5">
          <Wrench className="w-4 h-4 text-slate-400" />
          Vận hành &amp; Bảo dưỡng
        </Label>
        <div className="space-y-3">
          <Select
            value={
              formData.maintenanceSchedule ||
              formData.maintainanceInterval ||
              ""
            }
            onValueChange={(v) => {
              updateField("maintenanceSchedule", v);
              updateField("maintainanceInterval", v);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Lịch bảo dưỡng định kỳ..." />
            </SelectTrigger>
            <SelectContent>
              {maintenanceIntervals.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            value={formData.mainAccessories || ""}
            onChange={(e) => updateField("mainAccessories", e.target.value)}
            placeholder="Ghi chú vận hành: nhiên liệu, phụ tùng kèm theo, lưu ý bảo dưỡng..."
            rows={3}
          />
        </div>
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
            {commonHashtags.map((tag) => {
              const current = formData.hashtags || [];
              const isSelected = current.includes(tag);
              return (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : "hover:bg-slate-100"
                  }`}
                  onClick={() =>
                    isSelected
                      ? onRemoveHashtag(tag)
                      : updateField("hashtags", [...current, tag])
                  }
                >
                  #{tag}
                </Badge>
              );
            })}
            {(formData.hashtags || [])
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
            Chế độ cơ bản giúp tạo nhanh {domainLabel.toLowerCase()} với thông
            tin tối thiểu. Bật{" "}
            <span className="font-bold">Thông tin chuyên sâu</span> để khai báo
            đầy đủ thông số kỹ thuật, xuất xứ và nhà cung cấp.
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
