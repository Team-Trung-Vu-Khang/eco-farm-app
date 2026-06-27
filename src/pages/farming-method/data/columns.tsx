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
    label: "Cây trồng - Giống",
    render: (value: RelatedCrop[]) => (
      <div className="min-w-0 space-y-2">
        {value.map((group) => {
          const visibleVarieties = group.varieties.slice(0, 3);
          const hiddenCount = Math.max(group.varieties.length - 3, 0);

          return (
            <div
              key={`${group.cropGroup}-${group.crop}`}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex flex-col gap-1.5">
                {group.cropGroup && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {group.cropGroup}
                  </span>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    {group.crop}
                  </Badge>
                  <span className="whitespace-nowrap text-xs text-slate-500">
                    {group.varieties.length} giống
                  </span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {visibleVarieties.map((variety) => (
                  <Badge
                    key={`${group.crop}-${variety}`}
                    variant="secondary"
                    className="max-w-full bg-white text-slate-700 hover:bg-white"
                  >
                    <span className="max-w-[10rem] truncate">{variety}</span>
                  </Badge>
                ))}
                {hiddenCount > 0 && (
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-white text-slate-500"
                  >
                    +{hiddenCount}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    ),
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
