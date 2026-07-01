import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Users, User, Phone, Mail } from "lucide-react";
import type { BranchDetailView } from "../hooks/useBranchDetail";

interface PersonnelCardProps {
  contacts?: BranchDetailView["contacts"];
}

export function PersonnelCard({ contacts }: PersonnelCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Nhân sự liên hệ
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contacts && contacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-start gap-4 p-4 border rounded-xl bg-card hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {contact.name}
                    </h4>
                    {contact.isPrimary && (
                      <Badge variant="secondary" className="text-[10px]">
                        Chính
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-primary font-medium mb-2">
                    {contact.position}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3.5 h-3.5" />
                      {contact.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có thông tin nhân sự liên hệ
          </p>
        )}
      </CardContent>
    </Card>
  );
}
