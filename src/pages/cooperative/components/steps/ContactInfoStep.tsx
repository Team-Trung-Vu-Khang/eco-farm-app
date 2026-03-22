import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Label,
  Input,
  Button,
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, Users, User, Trash2, CreditCard } from "lucide-react";
import type { Contact, CooperativeFormData } from "../../types/types";

interface ContactInfoStepProps {
  formData: CooperativeFormData;
  newContact: Contact;
  setNewContact: (contact: Contact) => void;
  addContact: () => void;
  removeContact: (index: number) => void;
}

export function ContactInfoStep({
  formData,
  newContact,
  setNewContact,
  addContact,
  removeContact,
}: ContactInfoStepProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Thêm liên hệ mới
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="contact-name">Họ và tên *</Label>
              <Input
                id="contact-name"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                placeholder="VD: Nguyễn Văn A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Số điện thoại *</Label>
              <Input
                id="contact-phone"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                placeholder="09xx xxx xxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={newContact.email}
                onChange={(e) =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
                placeholder="email@example.com"
              />
            </div>
          </div>
          <Button onClick={addContact} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Thêm vào danh sách
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Danh sách liên hệ
          </h3>
          <Badge variant="outline">{formData.contacts.length} liên hệ</Badge>
        </div>

        {formData.contacts.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
            <p>Chưa có thông tin liên hệ nào.</p>
            <p className="text-sm">Vui lòng thêm liên hệ ở form phía trên.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.contacts.map((contact, index) => (
              <div
                key={index}
                className="relative group bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-bold">{contact.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeContact(index)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground ml-10">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3 h-3" />
                      <span>{contact.phone}</span>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 flex items-center justify-center">
                          @
                        </span>
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
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
