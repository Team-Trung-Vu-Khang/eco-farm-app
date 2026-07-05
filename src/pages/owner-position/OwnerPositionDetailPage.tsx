import { useFarmPositionById } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  FileText,
  Layers3,
  SquareUserRound,
} from "lucide-react";
import { useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import type { PositionRecord } from "./types";

function formatDateTime(value: unknown) {
  if (!value) return "—";

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusLabel(status?: string | null) {
  if (status === "active") return "Hoạt động";
  if (status === "inactive") return "Ngừng hoạt động";
  return "Đã lưu trữ";
}

function getStatusBadgeClass(status?: string | null) {
  if (status === "active") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "inactive") {
    return "border-slate-200 bg-slate-50 text-slate-600";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function openDocument(url?: string | null) {
  if (!url) return;

  window.open(url, "_blank", "noopener,noreferrer");
}

export default function OwnerPositionDetailPage() {
  const [, params] = useRoute("/owner-position/:id/detail");
  const [, setLocation] = useLocation();
  const id = params?.id ?? "";
  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  const positionQuery = useFarmPositionById(Number(id), {
    workspaceId: parsedWorkspaceId,
  });
  const position = positionQuery.data as PositionRecord | undefined;

  const documents = useMemo(() => {
    return (position?.documents ?? []).map((doc: any) => ({
      ...doc,
      type: (doc.documentType || doc.type || "").toLowerCase(),
    }));
  }, [position]);

  if (positionQuery.isLoading) {
    return (
      <AdminLayout title="Chi tiết chức vụ">
        <div className="flex items-center justify-center py-20 text-slate-500">
          Đang tải thông tin chức vụ...
        </div>
      </AdminLayout>
    );
  }

  if (positionQuery.error || !position) {
    return (
      <AdminLayout title="Chi tiết chức vụ">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="mb-4 text-slate-500">
            Không tìm thấy thông tin chức vụ này.
          </p>
          <Button
            variant="outline"
            onClick={() => setLocation("/owner-position")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Chi tiết chức vụ"
      description={`Thông tin chi tiết của ${position.name}`}
      actions={
        <Button
          variant="outline"
          onClick={() => setLocation("/owner-position")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      <div className="space-y-6 pb-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="border-b bg-slate-50/70">
              <CardTitle className="flex items-center gap-2 text-lg">
                <SquareUserRound className="h-5 w-5 text-slate-600" />
                Thông tin chung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="outline"
                  className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 font-mono text-xs font-semibold tracking-widest text-slate-700"
                >
                  {position.code}
                </Badge>
                <Badge
                  variant="outline"
                  className={`rounded-full px-3 py-1 font-medium ${getStatusBadgeClass(position.status)}`}
                >
                  {getStatusLabel(position.status)}
                </Badge>
                <span className="text-sm text-slate-500">
                  Thứ tự hiển thị: {position.displayOrder ?? 1}
                </span>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {position.name}
                </h1>
                <p className="mt-2 text-slate-600">
                  {position.description || "Chưa có mô tả cho chức vụ này."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Nhóm chức vụ
                  </p>
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Layers3 className="h-4 w-4 text-slate-500" />
                    {position.positionGroup?.name ?? "Chưa gán nhóm"}
                  </div>
                  {position.positionGroup?.code ? (
                    <p className="mt-2 text-sm text-slate-500">
                      Mã nhóm: {position.positionGroup.code}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Ngày tạo / cập nhật
                  </p>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-slate-500" />
                      Tạo lúc: {formatDateTime(position.createdAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-slate-500" />
                      Cập nhật: {formatDateTime(position.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b bg-slate-50/70">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-slate-600" />
                Trách nhiệm
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {position.responsibilityDescription ||
                  "Chưa có mô tả trách nhiệm cho chức vụ này."}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="border-b bg-slate-50/70">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-slate-600" />
              Tài liệu đính kèm
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {documents.length > 0 ? (
              <div className="grid gap-4">
                {documents.map((document, index) => (
                  <div
                    key={document.id ?? `${document.type}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-slate-900">
                            {document.name}
                          </h3>
                          <Badge variant="outline" className="capitalize">
                            {document.type}
                          </Badge>
                        </div>
                        {document.type === "editor" ? (
                          <div className="max-w-4xl whitespace-pre-wrap rounded-xl text-sm leading-6 text-slate-700">
                            {document.content || "Không có nội dung."}
                          </div>
                        ) : (
                          <div className="space-y-2 text-sm text-slate-600">
                            <p>
                              Tệp:{" "}
                              <span className="font-medium text-slate-800">
                                {document.fileName || "Chưa có tên tệp"}
                              </span>
                            </p>
                            <p className="break-all text-xs text-slate-500">
                              {document.fileUrl || "Chưa có đường dẫn tệp"}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-2">
                        {document.fileUrl ? (
                          <Button
                            variant="outline"
                            onClick={() => openDocument(document.fileUrl)}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Xem
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                Chưa có tài liệu đính kèm cho chức vụ này.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
