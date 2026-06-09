import { useMemo, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Briefcase, Check, Mail, Phone, Plus, Search, Trash2, User, Users } from "lucide-react";
import usePersonnelStore, { type Personnel } from "@/stores/usePersonnelStore";
import type { BranchFormData, ContactPerson } from "../../types/types";

interface PersonnelStepProps {
  formData: BranchFormData;
  updateFormData: (updates: Partial<BranchFormData>) => void;
}

function PersonnelSelectorDialog({
  open,
  onOpenChange,
  selectedIds,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onConfirm: (personnel: Personnel[]) => void;
}) {
  const personnel = usePersonnelStore((state) => state.personnel);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedIds);

  const departments = useMemo(
    () => Array.from(new Set(personnel.map((item) => item.department))).filter(Boolean),
    [personnel],
  );

  const filteredPersonnel = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();
    return personnel.filter((person) => {
      const matchesSearch =
        !keyword ||
        [
          person.fullName,
          person.phone,
          person.email,
          person.position,
          person.department,
          person.team,
          person.address,
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      const matchesDepartment =
        departmentFilter === "all" || person.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [departmentFilter, personnel, searchTerm]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setTempSelectedIds(selectedIds);
          setSearchTerm("");
          setDepartmentFilter("all");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden border-none p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Briefcase className="h-4 w-4" />
            </div>
            Chọn người liên hệ
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">
            Chọn một hoặc nhiều nhân sự từ danh sách rồi xác nhận để hiển thị bên dưới.
          </DialogDescription>
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, chức vụ, phòng ban..."
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="h-11 w-44 rounded-xl border-slate-200 bg-slate-50">
                <SelectValue placeholder="Phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{filteredPersonnel.length} kết quả</span>
            {tempSelectedIds.length > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary">
                <Check className="h-3 w-3" />
                Đã chọn {tempSelectedIds.length}
              </span>
            )}
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="grid gap-3 p-6 sm:grid-cols-2">
            {filteredPersonnel.map((person) => {
              const isSelected = tempSelectedIds.includes(person.id.toString());

              return (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => {
                    const id = person.id.toString();
                    setTempSelectedIds((prev) =>
                      prev.includes(id)
                        ? prev.filter((item) => item !== id)
                        : [...prev, id],
                    );
                  }}
                  className={cn(
                    "group flex items-center gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md",
                    isSelected
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-slate-200",
                  )}
                >
                  <Avatar className="h-12 w-12 shrink-0 border-2 border-white shadow-sm">
                    <AvatarImage src={person.avatar} />
                    <AvatarFallback className="bg-primary/10 font-bold text-primary">
                      {person.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {person.fullName}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {person.position}
                          {person.position && person.department ? " • " : ""}
                          {person.department}
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
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        {person.phone}
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        {person.team}
                      </Badge>
                    </div>

                    {person.email && (
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {person.email}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredPersonnel.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <Users className="mb-2 h-5 w-5 text-slate-400" />
                Không tìm thấy nhân sự phù hợp
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 border-t bg-white px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              onConfirm(
                personnel.filter((person) =>
                  tempSelectedIds.includes(person.id.toString()),
                ),
              );
              onOpenChange(false);
            }}
            disabled={tempSelectedIds.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PersonnelStep({
  formData,
  updateFormData,
}: PersonnelStepProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const personnel = usePersonnelStore((state) => state.personnel);

  const selectedPersonnel = useMemo(
    () =>
      formData.contacts
        .map((contact) => {
          const person = personnel.find(
            (item) => item.id.toString() === contact.id,
          );
          return {
            ...contact,
            person,
          };
        })
        .filter((item) => item.person),
    [formData.contacts, personnel],
  );

  const selectedIds = formData.contacts.map((contact) => contact.id);

  const handleSelectPersonnel = (selectedItems: Personnel[]) => {
    const nextContacts: ContactPerson[] = selectedItems.map((person, index) => ({
      id: person.id.toString(),
      name: person.fullName,
      position: person.position,
      phone: person.phone,
      email: person.email,
      isPrimary:
        formData.contacts.find((item) => item.id === person.id.toString())
          ?.isPrimary ?? index === 0,
    }));

    if (nextContacts.length > 0 && !nextContacts.some((item) => item.isPrimary)) {
      nextContacts[0] = { ...nextContacts[0], isPrimary: true };
    }

    updateFormData({ contacts: nextContacts });
  };

  const handleRemoveContact = (id: string) => {
    const nextContacts = formData.contacts.filter((contact) => contact.id !== id);
    if (nextContacts.length > 0 && !nextContacts.some((item) => item.isPrimary)) {
      nextContacts[0] = { ...nextContacts[0], isPrimary: true };
    }
    updateFormData({ contacts: nextContacts });
  };

  const handleSetPrimaryContact = (id: string) => {
    updateFormData({
      contacts: formData.contacts.map((contact) => ({
        ...contact,
        isPrimary: contact.id === id,
      })),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                <h4 className="font-semibold">Thêm người liên hệ mới</h4>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Chọn từ danh sách nhân sự có sẵn rồi hiển thị ngay bên dưới.
              </p>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Briefcase className="mr-2 h-4 w-4" />
              Chọn nhân sự
            </Button>
          </div>
        </CardContent>
      </Card>

      <PersonnelSelectorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedIds={selectedIds}
        onConfirm={handleSelectPersonnel}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold">
            <Users className="h-5 w-5 text-primary" />
            Danh sách người liên hệ
          </h3>
          <Badge variant="outline">{selectedPersonnel.length} người</Badge>
        </div>

        {selectedPersonnel.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed py-10 text-center text-muted-foreground">
            <p>Chưa có người liên hệ nào.</p>
            <p className="text-sm">Vui lòng chọn nhân sự ở form phía trên.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {selectedPersonnel.map(({ person, ...contact }) => (
              <div
                key={contact.id}
                className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                        {person?.avatar ? (
                          <img
                            src={person.avatar}
                            alt={person.fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900">
                          {contact.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {contact.position || person?.department || "Người liên hệ"}
                        </div>
                        {contact.isPrimary && (
                          <Badge className="mt-1" variant="default">
                            Chính
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!contact.isPrimary && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetPrimaryContact(contact.id)}
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
                        onClick={() => handleRemoveContact(contact.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                    <div className="ml-10 space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3 w-3" />
                        <span>{person?.position || "Chưa có chức vụ"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{contact.phone || "Chưa nhập số điện thoại"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">
                          {contact.email || "Chưa nhập email"}
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
