import { useState } from "react";
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
} from "lucide-react";
import type { EquipmentFormData } from "../types";
import {
  machineTypeOptions,
  maintenanceIntervals,
  technologyLevelOptions,
} from "../data/constants";

export type EquipmentDomain = "cultivation" | "animal" | "aquaculture";

// Domain-specific machine type options (name + description two-line style)
const DOMAIN_MACHINE_TYPES: Record<
  EquipmentDomain,
  { value: string; description?: string }[]
> = {
  cultivation: [
    { value: "Máy cày", description: "Làm đất, xới đất trồng trọt" },
    { value: "Máy kéo", description: "Kéo xe, phụ kiện nông nghiệp" },
    { value: "Máy gặt đập liên hợp", description: "Thu hoạch lúa, ngô..." },
    { value: "Máy bơm", description: "Bơm nước tưới tiêu" },
    { value: "Máy phun thuốc", description: "Phun thuốc BVTV, phân bón lá" },
    { value: "Drone", description: "Drone phun thuốc, gieo hạt UAV" },
    {
      value: "Hệ thống tưới",
      description: "Tưới nhỏ giọt, phun sương tự động",
    },
    { value: "Máy xay xát", description: "Xay, xát, chế biến nông sản" },
    { value: "Máy sấy", description: "Sấy thóc, ngô, nông sản" },
    { value: "Thiết bị khác", description: "Các máy móc canh tác khác" },
  ],
  animal: [
    {
      value: "Hệ thống cho ăn tự động",
      description: "Phân phối thức ăn tự động theo lịch",
    },
    { value: "Máy bơm", description: "Bơm nước uống, vệ sinh chuồng trại" },
    { value: "Quạt thông gió", description: "Điều hòa nhiệt độ chuồng nuôi" },
    {
      value: "Hệ thống chiếu sáng",
      description: "Điều chỉnh ánh sáng kích thích sinh trưởng",
    },
    { value: "Máy phun sát khuẩn", description: "Khử khuẩn, vệ sinh định kỳ" },
    {
      value: "Thiết bị giám sát",
      description: "Camera, cảm biến theo dõi đàn",
    },
    { value: "Thiết bị khác", description: "Máy móc chăn nuôi khác" },
  ],
  aquaculture: [
    { value: "Quạt tạo oxy", description: "Tăng oxy hòa tan trong ao nuôi" },
    { value: "Máy sục khí", description: "Sục khí đáy ao, xử lý khí độc" },
    {
      value: "Hệ thống lọc nước",
      description: "Lọc tuần hoàn, xử lý nước RAS",
    },
    {
      value: "Hệ thống cho ăn tự động",
      description: "Phân phối thức ăn thủy sản tự động",
    },
    { value: "Máy bơm", description: "Bơm nước, thay nước ao nuôi" },
    {
      value: "Thiết bị giám sát",
      description: "Đo pH, oxy, nhiệt độ, độ muối",
    },
    { value: "Thiết bị khác", description: "Máy móc nuôi trồng thủy sản khác" },
  ],
};

const DOMAIN_LABELS: Record<EquipmentDomain, string> = {
  cultivation: "Thiết bị canh tác",
  animal: "Thiết bị chăn nuôi",
  aquaculture: "Thiết bị thủy sản",
};

interface SimpleEquipmentFormProps {
  formData: EquipmentFormData;
  domain: EquipmentDomain;
  updateField: (field: keyof EquipmentFormData, value: any) => void;
  handleComplete: () => void;
  goBack: () => void;
  completeLabel?: string;
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
  updateField,
  handleComplete,
  goBack,
  completeLabel = "Hoàn tất & Lưu",
}: SimpleEquipmentFormProps) {
  const machineTypes = DOMAIN_MACHINE_TYPES[domain];
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
      {/* Banner info */}
      <div className="flex items-start gap-4 p-4 bg-slate-50 text-slate-900 rounded-xl border border-slate-200">
        <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
          <Wrench className="w-6 h-6 text-slate-600" />
        </div>
        <div>
          <h3 className="font-semibold">Thông tin cơ bản</h3>
          <p className="text-sm text-slate-600 mt-0.5">
            Nhập nhanh những thông tin cần thiết nhất. Bật{" "}
            <span className="font-bold">Thông tin chuyên sâu</span> để khai báo
            đầy đủ thông số kỹ thuật, xuất xứ và cung ứng.
          </p>
        </div>
      </div>

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
              onClick={() => updateField("productImage", "")}
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
              }}
            />
          </label>
        )}
      </div>

      {/* ── Phân loại ── */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-slate-400" />
          Loại {domainLabel.toLowerCase()}
        </Label>
        <Select
          value={
            Array.isArray(formData.machineType)
              ? (formData.machineType[0] ?? "")
              : (formData.machineType ?? "")
          }
          onValueChange={(v) => updateField("machineType", [v])}
        >
          <SelectTrigger className="text-left h-auto py-2">
            <SelectValue
              placeholder={`Chọn loại ${domainLabel.toLowerCase()}...`}
            />
          </SelectTrigger>
          <SelectContent>
            {machineTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{t.value}</span>
                  {t.description && (
                    <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                      {t.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
