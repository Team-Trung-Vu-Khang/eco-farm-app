import {
  AdminLayout,
  Button,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import useDocumentCategoryStore from "../../stores/useDocumentCategoryStore";
import { DocumentCategoryForm } from "./components/DocumentCategoryForm";
import { type DocumentCategory } from "./data/constants";

const DocumentCategoryCreatePage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addCategory } = useDocumentCategoryStore();

  const [formData, setFormData] = useState<
    Omit<DocumentCategory, "id" | "createdAt">
  >({
    code: "",
    name: "",
    description: "",
    entityTypes: [],
    required: false,
    allowMultiple: false,
    hasExpiry: false,
    status: "active",
  });

  const handleSave = () => {
    // Basic validation
    if (!formData.code || !formData.name) {
      toast({
        title: "Lỗi dữ liệu",
        description: "Vui lòng nhập đầy đủ Mã và Tên tài liệu.",
        variant: "destructive",
      });
      return;
    }

    if (formData.entityTypes.length === 0) {
      toast({
        title: "Lỗi dữ liệu",
        description: "Vui lòng chọn ít nhất một đối tượng áp dụng.",
        variant: "destructive",
      });
      return;
    }

    addCategory(formData);
    toast({
      title: "Thành công",
      description: `Đã tạo danh mục tài liệu "${formData.name}" thành công.`,
    });
    setLocation("/document-category");
  };

  return (
    <AdminLayout
      isDev={true}
      title="Tạo danh mục hồ sơ"
      description="Thiết lập các yêu cầu tệp tin cho các đơn vị trong hệ thống"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setLocation("/document-category")}
          >
            <X size={18} className="mr-2" />
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary shadow-lg shadow-primary/20"
          >
            <Save size={18} className="mr-2" />
            Lưu danh mục
          </Button>
        </div>
      }
    >
      <DocumentCategoryForm
        formData={formData}
        onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
      />
    </AdminLayout>
  );
};

export default DocumentCategoryCreatePage;
