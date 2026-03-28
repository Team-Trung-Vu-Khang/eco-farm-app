import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useUnitStore from "../../../stores/useUnitStore";
import {
  UNIT_STANDARDS,
  UNIT_TYPE_OPTIONS,
  emptyUnitFormData,
} from "../data/constants";
import type { Unit, UnitFormData, UnitType } from "../types/types";

function getDefaultStandard(type: UnitType) {
  return UNIT_STANDARDS[type].find((standard) => standard.factor === 1)?.value ?? "";
}

function getInitialFormData(item?: Unit): UnitFormData {
  if (!item) {
    return emptyUnitFormData;
  }

  return {
    code: item.code,
    name: item.name,
    description: item.description,
    status: item.status,
    type: item.type,
    conversionFactor: item.conversionFactor,
  };
}

export function useUnitFormPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/unit/:id/edit");
  const { toast } = useToast();

  const getUnitById = useUnitStore((state) => state.getUnitById);
  const addUnit = useUnitStore((state) => state.addUnit);
  const updateUnit = useUnitStore((state) => state.updateUnit);
  const getBaseUnitByType = useUnitStore((state) => state.getBaseUnitByType);

  const isEdit = match && Boolean(params?.id);
  const editItem = isEdit && params?.id ? getUnitById(Number(params.id)) : undefined;

  const [formData, setFormData] = useState<UnitFormData>(() =>
    getInitialFormData(editItem),
  );
  const [selectedStandard, setSelectedStandard] = useState(() =>
    getDefaultStandard(editItem?.type ?? emptyUnitFormData.type),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const standardOptions = UNIT_STANDARDS[formData.type];
  const selectedStandardLabel =
    standardOptions.find((standard) => standard.value === selectedStandard)?.label ?? "...";
  const unitTypeLabel =
    UNIT_TYPE_OPTIONS.find((option) => option.value === formData.type)?.label ?? formData.type;

  const updateField = <K extends keyof UnitFormData>(
    field: K,
    value: UnitFormData[K],
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "type") {
        const nextType = value as UnitType;
        setSelectedStandard(getDefaultStandard(nextType));
        return {
          ...next,
          conversionFactor: 1,
        };
      }
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    const systemBaseUnit = getBaseUnitByType(formData.type);

    if (!systemBaseUnit) {
      toast({
        title: "Lỗi cấu hình",
        description: `Không tìm thấy đơn vị chuẩn hệ thống cho loại ${formData.type}`,
        variant: "destructive",
      });
      setConfirmOpen(false);
      return;
    }

    const selectedStandardItem = standardOptions.find(
      (standard) => standard.value === selectedStandard,
    );

    if (!selectedStandardItem) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn đơn vị quy đổi",
        variant: "destructive",
      });
      setConfirmOpen(false);
      return;
    }

    const finalData = {
      code: formData.code,
      name: formData.name,
      description: formData.description,
      status: formData.status,
      type: formData.type,
      isBaseUnit: false,
      baseUnitId: systemBaseUnit.id,
      conversionFactor:
        Number(formData.conversionFactor) * selectedStandardItem.factor,
    };

    if (isEdit && params?.id) {
      updateUnit(Number(params.id), finalData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật đơn vị tính",
      });
    } else {
      addUnit(finalData);
      toast({
        title: "Thành công",
        description: "Đã thêm mới đơn vị tính",
      });
    }

    setConfirmOpen(false);
    setLocation("/unit");
  };

  return {
    isEdit,
    formData,
    selectedStandard,
    selectedStandardLabel,
    unitTypeLabel,
    standardOptions,
    confirmOpen,
    setConfirmOpen,
    updateField,
    setSelectedStandard,
    handleSubmit,
    handleConfirmSubmit,
    goBack: () => setLocation("/unit"),
  };
}
