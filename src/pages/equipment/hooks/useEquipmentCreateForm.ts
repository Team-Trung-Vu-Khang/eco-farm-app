import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import useEquipmentStore from "../../../stores/useEquipmentStore";
import type { EquipmentFormData, SupplierDetail } from "../types";

export function useEquipmentCreateForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/cultivation-material/equipment/:id/edit");
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
        setFormData((prev) => ({
          ...prev,
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
        }));
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
    if (isEdit && params?.id) {
      updateEquipment(Number(params.id), {
        code: formData.code,
        name: formData.name,
        technologyLevelId: formData.technologyLevelId,
        valueChainId: formData.valueChainId,
        financialManagementId: formData.financialManagementId,
        status: formData.status as any,
        description: formData.description,
        maintainanceInterval: formData.maintainanceInterval,
        technicalDocType: formData.technicalDocType,
        technicalDocContent: formData.technicalDocContent,
        supplierDetails: formData.supplierDetails,
      });
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin thiết bị",
      });
    } else {
      addEquipment({
        code: formData.code,
        name: formData.name,
        technologyLevelId: formData.technologyLevelId,
        valueChainId: formData.valueChainId,
        financialManagementId: formData.financialManagementId,
        status: formData.status as any,
        description: formData.description,
        maintainanceInterval: formData.maintainanceInterval,
        technicalDocType: formData.technicalDocType,
        technicalDocContent: formData.technicalDocContent,
        supplierDetails: formData.supplierDetails,
      });
      toast({ title: "Thành công", description: "Đã thêm mới thiết bị" });
    }
    setConfirmOpen(false);
    setLocation("/cultivation-material/equipment");
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
    navigateBack: () => setLocation("/cultivation-material/equipment"),
  };
}
