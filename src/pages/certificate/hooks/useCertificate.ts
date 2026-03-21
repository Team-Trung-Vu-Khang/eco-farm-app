import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export interface CertificationOrganization {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Certificate {
  id: number;
  code: string;
  name: string;
  organizationIds: number[];
  content: string;
  contentType: "editor" | "file";
  fileUrl?: string;
  stampUrl?: string;
  stampType: "url" | "file";
  stampFileUrl?: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export type CategoryType = "standards" | "organizations";

export function useCertificate() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CategoryType>("standards");

  // Mock data for Organizations
  const [organizations, setOrganizations] = useState<CertificationOrganization[]>([
    {
      id: 1,
      code: "ORG001",
      name: "Bộ Nông nghiệp và Phát triển Nông thôn",
      address: "2 Ngọc Hà, Ba Đình, Hà Nội",
      phone: "024 3843 3141",
      email: "mard@mard.gov.vn",
      website: "https://www.mard.gov.vn",
      description: "Cơ quan quản lý nhà nước về nông nghiệp",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      code: "ORG002",
      name: "Cục Trồng trọt",
      address: "2 Ngọc Hà, Ba Đình, Hà Nội",
      phone: "024 3733 9775",
      email: "cuctrongtrot@mard.gov.vn",
      website: "https://www.cuctrongtrot.gov.vn",
      description: "Cơ quan chuyên môn thuộc Bộ NN&PTNT",
      status: "active",
      createdAt: "2024-01-02",
    },
    {
      id: 3,
      code: "ORG003",
      name: "Tổ chức GlobalGAP",
      address: "Germany",
      phone: "+49 221 57993 0",
      email: "info@globalgap.org",
      website: "https://www.globalgap.org",
      description: "Tổ chức tiêu chuẩn nông nghiệp toàn cầu",
      status: "active",
      createdAt: "2024-01-03",
    },
  ]);

  // Mock data for Standards
  const [standards, setStandards] = useState<Certificate[]>([
    {
      id: 1,
      code: "CH001",
      name: "Global GAP",
      organizationIds: [3],
      content: "Chứng nhận thực hành nông nghiệp tốt toàn cầu",
      contentType: "editor",
      stampUrl: "https://lifarm.vn/wp-content/uploads/2025/03/globalgap-1.png",
      stampType: "url",
      description: "Tiêu chuẩn về thực hành nông nghiệp tốt",
      status: "active",
      createdAt: "2024-01-10",
    },
  ]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Certificate | CertificationOrganization | null>(null);

  // Form states for Standards
  const [standardFormOpen, setStandardFormOpen] = useState(false);
  const [editStandard, setEditStandard] = useState<Certificate | null>(null);
  const [standardFormData, setStandardFormData] = useState<Omit<Certificate, "id" | "createdAt">>({
    code: "",
    name: "",
    organizationIds: [],
    content: "",
    contentType: "editor",
    fileUrl: "",
    stampUrl: "",
    stampType: "url",
    stampFileUrl: "",
    description: "",
    status: "active",
  });

  // Form states for Organizations
  const [orgFormOpen, setOrgFormOpen] = useState(false);
  const [editOrg, setEditOrg] = useState<CertificationOrganization | null>(null);
  const [orgFormData, setOrgFormData] = useState<Omit<CertificationOrganization, "id" | "createdAt">>({
    code: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    status: "active",
  });

  const [orgSearchQuery, setOrgSearchQuery] = useState("");

  const handleAddStandard = () => {
    setEditStandard(null);
    setStandardFormData({
      code: "",
      name: "",
      organizationIds: [],
      content: "",
      contentType: "editor",
      fileUrl: "",
      stampUrl: "",
      stampType: "url",
      stampFileUrl: "",
      description: "",
      status: "active",
    });
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
      setStandards((prev) => prev.map((s) => (s.id === editStandard.id ? { ...s, ...standardFormData } : s)));
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
    setOrgFormData({
      code: "",
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      description: "",
      status: "active",
    });
    setOrgFormOpen(true);
  };

  const handleEditOrg = (item: CertificationOrganization) => {
    setEditOrg(item);
    setOrgFormData({ ...item });
    setOrgFormOpen(true);
  };

  const handleSubmitOrg = () => {
    if (editOrg) {
      setOrganizations((prev) => prev.map((o) => (o.id === editOrg.id ? { ...o, ...orgFormData } : o)));
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
