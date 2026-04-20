import { useEffect, useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { DOCUMENT_COLUMNS, compareDateDesc, createDocumentRows, formatDate, getCurrentVersion, getDocumentStatus, hasDateOverlap, sortVersions, suggestNextVersion } from "../constants/documentVersionConstants";
import { EMPTY_FORM, INITIAL_DOCUMENTS } from "../mocks";
import type { DocumentRecord, VersionFormState } from "../types";

export function useDocumentVersionPage() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentRecord[]>(INITIAL_DOCUMENTS);
  const [selectedDocumentId, setSelectedDocumentId] = useState(INITIAL_DOCUMENTS[0]?.id ?? "");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [formData, setFormData] = useState<VersionFormState>({
    ...EMPTY_FORM,
    documentId: INITIAL_DOCUMENTS[0]?.id ?? "",
  });

  const documentRows = useMemo(() => createDocumentRows(documents), [documents]);

  const selectedDocument = useMemo(
    () => documents.find((document) => document.id === selectedDocumentId) || null,
    [documents, selectedDocumentId],
  );

  const selectedVersions = useMemo(
    () => (selectedDocument ? sortVersions(selectedDocument.versions) : []),
    [selectedDocument],
  );

  const selectedLogs = useMemo(
    () =>
      selectedDocument
        ? [...selectedDocument.logs].sort((a, b) => compareDateDesc(a.at, b.at))
        : [],
    [selectedDocument],
  );

  const currentVersion = selectedDocument ? getCurrentVersion(selectedDocument) : null;

  useEffect(() => {
    if (!selectedDocumentId && documents[0]) {
      setSelectedDocumentId(documents[0].id);
      return;
    }

    if (selectedDocumentId && !documents.some((document) => document.id === selectedDocumentId)) {
      setSelectedDocumentId(documents[0]?.id ?? "");
    }
  }, [documents, selectedDocumentId]);

  const versionConflict = useMemo(() => {
    const targetDocument = documents.find((document) => document.id === formData.documentId);
    if (!targetDocument || !formData.effectiveFrom) return null;

    if (formData.effectiveTo && formData.effectiveTo < formData.effectiveFrom) {
      return "Ngày hết hiệu lực phải lớn hơn hoặc bằng ngày bắt đầu hiệu lực.";
    }

    const overlap = targetDocument.versions.find((version) => {
      if (version.id === editingVersionId) return false;
      return hasDateOverlap(
        formData.effectiveFrom,
        formData.effectiveTo || null,
        version.effectiveFrom,
        version.effectiveTo,
      );
    });

    if (!overlap) return null;

    return `Khoảng thời gian bị trùng với phiên bản ${overlap.version} (${formatDate(
      overlap.effectiveFrom,
    )} - ${formatDate(overlap.effectiveTo)}).`;
  }, [documents, editingVersionId, formData.documentId, formData.effectiveFrom, formData.effectiveTo]);

  const overview = useMemo(() => {
    const totalDocuments = documents.length;
    const totalActive = documents.filter((document) => getDocumentStatus(document) === "active").length;
    const waitingApproval = documents.reduce(
      (count, document) =>
        count + document.versions.filter((version) => version.status === "pending").length,
      0,
    );
    return { totalDocuments, totalActive, waitingApproval };
  }, [documents]);

  const resetForm = (documentId: string) => {
    setFormData({
      ...EMPTY_FORM,
      documentId,
    });
  };

  const openCreateDialog = (documentId: string, baseVersionId?: string | null) => {
    const document = documents.find((item) => item.id === documentId);
    const baseVersion =
      document?.versions.find((version) => version.id === (baseVersionId || document.currentVersionId)) ||
      null;

    setMode("create");
    setEditingVersionId(null);
    setFormData({
      documentId,
      baseVersionId: baseVersion?.id || "none",
      version: suggestNextVersion(baseVersion?.version),
      effectiveFrom: "",
      effectiveTo: "",
      fileName: baseVersion?.fileName || "",
      changeSummary: baseVersion
        ? `Kế thừa từ ${baseVersion.version}: ${baseVersion.changeSummary}`
        : "",
      status: "pending",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (documentId: string, versionId: string) => {
    const document = documents.find((item) => item.id === documentId);
    const version = document?.versions.find((item) => item.id === versionId);
    if (!document || !version) return;

    setMode("edit");
    setEditingVersionId(versionId);
    setFormData({
      documentId,
      baseVersionId: version.basedOnVersionId || "none",
      version: version.version,
      effectiveFrom: version.effectiveFrom,
      effectiveTo: version.effectiveTo || "",
      fileName: version.fileName,
      changeSummary: version.changeSummary,
      status: version.status === "draft" ? "draft" : "pending",
    });
    setDialogOpen(true);
  };

  const handleViewDetail = (documentId: string) => {
    setSelectedDocumentId(documentId);

    if (typeof window === "undefined") {
      return;
    }

    window.requestAnimationFrame(() => {
      document
        .getElementById("document-version-detail")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleEditDocument = (documentId: string) => {
    const targetDocument = documents.find((item) => item.id === documentId);
    if (!targetDocument || targetDocument.versions.length === 0) return;

    setSelectedDocumentId(documentId);

    const targetVersion =
      getCurrentVersion(targetDocument) || sortVersions(targetDocument.versions)[0] || null;

    if (!targetVersion) return;

    openEditDialog(documentId, targetVersion.id);
  };

  const approveVersion = (documentId: string, versionId: string) => {
    setDocuments((prev) =>
      prev.map((document) => {
        if (document.id !== documentId) return document;

        const approvedVersion = document.versions.find((version) => version.id === versionId);
        if (!approvedVersion) return document;

        return {
          ...document,
          currentVersionId: versionId,
          versions: document.versions.map((version) =>
            version.id === versionId
              ? {
                  ...version,
                  status: "active",
                  updatedAt: new Date().toISOString(),
                  updatedBy: "Trần Thanh Bình",
                }
              : version.status === "active"
                ? { ...version, status: "expired" }
                : version,
          ),
          logs: [
            {
              id: `log-${Date.now()}`,
              versionId,
              action: "approved",
              user: "Trần Thanh Bình",
              at: new Date().toISOString(),
              detail: `duyệt version ${approvedVersion.version} và cho phép phát hành.`,
            },
            ...document.logs,
          ],
        };
      }),
    );

    toast({
      title: "Đã duyệt phiên bản",
      description: "Phiên bản đã được cập nhật sang trạng thái hiệu lực.",
    });
  };

  const handleDocumentChangeInForm = (documentId: string) => {
    const targetDocument = documents.find((document) => document.id === documentId);
    const baseVersion = targetDocument ? getCurrentVersion(targetDocument) : null;

    setFormData((prev) => ({
      ...prev,
      documentId,
      baseVersionId: baseVersion?.id || "none",
      version: mode === "create" ? suggestNextVersion(baseVersion?.version) : prev.version,
      fileName: mode === "create" ? baseVersion?.fileName || "" : prev.fileName,
      changeSummary:
        mode === "create" && baseVersion
          ? `Kế thừa từ ${baseVersion.version}: ${baseVersion.changeSummary}`
          : prev.changeSummary,
    }));
  };

  const handleBaseVersionChange = (baseVersionId: string) => {
    const targetDocument = documents.find((document) => document.id === formData.documentId);
    const baseVersion =
      baseVersionId === "none"
        ? null
        : targetDocument?.versions.find((version) => version.id === baseVersionId) || null;

    setFormData((prev) => ({
      ...prev,
      baseVersionId,
      version: mode === "create" ? suggestNextVersion(baseVersion?.version) : prev.version,
      changeSummary:
        mode === "create" && baseVersion
          ? `Kế thừa từ ${baseVersion.version}: ${baseVersion.changeSummary}`
          : prev.changeSummary,
      fileName: mode === "create" && baseVersion ? baseVersion.fileName : prev.fileName,
    }));
  };

  const handleSubmit = () => {
    if (!formData.documentId || !formData.version || !formData.effectiveFrom || !formData.fileName) {
      toast({
        title: "Thiếu thông tin bắt buộc",
        description: "Vui lòng nhập version, ngày hiệu lực và file đính kèm.",
      });
      return;
    }

    if (!formData.changeSummary.trim()) {
      toast({
        title: "Thiếu mô tả thay đổi",
        description: "Mô tả thay đổi giúp phục vụ audit và truy xuất lịch sử.",
      });
      return;
    }

    if (versionConflict) {
      toast({
        title: "Xung đột hiệu lực",
        description: versionConflict,
      });
      return;
    }

    const targetDocument = documents.find((document) => document.id === formData.documentId);
    if (!targetDocument) return;

    const now = new Date().toISOString();
    const selectedBaseVersion =
      formData.baseVersionId !== "none"
        ? targetDocument.versions.find((version) => version.id === formData.baseVersionId) || null
        : null;

    if (mode === "create") {
      const newVersion = {
        id: `${formData.documentId}-${Date.now()}`,
        version: formData.version,
        effectiveFrom: formData.effectiveFrom,
        effectiveTo: formData.effectiveTo || null,
        status: formData.status,
        fileName: formData.fileName,
        changeSummary: formData.changeSummary,
        updatedBy: "Phạm Quốc Huy",
        updatedAt: now,
        basedOnVersionId: selectedBaseVersion?.id || null,
      } as const;

      setDocuments((prev) =>
        prev.map((document) =>
          document.id === formData.documentId
            ? {
                ...document,
                versions: [newVersion, ...document.versions],
                logs: [
                  {
                    id: `log-${Date.now()}`,
                    versionId: newVersion.id,
                    action: "created",
                    user: "Phạm Quốc Huy",
                    at: now,
                    detail: `tạo phiên bản ${newVersion.version} ${
                      selectedBaseVersion
                        ? `kế thừa từ ${selectedBaseVersion.version}`
                        : "không kế thừa từ bản cũ"
                    }.`,
                  },
                  ...document.logs,
                ],
              }
            : document,
        ),
      );

      toast({
        title: "Đã tạo phiên bản mới",
        description: `Phiên bản ${formData.version} đã được lưu và sẵn sàng chuyển duyệt.`,
      });
    } else if (editingVersionId) {
      setDocuments((prev) =>
        prev.map((document) =>
          document.id === formData.documentId
            ? {
                ...document,
                versions: document.versions.map((version) =>
                  version.id === editingVersionId
                    ? {
                        ...version,
                        version: formData.version,
                        effectiveFrom: formData.effectiveFrom,
                        effectiveTo: formData.effectiveTo || null,
                        fileName: formData.fileName,
                        changeSummary: formData.changeSummary,
                        status: formData.status,
                        updatedBy: "Phạm Quốc Huy",
                        updatedAt: now,
                        basedOnVersionId: selectedBaseVersion?.id || null,
                      }
                    : version,
                ),
                logs: [
                  {
                    id: `log-${Date.now()}`,
                    versionId: editingVersionId,
                    action: "updated",
                    user: "Phạm Quốc Huy",
                    at: now,
                    detail: `cập nhật phiên bản ${formData.version} và điều chỉnh thời gian hiệu lực.`,
                  },
                  ...document.logs,
                ],
              }
            : document,
        ),
      );

      toast({
        title: "Đã cập nhật phiên bản",
        description: `Phiên bản ${formData.version} đã được chỉnh sửa thành công.`,
      });
    }

    setDialogOpen(false);
    resetForm(formData.documentId);
  };

  return {
    currentVersion,
    dialogOpen,
    documentColumns: DOCUMENT_COLUMNS,
    documentRows,
    documents,
    formData,
    mode,
    overview,
    selectedDocument,
    selectedDocumentId,
    selectedLogs,
    selectedVersions,
    setDialogOpen,
    setFormData,
    setSelectedDocumentId,
    versionConflict,
    approveVersion,
    handleBaseVersionChange,
    handleDocumentChangeInForm,
    handleEditDocument,
    handleSubmit,
    handleViewDetail,
    openCreateDialog,
    openEditDialog,
  };
}
