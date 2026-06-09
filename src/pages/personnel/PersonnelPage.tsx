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
import { Plus, ChevronDown, Upload, FileUser } from "lucide-react";
import { ImportPersonnelDialog } from "../../components/personnel/ImportPersonnelDialog";
import { usePersonnel } from "./hooks/usePersonnel";
import { personnelColumns, personnelFilters } from "./data/table";

export default function PersonnelPage() {
  const {
    personnel,
    deleteOpen,
    setDeleteOpen,
    importOpen,
    setImportOpen,
    handleDelete,
    handleConfirmDelete,
    handleImportData,
    setLocation,
  } = usePersonnel();

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý nhân sự"
      description="Danh sách nhân sự của đơn vị"
      actions={
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Thêm mới
                <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => setLocation("/personnel/create")}
              >
                <FileUser className="w-4 h-4 mr-2" />
                Thêm thủ công
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setImportOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Nhập từ Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    >
      <DataTable
        columns={personnelColumns}
        data={personnel}
        onView={(item) => setLocation(`/personnel/${item.id}/edit`)}
        onEdit={(item) => setLocation(`/personnel/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm nhân sự..."
        filters={personnelFilters}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nhân sự này? Hoạt động này không thể hoàn tác."
      />
      <ImportPersonnelDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImportData}
      />
    </AdminLayout>
  );
}
