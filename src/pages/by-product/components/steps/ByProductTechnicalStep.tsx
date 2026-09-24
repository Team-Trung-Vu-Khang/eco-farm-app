import { useState } from "react";
import { RemoteMultiSelect } from "@/components/RemoteMultiSelect";
import { useMasterData } from "@/features/master-data";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { Input, Label, Textarea } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ByProductFormData } from "../../types/types";

interface ByProductTechnicalStepProps {
  formData: ByProductFormData;
  updateField: (
    field: keyof ByProductFormData,
    value: ByProductFormData[keyof ByProductFormData],
  ) => void;
}

export function ByProductTechnicalStep({
  formData,
  updateField,
}: ByProductTechnicalStepProps) {
  const [originSearch, setOriginSearch] = useState("");
  const [physicoSearch, setPhysicoSearch] = useState("");
  const [toxicitySearch, setToxicitySearch] = useState("");

  const debouncedOriginSearch = useDebounce(originSearch, 300);
  const debouncedPhysicoSearch = useDebounce(physicoSearch, 300);
  const debouncedToxicitySearch = useDebounce(toxicitySearch, 300);

  const { items: loadedOrigins, loading: isOriginLoading } = useMasterData(
    "by-product-groups",
    {
      params: {
        classification: "origin",
        keyword: debouncedOriginSearch.trim() || undefined,
        size: 100,
      },
    },
  );

  const { items: loadedPhysicos, loading: isPhysicoLoading } = useMasterData(
    "by-product-groups",
    {
      params: {
        classification: "physico_chemical",
        keyword: debouncedPhysicoSearch.trim() || undefined,
        size: 100,
      },
    },
  );

  const { items: loadedToxicities, loading: isToxicityLoading } = useMasterData(
    "by-product-groups",
    {
      params: {
        classification: "toxicity_regulation",
        keyword: debouncedToxicitySearch.trim() || undefined,
        size: 100,
      },
    },
  );

  const originOptions = (loadedOrigins || []).map((g) => ({
    label: g.name,
    value: g.name,
  }));
  const physicoOptions = (loadedPhysicos || []).map((g) => ({
    label: g.name,
    value: g.name,
  }));
  const toxicityOptions = (loadedToxicities || []).map((g) => ({
    label: g.name,
    value: g.name,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-base text-slate-800 border-b pb-2">
          Phân loại nhóm phụ phẩm
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nguồn gốc phụ phẩm</Label>
            <RemoteMultiSelect
              options={originOptions}
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
            <Label>Đặc tính Sinh học (Lý - Hóa)</Label>
            <RemoteMultiSelect
              options={physicoOptions}
              value={formData.byProductPhysicoChemicals || []}
              onChange={(vals) =>
                updateField("byProductPhysicoChemicals", vals)
              }
              onSearch={setPhysicoSearch}
              placeholder="Chọn đặc tính lý hóa..."
              searchPlaceholder="Tìm đặc tính lý hóa..."
              emptyText="Không có dữ liệu"
              loading={isPhysicoLoading}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Mức độ độc hại & Quy chuẩn quản lý</Label>
            <RemoteMultiSelect
              options={toxicityOptions}
              value={formData.byProductToxicityRegulations || []}
              onChange={(vals) =>
                updateField("byProductToxicityRegulations", vals)
              }
              onSearch={setToxicitySearch}
              placeholder="Chọn mức độ độc hại / quy chuẩn..."
              searchPlaceholder="Tìm độc hại / quy chuẩn..."
              emptyText="Không có dữ liệu"
              loading={isToxicityLoading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-base text-slate-800">
          Thành phần & Đặc tính kỹ thuật
        </h3>

        <div className="space-y-2">
          <Label>Thành phần chi tiết (Cellulose, Lignin, N, P, K...)</Label>
          <Input
            value={formData.detailedComposition}
            onChange={(e) => updateField("detailedComposition", e.target.value)}
            placeholder="VD: Cellulose 45%; Hemicellulose 30%; Lignin 20%..."
          />
        </div>

        <div className="space-y-2">
          <Label>Mô tả chi tiết</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Nhập mô tả chi tiết sản phẩm..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
