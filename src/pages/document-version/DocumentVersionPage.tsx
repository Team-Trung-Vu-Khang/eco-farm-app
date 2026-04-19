import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  CopyPlus,
  FileClock,
  FilePlus2,
  FolderKanban,
} from "lucide-react";
import { DocumentLibrarySection } from "./components/DocumentLibrarySection";
import { DocumentVersionContent } from "./components/DocumentVersionContent";
import { DocumentVersionFormDialog } from "./components/DocumentVersionFormDialog";
import { useDocumentVersionPage } from "./hooks/useDocumentVersionPage";

export default function DocumentVersionPage() {
  const {
    currentVersion,
    dialogOpen,
    documentColumns,
    documentRows,
    documents,
    formData,
    mode,
    overview,
    selectedDocument,
    selectedDocumentId,
    selectedLogs,
    setDialogOpen,
    setFormData,
    versionConflict,
    handleBaseVersionChange,
    handleDocumentChangeInForm,
    handleEditDocument,
    handleSubmit,
    handleViewDetail,
    openCreateDialog,
  } = useDocumentVersionPage();

  return (
    <AdminLayout
      title="Quản lý phiên bản tài liệu"
      description="Quản trị version cho SOP, hồ sơ truy xuất, nhật ký mùa vụ và tài liệu chứng nhận với kiểm tra hiệu lực theo thời gian."
      actions={
        <div className="flex w-full flex-row gap-2">
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            onClick={() =>
              selectedDocument &&
              openCreateDialog(selectedDocument.id, currentVersion?.id)
            }
            disabled={!selectedDocument}
          >
            <CopyPlus className="mr-2 h-4 w-4" />
            Kế thừa từ bản hiện tại
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() =>
              selectedDocument && openCreateDialog(selectedDocument.id)
            }
          >
            <FilePlus2 className="mr-2 h-4 w-4" />
            Tạo version mới
          </Button>
        </div>
      }
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 md:p-5">
          <div className="flex items-center gap-3">
            <FolderKanban className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-sm text-muted-foreground">Tài liệu quản lý</p>
              <p className="text-2xl font-semibold">
                {overview.totalDocuments}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 md:p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-sky-600" />
            <div>
              <p className="text-sm text-muted-foreground">Đang hiệu lực</p>
              <p className="text-2xl font-semibold">{overview.totalActive}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 md:p-5">
          <div className="flex items-center gap-3">
            <FileClock className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-sm text-muted-foreground">Chờ duyệt</p>
              <p className="text-2xl font-semibold">
                {overview.waitingApproval}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <DocumentLibrarySection
          columns={documentColumns}
          rows={documentRows}
          selectedDocumentId={selectedDocumentId}
          onEdit={handleEditDocument}
          onView={handleViewDetail}
        />

        <section id="document-version-detail" className="space-y-6">
          <DocumentVersionContent
            selectedDocument={selectedDocument}
            selectedLogs={selectedLogs}
          />
        </section>
      </div>

      <DocumentVersionFormDialog
        documents={documents}
        formData={formData}
        mode={mode}
        open={dialogOpen}
        versionConflict={versionConflict}
        onBaseVersionChange={handleBaseVersionChange}
        onDocumentChange={handleDocumentChangeInForm}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        setFormData={setFormData}
      />
    </AdminLayout>
  );
}
