import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  Editor,
  FormDialog,
  Input,
  Label,
  Textarea,
  useToast,
  type Column,
  type EditorState,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useDialogBugWorkaround } from "../shared/hooks/useDialogBugWorkaround";

interface GenericItem {
  id: number;
  code: string;
  name: string;
  image?: string;
  status: "active" | "inactive";
  description: string | EditorState;
  createdAt: string;
}

interface FieldConfig {
  required?: boolean;
  hidden?: boolean;
  label?: string;
  placeholder?: string;
}

interface GenericPageFieldConfig {
  code?: FieldConfig;
  name?: FieldConfig;
  description?: FieldConfig;
  image?: FieldConfig;
}

interface GenericPageProps {
  title: string;
  description: string;
  entityName: string;
  initialData: GenericItem[];
  enableImage?: boolean;
  withRichTextEditor?: boolean;
  columns?: Column<GenericItem>[];
  fieldConfig?: GenericPageFieldConfig;
  isLoading?: boolean;
  formDialogLoading?: boolean;
  onSubmit?: (
    data: Partial<GenericItem>,
    editId: number | null,
  ) => Promise<void> | void;
  onDelete?: (id: number) => Promise<void> | void;
  searchable?: boolean;
  onSearch?: (value: string) => void;
  pageSize?: number;
  currentIndex?: number;
  totalElements?: number;
  totalPages?: number;
  onPageSize?: (size: number) => void;
  onIndexChange?: (index: number) => void;
}

