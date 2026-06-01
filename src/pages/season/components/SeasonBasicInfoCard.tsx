import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Calendar, Flower, Info, Trees } from "lucide-react";
import { CROP_OPTIONS } from "../../../constants/crops";
import { SEASON_STATUS_OPTIONS } from "../utils/utils";
import type { SeasonFormData, SeasonStatus } from "../types/types";

interface SeasonBasicInfoCardProps {
  formData: SeasonFormData;
  onChange: (formData: SeasonFormData) => void;
  showStatusField?: boolean;
  varieties: { id: string; crop: string; varietyName: string }[];
}

export function SeasonBasicInfoCard({
  formData,
  onChange,
  showStatusField = false,
  varieties,
}: SeasonBasicInfoCardProps) {
  const handleScopeChange = (scope: SeasonFormData["scope"]) => {
    if (formData.scope === scope) {
      return;
    }

    onChange({
      ...formData,
      scope,
      cropId: undefined,
      varietyId: undefined,
      growthCycleIds: [],
      selectedStages: {},
    });
  };

  const updateForm = <K extends keyof SeasonFormData>(
    field: K,
    value: SeasonFormData[K],
  ) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Info className="h-5 w-5" />
          </div>
          <CardTitle>Thông tin chung</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-bold text-slate-800">
            Phạm vi áp dụng
          </Label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <button
              type="button"
              className={`relative flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                formData.scope === "crop"
                  ? "border-green-600 bg-green-50/30"
                  : "border-slate-100 bg-white hover:border-green-200"
              }`}
              onClick={() => handleScopeChange("crop")}
            >
              <div
                className={`shrink-0 rounded-full p-3 ${
                  formData.scope === "crop"
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Trees className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Theo loại cây trồng
                  </span>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      formData.scope === "crop"
                        ? "border-green-600"
                        : "border-slate-300"
                    }`}
                  >
                    {formData.scope === "crop" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                    )}
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-slate-500">
                  Áp dụng cho tất cả các giống thuộc loại cây trồng này.
                </p>
              </div>
            </button>

            <button
              type="button"
              className={`relative flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                formData.scope === "variety"
                  ? "border-green-600 bg-green-50/30"
                  : "border-slate-100 bg-white hover:border-green-200"
              }`}
              onClick={() => handleScopeChange("variety")}
            >
              <div
                className={`shrink-0 rounded-full p-3 ${
                  formData.scope === "variety"
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Flower className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Theo giống cụ thể
                  </span>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      formData.scope === "variety"
                        ? "border-green-600"
                        : "border-slate-300"
                    }`}
                  >
                    {formData.scope === "variety" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                    )}
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-slate-500">
                  Chỉ áp dụng cho chính xác giống cây trồng được chọn.
                </p>
              </div>
            </button>
          </div>

          <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  {formData.scope === "crop"
                    ? "Loại cây trồng"
                    : "Bước 1: Loại cây trồng"}
                  <span className="text-destructive"> *</span>
                </Label>
                <Select
                  value={formData.cropId}
                  onValueChange={(value) =>
                    onChange({
                      ...formData,
                      cropId: value,
                      varietyId: undefined,
                      growthCycleIds: [],
                      selectedStages: {},
                    })
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="-- Chọn cây trồng --" />
                  </SelectTrigger>
                  <SelectContent>
                    {CROP_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.name}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {option.name.charAt(0)}
                            </AvatarFallback>
                            <AvatarImage src={option.image} />
                          </Avatar>
                          <span>{option.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.scope === "variety" && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Bước 2: Giống cây trồng
                    <span className="text-destructive"> *</span>
                  </Label>
                  <Select
                    value={formData.varietyId}
                    disabled={!formData.cropId}
                    onValueChange={(value) =>
                      onChange({
                        ...formData,
                        varietyId: value,
                        growthCycleIds: [],
                        selectedStages: {},
                      })
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="-- Chọn giống --" />
                    </SelectTrigger>
                    <SelectContent>
                      {varieties
                        .filter((variety) => variety.crop === formData.cropId)
                        .map((variety) => (
                          <SelectItem key={variety.id} value={variety.id}>
                            {variety.varietyName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Mã mùa vụ <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="VD: MV2024-01"
                value={formData.code}
                onChange={(event) => updateForm("code", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Tên mùa vụ <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="VD: Vụ Xuân 2024"
                value={formData.name}
                onChange={(event) => updateForm("name", event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Textarea
              placeholder="Mô tả chi tiết về kế hoạch mùa vụ..."
              rows={3}
              value={formData.description}
              onChange={(event) =>
                updateForm("description", event.target.value)
              }
            />
          </div>

          <div
            className={`grid grid-cols-1 gap-4 ${showStatusField ? "md:grid-cols-2" : ""}`}
          >
            {/* <div className="space-y-2">
              <Label>
                Thời gian (ngày) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="VD: 120"
                  className="pl-10"
                  value={formData.duration || ""}
                  onChange={(event) =>
                    updateForm("duration", Number(event.target.value))
                  }
                />
              </div>
            </div> */}

            {showStatusField && (
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    updateForm("status", value as SeasonStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEASON_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
