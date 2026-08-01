import PageWrapper from "@/components/PageWrapper";
import { CROP_OPTIONS } from "@/constants/crops";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowLeft,
  Calendar,
  Edit,
  FileText,
  Flower,
  Hash,
  Leaf,
  Sprout,
  Trees,
} from "lucide-react";
import { Link, useRoute } from "wouter";
import useCropStore from "../../stores/useCropStore";
import useGrowthCycleStore from "../../stores/useGrowthCycleStore";
import useSeasonStore from "../../stores/useSeasonStore";
import useVarietyStore from "../../stores/useVarietyStore";
import {
  animalBreedOptions,
  animalCycleOptions,
} from "./data/cycleSelectionData";
import type { SeasonDocument } from "./types/types";

function resolveSeasonType(season: { seasonType?: "plant" | "animal" }) {
  return season.seasonType ?? "plant";
}

function resolveSeasonTargetLabel(
  season: {
    seasonType?: "plant" | "animal";
    scope: "crop" | "variety";
    cropId?: string;
    varietyId?: string;
  },
  getCropById: (id: number) => { name: string } | undefined,
  getVarietyById: (id: string) => { varietyName: string } | undefined,
) {
  const seasonType = resolveSeasonType(season);

  if (seasonType === "animal") {
    const primary = animalCycleOptions.find(
      (option) => option.id === season.cropId || option.name === season.cropId,
    );
    const breed = season.varietyId
      ? animalBreedOptions.find((option) => option.id === season.varietyId)
      : undefined;

    if (season.scope === "variety") {
      return (
        breed?.name ||
        season.varietyId ||
        primary?.name ||
        season.cropId ||
        "Chưa xác định"
      );
    }

    return primary?.name || season.cropId || "Chưa xác định";
  }

  const crop =
    CROP_OPTIONS.find(
      (item) => item.id === season.cropId || item.name === season.cropId,
    ) || (season.cropId ? getCropById(Number(season.cropId)) : undefined);
  const variety = season.varietyId
    ? getVarietyById(season.varietyId)
    : undefined;

  if (season.scope === "variety") {
    return (
      variety?.varietyName ||
      season.varietyId ||
      crop?.name ||
      season.cropId ||
      "Chưa xác định"
    );
  }

  return crop?.name || season.cropId || "Chưa xác định";
}

