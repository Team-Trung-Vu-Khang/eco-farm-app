import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Mail, Phone, Plus, Trash2, User, Users } from "lucide-react";
import type { ContactInfo } from "../types/types";

interface ContactCardProps {
  contactInfos: ContactInfo[];
  newContactInfo: ContactInfo;
  setNewContactInfo: (contact: ContactInfo) => void;
  addContactInfo: () => void;
  removeContactInfo: (id: string) => void;
  setPrimaryContactInfo: (id: string) => void;
}

export function ContactCard({
  contactInfos,
  newContactInfo,
  setNewContactInfo,
  addContactInfo,
  removeContactInfo,
  setPrimaryContactInfo,
}: ContactCardProps) {
  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Plus className="h-4 w-4" />
            Thêm liên hệ mới
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                placeholder="028..."
                value={newContactInfo.phone}
                onChange={(e) =>
                  setNewContactInfo({ ...newContactInfo, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="branch@example.com"
                type="email"
                value={newContactInfo.email}
                onChange={(e) =>
                  setNewContactInfo({ ...newContactInfo, email: e.target.value })
                }
              />
            </div>
          </div>

          <Button onClick={addContactInfo} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Thêm vào danh sách
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold">
            <Users className="h-5 w-5 text-primary" />
            Danh sách thông tin liên hệ
          </h3>
          <Badge variant="outline">{contactInfos.length} liên hệ</Badge>
        </div>

        {contactInfos.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed py-10 text-center text-muted-foreground">
            <p>Chưa có thông tin liên hệ nào.</p>
            <p className="text-sm">Vui lòng thêm liên hệ ở form phía trên.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {contactInfos.map((contactInfo) => (
              <div
                key={contactInfo.id}
                className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold">
                          Liên hệ {contactInfos.findIndex((item) => item.id === contactInfo.id) + 1}
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
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPrimaryContactInfo(contactInfo.id)}
                          className="h-7 px-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          Đặt làm chính
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeContactInfo(contactInfo.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="ml-10 space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{contactInfo.phone || "Chưa nhập số điện thoại"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">
                        {contactInfo.email || "Chưa nhập email"}
                      </span>
                    </div>
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
