import { Mail, Phone, User, Users } from "lucide-react";
import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Enterprise } from "../../data/constants";

export function EnterpriseContactsTab({ data }: { data: Enterprise }) {
  const contacts = data.contacts?.length
    ? data.contacts
    : data.phone || data.email
      ? [
          {
            name: data.representative || data.name,
            phone: data.phone,
            email: data.email,
          },
        ]
      : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-muted/5 p-4 rounded-xl border border-primary/10">
        <Users className="w-5 h-5 text-primary" />
        <h4 className="font-bold text-lg">Danh sách liên hệ</h4>
        <Badge className="bg-primary/10 text-primary border-none">
          {contacts.length}
        </Badge>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-3xl bg-muted/5">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">
            Chưa có liên hệ nào được thêm
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact, index) => (
            <Card
              key={`${contact.name}-${contact.phone}-${contact.email}-${index}`}
              className="hover:border-primary/40 transition-all shadow-sm"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base">{contact.name}</h3>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs">
                            Mặc định
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Liên hệ doanh nghiệp
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm bg-muted/30 p-4 rounded-lg">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
                      Số điện thoại
                    </span>
                    <div className="font-medium flex items-center gap-2">
                      <Phone className="w-3 h-3 text-primary" />
                      {contact.phone || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
                      Email
                    </span>
                    <div className="font-medium flex items-center gap-2 truncate">
                      <Mail className="w-3 h-3 text-primary" />
                      {contact.email || "-"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
