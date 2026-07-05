import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { Link } from "wouter";

import { DOCS_COLUMNS } from "./constants/docsConstants";
import { useDocs } from "./hooks/useDocs";

export default function DocsPage() {
  const {
    data,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleEdit,
    handleConfirmDelete,
  } = useDocs();

  return (
    <AdminLayout
      title="Quản lý tài liệu kỹ thuật"
      description="Xem và quản lý danh sách các tài liệu quy trình canh tác"
      actions={
        <Link href="docs/create">
          <Button
            data-testid="add-crop"
            className="shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm tài liệu kỹ thuật
          </Button>
        </Link>
      }
    >
      <DataTable
        data={data}
        selectable={false}
        columns={DOCS_COLUMNS}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm mã mẫu, cây trồng, mùa vụ..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
