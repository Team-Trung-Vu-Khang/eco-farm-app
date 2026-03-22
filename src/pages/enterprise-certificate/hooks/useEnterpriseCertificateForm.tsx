import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useRef, useState } from "react";
import useEnterpriseCertificateStore, {
  type EnterpriseCertificate,
} from "../../../stores/useEnterpriseCertificateStore";

export function useEnterpriseCertificateForm() {
  const { toast } = useToast();
  const editorContentRef = useRef<string>("");

  // Zustand store
  const certificates = useEnterpriseCertificateStore((state) => state.certificates);
  const standards = useEnterpriseCertificateStore((state) => state.standards);
  const enterprises = useEnterpriseCertificateStore((state) => state.enterprises);
  const areas = useEnterpriseCertificateStore((state) => state.areas);
  const addCertificate = useEnterpriseCertificateStore((state) => state.addCertificate);
  const updateCertificate = useEnterpriseCertificateStore((state) => state.updateCertificate);
  const deleteCertificate = useEnterpriseCertificateStore((state) => state.deleteCertificate);
  const calculateStatus = useEnterpriseCertificateStore((state) => state.calculateStatus);

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<EnterpriseCertificate | null>(null);
  const [deleteItem, setDeleteItem] = useState<EnterpriseCertificate | null>(null);
  const [availableOrganizations, setAvailableOrganizations] = useState<string[]>([]);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("");

  const [formData, setFormData] = useState<Omit<EnterpriseCertificate, "id" | "createdAt" | "status">>({
    code: "",
    name: "",
    standardType: "",
    organization: "",
    issuedDate: "",
    expiryDate: "",
    entityType: "enterprise",
    entityId: "",
    entityName: "",
    content: "",
    contentType: "editor",
    fileUrl: "",
    attachments: [],
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: "all",
    standardType: "all",
    entityType: "all",
  });

  const filteredData = certificates.filter((item) => {
    if (filters.status !== "all" && item.status !== filters.status) return false;
    if (filters.standardType !== "all" && item.standardType !== filters.standardType) return false;
    if (filters.entityType !== "all" && item.entityType !== filters.entityType) return false;
    return true;
  });

  const handleStandardTypeChange = (value: string) => {
    const selectedStandard = standards.find((s) => s.code === value);
    const orgs = selectedStandard?.organizations || [];
    setAvailableOrganizations(orgs);
    setFormData((prev) => ({
      ...prev,
      standardType: value,
      organization: orgs.length === 1 ? orgs[0] : "",
    }));
  };

  const handleEnterpriseSelect = (enterpriseId: string) => {
    const selectedEnterprise = enterprises.find((e) => e.id === enterpriseId);
    if (selectedEnterprise) {
      setSelectedEnterpriseId(enterpriseId);
      if (formData.entityType === "enterprise") {
        setFormData((prev) => ({
          ...prev,
          entityId: selectedEnterprise.code,
          entityName: selectedEnterprise.name,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          entityId: "",
          entityName: "",
        }));
      }
    }
  };

  const handleAreaSelect = (areaId: string) => {
    const selectedArea = areas.find((a) => a.id === areaId);
    if (selectedArea) {
      setFormData((prev) => ({
        ...prev,
        entityId: selectedArea.code,
        entityName: selectedArea.name,
      }));
    }
  };

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      standardType: "",
      organization: "",
      issuedDate: "",
      expiryDate: "",
      entityType: "enterprise",
      entityId: "",
      entityName: "",
      content: "",
      contentType: "editor",
      fileUrl: "",
      attachments: [],
    });
    setAvailableOrganizations([]);
    setSelectedEnterpriseId("");
    editorContentRef.current = "";
    setFormOpen(true);
  };

  const handleEdit = (item: EnterpriseCertificate) => {
    setEditItem(item);
    const selectedStandard = standards.find((s) => s.code === item.standardType);
    setAvailableOrganizations(selectedStandard?.organizations || []);
    
    // Find enterprise ID if it's an area or find enterprise code
    if (item.entityType === "area") {
        const area = areas.find(a => a.code === item.entityId);
        if (area) setSelectedEnterpriseId(area.enterpriseId);
    } else {
        const ent = enterprises.find(e => e.code === item.entityId);
        if (ent) setSelectedEnterpriseId(ent.id);
    }

    setFormData({
      code: item.code,
      name: item.name,
      standardType: item.standardType,
      organization: item.organization,
      issuedDate: item.issuedDate,
      expiryDate: item.expiryDate,
      entityType: item.entityType,
      entityId: item.entityId,
      entityName: item.entityName,
      content: item.content,
      contentType: item.contentType,
      fileUrl: item.fileUrl || "",
      attachments: item.attachments,
    });
    editorContentRef.current = item.content;
    setFormOpen(true);
  };

  const handleDelete = (item: EnterpriseCertificate) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const status = calculateStatus(formData.expiryDate);
    const finalContent = formData.contentType === "editor" ? editorContentRef.current : formData.content;

    const submissionData = {
      ...formData,
      content: finalContent,
      status,
    };

    if (editItem) {
      updateCertificate(editItem.id, submissionData);
      toast({ title: "Thành công", description: "Đã cập nhật chứng nhận" });
    } else {
      const newId = certificates.length > 0 ? Math.max(...certificates.map((c) => c.id)) + 1 : 1;
      const newItem: EnterpriseCertificate = {
        id: newId,
        ...submissionData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      addCertificate(newItem);
      toast({ title: "Thành công", description: "Đã thêm chứng nhận mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteCertificate(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa chứng nhận" });
    }
    setDeleteOpen(false);
  };

  return {
    formData,
    setFormData,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    deleteItem,
    availableOrganizations,
    selectedEnterpriseId,
    filters,
    setFilters,
    filteredData,
    standards,
    enterprises,
    areas,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    handleStandardTypeChange,
    handleEnterpriseSelect,
    handleAreaSelect,
    editorContentRef,
  };
}
