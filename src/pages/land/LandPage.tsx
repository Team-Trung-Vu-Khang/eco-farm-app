import { useState, type ChangeEvent } from "react";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useLandStore, { type Land } from "../../stores/useLandStore";
import LandFormDialog from "./components/LandFormDialog";
import {
  createEmptyLandFormData,
  createLandFormDataFromItem,
  landColumns,
  type LandFormData,
} from "./data/land.constants";

export default function LandPage() {
  const { toast } = useToast();
  const { lands: data, addLand, updateLand, deleteLand } = useLandStore();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Land | null>(null);
  const [deleteItem, setDeleteItem] = useState<Land | null>(null);
  const [formData, setFormData] = useState<LandFormData>(() =>
    createEmptyLandFormData(),
  );

  const handleFormDataChange = (data: Partial<LandFormData>) => {
    setFormData((current) => ({ ...current, ...data }));
  };

  const handleAdd = () => {
    setEditItem(null);
    setFormData(createEmptyLandFormData());
    setFormOpen(true);
  };

  const handleEdit = (item: Land) => {
    setEditItem(item);
    setFormData(createLandFormDataFromItem(item));
    setFormOpen(true);
  };

  const handleDelete = (item: Land) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    handleFormDataChange({ image: URL.createObjectURL(file) });
  };

  const handleSubmit = () => {
    if (editItem) {
      updateLand(editItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin loại đất",
      });
    } else {
      addLand({
        code: formData.code || "",
        name: formData.name || "",
        image: formData.image,
        description: formData.description || "",
      });
      toast({ title: "Thành công", description: "Đã thêm loại đất mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteLand(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa loại đất" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      isRice
      title="Quản lý đất"
      description="Phân loại và quản lý các loại đất canh tác"
      actions={
        <Button onClick={handleAdd} data-testid="add-land">
          <Plus className="w-4 h-4 mr-2" />
          Thêm loại đất
        </Button>
      }
    >
      <DataTable
        columns={landColumns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm loại đất..."
      />

      <LandFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onImageUpload={handleImageUpload}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa loại đất này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
