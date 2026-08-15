import {
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlarmClock, Beaker, Leaf } from "lucide-react";
import {
  applicationMethods,
  targetEntitiesAnimal,
  targetEntitiesAquaculture,
  targetEntitiesCultivation,
} from "../data/constants";
import type { PesticideDomain, PesticideFormData } from "../types";
import { useQuery } from "@tanstack/react-query";
import { farmSupplyApi } from "@/features/farm-supply";

interface PesticideUsageInfoStepProps {
  formData: PesticideFormData;
  domain?: PesticideDomain;
  onFormFieldChange: <K extends keyof PesticideFormData>(
    field: K,
    value: PesticideFormData[K],
  ) => void;
}

function getTargetOptionsByDomain(domain?: PesticideDomain) {
  let list: string[];
  switch (domain) {
    case "animal":
      list = targetEntitiesAnimal;
      break;
    case "aquaculture":
      list = targetEntitiesAquaculture;
      break;
    default:
      list = targetEntitiesCultivation;
  }
  return list.map((item) => ({ label: item, value: item }));
}

export default function PesticideUsageInfoStep({
  formData,
  domain,
  onFormFieldChange,
}: PesticideUsageInfoStepProps) {
  const domainCode =
    domain === "animal"
      ? "LIVESTOCK"
      : domain === "aquaculture"
        ? "AQUACULTURE"
        : "CROP";

  const isAquaculture = domainCode === "AQUACULTURE";

  const { data: apiSubjects } = useQuery({
    queryKey: ["target-subjects", domainCode],
    queryFn: () => farmSupplyApi.getTargetSubjects(domainCode),
    staleTime: 5 * 60 * 1000,
  });

  const targetOptions =
    apiSubjects && apiSubjects.length > 0
      ? apiSubjects.map((s: any) => ({ label: s.name, value: s.name }))
      : getTargetOptionsByDomain(domain);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      {/* Card: Công dụng & Đối tượng */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          Công dụng & Đối tượng sử dụng
        </h3>

        <div className="space-y-2">
          <Label>Công dụng chính / Chỉ định</Label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.indications}
            onChange={(e) => onFormFieldChange("indications", e.target.value)}
            placeholder="Phòng/trị bệnh gì, trừ đối tượng nào..."
            rows={3}
          />
        </div>

        {isAquaculture ? (
          <> </>
        ) : (
          <div className="space-y-2">
            <Label>Đối tượng sử dụng (áp dụng)</Label>
            <p className="text-xs text-muted-foreground -mt-1">
              Chọn cây trồng / vật nuôi / loài thủy sản cụ thể. Có thể chọn
              nhiều.
            </p>
            <MultiSelect
              options={targetOptions}
              value={formData.targetEntities}
              onChange={(value) => onFormFieldChange("targetEntities", value)}
              placeholder="Chọn đối tượng áp dụng..."
            />
          </div>
        )}
      </div>

      {/* Card: Hướng dẫn sử dụng */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Beaker className="w-5 h-5 text-primary" />
          Hướng dẫn sử dụng
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Liều lượng khuyến cáo</Label>
            <Input
              value={formData.recommendedDosage}
              onChange={(e) =>
                onFormFieldChange("recommendedDosage", e.target.value)
              }
              placeholder="VD: 10-15g/bình 16L, 1ml/kg thể trọng"
            />
            <p className="text-xs text-muted-foreground">
              Theo giai đoạn, mật độ, trọng lượng...
            </p>
          </div>

          <div className="space-y-2">
            <Label>Cách dùng</Label>
            <Select
              value={formData.applicationMethod}
              onValueChange={(val) =>
                onFormFieldChange("applicationMethod", val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn cách dùng..." />
              </SelectTrigger>
              <SelectContent>
                {applicationMethods.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Lưu ý khi sử dụng</Label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.usageNotes}
            onChange={(e) => onFormFieldChange("usageNotes", e.target.value)}
            placeholder="Tương kỵ, điều kiện thời tiết, an toàn sinh học..."
            rows={3}
          />
        </div>
      </div>

      {/* Card: Thời gian & Hạn dùng */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <AlarmClock className="w-5 h-5 text-primary" />
          Thời gian & Hạn sử dụng
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Thời gian cách ly (PHI)</Label>
            <div className="relative">
              <Input
                type="number"
                value={formData.phi}
                onChange={(e) => onFormFieldChange("phi", e.target.value)}
                placeholder="Số ngày"
                min={0}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                ngày
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Trước khi thu hoạch / giết mổ / xuất bán
            </p>
          </div>

          <div className="space-y-2">
            <Label>Số lần sử dụng tối đa</Label>
            <div className="relative">
              <Input
                type="number"
                value={formData.maxUsage}
                onChange={(e) => onFormFieldChange("maxUsage", e.target.value)}
                placeholder="Số lần"
                min={0}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                {domain === "animal" || domain === "aquaculture"
                  ? "lần/chu kỳ nuôi"
                  : "lần/vụ"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hạn sử dụng</Label>
            <Input
              value={formData.shelfLife}
              onChange={(e) => onFormFieldChange("shelfLife", e.target.value)}
              placeholder="VD: 2 năm, 18 tháng"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
