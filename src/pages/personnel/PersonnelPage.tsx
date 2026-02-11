import { useState } from "react";
import { useLocation } from "wouter";
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
import { Plus, ChevronDown, Upload, FileUser } from "lucide-react";
import { ImportPersonnelDialog } from "../../components/personnel/ImportPersonnelDialog";
import usePersonnelStore, {
  type Personnel,
} from "../../stores/usePersonnelStore";

export default function PersonnelPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Zustand store
  const personnel = usePersonnelStore((state) => state.personnel);
  const deletePersonnel = usePersonnelStore((state) => state.deletePersonnel);
  const bulkAddPersonnel = usePersonnelStore((state) => state.bulkAddPersonnel);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Personnel | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const columns: Column<Personnel>[] = [
    {
      key: "fullName",
      label: "Họ và tên",
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <img
              src={item.avatar}
              alt={value}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150";
              }}
            />
          </div>
          <span>{value}</span>
        </div>
      ),
    },
    { key: "phone", label: "Điện thoại" },
    { key: "position", label: "Chức vụ" },
    { key: "department", label: "Phòng ban" },
    { key: "team", label: "Đội nhóm" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
          {value === "active" ? "Hoạt động" : "Nghỉ việc"}
        </Badge>
      ),
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Nghỉ việc", value: "inactive" },
      ],
    },
    {
      key: "department",
      label: "Phòng ban",
      options: [
        { label: "Kinh doanh", value: "Kinh doanh" },
        { label: "Kế toán", value: "Kế toán" },
        { label: "Kỹ thuật", value: "Kỹ thuật" },
      ],
    },
  ];

  const handleDelete = (item: Personnel) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deletePersonnel(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa nhân sự khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  const handleImportData = (newData: any[]) => {
    bulkAddPersonnel(newData);
    toast({
      title: "Thành công",
      description: `Đã nhập ${newData.length} nhân sự mới`,
    });
  };

  return (
    <AdminLayout
      title="Quản lý nhân sự"
      description="Danh sách nhân sự của doanh nghiệp / nông hộ"
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
        columns={columns}
        data={personnel}
        onView={(item) => setLocation(`/personnel/${item.id}/edit`)}
        onEdit={(item) => setLocation(`/personnel/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm nhân sự..."
        filters={filters}
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
