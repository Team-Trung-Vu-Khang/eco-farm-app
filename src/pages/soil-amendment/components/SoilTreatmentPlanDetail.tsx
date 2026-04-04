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
} from "lucide-react";
import useCropStore from "../../../stores/useCropStore";
import useGroupCropStore from "../../../stores/useGroupCropStore";
import {
  budgetRangeOptions,
  inspectionParameterOptions,
  mockTreatmentMethods,
  responsibleUnitOptions,
  targetSeverityOptions,
  treatmentMaterialCategoryOptions,
} from "../data/soilAmendmentTreatmentData";
import type {
  TreatmentAttachment,
  TreatmentPlan,
  VideoTutorial,
} from "../types/treatment";

interface SoilTreatmentPlanDetailProps {
  onDelete: (item: TreatmentPlan) => void;
  onEdit: (item: TreatmentPlan) => void;
  selectedPlan: TreatmentPlan | null;
}

function getOptionLabel(
  options: ReadonlyArray<{ label: string; value: string }>,
  value?: string,
) {
  return options.find((item) => item.value === value)?.label || "Chưa cập nhật";
}

function resolveLabels(
  values: string[] | undefined,
  options: Array<{ label: string; value: string }>,
) {
  return (values || []).map((value) => {
    return options.find((item) => item.value === value)?.label || value;
  });
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
    <section className="rounded-[28px] border border-amber-100 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-xl font-semibold text-slate-900">{title}</h3>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function SoilTreatmentPlanDetail({
  onDelete,
  onEdit,
  selectedPlan,
}: SoilTreatmentPlanDetailProps) {
  const groupCrops = useGroupCropStore((state) => state.groupCrops);
  const crops = useCropStore((state) => state.crops);

  if (!selectedPlan) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-slate-50 text-slate-400">
        Chưa chọn phác đồ để xem chi tiết.
      </div>
    );
  }

  const methodIds = [
    ...(selectedPlan.primaryMethodId ? [selectedPlan.primaryMethodId] : []),
    ...(selectedPlan.supportingMethodIds || []),
    ...selectedPlan.selectedMethods,
  ];
  const methods = mockTreatmentMethods.filter((item) => methodIds.includes(item.id));
  const groupCropLabels = resolveLabels(
    selectedPlan.cropGroupTags,
    groupCrops.map((item) => ({ label: item.name, value: String(item.id) })),
  );
  const cropLabels = resolveLabels(
    selectedPlan.applicableCrops,
    crops.map((item) => ({ label: item.name, value: String(item.id) })),
  );
  const videos: Array<TreatmentAttachment | VideoTutorial> =
    selectedPlan.attachments?.filter((item) => item.fileType === "video").length
      ? (selectedPlan.attachments?.filter((item) => item.fileType === "video") as TreatmentAttachment[])
      : (selectedPlan.videoTutorials || []);
  const documents: Array<TreatmentAttachment | { id: number; name: string; size?: string; type?: string }> =
    selectedPlan.attachments && selectedPlan.attachments.length > 0
      ? selectedPlan.attachments
      : (selectedPlan.relatedDocuments || []);

  return (
    <div className="max-h-[92vh] overflow-y-auto bg-[linear-gradient(180deg,#fff7ed_0%,#fffbeb_22%,#ffffff_55%)]">
      <div className="border-b border-amber-100 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_34%),linear-gradient(135deg,#0f172a_0%,#1e293b_44%,#14532d_100%)] px-8 py-8 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/15 text-white">{selectedPlan.code}</Badge>
              <Badge className="bg-amber-400/90 text-slate-950">
                {getOptionLabel(targetSeverityOptions, selectedPlan.targetSeverity)}
              </Badge>
              <Badge className="bg-white/15 text-white">
                {getOptionLabel(budgetRangeOptions, selectedPlan.budgetRange)}
              </Badge>
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">
              {selectedPlan.name}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
              {selectedPlan.soilIssue}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onEdit(selectedPlan)}>
              Chỉnh sửa
            </Button>
            <Button variant="destructive" onClick={() => onDelete(selectedPlan)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-300">Khu vực</p>
            <p className="mt-2 font-medium">{selectedPlan.zone}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-300">Thời lượng</p>
            <p className="mt-2 font-medium">{selectedPlan.duration}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-300">
              Đơn vị phụ trách
            </p>
            <p className="mt-2 font-medium">
              {getOptionLabel(responsibleUnitOptions, selectedPlan.responsibleUnit)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-300">
              Biện pháp chính
            </p>
            <p className="mt-2 font-medium">
              {methods[0]?.name || "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="px-8 py-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-amber-50 p-1">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="handbook">Sách hướng dẫn</TabsTrigger>
          <TabsTrigger value="media">Video & Tài liệu</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <SectionBlock eyebrow="Overview" title="Tóm tắt áp dụng">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-slate-200">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    Phạm vi và đối tượng
                  </div>
                  <p className="text-sm text-slate-600">
                    Cây trồng: {cropLabels.join(", ") || "Chưa cập nhật"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Địa hình: {(selectedPlan.terrainTypes || []).join(", ") || "Chưa cập nhật"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Nhóm cây: {groupCropLabels.join(", ") || "Chưa cập nhật"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <UserRound className="h-4 w-4 text-amber-600" />
                    Tác giả và cộng tác
                  </div>
                  {(selectedPlan.authors || []).length > 0 ? (
                    <div className="space-y-2">
                      {selectedPlan.authors?.map((author) => (
                        <div key={author.id} className="rounded-xl bg-slate-50 p-3">
                          <p className="font-medium text-slate-900">{author.name}</p>
                          <p className="text-sm text-slate-600">
                            {author.qualification} - {author.organization}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Chưa có thông tin tác giả.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <Target className="h-4 w-4 text-red-500" />
                    Mục tiêu phác đồ
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(selectedPlan.goalTags || selectedPlan.objectives || []).map((item) => (
                      <Badge key={item} variant="secondary" className="rounded-full">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    Thông số kiểm tra
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(selectedPlan.inspectionParameters || []).map((item) => (
                      <Badge key={item} variant="outline" className="rounded-full">
                        {getOptionLabel(inspectionParameterOptions, item)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </SectionBlock>

          <SectionBlock eyebrow="Survey" title="Khảo sát và ghi chú">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-slate-200">
                <CardContent className="p-5">
                  <h4 className="font-medium text-slate-900">Khảo sát hiện trạng</h4>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {selectedPlan.currentSurvey || "Chưa cập nhật khảo sát hiện trạng."}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="p-5">
                  <h4 className="font-medium text-slate-900">Lưu ý quan trọng</h4>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {selectedPlan.importantNotes || "Chưa cập nhật lưu ý."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </SectionBlock>
        </TabsContent>

        <TabsContent value="handbook" className="mt-6 space-y-6">
          <SectionBlock eyebrow="Handbook" title="Sổ tay triển khai">
            <Card className="border-amber-200 bg-amber-50/70">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 font-medium text-slate-900">
                  <BookOpen className="h-4 w-4 text-amber-700" />
                  Mở đầu
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {selectedPlan.expectedOutcomeSummary ||
                    "Chưa cập nhật phần giới thiệu tổng quan cho phác đồ."}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {selectedPlan.procedures.length > 0 ? (
                selectedPlan.procedures.map((procedure) => (
                  <div
                    key={procedure.id}
                    className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Giai đoạn {procedure.stepNumber}
                        </p>
                        <h4 className="mt-2 text-xl font-semibold text-slate-900">
                          {procedure.name}
                        </h4>
                      </div>
                      <Badge className="rounded-full bg-slate-900 text-white">
                        <Clock3 className="mr-1 h-3 w-3" />
                        {procedure.startDay !== undefined && procedure.endDay !== undefined
                          ? `Ngày ${procedure.startDay} -> ${procedure.endDay}`
                          : procedure.timing}
                      </Badge>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {procedure.detailedInstructions || procedure.description || "Chưa cập nhật hướng dẫn cho giai đoạn này."}
                    </p>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <Card className="border-slate-200">
                        <CardContent className="p-4">
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Kỹ thuật
                          </p>
                          <p className="mt-2 text-sm font-medium text-slate-800">
                            {procedure.technique || "Chưa cập nhật"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="border-slate-200">
                        <CardContent className="p-4">
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Định lượng
                          </p>
                          <p className="mt-2 text-sm font-medium text-slate-800">
                            {procedure.dosage || "Theo thực tế hiện trường"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="border-slate-200">
                        <CardContent className="p-4">
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Kết quả mong đợi
                          </p>
                          <p className="mt-2 text-sm font-medium text-slate-800">
                            {procedure.expectedOutcome || "Chưa cập nhật"}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {(procedure.materials.length > 0 || procedure.equipment.length > 0) && (
                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium text-slate-900">Vật tư</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {procedure.materials.map((material) => (
                              <Badge key={material} variant="secondary" className="rounded-full">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Thiết bị</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {procedure.equipment.map((equipment) => (
                              <Badge key={equipment} variant="outline" className="rounded-full">
                                {equipment}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {(procedure.stageMaterials || []).length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-medium text-slate-900">
                          Vật tư riêng của giai đoạn
                        </p>
                        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {procedure.stageMaterials?.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                            >
                              <Badge variant="outline" className="rounded-full">
                                {getOptionLabel(treatmentMaterialCategoryOptions, item.category)}
                              </Badge>
                              <p className="mt-3 font-medium text-slate-900">{item.name}</p>
                              <p className="mt-2 text-sm text-slate-600">
                                {item.dosageMin} - {item.dosageMax} {item.unit}
                              </p>
                              {item.note && (
                                <p className="mt-2 text-sm text-slate-500">{item.note}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {procedure.qualityCheckpoints &&
                      procedure.qualityCheckpoints.length > 0 && (
                        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                          <p className="text-sm font-medium text-slate-900">
                            Checklist chất lượng
                          </p>
                          <div className="mt-3 space-y-2">
                            {procedure.qualityCheckpoints.map((item) => (
                              <div key={item} className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {procedure.warnings && procedure.warnings.length > 0 && (
                      <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 p-4">
                        <p className="text-sm font-medium text-rose-900">
                          Lưu ý riêng của giai đoạn
                        </p>
                        <div className="mt-3 space-y-2">
                          {procedure.warnings.map((item) => (
                            <div key={item} className="flex items-start gap-2 text-sm text-rose-700">
                              <span className="mt-0.5 h-2 w-2 rounded-full bg-rose-500" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <Card className="border-dashed border-slate-300">
                  <CardContent className="p-6 text-sm text-slate-500">
                    Chưa có chương hướng dẫn chi tiết. Hiện detail vẫn hiển thị đầy đủ
                    phần tổng quan, vật tư, media và checklist từ master data.
                  </CardContent>
                </Card>
              )}
            </div>

            {(selectedPlan.materialItems || []).length > 0 && (
              <SectionBlock eyebrow="Materials" title="Vật tư định lượng">
                <div className="grid gap-3">
                  {selectedPlan.materialItems?.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_1.4fr_1fr]"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Nhóm vật tư
                        </p>
                        <p className="mt-1 font-medium text-slate-900">
                          {getOptionLabel(treatmentMaterialCategoryOptions, item.category)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Tên vật tư
                        </p>
                        <p className="mt-1 font-medium text-slate-900">{item.name}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Định lượng / ha
                        </p>
                        <p className="mt-1 font-medium text-slate-900">
                          {item.dosageMin} - {item.dosageMax} {item.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionBlock>
            )}
          </SectionBlock>
        </TabsContent>

        <TabsContent value="media" className="mt-6 space-y-6">
          <SectionBlock eyebrow="Media" title="Video hướng dẫn và tài liệu">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <Video className="h-4 w-4 text-violet-600" />
                    Video hướng dẫn
                  </div>
                  <div className="mt-4 space-y-3">
                    {videos.length > 0 ? (
                      videos.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-slate-900">
                              {"title" in item ? item.title : item.name}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {"description" in item
                                ? item.description
                                : item.size || "Video hướng dẫn thao tác"}
                            </p>
                          </div>
                            <Button size="sm" variant="outline">
                              <PlayCircle className="mr-2 h-4 w-4" />
                              Xem video
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Chưa có video hướng dẫn.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    Tài liệu đính kèm
                  </div>
                  <div className="mt-4 space-y-3">
                    {documents.length > 0 ? (
                      documents.map((item, index) => (
                          <div
                            key={item.id || index}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <p className="font-medium text-slate-900">{item.name}</p>
                            <p className="mt-1 text-sm text-slate-500">
                              {"fileType" in item
                                ? item.size || item.fileType
                                : item.size || item.type || "Tài liệu tham khảo"}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-slate-500">Chưa có tài liệu đính kèm.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#ecfccb_100%)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 font-medium text-slate-900">
                  <Sprout className="h-4 w-4 text-emerald-600" />
                  Kết luận handbook
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  Phác đồ này được trình bày theo dạng sổ tay để đội hiện trường có
                  thể đọc từ trên xuống dưới như một hướng dẫn thao tác, đồng thời
                  vẫn tra cứu nhanh được video, vật tư và checklist khi cần.
                </p>
              </CardContent>
            </Card>
          </SectionBlock>
        </TabsContent>
      </Tabs>
    </div>
  );
}