export function GenericPage({
  title,
  columns,
  description,
  entityName,
  initialData,
  enableImage = false,
  withRichTextEditor = false,
  fieldConfig = {},
  isLoading = false,
  formDialogLoading = false,
  onSubmit,
  onDelete,
  searchable,
  onSearch,
  pageSize,
  currentIndex,
  totalElements,
  totalPages,
  onPageSize,
  onIndexChange,
}: GenericPageProps) {
  const { toast } = useToast();
  const [data, setData] = useState<GenericItem[]>(initialData);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<GenericItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<GenericItem | null>(null);
  const [formData, setFormData] = useState<Partial<GenericItem>>({
    code: "",
    name: "",
    image: "",
    description: "",
  });

  const _columns: Column<GenericItem>[] = React.useMemo(() => {
    return (
      columns || [
        { key: "code", label: "Mã" },
        ...(enableImage
          ? [
              {
                key: "image" as keyof GenericItem,
                label: "Hình ảnh",
                render: (value: any) =>
                  value ? (
                    <img
                      src={value as string}
                      alt="item"
                      className="w-10 h-10 object-cover rounded-md border"
                    />
                  ) : null,
              },
            ]
          : []),
        { key: "name", label: "Tên" },
        { key: "description", label: "Mô tả" },
        {
          key: "status",
          label: "Trạng thái",
          render: (value) => (
            <Badge variant={value === "active" ? "default" : "secondary"}>
              {value === "active" ? "Hoạt động" : "Không hoạt động"}
            </Badge>
          ),
        },
        { key: "createdAt", label: "Ngày tạo" },
      ]
    );
  }, [columns, enableImage]);

  const handleAdd = () => {
    setEditItem(null);
    setFormData({ code: "", name: "", image: "", description: "" });
    setFormOpen(true);
  };

  const handleEdit = (item: GenericItem) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      image: item.image || "",
      description: item?.description,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: GenericItem) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields: Array<keyof typeof formData> = [];
    if (fieldConfig.code?.required && !formData.code?.trim())
      requiredFields.push("code");
    if (fieldConfig.name?.required !== false && !formData.name?.trim())
      requiredFields.push("name");
    if (fieldConfig.description?.required && !formData.description)
      requiredFields.push("description");

    if (requiredFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Thiếu thông tin bắt buộc",
        description: "Vui lòng điền đầy đủ các trường bắt buộc (*)",
      });
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData, editItem?.id || null);
        setFormOpen(false);
        return;
      }

      if (editItem) {
        setData((prev) =>
          prev.map((item) =>
            item.id === editItem.id ? { ...item, ...formData } : item,
          ),
        );
        toast({
          title: "Thành công",
          description: `Đã cập nhật ${entityName}`,
        });
      } else {
        const newItem: GenericItem = {
          id: Date.now(),
          code: formData.code || "",
          name: formData.name || "",
          description: formData.description || "",
          image: formData.image,
          status: "active",
          createdAt: new Date().toISOString().split("T")[0],
        };
        setData((prev) => [...prev, newItem]);
        toast({
          title: "Thành công",
          description: `Đã thêm ${entityName} mới`,
        });
      }
      setFormOpen(false);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: e.message || "Đã xảy ra lỗi",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      try {
        if (onDelete) {
          await onDelete(deleteItem.id);
        } else {
          setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
          toast({ title: "Thành công", description: `Đã xóa ${entityName}` });
        }
        setDeleteOpen(false);
      } catch (e: any) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: e.message || "Đã xảy ra lỗi",
        });
      }
    }
  };

  useDialogBugWorkaround([formOpen, deleteOpen]);

  return (
    <AdminLayout
      isDev={true}
      title={title}
      description={description}
      actions={
        <Button onClick={handleAdd} data-testid={`add-${entityName}`}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm {entityName}
        </Button>
      }
    >
      <DataTable
        loading={isLoading}
        columns={_columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder={`Tìm kiếm ${entityName}...`}
        searchable={searchable}
        onSearch={onSearch}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={totalElements}
        totalPages={totalPages}
        onPageSize={onPageSize}
        onIndexChange={onIndexChange}
      />

      <FormDialog
        size="lg"
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? `Chỉnh sửa ${entityName}` : `Thêm ${entityName} mới`}
        onSubmit={handleSubmit}
        loading={formDialogLoading}
      >
        <div className="w-full space-y-4">
          {!fieldConfig.code?.hidden && (
            <div className="space-y-2">
              <Label htmlFor="code">
                {fieldConfig.code?.label ?? "Mã"}
                {fieldConfig.code?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder={fieldConfig.code?.placeholder ?? "Nhập mã"}
                data-testid="input-code"
              />
            </div>
          )}
          {!fieldConfig.name?.hidden && (
            <div className="space-y-2">
              <Label htmlFor="name">
                {fieldConfig.name?.label ?? "Tên"}
                {fieldConfig.name?.required !== false && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder={fieldConfig.name?.placeholder ?? "Nhập tên"}
                data-testid="input-name"
              />
            </div>
          )}
          {enableImage && (
            <div className="space-y-2">
              <Label htmlFor="image">Hình ảnh</Label>
              <div className="flex flex-col gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setFormData({ ...formData, image: url });
                    }
                  }}
                  data-testid="input-image"
                />
                <div className="text-sm text-gray-500">
                  Hoặc nhập URL hình ảnh:
                </div>
                <Input
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              {formData.image && (
                <div className="mt-2 relative w-full h-40">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x200?text=Invalid+Image";
                    }}
                  />
                </div>
              )}
            </div>
          )}
          {!fieldConfig.description?.hidden && (
            <div className="space-y-2">
              <Label htmlFor="description">
                {fieldConfig.description?.label ?? "Mô tả"}
                {fieldConfig.description?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              {withRichTextEditor ? (
                <Editor
                  contentEditableClassname="min-h-[300px] max-h-[500px] h-auto overflow-y-auto"
                  initialHtml={
                    typeof formData.description === "string"
                      ? formData.description
                      : ""
                  }
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      description: value,
                    })
                  }
                />
              ) : (
                <Textarea
                  id="description"
                  value={
                    typeof formData.description === "string"
                      ? formData.description
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder={
                    fieldConfig.description?.placeholder ?? "Nhập mô tả"
                  }
                  rows={3}
                  data-testid="input-description"
                />
              )}
            </div>
          )}
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={`Bạn có chắc chắn muốn xóa ${entityName} này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết.`}
      />
    </AdminLayout>
  );
}
export default GenericPage;
