import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import usePesticideStore from "../../../stores/usePesticideStore";
import PesticideBasicInfoStep from "../../pesticide/components/PesticideBasicInfoStep";
import PesticideConfirmStep from "../../pesticide/components/PesticideConfirmStep";
import PesticideSuppliersStep from "../../pesticide/components/PesticideSuppliersStep";
import PesticideTechnicalDocsStep from "../../pesticide/components/PesticideTechnicalDocsStep";
import type { PesticideFormData } from "../../pesticide/types";
import {
  createEmptyPesticideFormData,
  createPesticideFormDataFromItem,
} from "../../pesticide/utils/form";

export function useAqPesticideCreatePage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute(
    "/aquaculture-material/pesticide/:id/edit",
  );
  const isEdit = match && !!params?.id;
  const { toast } = useToast();

  const getPesticideById = usePesticideStore((state) => state.getPesticideById);
  const addPesticide = usePesticideStore((state) => state.addPesticide);
  const updatePesticide = usePesticideStore((state) => state.updatePesticide);
  const initialEditItem =
    isEdit && params?.id ? getPesticideById(Number(params.id)) : undefined;

  const [formData, setFormData] = useState<PesticideFormData>(() =>
    initialEditItem
      ? createPesticideFormDataFromItem(initialEditItem)
      : createEmptyPesticideFormData(),
  );
  const [paramHashtag, setParamHashtag] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const updateField = <K extends keyof PesticideFormData>(
    field: K,
    value: PesticideFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleConfirmSubmit = () => {
    const payload = {
      code: formData.code,
      name: formData.name,
      group: formData.group,
      form: formData.form,
      actionType: formData.actionType,
      origin: formData.origin,
      activeIngredient: formData.activeIngredient,
      status: "active" as const,
    };

    if (isEdit && params?.id) {
      updatePesticide(Number(params.id), payload);
      toast({ title: "Thành công", description: "Đã cập nhật thông tin thành công" });
    } else {
      addPesticide(payload);
      toast({ title: "Thành công", description: "Đã thêm mới thuốc" });
    }

    setConfirmOpen(false);
    setLocation("/aquaculture-material/pesticide");
  };

  const steps = [
    {
      id: "info",
      title: "Thông tin cơ bản",
      content: (
        <PesticideBasicInfoStep
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
      id: "docs",
      title: "Tài liệu kỹ thuật",
      content: (
        <PesticideTechnicalDocsStep
          formData={formData}
          onFormFieldChange={updateField}
        />
      ),
    },
    {
      id: "supply",
      title: "Nhà cung cấp",
      content: (
        <PesticideSuppliersStep
          formData={formData}
          onFormFieldChange={updateField}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      content: <PesticideConfirmStep formData={formData} />,
    },
  ];

  return {
    isEdit,
    formData,
    confirmOpen,
    setConfirmOpen,
    steps,
    goBack: () => setLocation("/aquaculture-material/pesticide"),
    handleComplete: () => setConfirmOpen(true),
    handleConfirmSubmit,
  };
}
