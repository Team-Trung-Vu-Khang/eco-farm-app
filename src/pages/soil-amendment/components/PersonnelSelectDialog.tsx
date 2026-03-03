import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@tankhang1/eco-shared-ui";
import { Search, User, FilterX } from "lucide-react";
import usePersonnelStore from "../../../stores/usePersonnelStore";

interface PersonnelSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedName?: string;
  onConfirm: (name: string) => void;
}

export function PersonnelSelectDialog({
  open,
  onOpenChange,
  selectedName,
  onConfirm,
}: PersonnelSelectDialogProps) {
  const { personnel } = usePersonnelStore();
  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] = useState<string | undefined>(
    selectedName,
  );

  // Sync temp selection when dialog opens
  React.useEffect(() => {
    if (open) {
      setTempSelected(selectedName);
    }
  }, [open, selectedName]);

  const filteredPersonnel = useMemo(() => {
    const searchLower = search.toLowerCase();
    return personnel.filter((p) => {
      return (
        p.fullName.toLowerCase().includes(searchLower) ||
        p.position.toLowerCase().includes(searchLower) ||
        p.department.toLowerCase().includes(searchLower)
      );
    });
  }, [personnel, search]);

  const handleSelect = (name: string) => {
    setTempSelected(name);
  };

  const handleConfirm = () => {
    if (tempSelected) {
      onConfirm(tempSelected);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0 flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 border-b bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Chọn nhân sự phụ trách
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Tìm kiếm và chọn kỹ thuật viên phụ trách kế hoạch cải tạo
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 border-b bg-white sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, vị trí hoặc phòng ban..."
              className="pl-10 h-11 bg-slate-50/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30 min-h-[300px]">
          {filteredPersonnel.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPersonnel.map((p) => {
                const isSelected = tempSelected === p.fullName;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(p.fullName)}
                    className={`
                      group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-white bg-white hover:border-primary/30 hover:shadow-sm"
                      }
                    `}
                  >
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm shrink-0">
                      <AvatarImage src={p.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {p.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                        {p.fullName}
                      </h4>
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="text-xs text-slate-500 font-medium truncate">
                          {p.position}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] w-fit font-normal bg-slate-50"
                        >
                          {p.department}
                        </Badge>
                      </div>
                    </div>

                    <div
                      className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                      ${isSelected ? "border-primary bg-primary" : "border-slate-200"}
                    `}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white animate-in zoom-in-50 duration-200" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <FilterX className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-900">
                Không tìm thấy nhân sự
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-[250px] mx-auto">
                Vui lòng thử lại với từ khóa khác hoặc kiểm tra lại danh sách
                nhân sự.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setSearch("")}
              >
                Xóa tìm kiếm
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 border-t bg-white">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm font-medium text-slate-500">
              {tempSelected ? (
                <span className="text-primary font-bold">
                  Đã chọn: {tempSelected}
                </span>
              ) : (
                "Chưa chọn nhân sự nào"
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="font-bold"
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!tempSelected}
                className="px-8 font-bold shadow-lg shadow-primary/20"
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
