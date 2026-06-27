import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  DeleteDialog,
  Separator,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  BadgeCheck,
  ChevronRight,
  Layers3,
  Plus,
  TreePine,
} from "lucide-react";
import { EnterpriseGroupForm } from "./components/EnterpriseGroupForm";
import { useEnterpriseGroupForm } from "./hooks/useEnterpriseGroupForm";
import type { VsicIndustry } from "./types";
import type { VsicIndustryTreeRecord } from "@/features/master-data/types/master-data.type";

const VSIC_STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
];

const VSIC_LEVEL_OPTIONS = [
  { value: "1", label: "Cấp 1" },
  { value: "2", label: "Cấp 2" },
  { value: "3", label: "Cấp 3" },
  { value: "4", label: "Cấp 4" },
  { value: "5", label: "Cấp 5" },
];

const columns: Column<VsicIndustry>[] = [
  { key: "code", label: "Mã ngành", sortable: true },
  { key: "name", label: "Tên ngành", sortable: true },
  { key: "level", label: "Cấp" },
  { key: "parentCode", label: "Mã ngành cha" },
  { key: "parentName", label: "Tên ngành cha" },
  {
    key: "status",
    label: "Trạng thái",
    render: (_value: unknown, row: VsicIndustry) => (
      <Badge variant={row.status === "active" ? "default" : "secondary"}>
        {row.status === "active"
          ? "Hoạt động"
          : row.status === "inactive"
            ? "Ngừng hoạt động"
            : "Lưu trữ"}
      </Badge>
    ),
  },
];

function TreeNode({
  node,
  depth = 0,
}: {
  node: VsicIndustryTreeRecord;
  depth?: number;
}) {
  const nestedChildren = (node.children ?? []).filter(
    (child): child is VsicIndustryTreeRecord => typeof child !== "string",
  );

  return (
    <details
      className="group rounded-xl border border-slate-200 bg-white shadow-sm"
      style={{ marginLeft: `${depth * 14}px` }}
    >
      <summary className="flex cursor-pointer list-none items-start gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-slate-800">
              {node.name}
            </p>
            <Badge variant="secondary" className="text-[10px] uppercase">
              {node.code}
            </Badge>
            <Badge
              variant={node.status === "active" ? "default" : "secondary"}
              className="text-[10px]"
            >
              Cấp {node.level}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {node.parentName || "Không có ngành cha"}
          </p>
        </div>
      </summary>

      {nestedChildren.length > 0 ? (
        <div className="space-y-2 border-t border-slate-100 px-3 pb-3 pt-2">
          {nestedChildren.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </details>
  );
}

const EnterpriseTypePage = () => {
  const {
    data,
    loading,
    error,
    response,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSearch,
    handleFilterChange,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    handleSubmit,
    handleConfirmDelete,
    tree,
    treeLoading,
    treeError,
  } = useEnterpriseGroupForm();

  const activeCount = data.filter((item) => item.status === "active").length;
  const rootCount = tree?.length ?? 0;
  const treeItemCount =
    tree?.reduce((count, node) => {
      const stack = [node];
      let total = 0;

      while (stack.length > 0) {
        const current = stack.pop();
        if (!current) continue;
        total += 1;
        const children = (current.children ?? []).filter(
          (child): child is VsicIndustryTreeRecord => typeof child !== "string",
        );
        stack.push(...children);
      }

      return count + total;
    }, 0) ?? 0;

  return (
    <AdminLayout
      isDev={true}
      title="Thông tin ngành nghề"
      description="Quản lý danh mục ngành nghề VSIC"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      }
    >
      <div className="space-y-6">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                <Layers3 className="h-4 w-4" />
                Tổng ngành nghề
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {response?.totalElements ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                <BadgeCheck className="h-4 w-4" />
                Đang hoạt động
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-900">
                {activeCount}
              </p>
            </div>
            <div className="rounded-xl bg-sky-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky-700">
                <TreePine className="h-4 w-4" />
                Nhánh gốc
              </div>
              <p className="mt-2 text-2xl font-bold text-sky-900">
                {rootCount}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-700">
                <ChevronRight className="h-4 w-4" />
                Mục trong cây
              </div>
              <p className="mt-2 text-2xl font-bold text-amber-900">
                {treeItemCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
          <div className="min-w-0">
            {error ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                ⚠️ {error}
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={data}
                searchable
                searchPlaceholder="Tìm kiếm ngành nghề..."
                pageSize={pageSize}
                currentIndex={currentIndex}
                totalElements={response?.totalElements}
                totalPages={response?.totalPages}
                onSearch={handleSearch}
                onPageSize={setPageSize}
                onIndexChange={setCurrentIndex}
                onFilterChange={handleFilterChange}
                filters={[
                  {
                    key: "status",
                    label: "Trạng thái",
                    options: VSIC_STATUS_OPTIONS,
                  },
                  {
                    key: "level",
                    label: "Cấp ngành",
                    options: VSIC_LEVEL_OPTIONS,
                  },
                ]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
              />
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="space-y-2 border-b bg-slate-50/80">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TreePine className="h-4 w-4 text-slate-500" />
                  Cây ngành nghề
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Hiển thị cấu trúc VSIC theo danh mục hiện tại.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 p-4 max-h-[57dvh] overflow-y-scroll">
                {treeError ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    Không tải được cây ngành nghề: {treeError}
                  </div>
                ) : null}

                {treeLoading ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                    Đang tải dữ liệu cây ngành nghề...
                  </div>
                ) : tree && tree.length > 0 ? (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs text-sky-700">
                      Bấm vào từng nhánh để xem sâu hơn.
                    </div>
                    {tree.map((node) => (
                      <TreeNode key={node.id} node={node} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                    Chưa có dữ liệu cây ngành nghề phù hợp với bộ lọc hiện tại.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EnterpriseGroupForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa ngành nghề này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default EnterpriseTypePage;
