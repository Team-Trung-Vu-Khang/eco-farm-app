import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  convertHtmlToLexical,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { safeConvertLexicalToHtml, isContaintHtmlTag } from "@/utils/commons";
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
import {
  farmSupplyApi,
  parsePackagingSpecs,
  formatPackagingSpecs,
} from "@/features/farm-supply";
import { useImageUploadWithCache } from "@/features/storage/hooks/useImageUploadWithCache";

export function usePesticideCreatePage() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/cultivation-material/pesticide/:id/edit");
  const isEdit = match && !!params?.id;
  const { toast } = useToast();
  const { uploadImage } = useImageUploadWithCache();

  const [formData, setFormData] = useState<PesticideFormData>(() =>
    createEmptyPesticideFormData(),
  );
  const [paramHashtag, setParamHashtag] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // Metadata states
  const [packagingTypes, setPackagingTypes] = useState<any[]>([]);
  const [baseUnits, setBaseUnits] = useState<any[]>([]);
  const [allGroups, setAllGroups] = useState<any[]>([]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [allCertificates, setAllCertificates] = useState<any[]>([]);

  const updateField = <K extends keyof PesticideFormData>(
    field: K,
    value: PesticideFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      farmSupplyApi.listPackagingTypes(),
      farmSupplyApi.listBaseUnits(),
      farmSupplyApi.getClassificationGroups("medicine"),
      farmSupplyApi.getTargetSubjects("CROP"),
      farmSupplyApi.listCertificateStandards(),
    ])
      .then(([pkgs, units, groups, subjects, certs]) => {
        setPackagingTypes(pkgs);
        setBaseUnits(units);
        setAllGroups(groups);
        setAllSubjects(subjects);
        setAllCertificates(certs);

        if (isEdit && params?.id) {
          return farmSupplyApi
            .getById("medicine", Number(params.id), "OWNER")
            .then((item) => {
              const mapped = mapResponseToPesticide(item, certs);
              setFormData(createPesticideFormDataFromItem(mapped));
            });
        }
      })
      .catch((err) => {
        toast({
          title: "Lỗi",
          description: "Không tải được thông tin metadata hoặc vật tư",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isEdit, params?.id]);

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
  }, [formData.code]); // trigger on initial load hydration

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

  const handleConfirmSubmit = async (isDetailMode?: boolean) => {
    setSubmitting(true);
    try {
      const firstAidHtml = await safeConvertLexicalToHtml(formData.firstAid);
      const uploadedImageUrl = await uploadImage(
        formData.imageUrl,
        formData.imageFile,
        "medicine",
      );

      // Dynamic Classifications matching
      const classifications: any[] = [];
      const addClass = (classKey: string, name: string) => {
        if (!name) return;
        const matched = allGroups.find(
          (g) =>
            g.classification === classKey &&
            g.name.toLowerCase() === name.toLowerCase(),
        );
        if (matched) {
          classifications.push({
            classification: classKey,
            groupId: matched.id,
            displayOrder: 0,
          });
        }
      };

      addClass("target_group", formData.group);
      addClass("dosage_form", formData.form);
      addClass("toxicity", formData.toxicityLevel);
      addClass("mode_of_action", formData.actionType);
      addClass("origin", formData.manufacturerOrigin?.name || formData.origin);

      // Dynamic Subjects mapping
      const targetSubjectIds = formData.targetEntities
        .map(
          (name) =>
            allSubjects.find((s) => s.name.toLowerCase() === name.toLowerCase())
              ?.id,
        )
        .filter((id): id is number => id !== undefined);

      // Dynamic Certificates mapping
      const certificateIds = formData.standardsCompliance
        .map(
          (name) =>
            allCertificates.find(
              (c) => c.name.toLowerCase() === name.toLowerCase(),
            )?.id,
        )
        .filter((id): id is number => id !== undefined);

      const generatedSku =
        formData.code?.trim() ||
        `BVTV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const payload: any = {
        name: formData.name,
        sku: generatedSku, // SKU code represents code in the form
        displayOrder: 10,
        status: "active",
        domainCode: "CROP",
        manufacturerOrganizationId: formData.manufacturerOrigin?.id || null,
        importerOrganizationId: formData.importerRegistrant?.id || null,
        distributorOrganizationId: formData.distributor?.id || null,
        referencePrice: formData.referencePrice || undefined,
        registrationNumber: formData.registrationNumber || undefined,
        legalStatus: formData.legalStatus || "allowed",
        legalDescription: formData.legalDescription || undefined,
        description: formData.note || undefined,
        hashtags: formData.hashtags,
        imageUrl: uploadedImageUrl || undefined,
        packagingVariants: parsePackagingSpecs(
          isDetailMode
            ? formData.packagingSpecs
            : formData.packaging || formData.quantity || formData.unit
              ? [
                  `${formData.packaging || "Chai"} ${formData.quantity || "1"} ${formData.unit || "l"}`,
                ]
              : [],
          packagingTypes,
          baseUnits,
        ),
        certificates: certificateIds.map((cid, i) => ({
          certificateId: cid,
          displayOrder: i,
        })),
        classifications,
        targetSubjectIds,

        // Metadata for unsupported fields
        metadataJson: {
          toxicityLevel: formData.toxicityLevel || undefined,
          origin: formData.origin || undefined,
          formType: isDetailMode ? "advanced" : "basic",
        },

        // Profile details
        concentration: formData.concentration || undefined,
        activeIngredient: formData.activeIngredient || undefined,
        moaGroupCode: formData.moaGroup || undefined,
        mainUsage: formData.indications || undefined,
        recommendedDosage: formData.recommendedDosage || undefined,
        usageMethod: formData.applicationMethod || undefined,
        usageNotes: formData.usageNotes || undefined,
        withdrawalPeriodDays: formData.phi ? Number(formData.phi) : undefined,
        maxUsageCount: formData.maxUsage
          ? Number(formData.maxUsage)
          : undefined,
        shelfLife: formData.shelfLife || undefined,
        toxicityDescription: formData.toxicityInfo || undefined,
        protectiveMeasures: formData.protectiveMeasures || undefined,
        poisoningTreatment: firstAidHtml || undefined,
      };

      if (isEdit && params?.id) {
        await farmSupplyApi.update("medicine", Number(params.id), payload);
        toast({
          title: "Thành công",
          description: "Đã cập nhật thông tin thành công",
        });
      } else {
        await farmSupplyApi.create("medicine", payload);
        toast({
          title: "Thành công",
          description: "Đã thêm mới thuốc bảo vệ thực vật",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["farm-supplies"] });
      setLocation("/cultivation-material/pesticide");
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast({
          title: "Trùng lặp SKU",
          description:
            "Mã SKU này đã tồn tại trong hệ thống. Vui lòng nhập mã SKU khác.",
          variant: "destructive",
        });
      } else if (err.response?.status === 400) {
        toast({
          title: "Dữ liệu không hợp lệ",
          description:
            err.response?.data?.message ||
            "Thông tin tổ chức không hợp lệ. Vui lòng kiểm tra lại.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Lỗi",
          description: err.message || "Lưu thất bại",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  const resetForm = () => {
    setFormData(createEmptyPesticideFormData());
  };

  const steps = [
    {
      id: "info",
      title: "Định danh & Phân loại",
      content: (
        <PesticideBasicInfoStep
          domain="cultivation"
          formData={formData}
          paramHashtag={paramHashtag}
          onParamHashtagChange={setParamHashtag}
          onFormFieldChange={updateField}
          onAddHashtag={handleAddHashtag}
          onRemoveHashtag={handleRemoveHashtag}
        />
      ),
      isValid: Boolean(formData.name && formData.group),
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
      content: (
        <PesticideConfirmStep formData={formData} domain="cultivation" />
      ),
    },
  ];

  return {
    isEdit,
    formData,
    updateField,
    resetForm,
    confirmOpen,
    setConfirmOpen,
    steps,
    loading,
    submitting,
    goBack: () => setLocation("/cultivation-material/pesticide"),
    handleComplete: () => setConfirmOpen(true),
    handleConfirmSubmit,
  };
}

function mapResponseToPesticide(item: any, certs: any[]): any {
  const profile = item.profile || {};
  return {
    id: item.id,
    code: item.sku || item.code,
    name: item.name,
    registrationNumber: item.registrationNumber,
    activeIngredient: profile.activeIngredient || "",
    concentration: profile.concentration || "",
    group:
      item.classifications?.find(
        (c: any) => c.classification === "target_group",
      )?.group?.name || "",
    form:
      item.classifications?.find((c: any) => c.classification === "dosage_form")
        ?.group?.name || "",
    toxicityLevel:
      item.classifications?.find((c: any) => c.classification === "toxicity")
        ?.group?.name ||
      (item.metadataJson && item.metadataJson?.toxicityLevel) ||
      "",
    moaGroup: profile.moaGroupCode || "",
    actionType:
      item.classifications?.find(
        (c: any) => c.classification === "mode_of_action",
      )?.group?.name || "",
    origin:
      item.classifications?.find((c: any) => c.classification === "origin")
        ?.group?.name ||
      (item.metadataJson && item.metadataJson?.origin) ||
      "",
    imageUrl:
      (item.metadataJson && item.metadataJson?.imageUrl) || item.imageUrl || "",
    formType: item.metadataJson?.formType || "basic",

    indications: profile.mainUsage || "",
    targetEntities: item.targetSubjects?.map((t: any) => t.name) || [],
    recommendedDosage: profile.recommendedDosage || "",
    applicationMethod: profile.usageMethod || "",
    phi: profile.withdrawalPeriodDays
      ? String(profile.withdrawalPeriodDays)
      : "",
    maxUsage: profile.maxUsageCount ? String(profile.maxUsageCount) : "",
    shelfLife: profile.shelfLife || "",
    usageNotes: profile.usageNotes || "",

    toxicityInfo: profile.toxicityDescription || "",
    protectiveMeasures: profile.protectiveMeasures || "",
    firstAid: profile.poisoningTreatment || "",
    legalStatus: item.legalStatus || "allowed",
    legalDescription: item.legalDescription || "",
    standardsCompliance:
      item.certificates
        ?.map(
          (c: any) =>
            c.certificate?.name ||
            certs.find((x: any) => x.id === c.certificateId)?.name,
        )
        .filter(Boolean) || [],

    manufacturerOrigin: item.manufacturerOrganization || null,
    importerRegistrant: item.importerOrganization || null,
    distributor: item.distributorOrganization || null,
    referencePrice: item.referencePrice || "",
    packagingSpecs: formatPackagingSpecs(item.packagingVariants) || [],
    hashtags: (item.hashtags || []).map((t: any) =>
      typeof t === "string"
        ? t.startsWith("#")
          ? t.slice(1)
          : t
        : String(t || ""),
    ),
    note: item.description || "",
  };
}
