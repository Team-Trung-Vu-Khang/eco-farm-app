import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useMaterialStore from "../../../stores/useMaterialStore";
import MaterialBasicInfoStep from "../components/MaterialBasicInfoStep";
import MaterialConfirmStep from "../components/MaterialConfirmStep";
import MaterialSuppliersStep from "../components/MaterialSuppliersStep";
import type { MaterialFormData } from "../types/types";
import {
  createEmptyMaterialFormData,
  createMaterialFormDataFromItem,
} from "../utils/form";

export function useMaterialCreatePage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/cultivation-material/material/:id/edit");
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

  const updateField = <K extends keyof MaterialFormData>(
    field: K,
    value: MaterialFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddHashtag = () => {
    const nextHashtag = paramHashtag.trim();

    if (nextHashtag && !(formData.hashtags || []).includes(nextHashtag)) {
      updateField("hashtags", [...(formData.hashtags || []), nextHashtag]);
      setParamHashtag("");
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    updateField(
      "hashtags",
      (formData.hashtags || []).filter((item) => item !== tag),
    );
  };

  const handleConfirmSubmit = () => {
    const payload = {
      code: formData.code,
      name: formData.name,
      type: formData.type,
      description: formData.description,
      status: "active" as const,
      materialGroupId: formData.materialGroupId,
      manufacturerOrigin: formData.manufacturerOrigin,
      importerRegistrant: formData.importerRegistrant,
      distributor: formData.distributor,
      packagingSpecs: formData.packagingSpecs,
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
    setLocation("/cultivation-material/material");
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
          onFormFieldChange={updateField}
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
    goBack: () => setLocation("/cultivation-material/material"),
    handleComplete: () => setConfirmOpen(true),
    handleConfirmSubmit,
  };
}
