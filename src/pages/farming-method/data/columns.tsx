import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { FarmingMethodCropRow, RelatedCrop } from "../types/types";

export const columns: Column<FarmingMethodCropRow>[] = [
  {
    key: "code",
    label: "Mã",
    render: (value: string) => (
      <span className="whitespace-nowrap font-mono text-xs font-semibold text-slate-500">
        {value}
      </span>
    ),
  },
  {
    key: "name",
    label: "Phương thức",
    render: (value, item) => (
      <div className="min-w-0 space-y-1">
        <div className="break-words font-medium text-slate-900">
          {value as string}
        </div>
        <div className="text-xs text-slate-500">
          {item.relatedCrops.length} nhóm cây liên kết
        </div>
      </div>
    ),
  },
  {
    key: "relatedCrops",
    label: "Cây trồng áp dụng",
    render: (value: RelatedCrop[]) => {
      const activeCrops = value.filter((g) => g.cropId > 0);
      if (activeCrops.length === 0) {
        return (
          <span className="text-xs italic text-slate-400">Chưa liên kết</span>
        );
      }
      return (
        <div className="flex flex-wrap gap-1.5 max-w-[350px]">
          {activeCrops.map((group) => (
            <Badge
              key={`${group.cropGroup}-${group.crop}`}
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5"
              title={group.cropGroup || undefined}
            >
              {group.crop}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    key: "description",
    label: "Mô tả",
    render: (value) => (
      <div className="max-w-[200px] text-wrap text-sm leading-6 text-slate-600">
        {value as string}
      </div>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge
        variant={value === "active" ? "secondary" : "outline"}
        className={`whitespace-nowrap ${
          value === "active"
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "text-slate-500"
        }`}
      >
        {value === "active" ? "Đang áp dụng" : "Ngưng"}
      </Badge>
    ),
  },
  {
    key: "updatedAt",
    label: "Cập nhật",
    render: (value) => (
      <span className="whitespace-nowrap text-sm text-slate-500">
        {value as string}
      </span>
    ),
  },
];
