import { LayoutGrid, List } from "lucide-react";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface TaskViewToggleProps {
  value: "list" | "calendar";
  onChange: (value: "list" | "calendar") => void;
}

export function TaskViewToggle({ value, onChange }: TaskViewToggleProps) {
  return (
    <div className="flex p-1 bg-muted rounded-lg">
      <Button
        variant={value === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("list")}
        className="h-8"
      >
        <List className="w-4 h-4 mr-2" />
        Danh sách
      </Button>
      <Button
        variant={value === "calendar" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("calendar")}
        className="h-8"
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        Lịch
      </Button>
    </div>
  );
}