export default function SeasonDetailPage() {
  const [, params] = useRoute("/season/:id");
  const { getSeasonById } = useSeasonStore();
  const { growthCycles } = useGrowthCycleStore();
  const { getCropById } = useCropStore();
  const { getVarietyById } = useVarietyStore();

  const season = params?.id ? getSeasonById(params.id) : undefined;

  if (!season) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy mùa vụ</h2>
          <Link href="/season">
            <Button variant="link">Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedCycles = growthCycles.filter((c) =>
    season.growthCycleIds.includes(c.id),
  );

  const statusMap: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "outline" | "destructive";
    }
  > = {
    planning: { label: "Lập kế hoạch", variant: "secondary" },
    active: { label: "Đang triển khai", variant: "default" },
    completed: { label: "Hoàn thành", variant: "outline" },
    cancelled: { label: "Đã hủy", variant: "destructive" },
  };

  const statusConfig = statusMap[season.status] || {
    label: season.status,
    variant: "outline",
  };

  const seasonType = resolveSeasonType(season);

  return (
    <PageWrapper
      title={`Chi tiết ${season.name}`}
      description="Thông tin chi tiết và tiến độ mùa vụ"
      actions={
        <Link href={`/season/${season.id}/edit`}>
          <Button className="gap-2 shadow-sm">
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </Button>
        </Link>
      }
    >
      <div className="mb-6">
        <Link href="/season">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Hash className="w-5 h-5 text-primary" />
                Thông tin chung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Mã mùa vụ
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg bg-muted/50 px-2 rounded-md">
                      {season.code}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Trạng thái
                  </span>
                  <div>
                    <Badge variant={statusConfig.variant} className="text-sm">
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Mô tả
                </span>
                <p className="text-base leading-relaxed text-foreground/90">
                  {season.description || "Chưa có mô tả"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    Thời gian
                  </span>
                  <p className="font-bold text-lg">{season.duration} ngày</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    {seasonType === "animal" ? (
                      <Flower className="w-4 h-4 text-green-600" />
                    ) : season.scope === "crop" ? (
                      <Trees className="w-4 h-4 text-green-600" />
                    ) : (
                      <Flower className="w-4 h-4 text-green-600" />
                    )}
                    Phạm vi áp dụng
                  </span>
                  <p className="font-bold text-lg">
                    {seasonType === "animal"
                      ? season.scope === "crop"
                        ? "Theo loại vật nuôi"
                        : "Theo giống / dòng"
                      : season.scope === "crop"
                        ? "Theo loại cây trồng"
                        : "Theo giống cụ thể"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    {seasonType === "animal" ? (
                      <Flower className="w-4 h-4 text-green-600" />
                    ) : (
                      <Trees className="w-4 h-4 text-green-600" />
                    )}
                    {seasonType === "animal"
                      ? "Đối tượng nuôi"
                      : "Loại cây trồng"}
                  </span>
                  <p className="font-bold text-lg">
                    {resolveSeasonTargetLabel(
                      season,
                      getCropById,
                      getVarietyById,
                    )}
                  </p>
                </div>
                {season.scope === "variety" && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Flower className="w-4 h-4 text-green-600" />
                      {seasonType === "animal"
                        ? "Giống / dòng"
                        : "Giống cây trồng"}
                    </span>
                    <p className="font-bold text-lg">
                      {season.varietyId
                        ? seasonType === "animal"
                          ? animalBreedOptions.find(
                              (item) => item.id === season.varietyId,
                            )?.name || season.varietyId
                          : getVarietyById(season.varietyId)?.varietyName ||
                            season.varietyId
                        : "Chưa xác định"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Connected Growth Cycles Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sprout className="w-5 h-5 text-green-600" />
                Chu kỳ sinh trưởng áp dụng
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCycles.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {selectedCycles.map((cycle) => {
                    const selectedStageMap =
                      season.selectedStages?.[cycle.id] || {};
                    const selectedStages =
                      cycle.stages?.filter((s) => !!selectedStageMap[s.id]) ||
                      [];

                    return (
                      <div
                        key={cycle.id}
                        className="flex flex-col p-4 rounded-xl border bg-white hover:shadow-sm transition-all gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            <Leaf className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-base">
                              {cycle.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Sprout className="w-3.5 h-3.5" />
                                {cycle.cropName} - {cycle.variety}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                              <span>{cycle.totalDays} ngày gốc</span>
                            </div>
                          </div>
                          <Link href={`/growth-cycle/${cycle.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Xem gốc
                            </Button>
                          </Link>
                        </div>

                        {selectedStages.length > 0 && (
                          <div className="pl-16">
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                              <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Giai đoạn áp dụng & Thời gian tùy chỉnh
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedStages.map((stage) => (
                                  <Badge
                                    key={stage.id}
                                    variant="secondary"
                                    className="bg-white border-slate-200 text-slate-700 font-normal shadow-sm"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                                    {stage.name} ({selectedStageMap[stage.id]}{" "}
                                    ngày)
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground italic bg-muted/20 rounded-xl border border-dashed">
                  Chưa có chu kỳ sinh trưởng nào được liên kết
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column: Documents & Metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                Tài liệu kỹ thuật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {season.documents.length > 0 ? (
                season.documents.map((doc: SeasonDocument) => (
                  <div
                    key={doc.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer group"
                  >
                    <div className="mt-1">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate group-hover:text-blue-700 transition-colors">
                        {doc.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {doc.uploadedAt}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                  Chưa có tài liệu nào
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
