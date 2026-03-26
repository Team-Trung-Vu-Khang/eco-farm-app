import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ClipboardList,
  FileCheck,
  Info,
  Package,
  Users,
  Wrench,
} from "lucide-react";
import type { AmendmentPlanFormData, AmendmentProcess, SoilAmendmentRegion } from "../types";

interface AmendmentPlanConfirmationStepProps {
  calculateArea: () => string;
  formData: AmendmentPlanFormData;
  regions: SoilAmendmentRegion[];
  seasons: { id: string; name: string }[];
  selectedProcess?: AmendmentProcess;
}

export function AmendmentPlanConfirmationStep({
  calculateArea,
  formData,
  regions,
  seasons,
  selectedProcess,
}: AmendmentPlanConfirmationStepProps) {
  const materialAllocations = formData.allocations.filter(
    (allocation) => allocation.type === "material",
  );
  const taskAllocations = formData.allocations.filter(
    (allocation) => allocation.type === "task",
  );
  const laborOptions = Array.from(
    new Set(
      taskAllocations
        .map((allocation) => allocation.labor || allocation.detail)
        .filter(Boolean),
    ),
  );

  return (
    <div className="animation-fade-in mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <FileCheck className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Xác nhận Kế hoạch Cải tạo
        </h2>
        <p className="mt-2 text-slate-500">
          Kiểm tra thông tin trước khi ban hành kế hoạch.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-slate-50/50 pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                <Info className="h-4 w-4 text-blue-600" />
                Tổng quan & Phạm vi
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-4 pt-4 text-sm font-medium">
              <div className="col-span-2">
                <span className="mb-1 block text-[10px] uppercase text-slate-400">
                  Tên kế hoạch
                </span>
                {formData.name}
                <Badge className="ml-2 font-mono" variant="secondary">
                  {formData.code}
                </Badge>
              </div>
              <div>
                <span className="mb-1 block text-[10px] uppercase text-slate-400">
                  Mùa vụ
                </span>
                {seasons.find((season) => season.id === formData.seasonId)?.name ||
                  "---"}
              </div>
              <div>
                <span className="mb-1 block text-[10px] uppercase text-slate-400">
                  Kỹ thuật viên
                </span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5 border">
                    <AvatarFallback className="bg-blue-100 text-[8px] text-blue-600">
                      {formData.technician?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {formData.technician || "Chưa phân bổ"}
                </div>
              </div>
              <div>
                <span className="mb-1 block text-[10px] uppercase text-slate-400">
                  Thời gian
                </span>
                {formData.startDate} → {formData.endDate}
              </div>
              <div>
                <span className="mb-1 block text-[10px] uppercase text-slate-400">
                  Quy mô
                </span>
                {formData.selectedPlotIds.length} lô đất • {calculateArea()} HA
              </div>
              <div className="col-span-2">
                <span className="mb-1 block text-[10px] uppercase text-slate-400">
                  Vùng áp dụng
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {regions
                    .filter(
                      (region) =>
                        String(region.id) === String(formData.selectedRegionId),
                    )
                    .map((region) => (
                      <Badge
                        className="border-emerald-100 bg-emerald-50 text-emerald-700"
                        key={region.id}
                      >
                        {region.name}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b bg-slate-50/50 pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                <Wrench className="h-4 w-4 text-amber-600" />
                Quy trình cải tạo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Quy trình:</span>
                <span className="border-b-2 border-amber-200 font-bold text-slate-900">
                  {selectedProcess?.name || "Tùy chỉnh"}
                </span>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Lộ trình giai đoạn:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {formData.selectedStages.map((stage, index) => (
                    <div
                      className="flex items-center gap-1 rounded border bg-slate-100 px-2 py-1"
                      key={stage}
                    >
                      <span className="text-[10px] font-black opacity-30">
                        {index + 1}
                      </span>
                      <span className="font-medium">{stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-full">
          <CardHeader className="border-b bg-slate-50/50 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
              <Package className="h-4 w-4 text-purple-600" />
              Nguồn lực & Dự trù
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-3 gap-4 border-b pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Vật tư
                </span>
                <p className="text-xl font-black text-slate-800">
                  {materialAllocations.length}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Nhân lực
                </span>
                <p className="text-xl font-black text-slate-800">
                  {laborOptions.length}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Công việc
                </span>
                <p className="text-xl font-black text-slate-800">
                  {taskAllocations.length}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest leading-none text-slate-400">
                  <Package className="h-3 w-3 text-purple-500" />
                  Danh mục vật tư
                </div>
                <div className="flex flex-wrap gap-1.5 leading-none">
                  {materialAllocations.length > 0 ? (
                    Array.from(
                      new Set(materialAllocations.map((item) => item.name)),
                    ).map((name) => (
                      <Badge
                        className="h-5 border-purple-100 bg-purple-50 px-2 text-[10px] font-bold text-purple-700"
                        key={name}
                        variant="secondary"
                      >
                        {name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs italic text-slate-400">
                      Chưa có vật tư
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest leading-none text-slate-400">
                  <Users className="h-3 w-3 text-blue-500" />
                  Nhân lực huy động
                </div>
                <div className="flex flex-wrap gap-1.5 leading-none">
                  {laborOptions.length > 0 ? (
                    laborOptions.map((labor) => (
                      <Badge
                        className="h-5 border-blue-100 bg-blue-50 px-2 text-[10px] font-bold text-blue-700"
                        key={labor}
                        variant="secondary"
                      >
                        {labor}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs italic text-slate-400">
                      Chưa phân bổ nhân lực
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest leading-none text-slate-400">
                  <ClipboardList className="h-3 w-3 text-amber-500" />
                  Đầu việc triển khai
                </div>
                <div className="flex flex-wrap gap-1.5 leading-none">
                  {taskAllocations.length > 0 ? (
                    Array.from(new Set(taskAllocations.map((item) => item.name))).map(
                      (name) => (
                        <Badge
                          className="h-5 border-amber-100 bg-amber-50 px-2 text-[10px] font-bold text-amber-700"
                          key={name}
                          variant="secondary"
                        >
                          {name}
                        </Badge>
                      ),
                    )
                  ) : (
                    <span className="text-xs italic text-slate-400">
                      Chưa có đầu việc
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="group relative mt-4 overflow-hidden rounded-3xl bg-slate-900 p-4 text-white shadow-xl shadow-slate-200/50">
              <div className="absolute -mr-12 -mt-12 h-24 w-24 rounded-full bg-white/5 transition-transform duration-500 group-hover:scale-110" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Tổng kinh phí dự kiến
                  </p>
                  <h3 className="text-2xl font-black leading-none text-white">
                    {formData.budget
                      ? Number(formData.budget).toLocaleString()
                      : "0"}{" "}
                    <span className="text-xs font-normal opacity-60">VNĐ</span>
                  </h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                  <Package className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
