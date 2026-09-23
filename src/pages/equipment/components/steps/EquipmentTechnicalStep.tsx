import { RemoteMultiSelect } from "@/components/RemoteMultiSelect";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Cpu } from "lucide-react";
import React, { useState } from "react";
import { fuelEnergyTypeOptions } from "../../data/constants";
import type { EquipmentFormData } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { farmSupplyApi, type DomainCode } from "@/features/farm-supply";
import { useMasterData } from "@/features/master-data";

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
  const [techSearch, setTechSearch] = useState("");
  const [assetSearch, setAssetSearch] = useState("");
  const [chainSearch, setChainSearch] = useState("");
  const [machineTypeSearch, setMachineTypeSearch] = useState("");

  const { items: equipmentToolGroups, isLoading: isEquipmentLoading } =
    useMasterData("equipment-tool-groups", { params: { size: 100 } });

  const { data: apiGroups, isLoading } = useQuery({
    queryKey: ["equipment-groups", domainCode],
    queryFn: () => farmSupplyApi.getClassificationGroups("equipment"),
    staleTime: 5 * 60 * 1000,
  });

  const equipmentToolGroupOptions = React.useMemo(() => {
    const list = equipmentToolGroups || [];
    const filtered = machineTypeSearch.trim()
      ? list.filter((item) =>
          item.name.toLowerCase().includes(machineTypeSearch.toLowerCase()),
        )
      : list;
    return filtered.map((item) => ({ label: item.name, value: item.name }));
  }, [equipmentToolGroups, machineTypeSearch]);

  const technologyLevelOptions = React.useMemo(() => {
    const list =
      apiGroups?.filter((item) => item.classification === "technology_level") ??
      [];
    if (!techSearch.trim()) return list;
    return list.filter((item) =>
      item.name.toLowerCase().includes(techSearch.toLowerCase()),
    );
  }, [apiGroups, techSearch]);

  const financialManagementOptions = React.useMemo(() => {
    const list =
      apiGroups?.filter((item) => item.classification === "financial_aspect") ??
      [];
    if (!assetSearch.trim()) return list;
    return list.filter((item) =>
      item.name.toLowerCase().includes(assetSearch.toLowerCase()),
    );
  }, [apiGroups, assetSearch]);

  const valueChainOptions = React.useMemo(() => {
    const list =
      apiGroups?.filter((item) => item.classification === "value_chain") ?? [];
    const filtered = chainSearch.trim()
      ? list.filter((item) =>
          item.name.toLowerCase().includes(chainSearch.toLowerCase()),
        )
      : list;
    return filtered.map((item) => ({ label: item.name, value: item.code }));
  }, [apiGroups, chainSearch]);

  const machineTypeArr = formData.machineType || [];
  const valueChainGroupArr = formData?.valueChainGroup || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      {/* Card: Technical Information */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          Thông số &amp; Đặc tính kỹ thuật
        </h3>

        {/* Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Mức độ Công nghệ</Label>
            <RemoteMultiSelect
              options={technologyLevelOptions.map((t) => ({
                label: t.name,
                value: t.code,
              }))}
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
              loading={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Khía cạnh Tài chính</Label>
            <RemoteMultiSelect
              options={financialManagementOptions.map((t) => ({
                label: t.name,
                value: t.code,
              }))}
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
              loading={isLoading}
            />
          </div>
        </div>

        {/* Process Group / Value Chain */}
        <div className="space-y-2">
          <Label>Chuỗi giá trị</Label>
          <RemoteMultiSelect
            options={valueChainOptions}
            value={valueChainGroupArr}
            onChange={(vals) => {
              updateField("valueChainGroup", vals);
              updateField("valueChainId", vals[0] || ""); // Sync legacy field (takes the first selected)
            }}
            onSearch={setChainSearch}
            placeholder="Chọn chuỗi giá trị (chọn nhiều)..."
            searchPlaceholder="Tìm chuỗi giá trị..."
            emptyText="Không tìm thấy chuỗi giá trị"
            loading={isLoading}
          />
        </div>

        {/* Machine Type Tags */}
        <div className="space-y-2">
          <Label>Loại máy / Nhóm thiết bị</Label>
          <RemoteMultiSelect
            options={equipmentToolGroupOptions}
            value={machineTypeArr}
            onChange={(vals) => updateField("machineType", vals)}
            onSearch={setMachineTypeSearch}
            placeholder="Chọn loại máy / nhóm thiết bị (chọn nhiều)..."
            searchPlaceholder="Tìm loại máy / nhóm thiết bị..."
            emptyText="Không tìm thấy loại máy / nhóm thiết bị"
            loading={isEquipmentLoading}
          />
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
