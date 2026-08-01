import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import BankFormDialog from "./components/BankFormDialog";
import { bankDirectoryColumns } from "./data/columns";
import { useBankDirectory } from "./hooks/useBankDirectory";

export default function BankDirectoryPage() {
  const {
    data,
    loading,
    error,
    response,
    pageSize,
    currentIndex,
    setSearch,
    handleFilterChange,
    setPageSize,
    setCurrentIndex,
    formData,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    logoPreview,
    isUploadingLogo,
    handleAdd,
    handleEdit,
    handleDelete,
    handleLogoUpload,
    handleRemoveLogo,
    handleSubmit,
    handleConfirmDelete,
  } = useBankDirectory();

  const bankDirectoryStatusOptions = [
    { value: "active", label: "Hoạt động" },
    { value: "inactive", label: "Không hoạt động" },
    { value: "archived", label: "Đã lưu trữ" },
  ];
  const booleanFilterOptions = [
    { value: "true", label: "Có" },
    { value: "false", label: "Không" },
  ];

  return (
    <PageWrapper
      title="Danh mục ngân hàng"
      description="Tra cứu thông tin thanh toán quốc tế: SWIFT/BIC code, địa chỉ và mã routing ngân hàng"
      actions={
        <Button onClick={handleAdd} data-testid="add-bank">
          <Plus className="w-4 h-4 mr-2" />
          Thêm ngân hàng
        </Button>
      }
    >
      {error ? (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm font-medium">
          ⚠️ {error}
        </div>
      ) : (
        <DataTable
          columns={bankDirectoryColumns}
          data={data}
          searchable
          searchPlaceholder="Tìm kiếm tên, SWIFT code, BIC..."
          filters={[
            {
              key: "status",
              label: "Trạng thái",
              options: bankDirectoryStatusOptions,
            },
            {
              key: "transferSupported",
              label: "Chuyển khoản",
              options: booleanFilterOptions,
            },
            {
              key: "lookupSupported",
              label: "Tra cứu",
              options: booleanFilterOptions,
            },
          ]}
          pageSize={pageSize}
          currentIndex={currentIndex}
          totalElements={response?.totalElements}
          totalPages={response?.totalPages}
          onSearch={setSearch}
          onFilterChange={handleFilterChange}
          onPageSize={setPageSize}
          onIndexChange={setCurrentIndex}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      <BankFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        formData={formData}
        logoPreview={logoPreview}
        isUploadingLogo={isUploadingLogo}
        onLogoUpload={handleLogoUpload}
        onRemoveLogo={handleRemoveLogo}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa ngân hàng này khỏi danh sách?"
      />
    </PageWrapper>
  );
}
