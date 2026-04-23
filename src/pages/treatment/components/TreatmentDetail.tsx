import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  PlayCircle,
  Sprout,
  Target,
  Trash2,
  UserRound,
  Video,
  Activity,
  Shield,
  Layers,
  AlertCircle,
  Copy,
} from "lucide-react";
import type { Treatment } from "../types/treatment.types";
import {
  budgetRangeOptions,
  inspectionParameterOptions,
  responsibleUnitOptions,
  severityConfig,
  treatmentMaterialCategoryOptions,
  treatmentMethodOptions,
} from "../data/treatment.data";

interface TreatmentDetailProps {
  treatment: Treatment;
  onEdit: (t: Treatment) => void;
  onDelete: (t: Treatment) => void;
  onDuplicate: (t: Treatment) => void;
  onViewMaterial?: (id: string) => void;
}

function getOptionLabel(
  options: ReadonlyArray<{ label: string; value: string }>,
  value?: string,
) {
  return options.find((item) => item.value === value)?.label || "Chưa cập nhật";
}

function SectionBlock({
  children,
  eyebrow,
  title,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-xl font-semibold text-slate-900">{title}</h3>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function TreatmentDetail({
  treatment,
  onEdit,
  onDelete,
  onDuplicate,
  onViewMaterial,
}: TreatmentDetailProps) {
  if (!treatment) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-slate-50 text-slate-400">
        Chưa chọn phác đồ để xem chi tiết.
      </div>
    );
  }

  // Resolve method labels
  const methodIds = [
    ...(treatment.primaryMethodId ? [treatment.primaryMethodId] : []),
    ...(treatment.supportingMethodIds || []),
  ];
  const methods = treatmentMethodOptions.filter((item) =>
    methodIds.includes(item.value),
  );

  const videos =
    treatment.attachments?.filter((item) => item.fileType === "video") || [];
  const documents =
    treatment.attachments?.filter((item) => item.fileType === "pdf") || [];

  return (
    <div className="h-full flex flex-col bg-[linear-gradient(180deg,#f0fdf4_0%,#f7fee7_22%,#ffffff_55%)] overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
      {/* 1. HERO HEADER SECTION */}
      <div className="border-b border-emerald-100 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_34%),linear-gradient(135deg,#064e3b_0%,#065f46_44%,#064e3b_100%)] px-8 py-8 text-white shrink-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/15 text-white border-transparent backdrop-blur-md">
                {treatment.code}
              </Badge>
              <Badge
                className={`border-transparent ${
                  severityConfig[
                    treatment.severity as keyof typeof severityConfig
                  ]?.color || ""
                } bg-opacity-90`}
              >
                {severityConfig[
                  treatment.severity as keyof typeof severityConfig
                ]?.label || treatment.severity}
              </Badge>
              <Badge className="bg-white/15 text-white border-transparent backdrop-blur-md">
                {getOptionLabel(budgetRangeOptions, treatment.budgetRange)}
              </Badge>
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">
              {treatment.name}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-emerald-100">
              <div className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span>{treatment.disease}</span>
              </div>
              <span className="opacity-30">|</span>
              <div className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>
                  {treatment.crop} - {treatment.cropType}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => onDuplicate(treatment)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Sao chép
            </Button>
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => onEdit(treatment)}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="destructive"
              className="bg-rose-500/80 hover:bg-rose-500 border-none"
              onClick={() => onDelete(treatment)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-wider text-emerald-200">
              Khu vực
            </p>
            <p className="mt-1 font-medium">{treatment.zone || "Đa vùng"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-wider text-emerald-200">
              Thời lượng
            </p>
            <p className="mt-1 font-medium">{treatment.totalDuration}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-wider text-emerald-200">
              Đơn vị phụ trách
            </p>
            <p className="mt-1 font-medium line-clamp-1">
              {getOptionLabel(
                responsibleUnitOptions,
                treatment.responsibleUnit,
              )}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-wider text-emerald-200">
              Biện pháp chính
            </p>
            <p className="mt-1 font-medium line-clamp-1">
              {methods[0]?.label || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. TABS SECTION */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <Tabs defaultValue="overview" className="flex-1 flex flex-col h-full">
          <div className="px-8 pt-6 pb-2 shrink-0 bg-white/50 border-b border-emerald-50">
            <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-emerald-50 p-1">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
              >
                Tổng quan
              </TabsTrigger>
              <TabsTrigger
                value="handbook"
                className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
              >
                Sổ tay hướng dẫn
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
              >
                Video & Tài liệu
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
            {/* --- OVERVIEW TAB --- */}
            <TabsContent
              value="overview"
              className="mt-0 space-y-6 outline-none"
            >
              <SectionBlock eyebrow="Overview" title="Tóm tắt phác đồ">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-slate-200 shadow-none">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center gap-2 font-medium text-slate-900">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        Phạm vi và đối tượng
                      </div>
                      <div className="space-y-2 pt-1 text-sm text-slate-600">
                        <p>
                          <span className="font-medium">Cây trồng:</span>{" "}
                          {treatment.crop} ({treatment.variety})
                        </p>
                        <p>
                          <span className="font-medium">Giống/Hạt:</span>{" "}
                          {treatment.seed || "Chưa cập nhật"}
                        </p>
                        <p>
                          <span className="font-medium">Địa hình:</span>{" "}
                          {(treatment.terrainTypes || []).join(", ") ||
                            "Đa terrain"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-none">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center gap-2 font-medium text-slate-900">
                        <UserRound className="h-4 w-4 text-emerald-600" />
                        Tác giả và cộng tác
                      </div>
                      {(treatment.authors || []).length > 0 ? (
                        <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                          {treatment.authors?.map((author) => (
                            <div
                              key={author.id}
                              className="rounded-xl bg-slate-50 p-3"
                            >
                              <p className="font-medium text-slate-900 text-sm">
                                {author.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {author.qualification} - {author.organization}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">
                          Chưa có thông tin tác giả chi tiết.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-slate-200 shadow-none">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 font-medium text-slate-900 mb-4">
                        <Target className="h-4 w-4 text-rose-500" />
                        Mục tiêu phác đồ
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(treatment.goalTags || []).map((item) => (
                          <Badge
                            key={item}
                            variant="secondary"
                            className="rounded-full bg-emerald-50 text-emerald-700 border-none"
                          >
                            {item}
                          </Badge>
                        ))}
                        {(treatment.goalTags || []).length === 0 && (
                          <span className="text-sm text-slate-400 italic">
                            Chưa xác định mục tiêu cụ thể
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-none">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 font-medium text-slate-900 mb-4">
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                        Thông số kiểm tra
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(treatment.inspectionParameters || []).map((item) => (
                          <Badge
                            key={item}
                            variant="outline"
                            className="rounded-full border-slate-200 text-slate-600"
                          >
                            {getOptionLabel(inspectionParameterOptions, item)}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </SectionBlock>

              <SectionBlock eyebrow="Context" title="Khảo sát và ghi chú">
                <div className="grid gap-4 md:grid-cols-1">
                  {treatment.soilIssue && (
                    <Card className="border-slate-200 shadow-none bg-slate-50/50 mb-4">
                      <CardContent className="p-5">
                        <h4 className="font-medium text-slate-900 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-emerald-600" />
                          Hiện trạng dịch hại
                        </h4>
                        <div className="mt-3 text-sm leading-6 text-slate-600">
                          {typeof treatment.soilIssue === "string" &&
                          treatment.soilIssue.includes("<") ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: treatment.soilIssue,
                              }}
                              className="rich-text-content"
                            />
                          ) : (
                            treatment.soilIssue
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-slate-200 shadow-none bg-slate-50/50">
                      <CardContent className="p-5">
                        <h4 className="font-medium text-slate-900 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          Khảo sát hiện trạng
                        </h4>
                        <div className="mt-3 text-sm leading-6 text-slate-600 italic">
                          {typeof treatment.currentSurvey === "string" &&
                          treatment.currentSurvey.includes("<") ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: treatment.currentSurvey,
                              }}
                              className="rich-text-content"
                            />
                          ) : (
                            treatment.currentSurvey ||
                            "Chưa cập nhật khảo sát hiện trạng."
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-none bg-slate-50/50">
                      <CardContent className="p-5">
                        <h4 className="font-medium text-slate-900 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-slate-400" />
                          Lưu ý quan trọng
                        </h4>
                        <div className="mt-3 text-sm leading-6 text-slate-600">
                          {typeof treatment.importantNotes === "string" &&
                          treatment.importantNotes.includes("<") ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: treatment.importantNotes,
                              }}
                              className="rich-text-content"
                            />
                          ) : (
                            treatment.importantNotes ||
                            "Chưa cập nhật lưu ý kỹ thuật."
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </SectionBlock>
            </TabsContent>

            {/* --- HANDBOOK TAB --- */}
            <TabsContent
              value="handbook"
              className="mt-0 space-y-6 outline-none"
            >
              <SectionBlock
                eyebrow="Handbook"
                title="Sổ tay triển khai thực địa"
              >
                <Card className="border-emerald-200 bg-emerald-50/70 shadow-none">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 font-medium text-emerald-900">
                      <BookOpen className="h-4 w-4 text-emerald-700" />
                      Mở đầu phác đồ
                    </div>
                    <div className="mt-3 text-sm leading-6 text-emerald-800">
                      {typeof treatment.expectedOutcomeSummary === "string" &&
                      treatment.expectedOutcomeSummary.includes("<") ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: treatment.expectedOutcomeSummary,
                          }}
                          className="rich-text-content"
                        />
                      ) : (
                        treatment.expectedOutcomeSummary ||
                        "Hướng dẫn chi tiết lộ trình điều trị, cách sử dụng vật tư và các bước kỹ thuật cần tuân thủ."
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6 pt-4">
                  {(treatment.procedures || []).length > 0 ? (
                    treatment.procedures?.map((procedure) => (
                      <div
                        key={procedure.id}
                        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                              Giai đoạn {procedure.stepNumber}
                            </p>
                            <h4 className="mt-1 text-xl font-semibold text-slate-900">
                              {procedure.name}
                            </h4>
                          </div>
                          <Badge className="rounded-full bg-slate-900 text-white font-mono border-none">
                            <Clock3 className="mr-1.5 h-3.5 w-3.5" />
                            {procedure.startDay !== undefined &&
                            procedure.endDay !== undefined
                              ? `Ngày ${procedure.startDay} -> ${procedure.endDay}`
                              : procedure.timing}
                          </Badge>
                        </div>

                        <div className="mt-4 text-sm leading-6 text-slate-600">
                          {typeof procedure.detailedInstructions === "string" &&
                          procedure.detailedInstructions.includes("<") ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: procedure.detailedInstructions,
                              }}
                              className="rich-text-content"
                            />
                          ) : (
                            procedure.detailedInstructions ||
                            procedure.description
                          )}
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Kỹ thuật
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-800 line-clamp-2">
                              {procedure.technique || "Chưa cập nhật"}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Định lượng
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-800">
                              {procedure.dosage || "Theo thực tế"}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Mục tiêu giai đoạn
                            </p>
                            <div className="mt-2 text-sm font-semibold text-emerald-700 line-clamp-2">
                              {typeof procedure.expectedOutcome === "string" &&
                              procedure.expectedOutcome.includes("<") ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: procedure.expectedOutcome,
                                  }}
                                  className="rich-text-content"
                                />
                              ) : (
                                procedure.expectedOutcome || "Phòng trị bệnh"
                              )}
                            </div>
                          </div>
                        </div>

                        {(procedure.stageMaterials || []).length > 0 && (
                          <div className="mt-6">
                            <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <Badge className="w-1.5 h-1.5 rounded-full p-0 bg-emerald-500 border-none" />
                              Danh mục vật tư
                            </p>
                            <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                              {procedure.stageMaterials?.map((item) => (
                                <div
                                  key={item.id}
                                  className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4"
                                >
                                  <Badge
                                    variant="outline"
                                    className="rounded-full bg-white text-[10px] h-5 border-emerald-100 text-emerald-700"
                                  >
                                    {getOptionLabel(
                                      treatmentMaterialCategoryOptions,
                                      item.category,
                                    )}
                                  </Badge>
                                  <p className="mt-3 font-bold text-slate-900 text-sm">
                                    {item.name}
                                  </p>
                                  <p className="mt-1 text-sm text-emerald-700 font-medium">
                                    {item.dosageMin} - {item.dosageMax}{" "}
                                    {item.unit}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {procedure.qualityCheckpoints &&
                          procedure.qualityCheckpoints.length > 0 && (
                            <div className="mt-6 rounded-2xl bg-blue-50/50 border border-blue-100 p-4">
                              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                                Checklist chất lượng
                              </p>
                              <div className="mt-3 space-y-2">
                                {Array.isArray(procedure.qualityCheckpoints) ? (
                                  procedure.qualityCheckpoints.map((item) => (
                                    <div
                                      key={item}
                                      className="flex items-start gap-2 text-sm text-slate-600"
                                    >
                                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-500 flex-shrink-0" />
                                      <span>{item}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div
                                    className="text-sm text-slate-600 rich-text-content"
                                    dangerouslySetInnerHTML={{
                                      __html: procedure.qualityCheckpoints,
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          )}

                        {procedure.warnings &&
                          procedure.warnings.length > 0 && (
                            <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
                              <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                                Lưu ý an toàn / Kỹ thuật
                              </p>
                              <div className="mt-3 space-y-2">
                                {Array.isArray(procedure.warnings) ? (
                                  procedure.warnings.map((item) => (
                                    <div
                                      key={item}
                                      className="flex items-start gap-2 text-sm text-rose-700"
                                    >
                                      <AlertCircle className="mt-0.5 h-4 w-4 text-rose-500 flex-shrink-0" />
                                      <span>{item}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div
                                    className="text-sm text-rose-700 rich-text-content"
                                    dangerouslySetInnerHTML={{
                                      __html: procedure.warnings,
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    ))
                  ) : (
                    <Card className="border-dashed border-slate-300 shadow-none">
                      <CardContent className="p-8 text-center">
                        <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">
                          Chưa có lộ trình hướng dẫn chi tiết cho phác đồ này.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </SectionBlock>
            </TabsContent>

            {/* --- MEDIA TAB --- */}
            <TabsContent value="media" className="mt-0 space-y-6 outline-none">
              <SectionBlock eyebrow="Media" title="Video & Tài liệu đính kèm">
                <div className="grid gap-4 lg:grid-cols-2">
                  <Card className="border-slate-200 shadow-none">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 font-medium text-slate-900 mb-4">
                        <Video className="h-4 w-4 text-violet-600" />
                        Video hướng dẫn
                      </div>
                      <div className="space-y-3">
                        {videos.length > 0 ? (
                          videos.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                                  <PlayCircle className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 text-sm">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-slate-500 uppercase">
                                    {item.size || "Video HD"}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <PlayCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            <Video className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-xs">Chưa có video hướng dẫn</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-none">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 font-medium text-slate-900 mb-4">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Tài liệu tham khảo
                      </div>
                      <div className="space-y-3">
                        {documents.length > 0 ? (
                          documents.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 text-sm">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-slate-500 uppercase">
                                    {item.fileType} • {item.size}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-xs">Chưa có tài liệu đính kèm</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-emerald-100 bg-[linear-gradient(135deg,#f8fafc_0%,#dcfce7_100%)] shadow-none">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 font-medium text-slate-900">
                      <Sprout className="h-4 w-4 text-emerald-600" />
                      Kết luận kỹ thuật
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700 italic">
                      Phác đồ này được xây dựng trên nền tảng cơ sở dữ liệu bệnh
                      học chuyên sâu, kết hợp giữa phương pháp hóa học và sinh
                      học để tối ưu chi phí và hiệu quả. Đội ngũ kỹ thuật cần
                      bám sát lộ trình 3 giai đoạn để đạt kết quả tốt nhất.
                    </p>
                  </CardContent>
                </Card>
              </SectionBlock>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
