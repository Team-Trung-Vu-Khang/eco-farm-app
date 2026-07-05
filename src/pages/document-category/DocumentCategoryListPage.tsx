import {
  AdminLayout,
  Button,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import useDocumentCategoryStore from "../../stores/useDocumentCategoryStore";
import { DocumentCategoryTable } from "./components/DocumentCategoryTable";

const DocumentCategoryListPage = () => {
  const [, setLocation] = useLocation();
  const { documentCategories, deleteCategory, toggleStatus } =
    useDocumentCategoryStore();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      deleteCategory(selectedId);
      setDeleteOpen(false);
      setSelectedId(null);
    }
  };

  return (
    <AdminLayout
      title="Danh mục hồ sơ tài liệu"
      description="Quản lý các loại giấy tờ, hồ sơ cần thiết cho các đối tượng trong hệ thống"
      actions={
        <Button
          onClick={() => setLocation("/document-category/create")}
          className="shadow-lg shadow-primary/20"
        >
          <Plus size={18} className="mr-2" />
          Tạo danh mục mới
        </Button>
      }
    >
      <DocumentCategoryTable
        data={documentCategories}
        onView={(id) => setLocation(`/document-category/${id}`)}
        onEdit={(id) => setLocation(`/document-category/${id}/edit`)}
        onDelete={handleDelete}
        onToggleStatus={toggleStatus}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa danh mục hồ sơ"
        description="Bạn có chắc chắn muốn xóa danh mục hồ sơ này? Tất cả cấu hình liên quan sẽ bị loại bỏ và không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default DocumentCategoryListPage;
