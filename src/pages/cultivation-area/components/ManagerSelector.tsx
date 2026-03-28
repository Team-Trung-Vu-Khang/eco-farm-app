import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Briefcase, CheckCircle2, Search, User } from "lucide-react";
import useDepartmentStore from "../../../stores/useDepartmentStore";
import usePersonnelStore from "../../../stores/usePersonnelStore";

interface ManagerSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const ManagerSelector = ({
  selectedId,
  onSelect,
}: ManagerSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const { personnel } = usePersonnelStore();
  const departments = useDepartmentStore((state) => state.departments)
    .filter((department) => department.status === "active")
    .map((department) => department.name);

  const selectedManager = personnel.find(
    (manager) => manager.id.toString() === selectedId,
  );

  const filteredManagers = useMemo(
    () =>
      personnel.filter((manager) => {
        const matchesSearch =
          manager.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          manager.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment =
          departmentFilter === "all" || manager.department === departmentFilter;

        return matchesSearch && matchesDepartment;
      }),
    [departmentFilter, personnel, searchTerm],
  );

  return (
    <>
      <div
        className={`group border rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer ${
          selectedManager
            ? "bg-white border-slate-200"
            : "bg-slate-50 border-dashed border-slate-300"
        }`}
        onClick={() => setIsOpen(true)}
      >
        {selectedManager ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
              {selectedManager.avatar ? (
                <img
                  src={selectedManager.avatar}
                  alt={selectedManager.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-800">
                {selectedManager.fullName}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className="font-normal text-xs bg-slate-100"
                >
                  {selectedManager.position}
                </Badge>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs">{selectedManager.department}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 group-hover:text-primary"
            >
              Thay đổi
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <div className="w-10 h-10 rounded-full bg-white border border-dashed flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium">Chọn quản lý vùng trồng</div>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn quản lý vùng trồng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên, chức vụ..."
                  className="pl-10 bg-slate-50"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-35 bg-slate-50">
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

            <ScrollArea className="h-75 pr-4">
              <div className="space-y-2">
                {filteredManagers.map((manager) => (
                  <div
                    key={manager.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedId === manager.id.toString()
                        ? "bg-primary/5 border border-primary/20 shadow-sm"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                    onClick={() => {
                      onSelect(manager.id.toString());
                      setIsOpen(false);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold overflow-hidden text-slate-600">
                      {manager.avatar ? (
                        <img
                          src={manager.avatar}
                          alt={manager.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        manager.fullName.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-slate-900">
                        {manager.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {manager.position} - {manager.department}
                      </div>
                    </div>
                    {selectedId === manager.id.toString() && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                ))}
                {filteredManagers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Không tìm thấy quản lý nào
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
