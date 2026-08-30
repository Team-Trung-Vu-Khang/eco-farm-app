import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Mail, Phone, Plus, Trash2, User, Users } from "lucide-react";
import { useMemo, useState } from "react";
import type { Contact } from "../../types";
import { ContactSelectorDialog } from "../ContactSelectorDialog";

interface FarmerContactStepProps {
  contacts: Contact[];
  newContact: Contact;
  setNewContact: (contact: Contact) => void;
  addContact: () => void;
  removeContact: (index: number) => void;
}

export const FarmerContactStep = ({
  contacts,
  newContact,
  setNewContact,
  addContact,
  removeContact,
}: FarmerContactStepProps) => {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  const selectedContactLabel = useMemo(() => {
    if (!newContact.name && !newContact.phone) return "Chọn liên hệ...";
    return [newContact.name, newContact.phone].filter(Boolean).join(" - ");
  }, [newContact.name, newContact.phone]);
  const canAddContact = Boolean(newContact.name.trim() && newContact.phone.trim());

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="overflow-hidden border-primary/20 shadow-lg">
        <CardContent className="space-y-6 p-6">
          <Tabs defaultValue="directory" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="directory">Liên hệ từ danh bạ</TabsTrigger>
              <TabsTrigger value="new">Liên hệ mới</TabsTrigger>
            </TabsList>

            <TabsContent value="directory" className="mt-5 space-y-2">
              <Label className="text-sm font-semibold" required>
                Họ và tên
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsContactDialogOpen(true)}
                  className="h-11 flex-1 justify-between border-primary/20 bg-muted/20 text-left font-normal hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="truncate">{selectedContactLabel}</span>
                  <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
                {(newContact.name || newContact.phone || newContact.email) && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setNewContact({ id: "", name: "", phone: "", email: "" })
                    }
                    className="h-11 px-3 text-muted-foreground"
                  >
                    Xóa
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="new" className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold" required>
                  Họ và tên
                </Label>
                <Input
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, id: "", name: e.target.value })
                  }
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold" required>
                    Số điện thoại
                  </Label>
                  <Input
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({ ...newContact, phone: e.target.value })
                    }
                    placeholder="09xx xxx xxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Email</Label>
                  <Input
                    type="email"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button
            disabled={!canAddContact}
            onClick={addContact}
            className="h-11 w-full bg-primary font-bold text-white hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm vào danh sách
          </Button>
        </CardContent>
      </Card>

      <ContactSelectorDialog
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
        selectedId={
          typeof newContact.id === "number" || typeof newContact.id === "string"
            ? newContact.id
            : null
        }
        onSelect={(contact) =>
          setNewContact({
            id: contact.id,
            name: contact.fullName,
            phone: contact.phone,
            email: contact.email || "",
          })
        }
      />

      <div className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <Users className="h-5 w-5 text-primary" />
            Danh sách liên hệ
          </h3>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
            {contacts.length} liên hệ
          </Badge>
        </div>

        {contacts.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed bg-muted/5 py-16 text-center transition-colors hover:bg-muted/10">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/40">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h5 className="text-lg font-bold text-muted-foreground">
              Chưa có liên hệ nào
            </h5>
            <p className="mt-2 text-sm text-muted-foreground/70">
              Các liên hệ bạn thêm sẽ hiển thị tại đây để kiểm tra trước khi
              lưu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {contact.name}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeContact(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="ml-10 space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{contact.phone}</span>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" />
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
};
