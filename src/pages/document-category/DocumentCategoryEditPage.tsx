import PageWrapper from "@/components/PageWrapper";
import { Button, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import useDocumentCategoryStore from "../../stores/useDocumentCategoryStore";
import { DocumentCategoryForm } from "./components/DocumentCategoryForm";
import { type DocumentCategory } from "./data/constants";

const DocumentCategoryEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { getCategoryById, updateCategory } = useDocumentCategoryStore();

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

  useEffect(() => {
    if (id) {
      const category = getCategoryById(Number(id));
      if (category) {
        setFormData({
          code: category.code,
          name: category.name,
          description: category.description,
          entityTypes: category.entityTypes,
          required: category.required,
          allowMultiple: category.allowMultiple,
          hasExpiry: category.hasExpiry,
          status: category.status,
        });
      } else {
        toast({
          title: "Không tìm thấy",
          description: "Danh mục hồ sơ không tồn tại hoặc đã bị xóa.",
          variant: "destructive",
        });
        setLocation("/document-category");
      }
    }
  }, [id, getCategoryById, setLocation, toast]);

  const handleSave = () => {
    if (!formData.name) {
      toast({
        title: "Lỗi dữ liệu",
        description: "Vui lòng nhập Tên tài liệu.",
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

    updateCategory(Number(id), formData);
    toast({
      title: "Thành công",
      description: `Đã cập nhật danh mục "${formData.name}" thành công.`,
    });
    setLocation("/document-category");
  };

  return (
    <PageWrapper
      title="Cập nhật danh mục hồ sơ"
      description={`Chỉnh sửa cấu hình cho tài liệu: ${formData.name}`}
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
            Lưu thay đổi
          </Button>
        </div>
      }
    >
      <DocumentCategoryForm
        formData={formData}
        onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
        isEdit
      />
    </PageWrapper>
  );
};

export default DocumentCategoryEditPage;
