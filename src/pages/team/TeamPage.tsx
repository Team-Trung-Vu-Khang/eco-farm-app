import { Plus, ChevronDown, Upload, FileUser } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ImportTeamDialog } from "../../components/team/ImportTeamDialog";
import { teamColumns } from "./data/columns";
import { useTeamPage } from "./hooks/useTeamPage";

export default function TeamPage() {
  const {
    teams,
    loading,
    response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    goToEdit,
    handleSearch,
    deleteOpen,
    setDeleteOpen,
    importOpen,
    setImportOpen,
    handleDelete,
    handleConfirmDelete,
    handleImportData,
    goToCreate,
    goToDetail,
    isDeleting,
  } = useTeamPage();

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý đội nhóm"
      description="Danh sách các đội / nhóm làm việc"
      actions={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm mới
              <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={goToCreate}>
              <FileUser className="w-4 h-4 mr-2" />
              Thêm thủ công
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setImportOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Nhập từ Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      <DataTable
        columns={teamColumns as any}
        data={teams}
        onView={(item) => goToDetail(item.id)}
        onEdit={(item) => goToEdit(item.id)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm đội nhóm..."
        selectable={false}
        loading={loading}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements}
        totalPages={response?.totalPages}
        onSearch={handleSearch}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa đội nhóm này? Các nhân sự thuộc đội nhóm sẽ cần được phân bổ lại."
        loading={isDeleting}
      />

      <ImportTeamDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImportData}
      />
    </AdminLayout>
  );
}
