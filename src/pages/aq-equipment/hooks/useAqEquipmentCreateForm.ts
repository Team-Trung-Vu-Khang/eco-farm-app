import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import type { EquipmentFormData, SupplierDetail } from "../../equipment/types";
import {
  farmSupplyApi,
  parsePackagingSpecs,
  formatPackagingSpecs,
} from "@/features/farm-supply";
import { useImageUploadWithCache } from "@/features/storage/hooks/useImageUploadWithCache";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const equipmentSchema = z.object({
  machineName: z.string().trim().min(1),
  sku: z.string().trim().min(1),
});

export function useAqEquipmentCreateForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/aquaculture-material/equipment/:id/edit");
  const isEdit = match && !!params?.id;
  const { toast } = useToast();
  const { uploadImage } = useImageUploadWithCache();
  const queryClient = useQueryClient();

  const [isDetailMode, setIsDetailMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [formData, setFormData] = useState<EquipmentFormData>({
    code: "",
    name: "",
    imageFile: null,
    technologyLevelId: "",
    valueChainId: "",
    financialManagementId: "",
    status: "active",
    maintainanceInterval: "",
    description: "",
    technicalDocType: "file",
    technicalDocContent: "",
    supplierDetails: [],

    sku: "",
    machineName: "",
    model: "",
    productImage: "",
    manufacturer: "",
    countryOfOrigin: "",
    manufactureYear: "",
    technologyLevelGroup: "",
    assetManagementGroup: "",
    valueChainGroup: [],
    machineType: [],
    powerCapacity: "",
    workingCapacity: "",
    fuelEnergyType: "Dầu diesel",
    dimensions: "",
    weight: "",
    otherSpecifications: "",
    fuelConsumptionRate: "",
    maintenanceSchedule: "",
    mainAccessories: "",
    manufacturerOrigin: null,
    importerRegistrant: null,
    distributor: null,
    referencePrice: "",
    packagingSpecs: [],
    hashtags: [],
  });
  const [tempSupplier, setTempSupplier] = useState<SupplierDetail>({
    supplierId: "",
    quantity: "",
    unit: "",
    warranty: "",
  });

  // Metadata states
  const [packagingTypes, setPackagingTypes] = useState<any[]>([]);
  const [baseUnits, setBaseUnits] = useState<any[]>([]);
  const [allGroups, setAllGroups] = useState<any[]>([]);

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
            .getById("equipment", Number(params.id), "OWNER")
            .then((item) => {
              const mapped = mapResponseToEquipment(item);
              setIsDetailMode(mapped.formType === "advanced");
              setFormData(mapped);
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

  const updateField = (field: keyof EquipmentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSupplierItem = () => {
    if (!tempSupplier.supplierId) return;
    setFormData((prev) => ({
      ...prev,
      supplierDetails: [...(prev.supplierDetails || []), tempSupplier],
    }));
    setTempSupplier({ supplierId: "", quantity: "", unit: "", warranty: "" });
  };

  const removeSupplierItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      supplierDetails: (prev.supplierDetails || []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const resetForm = () => {
    setFormData((prev) => ({ ...prev, sku: "" }));
  };

  const handleConfirmSubmit = async () => {
    const generatedSku =
      formData.sku?.trim() ||
      `AQEQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    updateField("sku", generatedSku);
    updateField("code", generatedSku);

    setSubmitting(true);
    // Dynamic Classifications matching
    const classifications: any[] = [];
    const addClass = (classKey: string, name: string) => {
      if (!name) return;
      const matched = allGroups.find(
        (g) =>
          g.classification === classKey &&
          (g.name.toLowerCase() === name.toLowerCase() ||
            g.code.toLowerCase() === name.toLocaleLowerCase()),
      );
      if (matched) {
        classifications.push({
          classification: classKey,
          groupId: matched.id,
          displayOrder: classifications.length,
        });
      }
    };

    addClass("technology_level", formData.technologyLevelGroup);
    addClass("financial_aspect", formData.assetManagementGroup);
    formData.valueChainGroup.forEach((chain) => {
      addClass("value_chain", chain);
    });

    try {
      const uploadedImageUrl = await uploadImage(
        formData.productImage || "",
        formData.imageFile,
        "equipment",
      );

      const payload: any = {
        name: formData.machineName,
        sku: generatedSku,
        description: formData.description,
        displayOrder: 10,
        status: formData.status === "maintenance" ? "inactive" : "active",
        domainCode: "AQUACULTURE",
        manufacturerOrganizationId: formData.manufacturerOrigin?.id || null,
        importerOrganizationId: formData.importerRegistrant?.id || null,
        distributorOrganizationId: formData.distributor?.id || null,
        referencePrice: formData.referencePrice || undefined,
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

        // Profile details
        model: formData.model || undefined,
        brand: formData.manufacturer || undefined,
        countryOfOrigin: formData.countryOfOrigin || undefined,
        manufactureYear: formData.manufactureYear
          ? Number(formData.manufactureYear)
          : undefined,
        powerRating: formData.powerCapacity || undefined,
        capacity: formData.workingCapacity || undefined,
        fuelType: formData.fuelEnergyType || undefined,
        dimensions: formData.dimensions || undefined,
        weight: formData.weight || undefined,
        otherSpecs: formData.otherSpecifications || undefined,
        fuelConsumptionRate: formData.fuelConsumptionRate || undefined,
        maintenanceSchedule: formData.maintenanceSchedule || undefined,
        includedParts: formData.mainAccessories || undefined,
        typeTags: formData.machineType || [],
      };

      if (isEdit && params?.id) {
        await farmSupplyApi.update("equipment", Number(params.id), payload);
        toast({
          title: "Thành công",
          description: "Đã cập nhật thông tin thiết bị thành công",
        });
      } else {
        await farmSupplyApi.create("equipment", payload);
        toast({
          title: "Thành công",
          description: "Đã thêm mới thiết bị thành công",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["farm-supplies"] });
      setLocation("/aquaculture-material/equipment");
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

  return {
    isEdit,
    formData,
    updateField,
    resetForm,
    tempSupplier,
    setTempSupplier,
    addSupplierItem,
    removeSupplierItem,
    confirmOpen,
    setConfirmOpen,
    handleConfirmSubmit,
    navigateBack: () => setLocation("/aquaculture-material/equipment"),
    loading,
    submitting,
    isDetailMode,
    setIsDetailMode,
    isValidStep1: equipmentSchema.safeParse(formData).success,
  };
}

function mapResponseToEquipment(item: any): any {
  const profile = item.profile || {};
  return {
    id: item.id,
    code: item.code || "",
    name: item.name || "",
    sku: item.sku || item.code || "",
    machineName: item.name || "",
    model: profile.model || "",
    productImage: item.imageUrl || item.metadataJson?.imageUrl || "",
    manufacturer: profile.brand || item.manufacturer || "",
    countryOfOrigin: profile.countryOfOrigin || "",
    manufactureYear: profile.manufactureYear
      ? String(profile.manufactureYear)
      : "",
    technologyLevelGroup:
      item.classifications?.find(
        (c: any) => c.classification === "technology_level",
      )?.group?.code || "",
    assetManagementGroup:
      item.classifications?.find(
        (c: any) => c.classification === "financial_aspect",
      )?.group?.code || "",
    valueChainGroup:
      item.classifications
        ?.filter((c: any) => c.classification === "value_chain")
        ?.map((c: any) => c.group?.code) || [],
    machineType: profile.typeTags || [],
    powerCapacity: profile.powerRating || "",
    workingCapacity: profile.capacity || "",
    fuelEnergyType: profile.fuelType || "Dầu diesel",
    dimensions: profile.dimensions || "",
    weight: profile.weight || "",
    otherSpecifications: profile.otherSpecs || "",
    fuelConsumptionRate: profile.fuelConsumptionRate || "",
    maintenanceSchedule: profile.maintenanceSchedule || "",
    mainAccessories: profile.includedParts || "",
    manufacturerOrigin: item.manufacturerOrganization || null,
    importerRegistrant: item.importerOrganization || null,
    distributor: item.distributorOrganization || null,
    referencePrice: item.referencePrice || "",
    packagingSpecs: formatPackagingSpecs(item.packagingVariants) || [],
    hashtags: item.hashtags || [],
    status: item.status || "active",
    description: item.description || "",
    formType: item.metadataJson?.formType || "basic",
    technicalDocType: "file",
    technicalDocContent: "",
    supplierDetails: [],
  };
}
