import { useBranches, type BranchRecord } from "@/features/branch";
import { useSelectedWorkspaceId } from "@/features/workspace";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { branchColumns } from "./data/columns";
import { useBranchTable } from "./hooks/useBranchTable";

/**
 * Branch management page component.
 * Displays a list of branches with filtering, viewing, editing, and deletion capabilities.
 */
export default function BranchPage() {
  const workspaceId = useSelectedWorkspaceId();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BranchRecord["status"] | "all">("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const branchStatusOptions = [
    { label: "Hoạt động", value: "active" },
    { label: "Không hoạt động", value: "inactive" },
    { label: "Đã lưu trữ", value: "archived" },
  ];

  const branchesQuery = useBranches(
    {
      keyword: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
    workspaceId ?? "missing",
    {
      enabled: workspaceId !== null,
    },
  );

  const branches = useMemo(
    () =>
      (branchesQuery.items ?? []).map((branch) => {
        const primaryContact =
          branch.contacts?.find((contact) => contact.isPrimary) ??
          branch.contacts?.[0] ??
          null;

        return {
          ...branch,
          enterpriseName: branch.organization?.name || "-",
          phone: primaryContact?.phone || "-",
          email: primaryContact?.email || "-",
        };
      }),
    [branchesQuery.items],
  );

  const {
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit,
  } = useBranchTable();

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý chi nhánh"
      description="Quản lý danh sách chi nhánh của các đơn vị"
      actions={
        <Link href="/branch/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      {branchesQuery.error ? (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {branchesQuery.error}
        </div>
      ) : (
        <DataTable
          columns={branchColumns}
          data={branches}
          searchable
          searchPlaceholder="Tìm kiếm chi nhánh..."
          filters={[
            {
              key: "status",
              label: "Trạng thái",
              options: branchStatusOptions,
            },
          ]}
          onSearch={setSearch}
          onFilterChange={(key, value) => {
            if (key === "status") {
              setStatus(value as BranchRecord["status"] | "all");
              setCurrentIndex(1);
            }
          }}
          onPageSize={setPageSize}
          onIndexChange={setCurrentIndex}
          pageSize={pageSize}
          currentIndex={currentIndex}
          totalElements={branchesQuery.response?.totalElements}
          totalPages={branchesQuery.response?.totalPages}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={branchesQuery.loading}
          selectable={false}
        />
      )}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa chi nhánh này? Dữ liệu liên quan có thể bị ảnh hưởng."
      />
    </AdminLayout>
  );
}
