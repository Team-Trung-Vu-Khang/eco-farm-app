import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBranchStore from "@/stores/useBranchStore";
import { branchEnterpriseNames } from "../data/constants";
import { getBranchLocationName } from "../utils/form";

export function useBranchCreate() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const branches = useBranchStore((state) => state.branches);
  const addBranch = useBranchStore((state) => state.addBranch);

  const [formData, setFormData] = useState({
    enterpriseId: "",
    code: "",
    name: "",
    taxCode: "",
    taxAddress: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    latitude: "",
    longitude: "",
    description: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.enterpriseId) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSubmit = () => {
    // Generate new ID based on existing branches
    const newId =
      branches.length > 0 ? Math.max(...branches.map((b) => b.id)) + 1 : 1;

    // Construct full address
    const fullAddress = [
      formData.address,
      getBranchLocationName(formData.ward, "ward"),
      getBranchLocationName(formData.district, "district"),
      getBranchLocationName(formData.province, "province"),
    ]
      .filter(Boolean)
      .join(", ");

    const newBranch = {
      id: newId,
      code: formData.code || `CN${String(newId).padStart(3, "0")}`,
      name: formData.name,
      enterpriseName: branchEnterpriseNames[formData.enterpriseId] || "",
      phone: formData.phone,
      email: formData.email,
      address: fullAddress || formData.address,
      city: getBranchLocationName(formData.province, "province"),
      district: getBranchLocationName(formData.district, "district"),
      ward: getBranchLocationName(formData.ward, "ward"),
      status: "active" as const,
      createdAt: new Date().toISOString(),
      imageUrl: "",
      latitude: formData.latitude || "10.7769",
      longitude: formData.longitude || "106.7009",
      contacts: [],
      bankAccounts: [],
    };

    addBranch(newBranch);

    toast({
      title: "Thành công",
      description: `Đã tạo chi nhánh "${formData.name}"`,
    });
    setLocation("/branch");
  };

  return {
    formData,
    updateFormData,
    showConfirm,
    setShowConfirm,
    handleSubmit,
    handleConfirmSubmit,
    handleCancel: () => setLocation("/branch"),
  };
}
