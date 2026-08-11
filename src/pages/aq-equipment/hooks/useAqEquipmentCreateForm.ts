import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import useEquipmentStore from "../../../stores/useEquipmentStore";
import type { EquipmentFormData, SupplierDetail } from "../../equipment/types";

export function useAqEquipmentCreateForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute(
    "/aquaculture-material/equipment/:id/edit",
  );
  const isEdit = match && !!params?.id;
  const { toast } = useToast();

  const getEquipmentById = useEquipmentStore((state) => state.getEquipmentById);
  const addEquipment = useEquipmentStore((state) => state.addEquipment);
  const updateEquipment = useEquipmentStore((state) => state.updateEquipment);

  const [formData, setFormData] = useState<EquipmentFormData>({
    code: "",
    name: "",
    technologyLevelId: "",
    valueChainId: "",
    financialManagementId: "",
    status: "active",
    maintainanceInterval: "",
    description: "",
    technicalDocType: "file",
    technicalDocContent: "",
    supplierDetails: [],

    // New fields
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
    manufacturerOrigin: [],
    importerRegistrant: [],
    distributor: [],
    referencePrice: "",
    packagingSpecs: [],
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tempSupplier, setTempSupplier] = useState<SupplierDetail>({
    supplierId: "",
    quantity: "",
    unit: "",
    warranty: "",
  });

  useEffect(() => {
    if (isEdit && params?.id) {
      const item = getEquipmentById(Number(params.id));
      if (item) {
        setFormData({
          code: item.code,
          name: item.name,
          technologyLevelId: item.technologyLevelId,
          valueChainId: item.valueChainId,
          financialManagementId: item.financialManagementId,
          status: item.status,
          maintainanceInterval: item.maintainanceInterval,
          description: item.description,
          technicalDocType: item.technicalDocType || "file",
          technicalDocContent: item.technicalDocContent || "",
          supplierDetails: item.supplierDetails || [],

          // Hydrate new fields
          sku: item.sku || item.code || "",
          machineName: item.machineName || item.name || "",
          model: item.model || "",
          productImage: item.productImage || "",
          manufacturer: item.manufacturer || "",
          countryOfOrigin: item.countryOfOrigin || "",
          manufactureYear: item.manufactureYear || "",
          technologyLevelGroup: item.technologyLevelGroup || item.technologyLevelId || "",
          assetManagementGroup: item.assetManagementGroup || item.financialManagementId || "",
          valueChainGroup: item.valueChainGroup || (item.valueChainId ? [item.valueChainId] : []),
          machineType: item.machineType || [],
          powerCapacity: item.powerCapacity || "",
          workingCapacity: item.workingCapacity || "",
          fuelEnergyType: item.fuelEnergyType || "Dầu diesel",
          dimensions: item.dimensions || "",
          weight: item.weight || "",
          otherSpecifications: item.otherSpecifications || "",
          fuelConsumptionRate: item.fuelConsumptionRate || "",
          maintenanceSchedule: item.maintenanceSchedule || item.maintainanceInterval || "",
          mainAccessories: item.mainAccessories || "",
          manufacturerOrigin: item.manufacturerOrigin || [],
          importerRegistrant: item.importerRegistrant || [],
          distributor: item.distributor || [],
          referencePrice: item.referencePrice || "",
          packagingSpecs: item.packagingSpecs || [],
        });
      }
    }
  }, [isEdit, params?.id, getEquipmentById]);

  const updateField = (field: keyof EquipmentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSupplierItem = () => {
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
    setFormData((prev) => ({
      ...prev,
      supplierDetails: [...prev.supplierDetails, tempSupplier],
    }));
    setTempSupplier({ supplierId: "", quantity: "", unit: "", warranty: "" });
  };

  const removeSupplierItem = (index: number) => {
    setFormData((prev) => {
      const newDetails = [...prev.supplierDetails];
      newDetails.splice(index, 1);
      return { ...prev, supplierDetails: newDetails };
    });
  };

  const handleConfirmSubmit = () => {
    const payload = {
      // Sync legacy fields
      code: formData.sku,
      name: formData.machineName,
      technologyLevelId: formData.technologyLevelGroup,
      financialManagementId: formData.assetManagementGroup,
      valueChainId: formData.valueChainGroup[0] || "",
      maintainanceInterval: formData.maintenanceSchedule,
      status: formData.status as any,
      description: formData.description,
      technicalDocType: formData.technicalDocType,
      technicalDocContent: formData.technicalDocContent,
      supplierDetails: formData.supplierDetails,

      // New fields
      sku: formData.sku,
      machineName: formData.machineName,
      model: formData.model,
      productImage: formData.productImage,
      manufacturer: formData.manufacturer,
      countryOfOrigin: formData.countryOfOrigin,
      manufactureYear: formData.manufactureYear === "" ? undefined : Number(formData.manufactureYear),
      technologyLevelGroup: formData.technologyLevelGroup,
      assetManagementGroup: formData.assetManagementGroup,
      valueChainGroup: formData.valueChainGroup,
      machineType: formData.machineType,
      powerCapacity: formData.powerCapacity,
      workingCapacity: formData.workingCapacity,
      fuelEnergyType: formData.fuelEnergyType,
      dimensions: formData.dimensions,
      weight: formData.weight,
      otherSpecifications: formData.otherSpecifications,
      fuelConsumptionRate: formData.fuelConsumptionRate,
      maintenanceSchedule: formData.maintenanceSchedule,
      mainAccessories: formData.mainAccessories,
      manufacturerOrigin: formData.manufacturerOrigin,
      importerRegistrant: formData.importerRegistrant,
      distributor: formData.distributor,
      referencePrice: formData.referencePrice,
      packagingSpecs: formData.packagingSpecs,
    };

    if (isEdit && params?.id) {
      updateEquipment(Number(params.id), payload);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin thiết bị thủy sản",
      });
    } else {
      addEquipment(payload);
      toast({ title: "Thành công", description: "Đã thêm mới thiết bị thủy sản" });
    }
    setConfirmOpen(false);
    setLocation("/aquaculture-material/equipment");
  };

  return {
    isEdit,
    formData,
    updateField,
    tempSupplier,
    setTempSupplier,
    addSupplierItem,
    removeSupplierItem,
    confirmOpen,
    setConfirmOpen,
    handleConfirmSubmit,
    navigateBack: () => setLocation("/aquaculture-material/equipment"),
  };
}
