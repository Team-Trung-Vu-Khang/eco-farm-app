import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import {
  convertHtmlToLexical,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { safeConvertLexicalToHtml, isContaintHtmlTag } from "@/utils/commons";
import usePesticideStore from "../../../stores/usePesticideStore";
import PesticideBasicInfoStep from "../components/PesticideBasicInfoStep";
import PesticideConfirmStep from "../components/PesticideConfirmStep";
import PesticideSafetyLegalStep from "../components/PesticideSafetyLegalStep";
import PesticideSuppliersStep from "../components/PesticideSuppliersStep";
import PesticideUsageInfoStep from "../components/PesticideUsageInfoStep";
import type { PesticideFormData } from "../types";
import {
  createEmptyPesticideFormData,
  createPesticideFormDataFromItem,
} from "../utils/form";

export function usePesticideCreatePage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/cultivation-material/pesticide/:id/edit");
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

  useEffect(() => {
    const hydrateFirstAid = async () => {
      if (!formData.firstAid || !isContaintHtmlTag(formData.firstAid)) {
        return;
      }
      const content = await convertHtmlToLexical(formData.firstAid);
      setFormData((prev) => ({
        ...prev,
        firstAid: content as unknown as string,
      }));
    };
    void hydrateFirstAid();
  }, [initialEditItem]);

  const handleAddHashtag = () => {
    const nextHashtag = paramHashtag.trim();
    if (nextHashtag && !formData.hashtags.includes(nextHashtag)) {
      updateField("hashtags", [...formData.hashtags, nextHashtag]);
      setParamHashtag("");
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    updateField("hashtags", formData.hashtags.filter((item) => item !== tag));
  };

  const handleConfirmSubmit = async () => {
    const firstAidHtml = await safeConvertLexicalToHtml(formData.firstAid);

    const payload = {
      // Bước 1
      code: formData.code,
      name: formData.name,
      registrationNumber: formData.registrationNumber || undefined,
      activeIngredient: formData.activeIngredient,
      concentration: formData.concentration || undefined,
      form: formData.form,
      group: formData.group,
      toxicityLevel: formData.toxicityLevel || undefined,
      moaGroup: formData.moaGroup || undefined,
      actionType: formData.actionType,
      origin: formData.manufacturerOrigin || formData.origin,
      imageUrl: formData.imageUrl,
      // Bước 2
      indications: formData.indications || undefined,
      targetEntities: formData.targetEntities.length > 0 ? formData.targetEntities : undefined,
      recommendedDosage: formData.recommendedDosage || undefined,
      applicationMethod: formData.applicationMethod || undefined,
      phi: formData.phi ? Number(formData.phi) : undefined,
      maxUsage: formData.maxUsage ? Number(formData.maxUsage) : undefined,
      shelfLife: formData.shelfLife || undefined,
      usageNotes: formData.usageNotes || undefined,
      // Bước 3
      toxicityInfo: formData.toxicityInfo || undefined,
      protectiveMeasures: formData.protectiveMeasures || undefined,
      firstAid: firstAidHtml || undefined,
      legalStatus: formData.legalStatus || undefined,
      standardsCompliance: formData.standardsCompliance || undefined,
      // Bước 4
      manufacturerOrigin: formData.manufacturerOrigin || undefined,
      importerRegistrant: formData.importerRegistrant || undefined,
      distributor: formData.distributor || undefined,
      referencePrice: formData.referencePrice || undefined,
      packagingSpecs: formData.packagingSpecs.length > 0 ? formData.packagingSpecs : undefined,
      status: "active" as const,
      domain: "cultivation" as const,
    };

    if (isEdit && params?.id) {
      updatePesticide(Number(params.id), payload);
      toast({ title: "Thành công", description: "Đã cập nhật thông tin thành công" });
    } else {
      addPesticide(payload);
      toast({ title: "Thành công", description: "Đã thêm mới thuốc bảo vệ thực vật" });
    }

    setConfirmOpen(false);
    setLocation("/cultivation-material/pesticide");
  };

  const steps = [
    {
      id: "info",
      title: "Định danh & Phân loại",
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
      id: "usage",
      title: "Thông tin sử dụng",
      content: (
        <PesticideUsageInfoStep
          formData={formData}
          domain="cultivation"
          onFormFieldChange={updateField}
        />
      ),
    },
    {
      id: "safety",
      title: "An toàn & Pháp lý",
      content: (
        <PesticideSafetyLegalStep
          formData={formData}
          onFormFieldChange={updateField}
        />
      ),
    },
    {
      id: "supply",
      title: "Xuất xứ & Cung ứng",
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
      content: <PesticideConfirmStep formData={formData} domain="cultivation" />,
    },
  ];

  return {
    isEdit,
    formData,
    confirmOpen,
    setConfirmOpen,
    steps,
    goBack: () => setLocation("/cultivation-material/pesticide"),
    handleComplete: () => setConfirmOpen(true),
    handleConfirmSubmit,
  };
}
