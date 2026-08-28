import PageWrapper from "@/components/PageWrapper";
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
  Hash,
  Layers,
  Leaf,
} from "lucide-react";
import { Link, useRoute } from "wouter";
import { useSeasonById } from "@/features/master-data/hooks/useSeasons";
import { getDomainLabel } from "./utils/utils";
import type { MasterDataSeasonResponse } from "@/features/master-data/types/master-data.type";

function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "outline" | "destructive";
    }
  > = {
    active: { label: "Đang hoạt động", variant: "default" },
    inactive: { label: "Tạm ngưng", variant: "secondary" },
    archived: { label: "Lưu trữ", variant: "outline" },
  };

  const { label, variant } = config[status] || {
    label: status,
    variant: "outline" as const,
  };

  return (
    <Badge variant={variant} className="text-sm">
      {label}
    </Badge>
  );
}

function StageCard({
  stage,
  index,
}: {
  stage: MasterDataSeasonResponse["stages"][number];
  index: number;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-white hover:shadow-sm transition-all">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm font-bold">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{stage.name}</h4>
        {stage.description && (
          <div
            className="text-xs text-muted-foreground mt-1 line-clamp-2 prose-xs"
            dangerouslySetInnerHTML={{ __html: stage.description }}
          />
        )}
        <div className="flex items-center gap-3 mt-2">
          {stage.durationDays > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {stage.durationDays} ngày
            </span>
          )}
          {stage.documents && stage.documents.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              {stage.documents.length} tài liệu
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SeasonDetailPage() {
  const [, params] = useRoute("/season/:id");
  const { data: season, isLoading } = useSeasonById(
    params?.id ? Number(params.id) : 0,
    { enabled: !!params?.id },
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

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

  const totalDuration = (season.stages || []).reduce(
    (sum, stage) => sum + (stage.durationDays || 0),
    0,
  );

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
                    <StatusBadge status={season.status} />
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
                  <p className="font-bold text-lg">{totalDuration} ngày</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    Loại mùa vụ
                  </span>
                  <p className="font-bold text-lg">
                    {getDomainLabel(season.domainCode)}
                  </p>
                </div>
              </div>

              {season.productionSubject && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-600" />
                      Đối tượng
                    </span>
                    <p className="font-bold text-lg">
                      {season.productionSubject.name}
                    </p>
                  </div>
                  {season.productionSubjectVariant && (
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-green-600" />
                        Giống / dòng
                      </span>
                      <p className="font-bold text-lg">
                        {season.productionSubjectVariant.name}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stages Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers className="w-5 h-5 text-green-600" />
                Các giai đoạn
              </CardTitle>
            </CardHeader>
            <CardContent>
              {season.stages && season.stages.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {season.stages.map((stage, index) => (
                    <StageCard key={stage.id} stage={stage} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground italic bg-muted/20 rounded-xl border border-dashed">
                  Chưa có giai đoạn nào
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                Tài liệu kỹ thuật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const allDocs = (season.stages || []).flatMap(
                  (stage) => stage.documents || [],
                );
                if (allDocs.length > 0) {
                  return allDocs.map((doc) => (
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
                          {doc.type === "pdf" ? "PDF" : "Editor"}
                        </p>
                      </div>
                    </div>
                  ));
                }
                return (
                  <div className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                    Chưa có tài liệu nào
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
