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
  AlertTriangle,
  Beaker,
  CheckCircle2,
  Clock,
  Edit,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  ListChecks,
  MapPin,
  Play,
  Sprout,
  Target,
  Trash2,
  Video,
  Wind,
} from "lucide-react";
import {
  getTreatmentIntensityConfig,
} from "../data/soilAmendmentTreatmentConfig";
import { mockTreatmentMethods } from "../data/soilAmendmentTreatmentData";
import type { TreatmentPlan } from "../types/treatment";

interface SoilTreatmentPlanDetailProps {
  onDelete: (item: TreatmentPlan) => void;
  onEdit: (item: TreatmentPlan) => void;
  selectedPlan: TreatmentPlan | null;
}

export function SoilTreatmentPlanDetail({
  onDelete,
  onEdit,
  selectedPlan,
}: SoilTreatmentPlanDetailProps) {
  if (!selectedPlan) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gray-50/30 text-gray-400">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
          <Sprout className="h-12 w-12 text-gray-300" />
        </div>
        <h3 className="mb-1 text-lg font-medium text-gray-600">Chưa chọn phác đồ</h3>
        <p>Vui lòng chọn một phác đồ từ danh sách bên trái</p>
      </div>
    );
  }

  const intensityConfig = getTreatmentIntensityConfig(selectedPlan.intensity);

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative h-48 overflow-hidden bg-gradient-to-r from-green-600 to-emerald-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <div className="mb-2 flex items-center gap-3">
            <span className="rounded-full bg-white/20 px-3 py-1 font-mono text-sm font-medium backdrop-blur-sm">
              {selectedPlan.code}
            </span>
            <Badge className={`${intensityConfig.color} text-white`}>
              {intensityConfig.label}
            </Badge>
          </div>
          <h2 className="mb-2 text-2xl font-bold">{selectedPlan.name}</h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {selectedPlan.zone}
            </span>
            <span className="flex items-center gap-1.5">
              <Sprout className="h-4 w-4" />
              {selectedPlan.cropType}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {selectedPlan.duration}
            </span>
          </div>
        </div>
        <div className="absolute right-4 top-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(selectedPlan)}
            className="bg-white/90 hover:bg-white"
          >
            <Edit className="mr-1 h-4 w-4" />
            Sửa
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(selectedPlan)}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="procedures" className="p-6">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="procedures">
            <ListChecks className="mr-2 h-4 w-4" />
            Quy trình & Các bước
          </TabsTrigger>
          <TabsTrigger value="methods">
            <Beaker className="mr-2 h-4 w-4" />
            Phương pháp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="procedures" className="space-y-6">
          {selectedPlan.procedures.length > 0 ? (
            <div className="space-y-6">
              {selectedPlan.procedures.map((procedure) => (
                <div
                  key={procedure.id}
                  className="relative border-l-2 border-gray-200 pb-8 pl-8 last:border-l-0 last:pb-0"
                >
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-green-500 shadow-sm" />

                  <Card className="border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge className="bg-green-600 text-xs font-bold text-white">
                              Bước {procedure.stepNumber}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="mr-1 h-3 w-3" />
                              {procedure.timing}
                            </Badge>
                            {procedure.estimatedDays && (
                              <Badge variant="outline" className="text-xs">
                                {procedure.estimatedDays} ngày
                              </Badge>
                            )}
                          </div>
                          <h3 className="mb-1 text-lg font-bold text-gray-900">
                            {procedure.name}
                          </h3>
                          <p className="text-sm text-gray-600">{procedure.description}</p>
                        </div>
                      </div>

                      {procedure.images && procedure.images.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <ImageIcon className="h-4 w-4 text-blue-600" />
                            Hình ảnh minh họa
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {procedure.images.map((image, index) => (
                              <div
                                key={index}
                                className="relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                              >
                                <img
                                  src={image}
                                  alt={`Bước ${procedure.stepNumber} - Ảnh ${index + 1}`}
                                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {procedure.videoUrl && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600">
                              <Play className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-blue-900">
                                Video hướng dẫn chi tiết
                              </p>
                              <p className="text-xs text-blue-700">
                                Xem video để hiểu rõ hơn về kỹ thuật thực hiện
                              </p>
                            </div>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Video className="mr-1 h-4 w-4" />
                              Xem
                            </Button>
                          </div>
                        </div>
                      )}

                      {procedure.detailedInstructions && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                            <FileText className="h-4 w-4 text-gray-600" />
                            Hướng dẫn chi tiết
                          </h4>
                          <p className="text-sm leading-relaxed text-gray-700">
                            {procedure.detailedInstructions}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        {procedure.dosage && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                            <p className="mb-1 text-xs font-medium text-amber-900">
                              Liều lượng
                            </p>
                            <p className="text-sm font-bold text-amber-700">
                              {procedure.dosage}
                            </p>
                          </div>
                        )}
                        {procedure.technique && (
                          <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                            <p className="mb-1 text-xs font-medium text-purple-900">
                              Kỹ thuật
                            </p>
                            <p className="text-sm font-bold text-purple-700">
                              {procedure.technique}
                            </p>
                          </div>
                        )}
                        {procedure.weatherRequirements && (
                          <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
                            <p className="mb-1 flex items-center gap-1 text-xs font-medium text-sky-900">
                              <Wind className="h-3 w-3" />
                              Điều kiện thời tiết
                            </p>
                            <p className="text-sm font-bold text-sky-700">
                              {procedure.weatherRequirements}
                            </p>
                          </div>
                        )}
                        {procedure.laborRequired && (
                          <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                            <p className="mb-1 text-xs font-medium text-indigo-900">
                              Nhân công
                            </p>
                            <p className="text-sm font-bold text-indigo-700">
                              {procedure.laborRequired} người
                            </p>
                          </div>
                        )}
                        {procedure.estimatedCost && (
                          <div className="col-span-2 rounded-lg border border-green-200 bg-green-50 p-3">
                            <p className="mb-1 text-xs font-medium text-green-900">
                              Chi phí ước tính
                            </p>
                            <p className="text-lg font-bold text-green-700">
                              {procedure.estimatedCost} triệu đồng
                            </p>
                          </div>
                        )}
                      </div>

                      {procedure.warnings && procedure.warnings.length > 0 && (
                        <div className="rounded-r-lg border-l-4 border-red-500 bg-red-50 p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                            <div className="flex-1">
                              <h4 className="mb-2 text-sm font-bold text-red-900">
                                ⚠️ Lưu ý quan trọng
                              </h4>
                              <ul className="space-y-1.5">
                                {procedure.warnings.map((warning, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-red-800"
                                  >
                                    <span className="mt-0.5 font-bold text-red-500">•</span>
                                    <span>{warning}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {procedure.tips && procedure.tips.length > 0 && (
                        <div className="rounded-r-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                            <div className="flex-1">
                              <h4 className="mb-2 text-sm font-bold text-yellow-900">
                                💡 Mẹo hữu ích
                              </h4>
                              <ul className="space-y-1.5">
                                {procedure.tips.map((tip, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-yellow-800"
                                  >
                                    <span className="mt-0.5 font-bold text-yellow-500">✓</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {procedure.expectedOutcome && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                          <div className="flex items-start gap-2">
                            <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                            <div>
                              <p className="mb-1 text-xs font-medium text-green-900">
                                Kết quả mong đợi
                              </p>
                              <p className="text-sm text-green-700">
                                {procedure.expectedOutcome}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {procedure.qualityCheckpoints &&
                        procedure.qualityCheckpoints.length > 0 && (
                          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-blue-900">
                              <CheckCircle2 className="h-4 w-4" />
                              Điểm kiểm tra chất lượng
                            </h4>
                            <div className="space-y-2">
                              {procedure.qualityCheckpoints.map((checkpoint, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600">
                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                  </div>
                                  <p className="flex-1 text-sm text-blue-800">
                                    {checkpoint}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      <div className="grid grid-cols-2 gap-3">
                        {procedure.materials && procedure.materials.length > 0 && (
                          <div>
                            <p className="mb-2 text-xs font-semibold text-gray-700">
                              Vật tư cần thiết
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {procedure.materials.map((material, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-green-100 text-xs text-green-800"
                                >
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {procedure.equipment && procedure.equipment.length > 0 && (
                          <div>
                            <p className="mb-2 text-xs font-semibold text-gray-700">
                              Thiết bị
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {procedure.equipment.map((equipment, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-blue-100 text-xs text-blue-800"
                                >
                                  {equipment}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400">
              <ListChecks className="mx-auto mb-3 h-12 w-12 opacity-20" />
              <p className="text-sm">Chưa có quy trình chi tiết</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="methods" className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {mockTreatmentMethods
              .filter((method) => selectedPlan.selectedMethods.includes(method.id))
              .map((method) => (
                <Card key={method.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{method.name}</h4>
                        <p className="mt-1 text-xs text-gray-500">
                          {method.description}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {method.type === "physical" && "Vật lý"}
                          {method.type === "chemical" && "Hóa học"}
                          {method.type === "biological" && "Sinh học"}
                          {method.type === "integrated" && "Tổng hợp"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
