import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useRef, useState } from "react";
import { useLocation, useRoute } from "wouter";
import useEnterpriseCertificateStore, {
  type EnterpriseCertificate,
} from "../../../stores/useEnterpriseCertificateStore";

const createInitialFormData = (): Omit<
  EnterpriseCertificate,
  "id" | "createdAt" | "status"
> => ({
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

export function useEnterpriseCertificateStepperForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, editParams] = useRoute("/enterprise-certificate/:id/edit");

  const certificates = useEnterpriseCertificateStore(
    (state) => state.certificates,
  );
  const standards = useEnterpriseCertificateStore((state) => state.standards);
  const enterprises = useEnterpriseCertificateStore(
    (state) => state.enterprises,
  );
  const areas = useEnterpriseCertificateStore((state) => state.areas);
  const addCertificate = useEnterpriseCertificateStore(
    (state) => state.addCertificate,
  );
  const updateCertificate = useEnterpriseCertificateStore(
    (state) => state.updateCertificate,
  );
  const calculateStatus = useEnterpriseCertificateStore(
    (state) => state.calculateStatus,
  );
  const getCertificateById = useEnterpriseCertificateStore(
    (state) => state.getCertificateById,
  );

  const editId = editParams?.id ? Number(editParams.id) : null;
  const editItem = editId ? getCertificateById(editId) : null;
  const isEdit = Boolean(editItem);

  const [formData, setFormData] = useState(() =>
    editItem
      ? {
          code: editItem.code,
          name: editItem.name,
          standardType: editItem.standardType,
          organization: editItem.organization,
          issuedDate: editItem.issuedDate,
          expiryDate: editItem.expiryDate,
          entityType: editItem.entityType,
          entityId: editItem.entityId,
          entityName: editItem.entityName,
          content: editItem.content,
          contentType: editItem.contentType,
          fileUrl: editItem.fileUrl || "",
          attachments: editItem.attachments,
        }
      : createInitialFormData(),
  );
  const [availableOrganizations, setAvailableOrganizations] = useState<string[]>(
    editItem
      ? standards.find((standard) => standard.code === editItem.standardType)
          ?.organizations || []
      : [],
  );
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState(() => {
    if (!editItem) return "";
    if (editItem.entityType === "area") {
      return (
        areas.find((area) => area.code === editItem.entityId)?.enterpriseId || ""
      );
    }
    return (
      enterprises.find((enterprise) => enterprise.code === editItem.entityId)
        ?.id || ""
    );
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const editorContentRef = useRef<string>(editItem?.content || "");

  const handleStandardTypeChange = (value: string) => {
    const selectedStandard = standards.find((standard) => standard.code === value);
    const organizations = selectedStandard?.organizations || [];

    setAvailableOrganizations(organizations);
    setFormData((prev) => ({
      ...prev,
      standardType: value,
      organization: organizations.length === 1 ? organizations[0] : "",
    }));
  };

  const handleEnterpriseSelect = (enterpriseId: string) => {
    const selectedEnterprise = enterprises.find(
      (enterprise) => enterprise.id === enterpriseId,
    );

    if (!selectedEnterprise) return;

    setSelectedEnterpriseId(enterpriseId);
    if (formData.entityType === "enterprise") {
      setFormData((prev) => ({
        ...prev,
        entityId: selectedEnterprise.code,
        entityName: selectedEnterprise.name,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      entityId: "",
      entityName: "",
    }));
  };

  const handleAreaSelect = (areaId: string) => {
    const selectedArea = areas.find((area) => area.id === areaId);
    if (!selectedArea) return;

    setFormData((prev) => ({
      ...prev,
      entityId: selectedArea.code,
      entityName: selectedArea.name,
    }));
  };

  const handleComplete = () => {
    setShowConfirmDialog(true);
  };

  const submitForm = () => {
    const status = calculateStatus(formData.expiryDate);
    const finalContent =
      formData.contentType === "editor" ? editorContentRef.current : formData.content;

    const submissionData = {
      ...formData,
      content: finalContent,
      status,
    };

    if (isEdit && editItem) {
      updateCertificate(editItem.id, submissionData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật chứng nhận",
      });
    } else {
      const newId =
        certificates.length > 0
          ? Math.max(...certificates.map((certificate) => certificate.id)) + 1
          : 1;

      addCertificate({
        id: newId,
        ...submissionData,
        createdAt: new Date().toISOString().split("T")[0],
      });
      toast({
        title: "Thành công",
        description: "Đã thêm chứng nhận mới",
      });
    }

    setShowConfirmDialog(false);
    setLocation("/enterprise-certificate");
  };

  const handleCancel = () => {
    setLocation("/enterprise-certificate");
  };

  return {
    isEdit,
    editItem,
    formData,
    setFormData,
    standards,
    enterprises,
    areas,
    availableOrganizations,
    selectedEnterpriseId,
    showConfirmDialog,
    setShowConfirmDialog,
    editorContentRef,
    handleStandardTypeChange,
    handleEnterpriseSelect,
    handleAreaSelect,
    handleComplete,
    submitForm,
    handleCancel,
  };
}
