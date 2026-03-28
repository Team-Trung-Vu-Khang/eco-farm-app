import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  emptyOrganizationFormData,
  emptyStandardFormData,
  initialOrganizations,
  initialStandards,
} from "../data/constants";
import type {
  CategoryType,
  Certificate,
  CertificationOrganization,
  OrganizationFormData,
  StandardFormData,
} from "../types/types";

export function useCertificate() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CategoryType>("standards");

  const [organizations, setOrganizations] =
    useState<CertificationOrganization[]>(initialOrganizations);

  const [standards, setStandards] = useState<Certificate[]>(initialStandards);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<
    Certificate | CertificationOrganization | null
  >(null);

  // Form states for Standards
  const [standardFormOpen, setStandardFormOpen] = useState(false);
  const [editStandard, setEditStandard] = useState<Certificate | null>(null);
  const [standardFormData, setStandardFormData] =
    useState<StandardFormData>(emptyStandardFormData);

  // Form states for Organizations
  const [orgFormOpen, setOrgFormOpen] = useState(false);
  const [editOrg, setEditOrg] = useState<CertificationOrganization | null>(null);
  const [orgFormData, setOrgFormData] =
    useState<OrganizationFormData>(emptyOrganizationFormData);

  const [orgSearchQuery, setOrgSearchQuery] = useState("");

  const handleAddStandard = () => {
    setEditStandard(null);
    setStandardFormData(emptyStandardFormData);
    setOrgSearchQuery("");
    setStandardFormOpen(true);
  };

  const handleEditStandard = (item: Certificate) => {
    setEditStandard(item);
    setStandardFormData({ ...item });
    setOrgSearchQuery("");
    setStandardFormOpen(true);
  };

  const handleSubmitStandard = () => {
    if (editStandard) {
      setStandards((prev) =>
        prev.map((s) =>
          s.id === editStandard.id ? { ...s, ...standardFormData } : s,
        ),
      );
      toast({ title: "Thành công", description: "Đã cập nhật loại tiêu chuẩn" });
    } else {
      const newStandard: Certificate = {
        id: Date.now(),
        ...standardFormData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setStandards((prev) => [...prev, newStandard]);
      toast({ title: "Thành công", description: "Đã thêm loại tiêu chuẩn mới" });
    }
    setStandardFormOpen(false);
  };

  const handleAddOrg = () => {
    setEditOrg(null);
    setOrgFormData(emptyOrganizationFormData);
    setOrgFormOpen(true);
  };

  const handleEditOrg = (item: CertificationOrganization) => {
    setEditOrg(item);
    setOrgFormData({ ...item });
    setOrgFormOpen(true);
  };

  const handleSubmitOrg = () => {
    if (editOrg) {
      setOrganizations((prev) =>
        prev.map((o) => (o.id === editOrg.id ? { ...o, ...orgFormData } : o)),
      );
      toast({ title: "Thành công", description: "Đã cập nhật tổ chức" });
    } else {
      const newOrg: CertificationOrganization = {
        id: Date.now(),
        ...orgFormData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setOrganizations((prev) => [...prev, newOrg]);
      toast({ title: "Thành công", description: "Đã thêm tổ chức mới" });
    }
    setOrgFormOpen(false);
  };

  const handleDelete = (item: Certificate | CertificationOrganization) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      if (activeTab === "standards") {
        setStandards((prev) => prev.filter((s) => s.id !== deleteItem.id));
        toast({ title: "Thành công", description: "Đã xóa loại tiêu chuẩn" });
      } else {
        setOrganizations((prev) => prev.filter((o) => o.id !== deleteItem.id));
        toast({ title: "Thành công", description: "Đã xóa tổ chức" });
      }
    }
    setDeleteOpen(false);
  };

  return {
    activeTab,
    setActiveTab,
    standards,
    organizations,
    standardFormOpen,
    setStandardFormOpen,
    orgFormOpen,
    setOrgFormOpen,
    standardFormData,
    setStandardFormData,
    orgFormData,
    setOrgFormData,
    editStandard,
    editOrg,
    orgSearchQuery,
    setOrgSearchQuery,
    deleteOpen,
    setDeleteOpen,
    handleAddStandard,
    handleEditStandard,
    handleSubmitStandard,
    handleAddOrg,
    handleEditOrg,
    handleSubmitOrg,
    handleDelete,
    handleConfirmDelete,
  };
}
