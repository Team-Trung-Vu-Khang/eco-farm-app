import { useState } from "react";
import {
  MapPin,
  Calendar,
  List,
  Activity,
  Shield,
  Leaf,
  Bug,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Droplets,
  Wind,
  Image as ImageIcon,
  Play,
  Layers,
  AlertOctagon,
  Building2,
  ShieldCheck,
} from "lucide-react";
import {
  Badge,
  Card,
  CardContent,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Treatment } from "../types/treatment.types";
import { severityConfig } from "../data/treatment.data";

interface TreatmentDetailProps {
  treatment: Treatment;
  onEdit: (t: Treatment) => void;
  onDelete: (t: Treatment) => void;
  onViewMaterial?: (id: string) => void;
}

const getSeverityStyle = (severity: keyof typeof severityConfig) => {
  return (
    severityConfig[severity]?.color ||
    "text-gray-700 bg-gray-50 border-gray-200"
  );
};

export function TreatmentDetail({
  treatment,
  onEdit,
  onDelete,
  onViewMaterial,
}: TreatmentDetailProps) {
  const [activeTab, setActiveTab] = useState<"milestone" | "gallery" | "info">(
    "milestone",
  );

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* 1. HERO HEADER SECTION */}
      <div className="relative shrink-0">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {treatment.images?.[0] ? (
            <img
              src={treatment.images[0]}
              className="w-full h-full object-cover"
              alt="Treatment Background"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-800 to-green-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        </div>

        <div className="relative z-10 p-6 md:p-8 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
                {treatment.code}
              </Badge>
              <div
                className={`
                text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border
                ${getSeverityStyle(treatment.severity)}
            `}
              >
                {severityConfig[treatment.severity]?.label ||
                  treatment.severity}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8"
                onClick={() => onEdit(treatment)}
              >
                Sửa
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-200 hover:text-white hover:bg-red-500/50 h-8"
                onClick={() => onDelete(treatment)}
              >
                Xóa
              </Button>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight max-w-3xl font-display">
            {treatment.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mt-4 text-sm font-medium text-white/90">
            <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full backdrop-blur-sm border border-white/10">
              <Leaf className="w-3.5 h-3.5 text-green-400" />
              <span>{treatment.crop}</span>
              <span className="text-white/40">|</span>
              <span>{treatment.cropType}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full backdrop-blur-sm border border-white/10">
              <Bug className="w-3.5 h-3.5 text-red-400" />
              <span>{treatment.disease}</span>
            </div>
            {treatment.stage && (
              <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full backdrop-blur-sm border border-white/10">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>{treatment.stage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Header Stats Bar */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border-t border-white/10 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          <div className="p-3 text-center transition-colors hover:bg-white/5">
            <div className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">
              Thời gian xử lý
            </div>
            <div className="text-white font-semibold font-mono text-lg">
              {treatment.totalDuration}
            </div>
          </div>
          {/* <div className="p-3 text-center transition-colors hover:bg-white/5">
            <div className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">
              Chi phí ước tính
            </div>
            <div className="text-white font-semibold font-mono text-lg">
              {treatment.totalCost}
            </div>
          </div> */}
          {/* <div className="p-3 text-center hidden md:block transition-colors hover:bg-white/5">
            <div className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">
              Hiệu quả bệnh
            </div>
            <div className="text-green-400 font-bold text-lg">
              {treatment.efficacyRate}
            </div>
          </div> */}
          <div className="p-3 text-center hidden md:block transition-colors hover:bg-white/5">
            <div className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">
              An toàn sinh học
            </div>
            <div
              className={`font-bold text-lg uppercase ${treatment.safetyRating === "high" ? "text-blue-400" : "text-amber-400"}`}
            >
              {treatment.safetyRating === "high" ? "Rất cao" : "Trung bình"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
        <button
          onClick={() => setActiveTab("milestone")}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors flex justify-center items-center gap-2
                 ${activeTab === "milestone" ? "border-green-600 text-green-700 bg-green-50/50" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"}
             `}
        >
          <List className="w-4 h-4" /> Quy trình & Các bước
        </button>

        <button
          onClick={() => setActiveTab("info")}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors flex justify-center items-center gap-2
                 ${activeTab === "info" ? "border-green-600 text-green-700 bg-green-50/50" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"}
             `}
        >
          <Activity className="w-4 h-4" /> Thông tin phác đồ
        </button>

        <button
          onClick={() => setActiveTab("gallery")}
          className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors flex justify-center items-center gap-2
                 ${activeTab === "gallery" ? "border-green-600 text-green-700 bg-green-50/50" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"}
             `}
        >
          <ImageIcon className="w-4 h-4" /> Thư viện ảnh/video
        </button>
      </div>

      {/* 3. CONTENT AREA */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
        {/* --- MILESTONE TAB --- */}
        {activeTab === "milestone" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Lộ trình xử lý
              </h3>
              <span className="text-sm text-gray-500">
                Tổng cộng {treatment.steps.length} bước xử lý
              </span>
            </div>

            {/* Timeline Items */}
            <div className="space-y-8 relative pl-4 md:pl-8">
              {/* Connecting Line */}
              <div className="absolute left-[27px] md:left-[43px] top-6 bottom-0 w-0.5 bg-gray-200 z-0"></div>

              {treatment.steps.map((step) => (
                <div key={step.id} className="relative z-10 group">
                  {/* Step Badge */}
                  <div className="absolute left-0 md:left-2 top-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm shadow ring-4 ring-gray-50">
                    {step.step}
                  </div>

                  <div className="ml-12 md:ml-16 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-gray-100 gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-bold text-lg text-gray-900">
                            {step.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">
                            {step.timing}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 rounded-xl p-4">
                      {/* Material Section */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <Droplets className="w-3.5 h-3.5" /> Vật tư sử dụng
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <div
                            className="font-bold text-base flex items-center gap-1 cursor-pointer hover:underline mb-1"
                            onClick={() =>
                              step.materialId &&
                              onViewMaterial?.(step.materialId)
                            }
                          >
                            <span
                              className={`
                              px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mr-1
                              ${
                                step.materialType === "fertilizer"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }
                            `}
                            >
                              {step.materialType === "fertilizer"
                                ? "Phân bón"
                                : "Thuốc"}
                            </span>
                            <span className="text-gray-900">
                              {step.materialName}
                            </span>
                            {step.materialId && (
                              <ArrowRight className="w-3.5 h-3.5 opacity-50 ml-auto" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm mt-2">
                            <div>
                              <span className="text-gray-500 text-xs block">
                                Liều lượng pha
                              </span>
                              <span className="font-medium text-gray-900">
                                {step.dosage}
                              </span>
                            </div>
                            <div className="h-6 w-px bg-gray-200"></div>
                            <div>
                              <span className="text-gray-500 text-xs block">
                                Lượng dùng/ha
                              </span>
                              <span className="font-medium text-gray-900">
                                {step.dosagePerArea}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Technical Section */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5" /> Yêu cầu kỹ thuật
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                            <span className="text-gray-500 text-[10px] uppercase block mb-0.5">
                              Cách xử lý
                            </span>
                            <span className="text-sm font-medium text-gray-900 leading-tight block">
                              {step.applicationMethod}
                            </span>
                          </div>

                          {/* SAFETY PERIOD HIGHLIGHT (PHI) */}
                          <div
                            className={`p-2.5 rounded-lg border ${step.safetyPeriod ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"}`}
                          >
                            <span className="text-amber-700/70 text-[10px] uppercase font-bold block mb-0.5 flex items-center gap-1">
                              <AlertOctagon className="w-3 h-3" /> Thời gian
                              cách ly
                            </span>
                            <span className="text-sm font-bold text-amber-700 leading-tight block">
                              {step.safetyPeriod || "Không yêu cầu"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Environment & PPE Row */}
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 border-t border-gray-100 pt-3">
                      {step.weatherConditions && (
                        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                          <Wind className="w-3.5 h-3.5" />
                          <span className="font-medium">
                            {step.weatherConditions}
                          </span>
                        </div>
                      )}
                      {step.ppeRequired && (
                        <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Bảo hộ: {step.ppeRequired}</span>
                        </div>
                      )}
                    </div>

                    {step.notes && (
                      <div className="mt-3 flex gap-2 text-amber-800 bg-amber-50 p-3 rounded-lg text-sm border border-amber-100">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          <span className="font-bold">Lưu ý quan trọng:</span>{" "}
                          {step.notes}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Finish Node */}
              <div className="relative z-10 pl-12 md:pl-16 pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Hoàn thành phác đồ
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- INFO TAB --- */}
        {activeTab === "info" && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            <Card className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" /> Thông tin chuyên
                  môn
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">
                    <div className="text-sm text-gray-500">Tác giả phác đồ</div>
                    <div className="text-sm font-medium text-right">
                      {treatment.author}
                      <br />
                      <span className="text-xs text-gray-400">
                        {treatment.authorTitle}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100">
                    <div className="text-sm text-gray-500">Người phê duyệt</div>
                    <div className="text-sm font-medium text-right">
                      {treatment.approvedBy}
                      <br />
                      <span className="text-xs text-gray-400">
                        {treatment.approvalDate}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3">
                    <div className="text-sm text-gray-500">Giống áp dụng</div>
                    <div className="text-sm font-medium text-right">
                      {treatment.variety} ({treatment.seed})
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200 bg-gradient-to-br from-white to-gray-50/50">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" /> Đơn vị cung
                  cấp phác đồ
                </h3>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-900 leading-tight">
                      {treatment.author}
                    </h4>
                    <p className="text-sm text-indigo-600 font-medium">
                      {treatment.authorTitle}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-gray-400 font-medium italic">
                        Đơn vị tư vấn kỹ thuật chuyên sâu
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" /> Chỉ số hiệu
                  quả
                </h3>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        Mức độ an toàn sinh học
                      </span>
                      <span className="font-bold">
                        {treatment.safetyRating === "high"
                          ? "Cao"
                          : "Trung bình"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${treatment.safetyRating === "high" ? "bg-green-500 w-[90%]" : "bg-amber-500 w-[60%]"}`}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        Hiệu quả kiểm soát bệnh
                      </span>
                      <span className="font-bold">
                        {treatment.efficacyRate}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-500 w-[85%]"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Deployment Regions Grid */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" /> Vùng đang áp
                  dụng
                </h3>
                <Button variant="outline" size="sm" className="h-8">
                  Xem bản đồ tổng quát
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 1,
                    name: "Khu vực A - Cầu Đất",
                    area: "2.5 ha",
                    manager: "Nguyễn Văn An",
                    startDate: "10/01/2024",
                    progress: 75,
                    status: "active",
                    image:
                      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    id: 2,
                    name: "Khu vực B - Trại Mát",
                    area: "1.8 ha",
                    manager: "Trần Thị Bé",
                    startDate: "15/01/2024",
                    progress: 45,
                    status: "active",
                    image:
                      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    id: 3,
                    name: "Khu vực C - Đa Sar",
                    area: "3.2 ha",
                    manager: "Lê Minh Cường",
                    startDate: "05/02/2024",
                    progress: 20,
                    status: "warning",
                    image:
                      "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    id: 4,
                    name: "Khu vực D - Lạc Dương",
                    area: "1.5 ha",
                    manager: "Phạm Văn Dũng",
                    startDate: "20/01/2024",
                    progress: 90,
                    status: "active",
                    image:
                      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  },
                ].map((region) => (
                  <Card
                    key={region.id}
                    className="overflow-hidden hover:shadow-md transition-all border-gray-200 group cursor-pointer"
                  >
                    <div className="flex h-full">
                      <div className="w-1/3 relative overflow-hidden">
                        <img
                          src={region.image}
                          alt={region.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      </div>
                      <div className="w-2/3 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-gray-900 line-clamp-1">
                              {region.name}
                            </h4>
                            <Badge
                              className={`text-[10px] h-5 border-none ${
                                region.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {region.status === "active"
                                ? "Đang xử lý"
                                : "Cảnh báo"}
                            </Badge>
                          </div>

                          <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {region.area}
                            </span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />{" "}
                              {region.startDate}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Tiến độ</span>
                              <span className="font-medium">
                                {region.progress}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${region.status === "active" ? "bg-green-500" : "bg-amber-500"}`}
                                style={{ width: `${region.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                          <div className="text-gray-500">
                            Phụ trách:{" "}
                            <span className="font-medium text-gray-700">
                              {region.manager}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- GALLERY TAB --- */}
        {activeTab === "gallery" && (
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Highlight */}
              {treatment.videoUrl && (
                <div className="col-span-1 md:col-span-2">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Play className="w-4 h-4" /> Video hướng dẫn
                  </h3>
                  <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-200">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${treatment.videoUrl.split("v=")[1] || treatment.videoUrl.split("/").pop()}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Images Grid */}
              {treatment.images?.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-video rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-zoom-in"
                >
                  <img
                    src={img}
                    alt={`Documentation ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">
                      Hình ảnh thực địa #{idx + 1}
                    </span>
                  </div>
                </div>
              ))}

              {/* Add placeholder if no images */}
              {(!treatment.images || treatment.images.length === 0) && (
                <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>Chưa có hình ảnh minh họa</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
