import { useRegions } from "@/features/farm/hooks/useRegions";
import { useSelectedWorkspaceId, useWorkspaceById } from "@/features/workspace";
import { LayoutGrid, MapPin, Maximize2, Pencil, Sprout } from "lucide-react";

interface FarmSummaryCardProps {
  onOpenEditName?: () => void;
}

export function FarmSummaryCard({ onOpenEditName }: FarmSummaryCardProps) {
  const selectedWorkspaceId = useSelectedWorkspaceId();
  const { data: workspaceData } = useWorkspaceById(selectedWorkspaceId ?? "", {
    enabled: !!selectedWorkspaceId,
  });

  // Đếm tổng số vườn từ totalElements của API regions
  const { response: regionsResponse } = useRegions({
    params: { page: 0, size: 1, domainCode: "CROP" },
  });
  const totalGardens = regionsResponse?.totalElements ?? 0;

  const farmTitle =
    (
      (workspaceData?.metadataJson as Record<string, unknown>)
        ?.farmDisplayName as string
    )?.trim() ||
    workspaceData?.brandName?.trim() ||
    workspaceData?.name?.trim() ||
    "MEVI Farm";

  const totalAcreage =
    typeof workspaceData?.totalAcreage === "number" &&
    workspaceData.totalAcreage > 0
      ? `${workspaceData.totalAcreage} ha`
      : "-- ha";

  const mainCrop = workspaceData?.mainCrop?.name?.trim() || "Chưa cập nhật";

  const address =
    workspaceData?.province?.trim() ||
    workspaceData?.address?.trim() ||
    "Việt Nam";

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
      {/* Tiêu đề Nông trại + Icon sửa tên */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 truncate">
          {farmTitle}
        </h2>
        {onOpenEditName && (
          <button
            type="button"
            onClick={onOpenEditName}
            className="p-1.5 -mr-1 rounded-full text-slate-400 hover:text-primary hover:bg-slate-50 active:scale-95 transition-all"
            title="Đổi tên nông hộ"
            aria-label="Đổi tên nông hộ"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Lưới 4 thông số cốt lõi */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 pt-1">
        {/* 1. Diện tích */}
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-primary">
            <Maximize2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Diện tích</p>
            <p className="font-bold text-sm text-slate-900 truncate mt-0.5">
              {totalAcreage}
            </p>
          </div>
        </div>

        {/* 2. Cây trồng chính */}
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-primary">
            <Sprout className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Cây trồng chính</p>
            <p className="font-bold text-sm text-slate-900 truncate mt-0.5">
              {mainCrop}
            </p>
          </div>
        </div>

        {/* 3. Địa chỉ */}
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-primary">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Địa chỉ</p>
            <p className="font-bold text-sm text-slate-900 truncate mt-0.5">
              {address}
            </p>
          </div>
        </div>

        {/* 4. Số vườn (totalElements) */}
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-primary">
            <LayoutGrid className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Số vườn</p>
            <p className="font-bold text-sm text-slate-900 truncate mt-0.5">
              {totalGardens} vườn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
