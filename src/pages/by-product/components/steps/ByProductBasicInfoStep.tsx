import { RemoteMultiSelect } from "@/components/RemoteMultiSelect";
import { useMasterData } from "@/features/master-data";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { normalizeSku } from "@/shared/lib/sku";
import {
  Badge,
  Button,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Image as ImageIcon, Leaf, Plus, Tags, Upload, X } from "lucide-react";
import { useState } from "react";
import { commonHashtags, SUPPLY_GROUP_CATALOG } from "../../data/constants";
import type { ByProductFormData } from "../../types/types";

interface ByProductBasicInfoStepProps {
  formData: ByProductFormData;
  updateField: (field: keyof ByProductFormData, value: any) => void;
}

export const ByProductBasicInfoStep = ({
  formData,
  updateField,
}: ByProductBasicInfoStepProps) => {
  const isEdit = window.location.pathname.includes("/edit");
  const [paramHashtag, setParamHashtag] = useState("");

  const [originSearch, setOriginSearch] = useState("");
  const [physicoSearch, setPhysicoSearch] = useState("");
  const [toxicitySearch, setToxicitySearch] = useState("");

  const debouncedOriginSearch = useDebounce(originSearch, 300);
  const debouncedPhysicoSearch = useDebounce(physicoSearch, 300);
  const debouncedToxicitySearch = useDebounce(toxicitySearch, 300);

  const { items: loadedOrigins, loading: isOriginLoading } = useMasterData(
    SUPPLY_GROUP_CATALOG,
    {
      params: {
        classification: "origin",
        keyword: debouncedOriginSearch.trim() || undefined,
        size: 100,
      },
    },
  );

  const { items: loadedPhysicos, loading: isPhysicoLoading } = useMasterData(
    SUPPLY_GROUP_CATALOG,
    {
      params: {
        classification: "physico_chemical",
        keyword: debouncedPhysicoSearch.trim() || undefined,
        size: 100,
      },
    },
  );

  const { items: loadedToxicities, loading: isToxicityLoading } = useMasterData(
    SUPPLY_GROUP_CATALOG,
    {
      params: {
        classification: "toxicity_regulation",
        keyword: debouncedToxicitySearch.trim() || undefined,
        size: 100,
      },
    },
  );

  const handleAddHashtag = () => {
    const nextHashtag = paramHashtag.trim();
    if (nextHashtag && !formData.hashtags.includes(nextHashtag)) {
      updateField("hashtags", [...formData.hashtags, nextHashtag]);
      setParamHashtag("");
    }
  };

  const removeHashtag = (tag: string) => {
    updateField(
      "hashtags",
      formData.hashtags.filter((t) => t !== tag),
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-6">
        {/* Card: Identification & Classification */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Định danh & Phân loại Phụ phẩm
          </h3>

          {/* SKU & Commercial Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Mã sản phẩm / SKU
              </Label>
              <Input
                value={formData.code}
                onChange={(e) =>
                  updateField("code", normalizeSku(e.target.value))
                }
                placeholder="VD: BYP-COFFEE-01"
                disabled={isEdit}
                clearable={!isEdit}
              />
              <p className="text-xs text-muted-foreground">
                Rất quan trọng để truy xuất nguồn gốc phụ phẩm
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Tên phụ phẩm <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="VD: Vỏ cà phê ủ hoai, Bã mía đã qua xử lý"
              />
              <p className="text-xs text-muted-foreground">
                Tên thương mại hoặc tên loại phụ phẩm
              </p>
            </div>
          </div>

          {/* Registration Number & Scientific/Technical Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số đăng ký / Quyết định lưu hành</Label>
              <Input
                value={formData.registrationNumber}
                onChange={(e) =>
                  updateField("registrationNumber", e.target.value)
                }
                placeholder="VD: QĐ-LH-2026-BYP"
              />
              <p className="text-xs text-muted-foreground">
                Số quyết định hoặc giấy phép lưu hành (nếu có)
              </p>
            </div>
            <div className="space-y-2">
              <Label>Tên khoa học / Tên kỹ thuật</Label>
              <Input
                value={formData.scientificTechnicalName}
                onChange={(e) =>
                  updateField("scientificTechnicalName", e.target.value)
                }
                placeholder="VD: Saccharum officinarum (bagasse)"
              />
            </div>
          </div>

          {/* 3 Classification Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nguồn gốc</Label>
              <RemoteMultiSelect
                options={(loadedOrigins || []).map((g) => ({
                  label: g.name,
                  value: g.name,
                }))}
                value={formData.byProductOrigins || []}
                onChange={(vals) => updateField("byProductOrigins", vals)}
                onSearch={setOriginSearch}
                placeholder="Chọn nguồn gốc..."
                searchPlaceholder="Tìm nguồn gốc..."
                emptyText="Không có dữ liệu"
                loading={isOriginLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Sinh học (Lý - Hóa)</Label>
              <RemoteMultiSelect
                options={(loadedPhysicos || []).map((g) => ({
                  label: g.name,
                  value: g.name,
                }))}
                value={formData.byProductPhysicoChemicals || []}
                onChange={(vals) =>
                  updateField("byProductPhysicoChemicals", vals)
                }
                onSearch={setPhysicoSearch}
                placeholder="Chọn đặc tính..."
                searchPlaceholder="Tìm đặc tính..."
                emptyText="Không có dữ liệu"
                loading={isPhysicoLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mức độ độc hại & Quy chuẩn quản lý</Label>
            <RemoteMultiSelect
              options={(loadedToxicities || []).map((g) => ({
                label: g.name,
                value: g.name,
              }))}
              value={formData.byProductToxicityRegulations || []}
              onChange={(vals) =>
                updateField("byProductToxicityRegulations", vals)
              }
              onSearch={setToxicitySearch}
              placeholder="Chọn quy chuẩn..."
              searchPlaceholder="Tìm quy chuẩn..."
              emptyText="Không có dữ liệu"
              loading={isToxicityLoading}
            />
          </div>

          {/* Detailed Composition */}
          <div className="space-y-2">
            <Label>Thành phần chi tiết & Hàm lượng</Label>
            <Textarea
              value={formData.detailedComposition}
              onChange={(e) =>
                updateField("detailedComposition", e.target.value)
              }
              placeholder="VD: Hữu cơ: 45%, Tỷ lệ C/N: 18, Độ ẩm: 25%, Vi sinh vật phân giải cellulose: 10^6 CFU/g"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Lưu thông số kỹ thuật, tỷ lệ dinh dưỡng/hữu cơ. Cần thiết cho báo
              cáo chất lượng.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Mô tả tóm tắt phụ phẩm</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Mô tả nguồn gốc thu gom, phương pháp xử lý, đặc điểm tổng quan..."
              rows={3}
            />
          </div>
        </div>

        {/* Card: Hashtags */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Tags className="w-5 h-5 text-primary" />
            Hashtags Phân loại nhanh
          </h3>
          <div className="space-y-3">
            <Label>Thêm Hashtag</Label>
            <div className="flex gap-2">
              <Input
                value={paramHashtag}
                onChange={(e) => setParamHashtag(e.target.value)}
                placeholder="Nhập hashtag..."
                onKeyDown={(e) => e.key === "Enter" && handleAddHashtag()}
              />
              <Button
                type="button"
                onClick={handleAddHashtag}
                variant="outline"
              >
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
                      ? removeHashtag(tag)
                      : updateField("hashtags", [...formData.hashtags, tag])
                  }
                >
                  #{tag}
                </Badge>
              ))}
              {formData.hashtags
                .filter((t) => !commonHashtags.includes(t))
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    #{tag}
                    <X
                      className="w-3.5 h-3.5 cursor-pointer"
                      onClick={() => removeHashtag(tag)}
                    />
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar: Image upload */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Hình ảnh phụ phẩm
          </h3>
          {formData.imageUrl ? (
            <div className="relative group w-full max-w-[240px] mx-auto">
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
            <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[200px]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <Upload className="w-8 h-8" />
              </div>
              <p className="font-medium text-slate-900">Tải lên ảnh phụ phẩm</p>
              <p className="text-sm text-muted-foreground mt-1">
                Kéo thả hoặc click để chọn file
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG tối đa 5MB
              </p>
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
      </div>
    </div>
  );
};
