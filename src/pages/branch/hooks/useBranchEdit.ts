import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBranchStore from "@/stores/useBranchStore";
import { getBranchLocationCode, getBranchLocationName } from "../utils/form";

function getInitialEditFormData(branch?: ReturnType<typeof useBranchStore.getState>["branches"][number]) {
  if (!branch) {
    return {
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
      description: "",
    };
  }

  let streetAddress = branch.address;
  if (branch.ward) {
    streetAddress = streetAddress
      .replace(`, ${branch.ward}`, "")
      .replace(`${branch.ward}, `, "");
  }
  if (branch.district) {
    streetAddress = streetAddress
      .replace(`, ${branch.district}`, "")
      .replace(`${branch.district}, `, "");
  }
  if (branch.city) {
    streetAddress = streetAddress
      .replace(`, ${branch.city}`, "")
      .replace(`${branch.city}`, "");
  }

  return {
    enterpriseId: "1",
    code: branch.code,
    name: branch.name,
    taxCode: branch.taxCode || "",
    taxAddress: branch.taxAddress || "",
    website: branch.website || "",
    phone: branch.phone,
    email: branch.email,
    address: streetAddress.trim(),
    province: getBranchLocationCode(branch.city, "province"),
    district: getBranchLocationCode(branch.district, "district"),
    ward: getBranchLocationCode(branch.ward, "ward"),
    description: "",
  };
}

export function useBranchEdit() {
  const [, params] = useRoute("/branch/:id/edit");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const branchId = params?.id ? parseInt(params.id) : undefined;
  const getBranchById = useBranchStore((state) => state.getBranchById);
  const updateBranch = useBranchStore((state) => state.updateBranch);
  const deleteBranch = useBranchStore((state) => state.deleteBranch);
  const branch = branchId ? getBranchById(branchId) : undefined;

  const [formData, setFormData] = useState(() => getInitialEditFormData(branch));

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !branchId) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }
    // Construct full address
    const fullAddress = [
      formData.address,
      getBranchLocationName(formData.ward, "ward"),
      getBranchLocationName(formData.district, "district"),
      getBranchLocationName(formData.province, "province"),
    ]
      .filter(Boolean)
      .join(", ");

    updateBranch(branchId, {
      code: formData.code,
      name: formData.name,
      taxCode: formData.taxCode,
      taxAddress: formData.taxAddress,
      website: formData.website,
      phone: formData.phone,
      email: formData.email,
      address: fullAddress || formData.address,
      city: getBranchLocationName(formData.province, "province"),
      district: getBranchLocationName(formData.district, "district"),
      ward: getBranchLocationName(formData.ward, "ward"),
    });

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật thông tin chi nhánh "${formData.name}"`,
    });
    setLocation("/branch");
  };

  const handleDelete = () => {
    if (branchId) {
      deleteBranch(branchId);
      toast({
        title: "Đã xóa",
        description: "Đã xóa chi nhánh khỏi hệ thống",
      });
      setLocation("/branch");
    }
  };

  return {
    branch,
    branchId: params?.id,
    formData,
    updateFormData,
    handleSubmit,
    handleDelete,
    handleCancel: () => setLocation("/branch"),
  };
}
