import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Calendar, Edit, FileText, Fish, Layers, Leaf, Sprout } from "lucide-react";
import { formatDaysToDuration } from "./utils/duration";
import { Link, useParams } from "wouter";
import {
  useSystemGrowthCycleTemplateById,
  useUserGrowthCycleTemplateById,
} from "../../../features/foundation";

interface AnimalGrowthCycleDetailPageProps {
  id?: string;
}

export default function AnimalGrowthCycleDetailPage({
  id: propId,
}: AnimalGrowthCycleDetailPageProps) {
  const params = useParams<{ id: string }>();
  const id = propId ?? params?.id;

  const isFoundation = String(id).startsWith("foundation-");
  const numericId = Number(String(id).replace(/^(foundation-|user-)/, ""));

  const { data: foundationCycle, isLoading: fLoading } =
    useSystemGrowthCycleTemplateById(numericId, {
      enabled: !!numericId && isFoundation,
    });

  const { data: userCycle, isLoading: uLoading } =
    useUserGrowthCycleTemplateById(numericId, {
      enabled: !!numericId && !isFoundation,
    });

  const cycle = isFoundation ? foundationCycle : userCycle;
  const isLoading = isFoundation ? fLoading : uLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Sprout className="w-12 h-12 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground">
          Không tìm thấy chu kỳ sinh trưởng.
        </p>
      </div>
    );
  }

  const metadata = cycle.metadataJson || {};
  const isAnimal = (metadata.cycleType ?? "animal") === "animal";

  const cropIdVal = cycle.productionSubject?.id;
  const varietyIdVal = cycle.productionSubjectVariant?.id;
  const expectedDaysVal =
    cycle.stages?.reduce(
      (sum: number, s: any) => sum + (s.durationDays || 0),
      0,
    ) ?? 0;

  const cropName = cycle.productionSubject?.name || String(cropIdVal || "");
  const varietyName = cycle.productionSubjectVariant?.name || "";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-background via-background to-muted/30 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {params?.id && (
              <Link href="/animal-growth-cycle">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold">
                  Chi tiết chu kỳ sinh trưởng
                </h2>
                <Badge variant={isAnimal ? "default" : "secondary"}>
                  {isAnimal ? "Động vật" : "Vật nuôi / Thủy sản"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{cycle.name}</p>
            </div>
          </div>

          {!isFoundation && (
            <Link href={`/animal-growth-cycle/${id}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Phạm vi</span>
              <Badge variant={varietyIdVal ? "secondary" : "default"}>
                {!varietyIdVal ? "Theo loại" : "Theo giống"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isAnimal ? "Loại vật nuôi" : "Đối tượng nuôi"}
              </span>
              <span className="font-medium flex items-center gap-2">
                {isAnimal ? (
                  <Leaf className="w-4 h-4 text-green-600" />
                ) : (
                  <Fish className="w-4 h-4 text-blue-600" />
                )}
                {cropName}
              </span>
            </div>
            {varietyIdVal && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {isAnimal ? "Giống vật nuôi" : "Giống / dòng"}
                </span>
                <span className="font-medium flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-primary" />
                  {varietyName}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Tổng thời gian
              </span>
              <Badge variant="secondary">{expectedDaysVal} ngày</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Số giai đoạn
              </span>
              <span className="font-medium">
                {cycle.stages?.length || 0} giai đoạn
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mốc thời gian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tạo lúc</span>
              <span className="font-medium">
                {cycle.createdAt
                  ? new Date(cycle.createdAt).toLocaleString("vi-VN")
                  : "---"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cập nhật</span>
              <span className="font-medium">
                {cycle.updatedAt
                  ? new Date(cycle.updatedAt).toLocaleString("vi-VN")
                  : "---"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Danh sách giai đoạn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cycle.stages?.map((stage: any, index: number) => (
            <div key={stage.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold">
                    Giai đoạn {index + 1}: {stage.name}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDaysToDuration(stage.durationDays)}
                  </p>
                </div>
                {stage.documents?.[0] ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-blue-500" />
                    Tài liệu đính kèm
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Soạn thảo
                  </Badge>
                )}
              </div>

              {/* Document Content */}
              {stage.documents?.[0]?.fileUrl && (
                <div className="mt-2 flex items-center gap-2 rounded-md bg-slate-50 p-3 text-sm border border-slate-100">
                  <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                  <a
                    href={stage.documents[0].fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium line-clamp-1"
                    title={
                      stage.documents[0].fileName ||
                      stage.documents[0].name ||
                      "Tài liệu đính kèm"
                    }
                  >
                    {stage.documents[0].fileName ||
                      stage.documents[0].name ||
                      "Tài liệu đính kèm"}
                  </a>
                </div>
              )}
              {(!stage.documents || stage.documents.length === 0) &&
                stage.description && (
                  <div
                    className="prose prose-sm max-w-none mt-2 text-slate-700 border-t pt-3"
                    dangerouslySetInnerHTML={{ __html: stage.description }}
                  />
                )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
