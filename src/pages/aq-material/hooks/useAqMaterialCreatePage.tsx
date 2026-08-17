import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useQueryClient } from "@tanstack/react-query";
import MaterialBasicInfoStep from "../../material/components/MaterialBasicInfoStep";
import MaterialConfirmStep from "../../material/components/MaterialConfirmStep";
import MaterialSuppliersStep from "../../material/components/MaterialSuppliersStep";
import type { MaterialFormData } from "../../material/types/types";
import {
  createEmptyMaterialFormData,
  createMaterialFormDataFromItem,
} from "../../material/utils/form";
import {
  farmSupplyApi,
  parsePackagingSpecs,
  formatPackagingSpecs,
} from "@/features/farm-supply";
import { useImageUploadWithCache } from "@/features/storage/hooks/useImageUploadWithCache";
import { z } from "zod";

const materialSchema = z.object({
  name: z.string().trim().min(1),
  technologyLevelId: z.string().trim().min(1),
  valueChainId: z.string().trim().min(1),
});

export function useAqMaterialCreatePage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/aquaculture-material/material/:id/edit");
  const isEdit = match && !!params?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { uploadImage } = useImageUploadWithCache();

  const [formData, setFormData] = useState<MaterialFormData>(() =>
    createEmptyMaterialFormData(),
  );
  const [paramHashtag, setParamHashtag] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // Metadata states
  const [packagingTypes, setPackagingTypes] = useState<any[]>([]);
  const [baseUnits, setBaseUnits] = useState<any[]>([]);
  const [allGroups, setAllGroups] = useState<any[]>([]);

  const updateField = <K extends keyof MaterialFormData>(
    field: K,
    value: MaterialFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      farmSupplyApi.listPackagingTypes(),
      farmSupplyApi.listBaseUnits(),
      farmSupplyApi.getClassificationGroups("material"),
    ])
      .then(([pkgs, units, groups]) => {
        setPackagingTypes(pkgs);
        setBaseUnits(units);
        setAllGroups(groups);

        if (isEdit && params?.id) {
          return farmSupplyApi
            .getById("material", Number(params.id), "OWNER")
            .then((item) => {
              const mapped = mapResponseToMaterial(item);
              setIsDetailMode(mapped.formType === "advanced");
              setFormData(createMaterialFormDataFromItem(mapped));
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

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    try {
      const uploadedImageUrl = await uploadImage(
        formData.imageUrl || "",
        formData.imageFile,
        "material",
      );

      // Dynamic Classifications matching
      const classifications: any[] = [];
      const addClass = (classKey: string, name: string) => {
        if (!name) return;
        const matched = allGroups.find(
          (g) =>
            g.classification === classKey &&
            (g.code?.toLowerCase() === name.toLowerCase() ||
              g.name?.toLowerCase() === name.toLowerCase()),
        );
        if (matched) {
          classifications.push({
            classification: classKey,
            groupId: matched.id,
            displayOrder: 0,
          });
        }
      };

      addClass("technology_level", formData.technologyLevelId);
      addClass("value_chain", formData.valueChainId);

      const generatedSku =
        formData.code?.trim() ||
        `AQVL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      updateField("code", generatedSku);

      const payload: any = {
        name: formData.name,
        sku: generatedSku,
        description: formData.description,
        displayOrder: 10,
        status: "active",
        domainCode: "AQUACULTURE",
        manufacturerOrganizationId: formData.manufacturerOrigin?.id || null,
        importerOrganizationId: formData.importerRegistrant?.id || null,
        distributorOrganizationId: formData.distributor?.id || null,
        hashtags: formData.hashtags || [],
        imageUrl: uploadedImageUrl || undefined,
        metadataJson: {
          formType: isDetailMode ? "advanced" : "basic",
        },
        packagingVariants: parsePackagingSpecs(
          formData.packagingSpecs || [],
          packagingTypes,
          baseUnits,
        ),
        classifications,
      };

      if (isEdit && params?.id) {
        await farmSupplyApi.update("material", Number(params.id), payload);
        toast({
          title: "Thành công",
          description: "Đã cập nhật thông tin vật tư thành công",
        });
      } else {
        await farmSupplyApi.create("material", payload);
        toast({
          title: "Thành công",
          description: "Đã thêm mới vật tư thành công",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["farm-supplies"] });
      setLocation("/aquaculture-material/material");
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
      isValid: materialSchema.safeParse(formData).success,
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
      isValid: true,
    },
    {
      id: "confirm",
      title: "Xác nhận",
      content: <MaterialConfirmStep formData={formData} />,
      isValid: true,
    },
  ];

  return {
    isEdit,
    formData,
    updateField,
    confirmOpen,
    setConfirmOpen,
    steps,
    loading,
    submitting,
    isDetailMode,
    setIsDetailMode,
    goBack: () => setLocation("/aquaculture-material/material"),
    handleComplete: () => setConfirmOpen(true),
    handleConfirmSubmit,
  };
}

function mapResponseToMaterial(item: any): any {
  return {
    id: item.id,
    code: item.sku || item.code,
    name: item.name,
    description: item.description || "",
    status: item.status || "active",
    technologyLevelId:
      item.classifications
        ?.find((c: any) => c.classification === "technology_level")
        ?.group?.code?.toLowerCase() ||
      item.classifications
        ?.find((c: any) => c.classification === "technology_level")
        ?.group?.name?.toLowerCase() ||
      "",
    valueChainId:
      item.classifications
        ?.find((c: any) => c.classification === "value_chain")
        ?.group?.code?.toLowerCase() ||
      item.classifications
        ?.find((c: any) => c.classification === "value_chain")
        ?.group?.name?.toLowerCase() ||
      "",
    materialGroupId:
      item.classifications?.[0]?.group?.code?.toLowerCase() ||
      item.classifications?.[0]?.group?.name?.toLowerCase() ||
      "",
    manufacturerOrigin: item.manufacturerOrganization || null,
    importerRegistrant: item.importerOrganization || null,
    distributor: item.distributorOrganization || null,
    packagingSpecs: formatPackagingSpecs(item.packagingVariants) || [],
    hashtags: item.hashtags || [],
    imageUrl: item.metadataJson?.imageUrl || item.imageUrl || "",
    formType: item.metadataJson?.formType || "basic",
  };
}
