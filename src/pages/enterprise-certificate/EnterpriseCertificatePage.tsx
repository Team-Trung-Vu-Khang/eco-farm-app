import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  FormDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { CertificateBasicInfoFields } from "./components/CertificateBasicInfoFields";
import { CertificateContentFields } from "./components/CertificateContentFields";
import { CertificateEntitySelection } from "./components/CertificateEntitySelection";
import { CertificateTimedFields } from "./components/CertificateTimedFields";
import { getCertificateColumns, getFilterConfig } from "./data/constants";
import { useEnterpriseCertificateForm } from "./hooks/useEnterpriseCertificateForm";

const EnterpriseCertificatePage = () => {
  const {
    formData,
    setFormData,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
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
    availableOrganizations,
    selectedEnterpriseId,
    setFilters,
  } = useEnterpriseCertificateForm();

  const columns = getCertificateColumns();
  const filterConfig = getFilterConfig(standards);

  return (
    <AdminLayout
      title="Chứng nhận - Chứng chỉ"
      description="Quản lý chứng nhận cho doanh nghiệp và vùng trồng"
      actions={
        <Button onClick={handleAdd} data-testid="add-certificate">
          <Plus className="w-4 h-4 mr-2" />
          Thêm chứng nhận
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm chứng nhận..."
        filters={filterConfig}
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa chứng nhận" : "Thêm chứng nhận mới"}
        onSubmit={handleSubmit}
        size="xl"
      >
        <div className="max-h-[70vh] overflow-y-auto px-1 space-y-4">
          <CertificateBasicInfoFields
            formData={formData}
            setFormData={setFormData}
            standards={standards}
            availableOrganizations={availableOrganizations}
            onStandardTypeChange={handleStandardTypeChange}
          />

          <CertificateTimedFields
            formData={formData}
            setFormData={setFormData}
          />

          <CertificateEntitySelection
            formData={formData}
            setFormData={setFormData}
            enterprises={enterprises}
            areas={areas}
            selectedEnterpriseId={selectedEnterpriseId}
            onEnterpriseSelect={handleEnterpriseSelect}
            onAreaSelect={handleAreaSelect}
          />

          <CertificateContentFields
            formData={formData}
            setFormData={setFormData}
            editorContentRef={editorContentRef}
          />
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa chứng nhận này?"
      />
    </AdminLayout>
  );
};

export default EnterpriseCertificatePage;
