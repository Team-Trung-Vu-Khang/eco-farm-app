import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBranchStore from "@/stores/useBranchStore";
import { branchEnterpriseNames } from "../data/constants";
import { getBranchLocationName } from "../utils/form";
import type { ContactInfo } from "../types/types";

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
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([]);
  const [newContactInfo, setNewContactInfo] = useState<ContactInfo>({
    id: "",
    contactId: "",
    phone: "",
    email: "",
    isPrimary: false,
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const syncPrimaryContact = (nextContacts: ContactInfo[]) => {
    const primaryContact = nextContacts.find((contact) => contact.isPrimary);

    setFormData((prev) => ({
      ...prev,
      phone: primaryContact?.phone || "",
      email: primaryContact?.email || "",
    }));
  };

  const addContactInfo = () => {
    if (!newContactInfo.phone && !newContactInfo.email) return;

    const nextContacts: ContactInfo[] = [
      ...contactInfos,
      {
        ...newContactInfo,
        id: Date.now().toString(),
        contactId: newContactInfo.contactId || undefined,
        isPrimary: contactInfos.length === 0 || newContactInfo.isPrimary,
      },
    ].map((contact, index, list) => ({
      ...contact,
      isPrimary:
        contact.isPrimary || (list.length > 0 && index === 0 && contactInfos.length === 0),
    }));

    if (!nextContacts.some((contact) => contact.isPrimary) && nextContacts[0]) {
      nextContacts[0].isPrimary = true;
    }

    setContactInfos(nextContacts);
    syncPrimaryContact(nextContacts);
    setNewContactInfo({
      id: "",
      contactId: "",
      phone: "",
      email: "",
      isPrimary: false,
    });
  };

  const removeContactInfo = (id: string) => {
    const nextContacts = contactInfos.filter((contact) => contact.id !== id);
    if (nextContacts.length === 0) {
      setFormData((prev) => ({ ...prev, phone: "", email: "" }));
      setContactInfos([]);
      return;
    }

    if (!nextContacts.some((contact) => contact.isPrimary)) {
      nextContacts[0] = { ...nextContacts[0], isPrimary: true };
    }

    setContactInfos(nextContacts);
    syncPrimaryContact(nextContacts);
  };

  const setPrimaryContactInfo = (id: string) => {
    const nextContacts = contactInfos.map((contact) => ({
      ...contact,
      isPrimary: contact.id === id,
    }));

    setContactInfos(nextContacts);
    syncPrimaryContact(nextContacts);
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
      phone: contactInfos.find((contact) => contact.isPrimary)?.phone || formData.phone,
      email: contactInfos.find((contact) => contact.isPrimary)?.email || formData.email,
      address: fullAddress || formData.address,
      city: getBranchLocationName(formData.province, "province"),
      district: getBranchLocationName(formData.district, "district"),
      ward: getBranchLocationName(formData.ward, "ward"),
      status: "active" as const,
      createdAt: new Date().toISOString(),
      imageUrl: "",
      latitude: formData.latitude || "10.7769",
      longitude: formData.longitude || "106.7009",
      contacts: contactInfos.map((contact, index) => ({
        id: contact.contactId || contact.id || String(index + 1),
        name: `Liên hệ ${index + 1}`,
        position: "Liên hệ",
        phone: contact.phone,
        email: contact.email,
        isPrimary: contact.isPrimary,
      })),
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
    contactInfos,
    newContactInfo,
    setNewContactInfo,
    addContactInfo,
    removeContactInfo,
    setPrimaryContactInfo,
    showConfirm,
    setShowConfirm,
    handleSubmit,
    handleConfirmSubmit,
    handleCancel: () => setLocation("/branch"),
  };
}
