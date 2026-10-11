import type { FarmDailyDiaryEntryResponse } from "@/features/farm-daily-diary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import {
  AlertTriangle,
  Camera,
  ChevronRight,
  Edit3,
  MoreVertical,
} from "lucide-react";
import { useLocation } from "wouter";
import { getMobilePurposeVisual } from "@/pages/diary/components/mobile-history/purposeVisuals";

export interface MobileDiaryCardProps {
  entry: FarmDailyDiaryEntryResponse;
  actionType?: "menu" | "chevron";
}

export function MobileDiaryCard({
  entry,
  actionType = "menu",
}: MobileDiaryCardProps) {
  const [, setLocation] = useLocation();

  const visual = getMobilePurposeVisual(entry.purpose);
  const VisualIcon = visual.Icon;

  // 1. Kiểm tra quyền chỉnh sửa trong 24h
  const isEditable =
    entry.editable !== undefined
      ? Boolean(entry.editable)
      : entry.createdAt
        ? dayjs().diff(dayjs(entry.createdAt), "hour") < 24
        : false;

  // 2. Định dạng thời gian giống hệt màn hình Home (HH:mm · DD/MM/YYYY)
  const primaryLine = entry.lines?.[0];
  const timeFormatted = dayjs(entry.createdAt || primaryLine?.startDate).format(
    "HH:mm · DD/MM/YYYY",
  );

  // 3. Định dạng vị trí Vườn - Lô
  const regionName = primaryLine?.region?.name;
  const areaName = primaryLine?.area?.name;
  const plotName = primaryLine?.plot?.name;

  let locationText = "";
  if (regionName && plotName) {
    locationText = `${regionName} - ${plotName}`;
  } else if (regionName && areaName) {
    locationText = `${regionName} - ${areaName}`;
  } else if (regionName) {
    locationText = regionName;
  } else if (plotName) {
    locationText = plotName;
  } else if (areaName) {
    locationText = areaName;
  } else if (entry.workflow?.name) {
    locationText = entry.workflow.name;
  } else {
    locationText = "Nông trại";
  }

  // 4. Danh sách ảnh đính kèm (tối đa 3 ảnh)
  const photos = entry.photos ?? [];
  const thumbnailPhotos = photos.slice(0, 3);

  const handleClick = () => {
    // Điều hướng trực tiếp sang trang chi tiết
    setLocation(`/diary/update/${entry.id}`);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      className="flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all active:scale-[0.99] hover:border-emerald-300 hover:shadow-xs group cursor-pointer"
    >
      {/* Icon thể hiện loại công việc */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${visual.bg} ${visual.text} border ${visual.border}`}
      >
        <VisualIcon className="h-5 w-5" />
      </div>

      {/* Cụm text nội dung */}
      <div className="min-w-0 flex-1 space-y-1">
        {/* Dòng 1: Tiêu đề + Huy hiệu cảnh báo (nếu có) + Nút hành động góc trên bên phải */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="truncate text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {visual.label}
            </h3>
            {entry.warning && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-200/80">
                <AlertTriangle className="h-3 w-3" />
                Cảnh báo
              </span>
            )}
          </div>

          {/* Nút hành động góc trên bên phải: Chevron > hoặc Menu 3 chấm */}
          {actionType === "chevron" ? (
            <div className="flex h-7 w-7 items-center justify-center shrink-0 -mr-1">
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-emerald-600 transition-all" />
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer shrink-0 -mr-1"
                  title="Tùy chọn nhật ký"
                >
                  <MoreVertical className="h-4.5 w-4.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 rounded-2xl p-1.5 shadow-xl border border-slate-100 bg-white z-50"
                onClick={(e) => e.stopPropagation()}
              >
                {isEditable ? (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/diary/incident?editId=${entry.id}`);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4 text-emerald-600" />
                    <span>Chỉnh sửa nhật ký</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    disabled
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 opacity-60 cursor-not-allowed"
                  >
                    <Edit3 className="h-4 w-4 text-slate-400" />
                    <div className="flex flex-col text-left">
                      <span>Chỉnh sửa</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Hết hạn (quá 24h)
                      </span>
                    </div>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Dòng 2: Giờ · Ngày/Tháng/Năm · Số ảnh */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="truncate">{timeFormatted}</span>
          {photos.length > 0 && (
            <>
              <span className="text-slate-300">·</span>
              <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] text-slate-400">
                <Camera className="h-3 w-3" />
                {photos.length}
              </span>
            </>
          )}
        </div>

        {/* Dòng 3: Vườn - Lô */}
        <p className="truncate text-xs font-semibold text-slate-700">
          {locationText}
        </p>

        {/* Hàng ảnh thumbnail (nếu có) */}
        {thumbnailPhotos.length > 0 && (
          <div className="flex items-center gap-2 pt-1.5">
            {thumbnailPhotos.map((photo, idx) => {
              const imgUrl = photo.thumbnail?.fileUrl || photo.fileUrl;
              if (!imgUrl) return null;
              return (
                <img
                  key={photo.objectKey || idx}
                  src={imgUrl}
                  alt="Ảnh nhật ký"
                  className="h-12 w-12 rounded-xl object-cover border border-slate-200/80 shadow-2xs bg-slate-50 shrink-0"
                  loading="lazy"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
