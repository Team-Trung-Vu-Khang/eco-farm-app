import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";
import { getCertificateColumns, getFilterConfig } from "./data/constants";
import { useEnterpriseCertificateForm } from "./hooks/useEnterpriseCertificateForm";

const EnterpriseCertificatePage = () => {
  const [, setLocation] = useLocation();
  const {
    deleteOpen,
    setDeleteOpen,
    filteredData,
    standards,
    loading,
    handleSearch,
    handleFilterChange,
    handleDelete,
    handleConfirmDelete,
  } = useEnterpriseCertificateForm();

  const columns = getCertificateColumns(standards);
  const filterConfig = getFilterConfig(standards);

  return (
    <AdminLayout
      isDev={true}
      title="Chứng nhận - Chứng chỉ"
      description="Quản lý chứng nhận cho workspace và vùng trồng"
      actions={
        <Button
          onClick={() => setLocation("/enterprise-certificate/create")}
          data-testid="add-certificate"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm chứng nhận
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={filteredData}
        searchable
        loading={loading}
        onEdit={(item) =>
          setLocation(`/enterprise-certificate/${item.id}/edit`)
        }
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm chứng nhận..."
        filters={filterConfig}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

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
