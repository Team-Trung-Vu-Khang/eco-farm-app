import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Mail, Phone, Plus, Trash2, User, Users } from "lucide-react";
import { ContactSelectorDialog } from "@/pages/farmer/components/ContactSelectorDialog";
import type { BranchFormData, ContactInfo } from "../../types/types";
import type { Contact as StoredContact } from "@/stores/useContactStore";

interface ContactInfoStepProps {
  formData: BranchFormData;
  updateFormData: (updates: Partial<BranchFormData>) => void;
}

export function ContactInfoStep({
  formData,
  updateFormData,
}: ContactInfoStepProps) {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [draftContact, setDraftContact] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const selectedContactLabel = useMemo(() => {
    return draftContact.name || "Chọn liên hệ...";
  }, [draftContact.name]);

  const selectedContacts = useMemo(
    () => formData.contactInfos,
    [formData.contactInfos],
  );

  const handleSelectContact = (contact: StoredContact) => {
    setSelectedContactId(contact.id);
    setDraftContact({
      name: contact.fullName,
      phone: contact.phone,
      email: contact.email,
    });
  };

  const handleAddNewContactInfo = () => {
    if (!draftContact.name && !draftContact.phone && !draftContact.email) return;

    const nextContactInfos: ContactInfo[] = [
      ...formData.contactInfos,
      {
        id: Date.now().toString(),
        name: draftContact.name,
        phone: draftContact.phone,
        email: draftContact.email,
        isPrimary: formData.contactInfos.length === 0,
      },
    ];

    updateFormData({ contactInfos: nextContactInfos });
    setDraftContact({ name: "", phone: "", email: "" });
    setSelectedContactId(null);
  };

  const handleRemoveContactInfo = (id: string) => {
    const nextContactInfos = formData.contactInfos.filter((contact) => contact.id !== id);
    if (nextContactInfos.length > 0 && !nextContactInfos.some((contact) => contact.isPrimary)) {
      nextContactInfos[0] = { ...nextContactInfos[0], isPrimary: true };
    }
    updateFormData({ contactInfos: nextContactInfos });
  };

  const handleSetPrimaryContactInfo = (id: string) => {
    updateFormData({
      contactInfos: formData.contactInfos.map((contact) => ({
        ...contact,
        isPrimary: contact.id === id,
      })),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="overflow-hidden border-primary/20 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Plus className="h-5 w-5 text-primary" />
            Thêm liên hệ mới
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Chọn nhanh từ danh sách liên hệ có sẵn hoặc nhập mới bên dưới.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsContactDialogOpen(true)}
                className="h-11 flex-1 justify-between border-primary/20 bg-muted/20 text-left font-normal hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="truncate">{selectedContactLabel}</span>
                <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Button>
              {(draftContact.name || draftContact.phone || draftContact.email) && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setDraftContact({ name: "", phone: "", email: "" });
                    setSelectedContactId(null);
                  }}
                  className="h-11 px-3 text-muted-foreground"
                >
                  Xóa
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Có thể chọn liên hệ từ store Thông tin liên hệ.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Hoặc nhập tên mới</Label>
            <Input
              value={draftContact.name}
              onChange={(event) =>
                setDraftContact((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="VD: Nguyễn Văn A"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                value={draftContact.phone}
                onChange={(event) =>
                  setDraftContact((prev) => ({ ...prev, phone: event.target.value }))
                }
                placeholder="09xx xxx xxx"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={draftContact.email}
                onChange={(event) =>
                  setDraftContact((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="email@example.com"
              />
            </div>
          </div>

          <Button onClick={handleAddNewContactInfo} className="w-full bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Thêm vào danh sách
          </Button>
        </CardContent>
      </Card>

      <ContactSelectorDialog
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
        selectedId={selectedContactId}
        onSelect={handleSelectContact}
      />

      <div className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <Users className="h-5 w-5 text-primary" />
            Danh sách liên hệ
          </h3>
          <Badge variant="secondary" className="px-3 py-1 rounded-full text-sm">
            {selectedContacts.length} liên hệ
          </Badge>
        </div>

        {selectedContacts.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed bg-muted/5 py-16 text-center transition-colors hover:bg-muted/10">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/40">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h5 className="text-lg font-bold text-muted-foreground">
              Chưa có liên hệ nào
            </h5>
            <p className="mt-2 text-sm text-muted-foreground/70">
              Các liên hệ bạn thêm sẽ hiển thị tại đây để kiểm tra trước khi lưu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {formData.contactInfos.map((contactInfo, index) => (
              <Card
                key={contactInfo.id}
                className="group overflow-hidden border-primary/10 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {contactInfo.name || `Liên hệ #${index + 1}`}
                        </div>
                        {contactInfo.isPrimary && (
                          <Badge className="mt-1" variant="default">
                            Chính
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!contactInfo.isPrimary && (
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => handleSetPrimaryContactInfo(contactInfo.id)}
                          className="h-8 px-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          Đặt làm chính
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => handleRemoveContactInfo(contactInfo.id)}
                        className="h-8 w-8 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="ml-10 space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{contactInfo.phone || "Chưa nhập số điện thoại"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">
                        {contactInfo.email || "Chưa nhập email"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
