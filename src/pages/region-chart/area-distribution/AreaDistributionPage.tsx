import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useAreaDistributionPage } from "../hooks/useAreaDistributionPage";
import { TERMS, formatTerm } from "@/config/terminology";

const AreaDistributionPage = () => {
  const {
    areas,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
    isLoading,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
  } = useAreaDistributionPage();

  return (
    <PageWrapper
      title={`Phân bố ${TERMS.areaLower}`}
      description={`Quản lý danh sách và bản đồ phân bố các ${TERMS.areaLower}`}
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          {formatTerm.create(TERMS.area)}
        </Button>
      }
    >
      <DataTable
        enableMobileCard
        data={areas}
        columns={columns}
        loading={isLoading}
        searchable
        searchPlaceholder={formatTerm.search(TERMS.area)}
        onSearch={handleSearch}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements}
        totalPages={response?.totalPages}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        onEdit={(item) => handleEdit(item.id)}
        onDelete={(item) => handleDelete(item.id)}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        description="Bạn có chắc chắn muốn xóa khu vực này?"
      />
    </PageWrapper>
  );
};
export default AreaDistributionPage;
