import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Calendar, Edit, FileText, Fish, Layers, Leaf, Sprout } from "lucide-react";
import { Link, useParams } from "wouter";
import useGrowthCycleStore from "../../stores/useGrowthCycleStore";
import useVarietyStore from "../../stores/useVarietyStore";

interface GrowthCycleDetailPageProps {
  id?: string;
}

export default function GrowthCycleDetailPage({
  id: propId,
}: GrowthCycleDetailPageProps) {
  const params = useParams<{ id: string }>();
  const id = propId ?? params?.id;
  const { getGrowthCycleById } = useGrowthCycleStore();
  const { getVarietyById } = useVarietyStore();

  const cycle = getGrowthCycleById(id || "");

  if (!cycle) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Sprout className="w-12 h-12 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground">Không tìm thấy chu kỳ sinh trưởng.</p>
      </div>
    );
  }

  const varietyName = cycle.variety
    ? getVarietyById(cycle.variety)?.varietyName || cycle.variety
    : null;
  const isPlant = (cycle.cycleType ?? "plant") === "plant";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-background via-background to-muted/30 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {params?.id && (
              <Link href="/growth-cycle">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold">Chi tiết chu kỳ sinh trưởng</h2>
                <Badge variant={isPlant ? "default" : "secondary"}>
                  {isPlant ? "Thực vật" : "Vật nuôi / Thủy sản"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{cycle.name}</p>
            </div>
          </div>

          <Link href={`/growth-cycle/${cycle.id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
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
              <Badge variant={cycle.scope === "crop" ? "default" : "secondary"}>
                {cycle.scope === "crop" ? "Theo loại cây" : "Theo giống"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isPlant ? "Loại cây trồng" : "Đối tượng nuôi"}
              </span>
              <span className="font-medium flex items-center gap-2">
                {isPlant ? (
                  <Leaf className="w-4 h-4 text-green-600" />
                ) : (
                  <Fish className="w-4 h-4 text-blue-600" />
                )}
                {cycle.cropName}
              </span>
            </div>
            {varietyName && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {isPlant ? "Giống cây" : "Giống / dòng"}
                </span>
                <span className="font-medium flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-primary" />
                  {varietyName}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tổng thời gian</span>
              <Badge variant="secondary">{cycle.totalDays} ngày</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Số giai đoạn</span>
              <span className="font-medium">{cycle.numStages} giai đoạn</span>
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
                {new Date(cycle.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cập nhật</span>
              <span className="font-medium">
                {new Date(cycle.updatedAt).toLocaleString("vi-VN")}
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
          {cycle.stages.map((stage, index) => (
            <div
              key={stage.id}
              className="rounded-lg border p-4 flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="font-semibold">
                  Giai đoạn {index + 1}: {stage.name}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {stage.duration} ngày
                </p>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {stage.usePdf ? "PDF" : "Soạn thảo"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
