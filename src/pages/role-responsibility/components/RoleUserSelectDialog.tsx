import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, Search, User, Users } from "lucide-react";
import type { NguoiDungVaiTro } from "../types";

interface RoleUserSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: NguoiDungVaiTro[];
  selectedIds: string[];
  onConfirm: (selectedIds: string[]) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function RoleUserSelectDialog({
  open,
  onOpenChange,
  options,
  selectedIds,
  onConfirm,
}: RoleUserSelectDialogProps) {
  const [search, setSearch] = useState("");
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedIds);

  useEffect(() => {
    if (open) {
      setTempSelectedIds(selectedIds);
      setSearch("");
    }
  }, [open, selectedIds]);

  const filteredOptions = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return options;

    return options.filter((item) =>
      [item.hoTen, item.chucDanh, item.donVi, item.email]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(keyword)),
    );
  }, [options, search]);

  const toggleUser = (userId: string) => {
    setTempSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((item) => item !== userId)
        : [...prev, userId],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b bg-slate-50/50 p-6">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p>Chọn người dùng phụ trách</p>
              <p className="mt-1 text-sm font-normal text-muted-foreground">
                Tìm kiếm và chọn một hoặc nhiều người dùng để gán vào vai trò.
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="border-b bg-white p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 pl-10"
              placeholder="Tìm theo tên, chức danh, đơn vị hoặc email..."
            />
          </div>
        </div>

        <div className="max-h-[440px] overflow-y-auto bg-slate-50/30 p-4">
          {filteredOptions.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredOptions.map((item) => {
                const isSelected = tempSelectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleUser(item.id)}
                    className={`flex items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition-all ${
                      isSelected
                        ? "border-sky-500 bg-sky-50 shadow-sm"
                        : "border-transparent hover:border-slate-200"
                    }`}
                  >
                    <Avatar className="h-12 w-12 shrink-0 border-2 border-white shadow-sm">
                      <AvatarImage src={item.avatar} />
                      <AvatarFallback className="bg-sky-100 font-semibold text-sky-700">
                        {getInitials(item.hoTen) || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold text-slate-900">{item.hoTen}</p>
                        <Badge
                          className={
                            item.trangThai === "dang-lam-viec"
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          }
                        >
                          {item.trangThai === "dang-lam-viec"
                            ? "Đang làm việc"
                            : "Tạm ngưng"}
                        </Badge>
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {item.chucDanh}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{item.donVi}</p>
                      {item.email ? (
                        <p className="truncate text-xs text-slate-400">{item.email}</p>
                      ) : null}
                    </div>

                    {isSelected ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-sky-600" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-sm text-muted-foreground">
              Không tìm thấy người dùng phù hợp với từ khóa hiện tại.
            </div>
          )}
        </div>

        <DialogFooter className="border-t bg-white p-6">
          <div className="flex w-full items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Đã chọn <span className="font-semibold text-foreground">{tempSelectedIds.length}</span> người dùng
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button
                onClick={() => {
                  onConfirm(tempSelectedIds);
                  onOpenChange(false);
                }}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
