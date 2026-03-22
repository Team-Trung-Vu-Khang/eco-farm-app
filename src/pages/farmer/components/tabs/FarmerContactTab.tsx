import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Mail, Phone, Users } from "lucide-react";
import type { Contact } from "../../types";

interface FarmerContactTabProps {
  contacts?: Contact[];
}

export const FarmerContactTab = ({ contacts }: FarmerContactTabProps) => {
  return (
    <div className="space-y-4">
      {!contacts || contacts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có người liên hệ nào.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {contacts.map((contact, i) => (
            <Card
              key={i}
              className="hover:border-primary/50 transition-colors shadow-sm"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base truncate">
                    {contact.name}
                  </h4>
                  <div className="flex flex-col gap-1 mt-1 font-medium">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      <span>{contact.phone}</span>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
