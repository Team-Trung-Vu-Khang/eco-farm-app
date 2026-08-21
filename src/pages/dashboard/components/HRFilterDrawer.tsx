import { useState } from "react";
import {
  Button,
  Checkbox,
  Separator,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  type HRFilterState,
  departmentOptions,
  locationOptions,
  positionOptions,
  taskStatusOptions,
} from "../constants";

interface HRFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFilter: HRFilterState;
  onApply: (filter: HRFilterState) => void;
}

export function HRFilterDrawer({
  open,
  onOpenChange,
  initialFilter,
  onApply,
}: HRFilterDrawerProps) {
  const [location, setLocation] = useState(initialFilter.location);
  const [departments, setDepartments] = useState<Set<string>>(
    new Set(initialFilter.departments)
  );
  const [positions, setPositions] = useState<Set<string>>(
    new Set(initialFilter.positions)
  );
  const [taskStatus, setTaskStatus] = useState<Set<string>>(
    new Set(initialFilter.taskStatus)
  );

  const toggleItem = (
    setFn: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string
  ) => {
    setFn((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setLocation("");
    setDepartments(new Set());
    setPositions(new Set());
    setTaskStatus(new Set());
  };

  const handleApply = () => {
    onApply({
      location,
      departments: Array.from(departments),
      positions: Array.from(positions),
      taskStatus: Array.from(taskStatus),
    });
    onOpenChange(false);
  };

  const hasFilters =
    location ||
    departments.size > 0 ||
    positions.size > 0 ||
    taskStatus.size > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-none sm:w-[440px] sm:max-w-[440px] flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Lọc nhân sự</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Vùng/Khu vực làm việc
            </label>
            <div className="space-y-1">
              {locationOptions.map((loc) => (
                <div
                  key={loc.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                    location === loc.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  }`}
                  onClick={() =>
                    setLocation(location === loc.id ? "" : loc.id)
                  }
                >
                  <Checkbox
                    checked={location === loc.id}
                    onCheckedChange={() =>
                      setLocation(location === loc.id ? "" : loc.id)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm">{loc.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Phòng ban
            </label>
            <div className="space-y-1">
              {departmentOptions.map((dept) => (
                <div
                  key={dept.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => toggleItem(setDepartments, dept.id)}
                >
                  <Checkbox
                    checked={departments.has(dept.id)}
                    onCheckedChange={() => toggleItem(setDepartments, dept.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm">{dept.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Chức vụ
            </label>
            <div className="space-y-1">
              {positionOptions.map((pos) => (
                <div
                  key={pos.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => toggleItem(setPositions, pos.id)}
                >
                  <Checkbox
                    checked={positions.has(pos.id)}
                    onCheckedChange={() => toggleItem(setPositions, pos.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm">{pos.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Trạng thái công việc
            </label>
            <div className="space-y-1">
              {taskStatusOptions.map((status) => (
                <div
                  key={status.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => toggleItem(setTaskStatus, status.id)}
                >
                  <Checkbox
                    checked={taskStatus.has(status.id)}
                    onCheckedChange={() => toggleItem(setTaskStatus, status.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm">{status.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <SheetFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="ghost"
              onClick={handleClearAll}
              disabled={!hasFilters}
            >
              Bỏ chọn tất cả
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleApply}>Áp dụng</Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
