import { useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Search, X } from "lucide-react";
import { useContacts, type ContactRecord } from "@/features/contact";

interface ContactSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId?: number | string | null;
  onSelect: (contact: ContactRecord) => void;
}

export function ContactSelectorDialog({
  open,
  onOpenChange,
  selectedId = null,
  onSelect,
}: ContactSelectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedId, setTempSelectedId] = useState<number | string | null>(
    selectedId,
  );
  const contactsQuery = useContacts({
    params: {
      keyword: searchTerm.trim() || undefined,
      status: "active",
      page: 0,
      size: 100,
    },
    enabled: open,
  });

  const filteredContacts = contactsQuery.items;

  const selectedContact = filteredContacts.find(
    (contact) => contact.id === tempSelectedId,
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setTempSelectedId(selectedId);
          setSearchTerm("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="flex h-[90vh] max-h-[90vh] w-[95vw] sm:w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50 px-4 py-4 sm:px-6 sm:py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-4 w-4" />
            </div>
            Chọn người liên hệ
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Chọn nhanh từ store Thông tin liên hệ để điền vào nông hộ.
          </p>
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-4 py-4 sm:px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên, số điện thoại, email, đơn vị..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {contactsQuery.loading
                ? "Đang tải..."
                : `${filteredContacts.length} kết quả`}
            </span>
            {selectedContact && (
              <span
                className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary max-w-full"
                title={`Đang chọn: ${selectedContact.fullName}`}
              >
                <Check className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  Đang chọn: {selectedContact.fullName}
                </span>
              </span>
            )}
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="grid gap-3 p-4 sm:p-6 sm:grid-cols-2">
            {filteredContacts.map((contact) => {
              const isSelected = tempSelectedId === contact.id;

              return (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => setTempSelectedId(contact.id)}
                  className={cn(
                    "group flex w-full min-w-0 items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md",
                    isSelected
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-slate-200",
                  )}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="text-sm font-bold">
                        {contact.fullName?.[0] || "C"}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {contact.fullName}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {contact.position || ""}
                          {contact.position && contact.department?.name
                            ? " • "
                            : ""}
                          {contact.department?.name || ""}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700"
                      >
                        {contact.phone}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 max-w-full"
                        title={contact.entityName ?? ""}
                      >
                        <span className="truncate">{contact.entityName}</span>
                      </Badge>
                    </div>

                    {contact.email && (
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {contact.email}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

            {!contactsQuery.loading && filteredContacts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <X className="mb-2 h-5 w-5 text-slate-400" />
                Không tìm thấy liên hệ phù hợp
              </div>
            )}
            {contactsQuery.loading && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <Search className="mb-2 h-5 w-5 animate-pulse text-slate-400" />
                Đang tải danh sách liên hệ
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 border-t bg-white px-4 py-4 sm:px-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              const contact = filteredContacts.find(
                (item) => item.id === tempSelectedId,
              );
              if (contact) onSelect(contact);
              onOpenChange(false);
            }}
            disabled={!tempSelectedId}
            className="bg-primary hover:bg-primary/90"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
