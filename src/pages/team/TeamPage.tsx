import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, ChevronDown, Upload, FileUser } from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import { ImportTeamDialog } from "../../components/team/ImportTeamDialog";
import useTeamStore, { type Team } from "../../stores/useTeamStore";

export default function TeamPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Zustand store
  const teams = useTeamStore((state) => state.teams);
  const deleteTeam = useTeamStore((state) => state.deleteTeam);
  const bulkAddTeams = useTeamStore((state) => state.bulkAddTeams);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Team | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const columns: Column<Team>[] = [
    { key: "code", label: "Mã đội" },
    { key: "name", label: "Tên đội nhóm" },
    { key: "leader", label: "Trưởng nhóm" },
    { key: "department", label: "Phòng ban" },
    { key: "memberCount", label: "Số lượng thành viên" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
          {value === "active" ? "Hoạt động" : "Ngừng hoạt động"}
        </Badge>
      ),
    },
  ];

  const handleDelete = (item: Team) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteTeam(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa đội nhóm khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  const handleImportData = (newData: any[]) => {
    bulkAddTeams(newData);
    toast({
      title: "Thành công",
      description: `Đã nhập ${newData.length} đội nhóm mới`,
    });
  };

  return (
    <AdminLayout
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
            <DropdownMenuItem onClick={() => setLocation("/team/create")}>
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
        columns={columns}
        data={teams}
        onView={(item) => setLocation(`/team/${item.id}`)}
        onEdit={(item) => setLocation(`/team/${item.id}`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm đội nhóm..."
        selectable
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
