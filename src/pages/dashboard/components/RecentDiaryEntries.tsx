import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ClipboardList,
  Calendar,
  Layers,
  Image as ImageIcon,
  ChevronRight,
  PackageCheck,
} from "lucide-react";
import { useFarmDailyDiaryEntries } from "@/features/farm-daily-diary/hooks/useFarmDailyDiaryEntries";
import type { FarmPlanPurpose } from "@/features/farm-daily-diary/types/farm-daily-diary.type";
import { FARM_PLAN_PURPOSE_LABELS } from "@/shared/constants/farm.constants";

const PURPOSE_MAP: Record<string, { label: string; className: string }> = {
  CULTIVATION: {
    label: FARM_PLAN_PURPOSE_LABELS.CULTIVATION,
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold",
  },
  FACILITY_UPGRADE: {
    label: FARM_PLAN_PURPOSE_LABELS.FACILITY_UPGRADE,
    className: "bg-blue-50 text-blue-700 border border-blue-200 font-bold",
  },
  TREATMENT: {
    label: FARM_PLAN_PURPOSE_LABELS.TREATMENT,
    className: "bg-amber-50 text-amber-700 border border-amber-200 font-bold",
  },
  SOIL_IMPROVEMENT: {
    label: FARM_PLAN_PURPOSE_LABELS.SOIL_IMPROVEMENT,
    className:
      "bg-orange-50 text-orange-700 border border-orange-200 font-bold",
  },
  HARVEST: {
    label: FARM_PLAN_PURPOSE_LABELS.HARVEST,
    className:
      "bg-purple-50 text-purple-700 border border-purple-200 font-bold",
  },
  NUTRITION: {
    label: FARM_PLAN_PURPOSE_LABELS.NUTRITION,
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold",
  },
  PLANT_CARE: {
    label: FARM_PLAN_PURPOSE_LABELS.PLANT_CARE,
    className: "bg-teal-50 text-teal-700 border border-teal-200 font-bold",
  },
  PEST_DISEASE: {
    label: FARM_PLAN_PURPOSE_LABELS.PEST_DISEASE,
    className:
      "bg-amber-50 text-amber-700 border border-amber-200 font-bold",
  },
  WEED_CONTROL: {
    label: FARM_PLAN_PURPOSE_LABELS.WEED_CONTROL,
    className: "bg-lime-50 text-lime-700 border border-lime-200 font-bold",
  },
  IRRIGATION: {
    label: FARM_PLAN_PURPOSE_LABELS.IRRIGATION,
    className: "bg-sky-50 text-sky-700 border border-sky-200 font-bold",
  },
  OTHER: {
    label: FARM_PLAN_PURPOSE_LABELS.OTHER,
    className: "bg-gray-50 text-gray-700 border border-gray-200 font-bold",
  },
};

export function RecentDiaryEntries() {
  // Call API for daily diary entries
  const { data: apiData, isLoading } = useFarmDailyDiaryEntries({
    params: { page: 0, size: 5 },
  });

  const diaryEntries = useMemo(() => {
    if (apiData?.content && apiData.content.length > 0) {
      return apiData.content.map((item) => {
        const lineNames = (item.lines || []).map((l) => l.name).filter(Boolean);
        const supplies = (item.lines || [])
          .flatMap((l) => l.supplies || [])
          .map(
            (s) =>
              `${s.quantityActual || 1} ${s.unitName || s.unit || "đơn vị"} ${s.supplyItemName || s.name || "Vật tư"}`,
          );

        return {
          id: item.id,
          purpose: (item.purpose as FarmPlanPurpose) || "CULTIVATION",
          name:
            lineNames[0] ||
            item.description ||
            item.workflow?.name ||
            `Nhật ký canh tác #${item.code || item.id}`,
          startDate: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("vi-VN")
            : "",
          endDate: "",
          description:
            item.description ||
            lineNames.join(", ") ||
            "Đã ghi nhận nhật ký hoạt động canh tác",
          imageCount: item.photos ? item.photos.length : 0,
          stagesCount: item.lines ? item.lines.length : 1,
          materialSummary:
            supplies.length > 0
              ? supplies.slice(0, 2).join(", ")
              : "Chưa sử dụng vật tư",
          createdAt: item.createdAt
            ? new Date(item.createdAt).toLocaleString("vi-VN")
            : "",
        };
      });
    }

    return [];
  }, [apiData]);

  const handleOpenHistoryPage = () => {
    window.open("/diary/daily-history", "_blank");
  };

  const handleOpenDetail = (id: string | number) => {
    window.open(`/diary/detail/${id}`, "_blank");
  };

  return (
    <Card className="rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
            <ClipboardList className="w-4 h-4" />
          </div>
          <span>Nhật ký gần đây</span>
        </CardTitle>

        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenHistoryPage}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100 border-emerald-200 rounded-xl h-8 px-3"
        >
          <span>Xem tất cả nhật ký</span>
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </CardHeader>

      <CardContent className="p-4 space-y-3.5">
        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-400 italic">
            Đang tải dữ liệu nhật ký...
          </div>
        ) : diaryEntries.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ClipboardList className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-500">
              Chưa có nhật ký ghi nhận
            </p>
            <p className="text-[11px] text-slate-400">
              Các hoạt động nhật ký mới nhất sẽ hiển thị tại đây
            </p>
          </div>
        ) : (
          diaryEntries.map((item) => {
            const purposeInfo = PURPOSE_MAP[item.purpose] || {
              label: item.purpose || "Canh tác",
              className:
                "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold",
            };

            return (
              <div
                key={item.id}
                onClick={() => handleOpenDetail(item.id)}
                className="p-3.5 rounded-xl border border-slate-200/70 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer group space-y-2.5 bg-white shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2 py-0.5 uppercase tracking-wider shrink-0 ${purposeInfo.className}`}
                    >
                      {purposeInfo.label}
                    </Badge>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                      {item.name}
                    </h4>
                  </div>

                  {item.startDate && (
                    <span className="text-[10px] font-medium text-slate-400 shrink-0 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.startDate}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Layers className="w-3 h-3 text-emerald-600" />
                      {item.stagesCount} hạng mục công việc
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <ImageIcon className="w-3 h-3 text-blue-500" />
                      {item.imageCount} ảnh minh chứng
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500 text-[11px] truncate max-w-[220px]">
                    <PackageCheck className="w-3 h-3 text-amber-600 shrink-0" />
                    <span className="truncate" title={item.materialSummary}>
                      {item.materialSummary}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
