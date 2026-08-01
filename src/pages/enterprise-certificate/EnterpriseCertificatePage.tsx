import PageWrapper from "@/components/PageWrapper";
import {
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
    response,
    standards,
    loading,
    handleSearch,
    handleFilterChange,
    handleDelete,
    handleConfirmDelete,
    pageSize,
    handlePageSizeChange,
    currentIndex,
    handleIndexChange,
  } = useEnterpriseCertificateForm();

  const columns = getCertificateColumns();
  const filterConfig = getFilterConfig(standards);

  return (
    <PageWrapper
      title="Chứng nhận - Chứng chỉ"
      description="Quản lý chứng nhận cho đơn vị - tổ chức và vùng canh tác"
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
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements}
        totalPages={response?.totalPages}
        onEdit={(item) =>
          setLocation(`/enterprise-certificate/${item.id}/edit`)
        }
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm chứng nhận..."
        filters={filterConfig}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onPageSize={handlePageSizeChange}
        onIndexChange={handleIndexChange}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa chứng nhận này?"
      />
    </PageWrapper>
  );
};

export default EnterpriseCertificatePage;
