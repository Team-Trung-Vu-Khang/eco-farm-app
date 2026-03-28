import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, X } from "lucide-react";
import { useContactCreate } from "./hooks/useContactCreate";
import { ContactFormCard } from "./components/ContactFormCard";

/**
 * Contact create page.
 * Manages the addition of a new contact.
 */
export default function ContactCreatePage() {
  const {
    formData,
    setFormData,
    groups,
    enterprises,
    departments,
    handleSubmit,
    goBack,
  } = useContactCreate();

  return (
    <AdminLayout
      title="Thêm mới liên hệ"
      description="Thêm thông tin liên hệ mới vào hệ thống"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={goBack}>
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Lưu lại
          </Button>
        </div>
      }
    >
      <div className="max-w-2xl mx-auto">
        <ContactFormCard
          formData={formData}
          setFormData={setFormData}
          enterprises={enterprises}
          groups={groups}
          departments={departments}
        />
      </div>
    </AdminLayout>
  );
}
