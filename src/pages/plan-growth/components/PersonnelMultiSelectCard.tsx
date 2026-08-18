import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  Plus,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
export interface PersonnelOption {
  id: number | string;
  fullName: string;
  position: string;
  department: string;
  team: string;
  avatar?: string;
}

interface PersonnelMultiSelectCardProps {
  title: string;
  description: string;
  selectedIds: string[];
  personnel: PersonnelOption[];
  onChange: (ids: string[]) => void;
  tone?: "blue" | "violet";
  emptyText?: string;
}

const toneClasses = {
  blue: {
    ring: "border-blue-100 bg-blue-50/30",
    button: "border-blue-200 text-blue-700 hover:bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    chip: "bg-blue-50 border-blue-100",
    chipText: "text-blue-700",
    selected: "bg-blue-50 border-blue-200",
    check: "text-blue-500",
  },
  violet: {
    ring: "border-violet-100 bg-violet-50/30",
    button: "border-violet-200 text-violet-700 hover:bg-violet-50",
    badge: "bg-violet-100 text-violet-700",
    chip: "bg-violet-50 border-violet-100",
    chipText: "text-violet-700",
    selected: "bg-violet-50 border-violet-200",
    check: "text-violet-500",
  },
} as const;

export function PersonnelMultiSelectCard({
  title,
  description,
  selectedIds,
  personnel,
  onChange,
  tone = "blue",
  emptyText = "Chưa chọn",
}: PersonnelMultiSelectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const classes = toneClasses[tone];

  const selectedPersonnel = useMemo(
    () =>
      selectedIds
        .map((id) => personnel.find((item) => String(item.id) === String(id)))
        .filter(Boolean) as PersonnelOption[],
    [personnel, selectedIds],
  );

  const filteredPersonnel = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return personnel;
    return personnel.filter(
      (item) =>
        item.fullName.toLowerCase().includes(query) ||
        item.position.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query),
    );
  }, [personnel, search]);

  const togglePersonnel = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];
    onChange(next);
  };

  return (
    <>
      <div className={cn("space-y-3 rounded-2xl border p-4", classes.ring)}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-slate-800">{title}</div>
            <div className="text-[11px] text-slate-500">{description}</div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn("h-8 text-xs rounded-xl", classes.button)}
            onClick={() => setIsOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Thêm
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedPersonnel.length > 0 ? (
            selectedPersonnel.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
                  classes.chip,
                )}
              >
                <div className="h-5 w-5 rounded-full bg-white border border-white/60 overflow-hidden flex items-center justify-center shrink-0">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="w-3 h-3 text-slate-400" />
                  )}
                </div>
                <span className={cn("font-medium", classes.chipText)}>
                  {item.fullName}
                </span>
                <button
                  type="button"
                  onClick={() => togglePersonnel(String(item.id))}
                  className="rounded-full p-0.5 hover:bg-white/60"
                >
                  <X className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 italic">{emptyText}</div>
          )}
        </div>
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setSearch("");
        }}
      >
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b bg-slate-50">
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-700" />
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên, chức danh hoặc phòng ban..."
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="max-h-[420px] px-6 py-4">
            <div className="space-y-2">
              {filteredPersonnel.map((item) => {
                const isSelected = selectedIds.includes(String(item.id));
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePersonnel(String(item.id))}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-2xl border p-3 text-left transition-all",
                      isSelected
                        ? classes.selected
                        : "border-slate-100 bg-white hover:border-slate-200",
                    )}
                  >
                    <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 truncate">
                        {item.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {item.position} - {item.department}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] border-transparent", classes.badge)}
                    >
                      {item.team}
                    </Badge>
                    {isSelected ? (
                      <CheckCircle2 className={cn("w-5 h-5", classes.check)} />
                    ) : (
                      <Checkbox checked={false} />
                    )}
                  </button>
                );
              })}
              {filteredPersonnel.length === 0 && (
                <div className="py-10 text-center text-sm text-slate-400">
                  Không tìm thấy nhân sự phù hợp.
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t bg-slate-50">
            <Button
              type="button"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Xác nhận ({selectedIds.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
