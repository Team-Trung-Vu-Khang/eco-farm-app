import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  FormDialog,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
  type Column,
  Editor,
  convertLexicalToHtml,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@tankhang1/eco-shared-ui";

interface Certificate {
  id: number;
  code: string;
  name: string;
  organization: string;
  content: string;
  contentType: "editor" | "file";
  fileUrl?: string;
  stampUrl?: string;
  stampType: "url" | "file";
  stampFileUrl?: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const CertificatePage = () => {
  const { toast } = useToast();
  const editorStateRef = useRef<any>(null);

  const [data, setData] = useState<Certificate[]>([
    {
      id: 1,
      code: "CH001",
      name: "Global GAP",
      organization: "Tổ chức GlobalGAP",
      content: "Chứng nhận thực hành nông nghiệp tốt toàn cầu",
      contentType: "editor",
      stampUrl: "https://lifarm.vn/wp-content/uploads/2025/03/globalgap-1.png",
      stampType: "url",
      description: "Tiêu chuẩn về thực hành nông nghiệp tốt",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "CH002",
      name: "VietGAP",
      organization: "Bộ Nông nghiệp",
      content: "Chứng nhận thực hành nông nghiệp tốt Việt Nam",
      contentType: "editor",
      stampUrl:
        "https://vietpatservice.com/wp-content/uploads/2019/04/VietGAP.jpg",
      stampType: "url",
      description:
        "Tiêu chuẩn về thực hành sản xuất nông nghiệp tốt ở Việt Nam",
      status: "active",
      createdAt: "2024-01-11",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Certificate | null>(null);
  const [deleteItem, setDeleteItem] = useState<Certificate | null>(null);

  const [formData, setFormData] = useState<
    Omit<Certificate, "id" | "createdAt">
  >({
    code: "",
    name: "",
    organization: "",
    content: "",
    contentType: "editor",
    fileUrl: "",
    stampUrl: "",
    stampType: "url",
    stampFileUrl: "",
    description: "",
    status: "active",
  });

  const columns: Column<Certificate>[] = [
    { key: "code", label: "Mã số" },
    { key: "name", label: "Tên tiêu chuẩn" },
    {
      key: "stampUrl",
      label: "Dấu mộc",
      render: (value) =>
        value ? (
          <img
            src={value as string}
            alt="Stamp"
            className="w-8 h-8 object-contain"
          />
        ) : (
          <span>-</span>
        ),
    },
    { key: "organization", label: "Tổ chức" },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      organization: "",
      content: "",
      contentType: "editor",
      fileUrl: "",
      stampUrl: "",
      stampType: "url",
      stampFileUrl: "",
      description: "",
      status: "active",
    });
    editorStateRef.current = null;
    setFormOpen(true);
  };

  const handleEdit = (item: Certificate) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      organization: item.organization,
      content: item.content,
      contentType: item.contentType || "editor",
      fileUrl: item.fileUrl || "",
      stampUrl: item.stampUrl || "",
      stampType: item.stampType || "url",
      stampFileUrl: item.stampFileUrl || "",
      description: item.description,
      status: item.status,
    });
    editorStateRef.current = null;
    setFormOpen(true);
  };

  const handleDelete = (item: Certificate) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = async () => {
    let finalContent = formData.content;

    if (editorStateRef.current) {
      try {
        const serialized = editorStateRef.current.toJSON();
        finalContent = await convertLexicalToHtml(serialized);
      } catch (error) {
        console.error("Error converting editor content:", error);
      }
    }

    const submissionData = { ...formData, content: finalContent };

    if (editItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...submissionData } : item,
        ),
      );
      toast({ title: "Thành công", description: "Đã cập nhật chứng chỉ" });
    } else {
      const newItem: Certificate = {
        id: Date.now(),
        ...submissionData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({ title: "Thành công", description: "Đã thêm chứng chỉ mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa tiêu chuẩn" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Danh mục tiêu chuẩn"
      description="Quản lý danh sách các loại chứng chỉ/tiêu chuẩn (Master Data)"
      actions={
        <Button onClick={handleAdd} data-testid="add-certificate">
          <Plus className="w-4 h-4 mr-2" />
          Thêm tiêu chuẩn
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm tiêu chuẩn..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa tiêu chuẩn" : "Thêm tiêu chuẩn mới"}
        onSubmit={handleSubmit}
        size="xl"
      >
        <div className="max-h-[70vh] overflow-y-auto px-1 flex flex-col md:flex-row gap-6">
          {/* Left Column: Stamp/Logo */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <Label>Dấu mộc</Label>
            <Tabs
              defaultValue={formData.stampType}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  stampType: value as "url" | "file",
                })
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="file">File</TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div className="border rounded-lg p-4 flex items-center justify-center bg-muted/20 min-h-[200px] relative overflow-hidden">
                  {formData.stampUrl ? (
                    <img
                      src={formData.stampUrl}
                      alt="Stamp Preview"
                      className="max-w-full max-h-[180px] object-contain"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                      <span>Chưa có hình ảnh</span>
                    </div>
                  )}
                </div>
                <Input
                  id="stampUrl"
                  value={formData.stampUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, stampUrl: e.target.value })
                  }
                  placeholder="URL hình ảnh..."
                />
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="border rounded-lg p-4 flex items-center justify-center bg-muted/20 min-h-[200px]">
                  {formData.stampFileUrl ? (
                    <div className="text-center space-y-2">
                      <div className="text-sm text-muted-foreground">
                        File đã chọn
                      </div>
                      <a
                        href={formData.stampFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        Xem file
                      </a>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground text-sm">
                      <span>Chưa có file</span>
                    </div>
                  )}
                </div>
                <Input
                  id="stampFileUrl"
                  value={formData.stampFileUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, stampFileUrl: e.target.value })
                  }
                  placeholder="Đường dẫn file..."
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: Content */}
          <div className="w-full md:w-2/3 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã số</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="VD: CH001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên tiêu chuẩn</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: GlobalGAP"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Tên tổ chức</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                placeholder="VD: Hiệp hội nông nghiệp..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Định nghĩa / Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả thêm..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Nội dung giấy chứng nhận</Label>
              <Tabs
                defaultValue={formData.contentType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    contentType: value as "editor" | "file",
                  })
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">Soạn thảo</TabsTrigger>
                  <TabsTrigger value="file">Upload File</TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="mt-4">
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Nội dung giấy chứng nhận..."
                    rows={2}
                  />
                </TabsContent>

                <TabsContent value="file" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fileUpload">Chọn file (PDF, DOCX...)</Label>
                    <Input
                      id="fileUpload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Tạo URL tạm thời cho file
                          const fileUrl = URL.createObjectURL(file);
                          setFormData({
                            ...formData,
                            fileUrl: fileUrl,
                            content: file.name,
                          });
                        }
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                  {formData.fileUrl && (
                    <div className="p-4 border rounded bg-muted/20 space-y-2">
                      <div className="text-sm text-muted-foreground">
                        File đã chọn:{" "}
                        <span className="font-medium">{formData.content}</span>
                      </div>
                      <a
                        href={formData.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-sm inline-block"
                      >
                        Xem file
                      </a>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa chứng chỉ này?"
      />
    </AdminLayout>
  );
};
export default CertificatePage;
