import {
  Badge,
  Button,
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Cpu, Plus, X } from "lucide-react";
import React, { useState } from "react";
import {
  fuelEnergyTypeOptions,
  machineTypeOptions,
} from "../../data/constants";
import type { EquipmentFormData } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { farmSupplyApi, type DomainCode } from "@/features/farm-supply";

interface EquipmentTechnicalStepProps {
  domainCode: DomainCode;
  formData: EquipmentFormData;
  updateField: (field: keyof EquipmentFormData, value: any) => void;
}

export const EquipmentTechnicalStep = ({
  formData,
  domainCode,
  updateField,
}: EquipmentTechnicalStepProps) => {
  const [customMachineType, setCustomMachineType] = useState("");

  const { data: apiGroups } = useQuery({
    queryKey: ["equipment-groups", domainCode],
    queryFn: () => farmSupplyApi.getClassificationGroups("material"),
    staleTime: 5 * 60 * 1000,
  });

  const technologyLevelOptions = React.useMemo(() => {
    return (
      apiGroups?.filter((item) => item.classification === "technology_level") ??
      []
    );
  }, [apiGroups]);

  const financialManagementOptions = React.useMemo(
    () =>
      apiGroups?.filter((item) => item.classification === "financial_aspect") ??
      [],
    [apiGroups],
  );

  const valueChainOptions = React.useMemo(
    () =>
      (
        apiGroups?.filter((item) => item.classification === "value_chain") ?? []
      ).map((item) => ({ label: item.name, value: item.code })),
    [apiGroups],
  );

  const machineTypeArr = formData.machineType || [];
  const valueChainGroupArr = formData?.valueChainGroup || [];

  const handleAddMachineType = () => {
    const nextType = customMachineType.trim();
    if (nextType && !machineTypeArr.includes(nextType)) {
      updateField("machineType", [...machineTypeArr, nextType]);
      setCustomMachineType("");
    }
  };

  const removeMachineType = (tag: string) => {
    updateField(
      "machineType",
      machineTypeArr.filter((t) => t !== tag),
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      {/* Card: Technical Information */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          Thông số & Đặc tính kỹ thuật
        </h3>

        {/* Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nhóm công nghệ (Năng lực vận hành)</Label>
            <Select
              value={formData.technologyLevelGroup || ""}
              onValueChange={(v) => {
                updateField("technologyLevelGroup", v);
                updateField("technologyLevelId", v); // Sync legacy field
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn mức độ công nghệ" />
              </SelectTrigger>
              <SelectContent>
                {technologyLevelOptions.map((t) => (
                  <SelectItem key={t.code} value={t.code}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nhóm tài sản (Quản lý tài chính)</Label>
            <Select
              value={formData.assetManagementGroup || ""}
              onValueChange={(v) => {
                updateField("assetManagementGroup", v);
                updateField("financialManagementId", v); // Sync legacy field
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhóm tài sản" />
              </SelectTrigger>
              <SelectContent>
                {financialManagementOptions.map((t) => (
                  <SelectItem key={t.code} value={t.code}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Process Group / Value Chain */}
        <div className="space-y-2">
          <Label>Nhóm công cụ theo quy trình (Chuỗi giá trị)</Label>
          <MultiSelect
            options={valueChainOptions}
            value={valueChainGroupArr}
            onChange={(vals) => {
              updateField("valueChainGroup", vals);
              updateField("valueChainId", vals[0] || ""); // Sync legacy field (takes the first selected)
            }}
            placeholder="Chọn khâu trong quy trình sản xuất..."
          />
        </div>

        {/* Machine Type Tags */}
        <div className="space-y-3">
          <Label>Loại máy / Công dụng chi tiết</Label>
          <div className="flex gap-2">
            <Input
              value={customMachineType}
              onChange={(e) => setCustomMachineType(e.target.value)}
              placeholder="Nhập loại máy (VD: Máy bơm chìm, Quạt nước...)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddMachineType();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddMachineType}
              variant="outline"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {/* Quick presets */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">
              Gợi ý loại máy phổ biến:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {machineTypeOptions.map((preset) => {
                const isSelected = machineTypeArr.includes(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      if (!isSelected) {
                        updateField("machineType", [...machineTypeArr, preset]);
                      } else {
                        removeMachineType(preset);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Tag list */}
          {machineTypeArr.filter((t) => !machineTypeOptions.includes(t))
            .length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {machineTypeArr
                .filter((t) => !machineTypeOptions.includes(t))
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="w-3.5 h-3.5 cursor-pointer ml-1 text-slate-400 hover:text-slate-600"
                      onClick={() => removeMachineType(tag)}
                    />
                  </Badge>
                ))}
            </div>
          )}
        </div>

        {/* Power & Working Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Công suất (HP / kW)</Label>
            <Input
              value={formData.powerCapacity || ""}
              onChange={(e) => updateField("powerCapacity", e.target.value)}
              placeholder="VD: 50 HP, 12 kW..."
            />
          </div>
          <div className="space-y-2">
            <Label>Dung tích / Khả năng làm việc</Label>
            <Input
              value={formData.workingCapacity || ""}
              onChange={(e) => updateField("workingCapacity", e.target.value)}
              placeholder="VD: 21 ha/giờ, 10 m3/giờ..."
            />
            <p className="text-xs text-muted-foreground">
              Ví dụ: lít/giờ, ha/giờ, tấn/giờ...
            </p>
          </div>
        </div>

        {/* Fuel Type & Dimensions & Weight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Loại nhiên liệu / Năng lượng</Label>
            <Select
              value={formData.fuelEnergyType || ""}
              onValueChange={(v) => updateField("fuelEnergyType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhiên liệu..." />
              </SelectTrigger>
              <SelectContent>
                {fuelEnergyTypeOptions.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Kích thước (D × R × C)</Label>
            <Input
              value={formData.dimensions || ""}
              onChange={(e) => updateField("dimensions", e.target.value)}
              placeholder="VD: 3200 × 1495 × 2050 mm"
            />
          </div>
          <div className="space-y-2">
            <Label>Trọng lượng</Label>
            <Input
              value={formData.weight || ""}
              onChange={(e) => updateField("weight", e.target.value)}
              placeholder="VD: 1490 kg, 38 kg..."
            />
          </div>
        </div>

        {/* Other Specifications */}
        <div className="space-y-2">
          <Label>Các thông số kỹ thuật đặc thù khác</Label>
          <Textarea
            value={formData.otherSpecifications || ""}
            onChange={(e) => updateField("otherSpecifications", e.target.value)}
            placeholder="Nhập chi tiết các cảm biến, hệ thống lái tự động, radar bảo vệ, vv..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};
