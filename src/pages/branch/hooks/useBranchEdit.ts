import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBranchStore from "@/stores/useBranchStore";

export function useBranchEdit() {
  const [, params] = useRoute("/branch/:id/edit");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const branchId = params?.id ? parseInt(params.id) : undefined;
  const getBranchById = useBranchStore((state) => state.getBranchById);
  const updateBranch = useBranchStore((state) => state.updateBranch);
  const deleteBranch = useBranchStore((state) => state.deleteBranch);
  const branch = branchId ? getBranchById(branchId) : undefined;

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
    description: "",
  });

  useEffect(() => {
    if (branch) {
      // Parse location data from branch
      const getLocationCode = (
        value: string | undefined,
        type: "province" | "district" | "ward",
      ) => {
        if (!value) return "";
        const maps = {
          province: { "TP.HCM": "hcm", "Hà Nội": "hn", "Đà Nẵng": "dn" },
          district: { "Quận 1": "q1", "Quận 3": "q3", "Ba Đình": "badinh" },
          ward: { "Phường 1": "p1", "Phường 2": "p2", "Kim Mã": "kimma" },
        };
        const map = maps[type] as Record<string, string>;
        return map[value] || "";
      };

      // Extract street address (remove ward, district, city)
      let streetAddress = branch.address;
      if (branch.ward)
        streetAddress = streetAddress
          .replace(`, ${branch.ward}`, "")
          .replace(`${branch.ward}, `, "");
      if (branch.district)
        streetAddress = streetAddress
          .replace(`, ${branch.district}`, "")
          .replace(`${branch.district}, `, "");
      if (branch.city)
        streetAddress = streetAddress
          .replace(`, ${branch.city}`, "")
          .replace(`${branch.city}`, "");

      setFormData({
        enterpriseId: "1", // Default to first enterprise for now
        code: branch.code,
        name: branch.name,
        taxCode: branch.taxCode || "",
        taxAddress: branch.taxAddress || "",
        website: branch.website || "",
        phone: branch.phone,
        email: branch.email,
        address: streetAddress.trim(),
        province: getLocationCode(branch.city, "province"),
        district: getLocationCode(branch.district, "district"),
        ward: getLocationCode(branch.ward, "ward"),
        description: "",
      });
    }
  }, [branch]);

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

    // Map location codes to names
    const getLocationName = (
      code: string,
      type: "province" | "district" | "ward",
    ) => {
      const maps = {
        province: { hcm: "TP.HCM", hn: "Hà Nội", dn: "Đà Nẵng" },
        district: { q1: "Quận 1", q3: "Quận 3", badinh: "Ba Đình" },
        ward: { p1: "Phường 1", p2: "Phường 2", kimma: "Kim Mã" },
      };
      return maps[type][code as keyof (typeof maps)[typeof type]] || "";
    };

    // Construct full address
    const fullAddress = [
      formData.address,
      getLocationName(formData.ward, "ward"),
      getLocationName(formData.district, "district"),
      getLocationName(formData.province, "province"),
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
      city: getLocationName(formData.province, "province"),
      district: getLocationName(formData.district, "district"),
      ward: getLocationName(formData.ward, "ward"),
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
