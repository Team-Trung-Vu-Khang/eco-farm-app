import {
  Input,
  Label,
  Badge,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, Trash2, Users } from "lucide-react";
import type { BranchFormData, ContactPerson } from "../../types/types";

interface PersonnelStepProps {
  formData: BranchFormData;
  updateFormData: (updates: Partial<BranchFormData>) => void;
}

export function PersonnelStep({
  formData,
  updateFormData,
}: PersonnelStepProps) {
  const handleAddNewContact = () => {
    const newContact: ContactPerson = {
      id: Date.now().toString(),
      name: "",
      position: "",
      phone: "",
      email: "",
      isPrimary: formData.contacts.length === 0,
    };
    updateFormData({ contacts: [...formData.contacts, newContact] });
  };

  const handleRemoveContact = (id: string) => {
    updateFormData({ contacts: formData.contacts.filter((c) => c.id !== id) });
  };

  const handleUpdateContact = (
    id: string,
    field: keyof ContactPerson,
    value: ContactPerson[keyof ContactPerson],
  ) => {
    updateFormData({
      contacts: formData.contacts.map((c) =>
        c.id === id ? { ...c, [field]: value } : c,
      ),
    });
  };

  const handleSetPrimaryContact = (id: string) => {
    updateFormData({
      contacts: formData.contacts.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      })),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <h4 className="font-semibold text-lg flex items-center justify-between">
          Danh sách người liên hệ
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{formData.contacts.length}</Badge>
            <Button onClick={handleAddNewContact}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo người liên hệ mới
            </Button>
          </div>
        </h4>

        {formData.contacts.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              Chưa có người liên hệ nào
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.contacts.map((contact, index) => (
              <div
                key={contact.id}
                className="border rounded-lg p-4 bg-card shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Người liên hệ #{index + 1}</h4>
                    {contact.isPrimary && (
                      <Badge variant="default">Chính</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!contact.isPrimary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetPrimaryContact(contact.id)}
                        type="button"
                      >
                        Đặt làm chính
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContact(contact.id)}
                      type="button"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Họ và tên</Label>
                    <Input
                      value={contact.name}
                      onChange={(e) =>
                        handleUpdateContact(contact.id, "name", e.target.value)
                      }
                      placeholder="VD: Nguyễn Văn A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Chức vụ</Label>
                    <Input
                      value={contact.position}
                      onChange={(e) =>
                        handleUpdateContact(
                          contact.id,
                          "position",
                          e.target.value,
                        )
                      }
                      placeholder="VD: Giám đốc chi nhánh"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Số điện thoại</Label>
                    <Input
                      value={contact.phone}
                      onChange={(e) =>
                        handleUpdateContact(contact.id, "phone", e.target.value)
                      }
                      placeholder="VD: 0901234567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={contact.email}
                      onChange={(e) =>
                        handleUpdateContact(contact.id, "email", e.target.value)
                      }
                      placeholder="VD: nguyenvana@ecofarm.vn"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
