import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { OrganizationSourceTabs } from "@/components/OrganizationSourceTabs";
import { useEnterprisePage } from "./hooks/useEnterprisePage";

export default function EnterprisePage() {
  const [sourceTab, setSourceTab] = useState<"personal" | "system">("personal");
  const {
    filterEnterprises,
    columns,
    filters,
    pageSize,
    currentIndex,
    setCurrentIndex,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    setLocation,
    handleSearch,
    handleFilterChange,
    setPageSize,
    totalPages,
    totalElements,
    loading,
    error,
  } = useEnterprisePage();

  return (
    <PageWrapper
      title="Quản lý doanh nghiệp"
      description="Quản lý thông tin các doanh nghiệp trong hệ thống"
      actions={sourceTab === "personal" ? (
        <Link href="/enterprise/create">
          <Button data-testid="add-enterprise">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      ) : undefined}
    >
      {error ? (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      <OrganizationSourceTabs
        type="enterprise"
        personalColumns={columns}
        onTabChange={setSourceTab}
        onSystemView={(item) => setLocation(`/enterprise/${item.id}`)}
        searchPlaceholder="Tìm kiếm doanh nghiệp hệ thống..."
        personal={<DataTable
        columns={columns}
        data={filterEnterprises}
        searchable
        onView={(item) => setLocation(`/enterprise/${item.id}`)}
        onEdit={(item) => setLocation(`/enterprise/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm doanh nghiệp..."
        filters={filters}
        selectable={false}
        loading={loading}
        currentIndex={currentIndex}
        pageSize={pageSize}
        totalPages={totalPages}
        totalElements={totalElements}
        onSearch={handleSearch}
        onIndexChange={setCurrentIndex}
        onPageSize={setPageSize}
        onFilterChange={handleFilterChange}
        />}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa doanh nghiệp này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </PageWrapper>
  );
}
