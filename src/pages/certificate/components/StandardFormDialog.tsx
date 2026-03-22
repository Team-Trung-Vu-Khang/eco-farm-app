import { useState } from "react";
import {
  FormDialog,
  Label,
  Input,
  Textarea,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Upload, X } from "lucide-react";
import type {
  Certificate,
  CertificationOrganization,
} from "../hooks/useCertificate";

interface StandardFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: Certificate | null;
  formData: Omit<Certificate, "id" | "createdAt">;
  setFormData: (data: Omit<Certificate, "id" | "createdAt">) => void;
  organizations: CertificationOrganization[];
  onSubmit: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function StandardFormDialog({
  open,
  onOpenChange,
  editItem,
  formData,
  setFormData,
  organizations,
  onSubmit,
  searchQuery,
  setSearchQuery,
}: StandardFormDialogProps) {
  const [stampPreview, setStampPreview] = useState<string>(
    formData.stampUrl || "",
  );

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setStampPreview(result);
        setFormData({ ...formData, stampUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveStamp = () => {
    setStampPreview("");
    setFormData({ ...formData, stampUrl: "" });
  };

  const toggleOrganization = (orgId: number) => {
    setFormData({
      ...formData,
      organizationIds: formData.organizationIds.includes(orgId)
        ? formData.organizationIds.filter((id) => id !== orgId)
        : [...formData.organizationIds, orgId],
    });
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        editItem ? "Chỉnh sửa loại tiêu chuẩn" : "Thêm loại tiêu chuẩn mới"
      }
      onSubmit={onSubmit}
      size="xl"
    >
      <div className="max-h-[70vh] overflow-y-auto px-1 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <Label>Dấu mộc</Label>
          {stampPreview ? (
            <div className="relative">
              <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center bg-muted/20 min-h-[200px]">
                <img
                  src={stampPreview}
                  alt="Stamp Preview"
                  className="max-w-full max-h-[180px] object-contain"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveStamp}
                className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="stamp-upload"
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors min-h-[200px]"
            >
              <Upload className="w-10 h-10 text-muted-foreground mb-3" />
              <span className="text-sm font-medium text-muted-foreground">
                Click để tải ảnh dấu mộc lên
              </span>
              <input
                id="stamp-upload"
                type="file"
                accept="image/*"
                onChange={handleStampUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

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
            <Label>Tổ chức có thể cấp chứng nhận</Label>
            <Input
              placeholder="Tìm kiếm tổ chức..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
            <div className="border rounded-lg p-4 space-y-2 max-h-[200px] overflow-y-auto">
              {filteredOrganizations.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                  onClick={() => toggleOrganization(org.id)}
                >
                  <input
                    type="checkbox"
                    checked={formData.organizationIds.includes(org.id)}
                    readOnly
                    className="cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{org.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {org.code}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              value={formData.contentType}
              onValueChange={(val) =>
                setFormData({
                  ...formData,
                  contentType: val as "editor" | "file",
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
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Nội dung giấy chứng nhận..."
                  rows={2}
                />
              </TabsContent>
              <TabsContent value="file" className="mt-4">
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({
                        ...formData,
                        fileUrl: URL.createObjectURL(file),
                        content: file.name,
                      });
                    }
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </FormDialog>
  );
}
