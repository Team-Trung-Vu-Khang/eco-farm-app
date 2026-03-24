import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useMaterialStore from "../../../stores/useMaterialStore";
import MaterialBasicInfoStep from "../components/MaterialBasicInfoStep";
import MaterialConfirmStep from "../components/MaterialConfirmStep";
import MaterialSuppliersStep from "../components/MaterialSuppliersStep";
import type { MaterialFormData, MaterialSupplierDetail } from "../types/types";
import {
  createEmptyMaterialFormData,
  createEmptyTempSupplier,
  createMaterialFormDataFromItem,
} from "../utils/form";

export function useMaterialCreatePage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/material/:id/edit");
  const isEdit = match && !!params?.id;
  const { toast } = useToast();

  const getMaterialById = useMaterialStore((state) => state.getMaterialById);
  const addMaterial = useMaterialStore((state) => state.addMaterial);
  const updateMaterial = useMaterialStore((state) => state.updateMaterial);
  const initialEditItem =
    isEdit && params?.id ? getMaterialById(Number(params.id)) : undefined;

  const [formData, setFormData] = useState<MaterialFormData>(() =>
    initialEditItem
      ? createMaterialFormDataFromItem(initialEditItem)
      : createEmptyMaterialFormData(),
  );
  const [paramHashtag, setParamHashtag] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tempSupplier, setTempSupplier] = useState<MaterialSupplierDetail>(() =>
    createEmptyTempSupplier(),
  );

  const updateField = <K extends keyof MaterialFormData>(
    field: K,
    value: MaterialFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateTempSupplier = (data: Partial<MaterialSupplierDetail>) => {
    setTempSupplier((prev) => ({ ...prev, ...data }));
  };

  const handleAddHashtag = () => {
    const nextHashtag = paramHashtag.trim();

    if (nextHashtag && !formData.hashtags.includes(nextHashtag)) {
      updateField("hashtags", [...formData.hashtags, nextHashtag]);
      setParamHashtag("");
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    updateField(
      "hashtags",
      formData.hashtags.filter((item) => item !== tag),
    );
  };

  const handleAddSupplier = () => {
    if (
      !tempSupplier.supplierId ||
      !tempSupplier.quantity ||
      !tempSupplier.unit
    ) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn nhà cung cấp, số lượng và đơn vị",
        variant: "destructive",
      });
      return;
    }

    updateField("supplierDetails", [...formData.supplierDetails, tempSupplier]);
    setTempSupplier(createEmptyTempSupplier());
  };

  const handleRemoveSupplier = (index: number) => {
    updateField(
      "supplierDetails",
      formData.supplierDetails.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const handleConfirmSubmit = () => {
    const payload = {
      code: formData.code,
      name: formData.name,
      type: formData.type,
      description: formData.description,
      status: "active" as const,
    };

    if (isEdit && params?.id) {
      updateMaterial(Number(params.id), payload);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin vật tư",
      });
    } else {
      addMaterial(payload);
      toast({
        title: "Thành công",
        description: "Đã thêm mới vật tư",
      });
    }

    setConfirmOpen(false);
    setLocation("/material");
  };

  const steps = [
    {
      id: "info",
      title: "Thông tin cơ bản",
      content: (
        <MaterialBasicInfoStep
          formData={formData}
          paramHashtag={paramHashtag}
          onParamHashtagChange={setParamHashtag}
          onFormFieldChange={updateField}
          onAddHashtag={handleAddHashtag}
          onRemoveHashtag={handleRemoveHashtag}
        />
      ),
    },
    {
      id: "supply",
      title: "Nhà cung cấp",
      content: (
        <MaterialSuppliersStep
          formData={formData}
          tempSupplier={tempSupplier}
          onTempSupplierChange={updateTempSupplier}
          onAddSupplier={handleAddSupplier}
          onRemoveSupplier={handleRemoveSupplier}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      content: <MaterialConfirmStep formData={formData} />,
    },
  ];

  return {
    isEdit,
    formData,
    confirmOpen,
    setConfirmOpen,
    steps,
    goBack: () => setLocation("/material"),
    handleComplete: () => setConfirmOpen(true),
    handleConfirmSubmit,
  };
}
