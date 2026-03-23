import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Hash, Leaf } from "lucide-react";
import type { GroupCrop } from "../types/types";

export const groupCropColumns: Column<GroupCrop>[] = [
  {
    key: "code",
    label: "Mã nhóm cây",
    render: (value: string) => (
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit">
        <Hash className="w-3 h-3 opacity-60" />
        {value}
      </div>
    ),
  },
  {
    key: "name",
    label: "Tên nhóm cây",
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <Leaf className="w-4 h-4 text-green-600" />
        <span className="font-bold text-foreground">{value}</span>
      </div>
    ),
  },
  {
    key: "biological",
    label: "Đặc tính sinh học",
    render: (value: string) => (
      <p className="text-sm text-muted-foreground line-clamp-2 max-w-50">
        {value}
      </p>
    ),
  },
  {
    key: "description",
    label: "Ghi chú",
    render: (value: string) => (
      <p className="text-sm text-muted-foreground line-clamp-2 max-w-[300px]">
        {value}
      </p>
    ),
  },
];
