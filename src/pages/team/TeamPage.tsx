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
    deleteOpen,
    setDeleteOpen,
    importOpen,
    setImportOpen,
    handleDelete,
    handleConfirmDelete,
    handleImportData,
    goToCreate,
    goToDetail,
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
        columns={teamColumns}
        data={teams}
        onView={(item) => goToDetail(item.id)}
        onEdit={(item) => goToDetail(item.id)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm đội nhóm..."
        selectable={false}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa đội nhóm này? Các nhân sự thuộc đội nhóm sẽ cần được phân bổ lại."
      />

      <ImportTeamDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImportData}
      />
    </AdminLayout>
  );
}
