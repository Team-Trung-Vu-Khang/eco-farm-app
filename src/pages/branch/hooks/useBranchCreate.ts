import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBranchStore from "@/stores/useBranchStore";

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

    // Get enterprise name based on selected ID
    const enterpriseNames: Record<string, string> = {
      "1": "Công ty CP Nông nghiệp Xanh EcoFarm",
      "2": "HTX Rau sạch Thanh Hà",
      "3": "Nông hộ Nguyễn Văn A",
    };

    // Map province/district/ward codes to names
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

    const newBranch = {
      id: newId,
      code: formData.code || `CN${String(newId).padStart(3, "0")}`,
      name: formData.name,
      enterpriseName: enterpriseNames[formData.enterpriseId] || "",
      phone: formData.phone,
      email: formData.email,
      address: fullAddress || formData.address,
      city: getLocationName(formData.province, "province"),
      district: getLocationName(formData.district, "district"),
      ward: getLocationName(formData.ward, "ward"),
      status: "active" as const,
      createdAt: new Date().toISOString(),
      imageUrl: "",
      latitude: "10.7769",
      longitude: "106.7009",
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
