import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useCultivationRegionPage } from "./hooks/useCultivationRegionPage";
import { TERMS, formatTerm } from "@/config/terminology";

const CultivationRegionPage = () => {
  const {
    areas,
    columns,
    isLoading,
    response,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleView,
    handleEdit,
    handleWorkflow,
    handleDelete,
    handleConfirmDelete,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    filters,
    handleFilterChange,
  } = useCultivationRegionPage();

  return (
    <PageWrapper
      title={TERMS.zone}
      description={`Quản lý các thiết lập cho ${TERMS.zone}`}
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          {formatTerm.create(TERMS.zone)}
        </Button>
      }
    >
      <DataTable
        enableMobileCard
        columns={columns}
        data={areas}
        loading={isLoading}
        searchable
        searchPlaceholder={formatTerm.search(TERMS.zone)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements}
        totalPages={response?.totalPages}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        onView={(item) => handleView(item.id)}
        onEdit={(item) => handleEdit(item.id)}
        onDelete={(item) => handleDelete(item.id)}
        onWorkflow={(item) => handleWorkflow(item.id)}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={formatTerm.deleteConfirm(TERMS.zone)}
      />
    </PageWrapper>
  );
};

export default CultivationRegionPage;
