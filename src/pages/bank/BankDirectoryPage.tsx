import { useState } from "react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  FormDialog,
  Input,
  Label,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { bankList, type Bank } from "../../constants/banks";
import { Plus, Upload, X } from "lucide-react";

export default function BankDirectoryPage() {
  const { toast } = useToast();
  const [data, setData] = useState<Bank[]>(bankList);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Bank | null>(null);
  const [deleteItem, setDeleteItem] = useState<Bank | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const [formData, setFormData] = useState<Bank>({
    id: "",
    name: "",
    logo: "",
    fullName: "",
  });

  const columns: Column<Bank>[] = [
    {
      key: "id",
      label: "ID",
      render: (value) => (
        <span className="font-mono text-muted-foreground">#{value}</span>
      ),
    },
    {
      key: "name",
      label: "Ngân hàng",
      render: (value, item) => (
        <div className="flex items-center gap-4 py-1">
          <div className="w-10 h-10 rounded-xl border bg-white flex items-center justify-center p-2 shadow-sm overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
            <img
              src={item.logo}
              alt={value as string}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/48x48?text=" + (value as string)?.[0];
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight">{value}</span>
            <span className="text-sm text-muted-foreground line-clamp-1">
              {item.fullName}
            </span>
          </div>
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      id: "",
      name: "",
      logo: "",
      fullName: "",
    });
    setLogoFile(null);
    setLogoPreview("");
    setFormOpen(true);
  };

  const handleEdit = (item: Bank) => {
    setEditItem(item);
    setFormData({
      id: item.id,
      name: item.name,
      logo: item.logo,
      fullName: item.fullName,
    });
    setLogoFile(null);
    setLogoPreview(item.logo);
    setFormOpen(true);
  };

  const handleDelete = (item: Bank) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData({ ...formData, logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setFormData({ ...formData, logo: "" });
  };

  const handleSubmit = () => {
    if (editItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...formData } : item,
        ),
      );
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin ngân hàng",
      });
    } else {
      const newItem: Bank = {
        ...formData,
        id: formData.id || String(Date.now()),
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm ngân hàng mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa ngân hàng",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Danh mục ngân hàng"
      description="Quản lý danh sách các ngân hàng được hỗ trợ trong hệ thống"
      actions={
        <Button onClick={handleAdd} data-testid="add-bank">
          <Plus className="w-4 h-4 mr-2" />
          Thêm ngân hàng
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        pageSize={10}
        searchPlaceholder="Tìm kiếm tên ngân hàng..."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa ngân hàng" : "Thêm ngân hàng mới"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">ID *</Label>
            <Input
              id="id"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="VD: VCB, BIDV, ACB..."
              disabled={!!editItem}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tên ngân hàng *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Vietcombank, BIDV..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Tên đầy đủ *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="VD: Ngân hàng TMCP Ngoại Thương Việt Nam"
            />
          </div>

          <div className="space-y-2">
            <Label>Logo ngân hàng</Label>
            {logoPreview ? (
              <div className="relative">
                <div className="p-4 border-2 border-dashed rounded-lg bg-muted/50 flex items-center justify-center">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-16 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/100x48?text=Logo";
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="logo-upload"
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
              >
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium text-muted-foreground">
                  Click để tải logo lên
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, SVG (tối đa 2MB)
                </span>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa ngân hàng này khỏi danh sách?"
      />
    </AdminLayout>
  );
}
