import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Flower2, TreeDeciduous } from "lucide-react";
import type { ReactNode } from "react";
import type { CreateGrowthCycleForm } from "../../types/types";
import type { Variety } from "@/pages/variety/types";
import { CROP_OPTIONS } from "@/constants/crops";

interface GrowthCycleBasicInfoStepProps {
  formData: CreateGrowthCycleForm;
  filteredVarieties: Variety[];
  onScopeChange: (scope: "crop" | "variety") => void;
  onCropChange: (cropId: string) => void;
  onVarietyChange: (variety: string) => void;
}

function ScopeOption({
  checked,
  icon,
  inputId,
  title,
  value,
  description,
  onClick,
}: {
  checked: boolean;
  icon: ReactNode;
  inputId: string;
  title: string;
  value: "crop" | "variety";
  description: string;
  onClick: () => void;
}) {
  return (
    <div
      className={`relative flex flex-row items-center space-x-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${
        checked
          ? "border-primary bg-primary/5 shadow-md"
          : "border-muted hover:border-primary/50 hover:bg-muted/50"
      }`}
      onClick={onClick}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
          checked
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={value} id={inputId} />
          <Label
            htmlFor={inputId}
            className="font-bold cursor-pointer text-base"
          >
            {title}
          </Label>
        </div>
        <p className="text-xs text-muted-foreground leading-snug">
          {description}
        </p>
      </div>
    </div>
  );
}

export function GrowthCycleBasicInfoStep({
  formData,
  filteredVarieties,
  onScopeChange,
  onCropChange,
  onVarietyChange,
}: GrowthCycleBasicInfoStepProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-semibold">Phạm vi áp dụng</Label>
          <RadioGroup
            value={formData.scope}
            onValueChange={onScopeChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <ScopeOption
              checked={formData.scope === "crop"}
              icon={<TreeDeciduous className="w-6 h-6" />}
              inputId="scope-crop"
              title="Theo loại cây trồng"
              value="crop"
              description="Áp dụng cho tất cả các giống thuộc loại cây trồng này."
              onClick={() => onScopeChange("crop")}
            />
            <ScopeOption
              checked={formData.scope === "variety"}
              icon={<Flower2 className="w-6 h-6" />}
              inputId="scope-variety"
              title="Theo giống cụ thể"
              value="variety"
              description="Chỉ áp dụng cho chính xác giống cây trồng được chọn."
              onClick={() => onScopeChange("variety")}
            />
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Loại cây trồng</Label>
            <Select value={formData.cropId} onValueChange={onCropChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại cây" />
              </SelectTrigger>
              <SelectContent>
                {CROP_OPTIONS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.name}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback>{opt.name.charAt(0)}</AvatarFallback>
                        <AvatarImage src={opt.image} />
                      </Avatar>
                      <span>{opt.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.scope === "variety" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-sm font-semibold">Giống cây trồng</Label>
              <Select
                value={formData.variety}
                onValueChange={onVarietyChange}
                disabled={!formData.cropId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      formData.cropId
                        ? "Chọn giống cây"
                        : "Vui lòng chọn loại cây trước"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredVarieties.length > 0 ? (
                    filteredVarieties.map((variety) => (
                      <SelectItem key={variety.id} value={variety.id}>
                        <div className="flex items-center gap-2">
                          <Flower2 className="w-4 h-4 text-rose-500" />
                          <span>{variety.varietyName}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-xs text-muted-foreground">
                      Không có giống cây nào cho loại này
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
