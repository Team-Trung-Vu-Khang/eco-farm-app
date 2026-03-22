import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CalendarDays,
  Check,
  FileText,
  FlaskConical,
  Sprout,
} from "lucide-react";

import { seedData } from "../../data/mocks";
import type { CreateCropForm } from "../../types/types";

interface ConfirmationStepProps {
  formData: CreateCropForm;
}

export function ConfirmationStep({ formData }: ConfirmationStepProps) {
  const selectedSeeds = seedData.filter((s) => formData.selectedSeedIds.includes(s.id));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center space-y-4 py-6">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-lg shadow-green-100 ring-4 ring-white">
          <Check className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Xác nhận thông tin</h3>
          <p className="text-slate-500 max-w-lg mx-auto text-sm mt-2">
            Vui lòng kiểm tra kỹ tất cả các thông tin đã nhập trước khi hoàn tất quá trình khởi tạo
            cây trồng mới.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100/50">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-green-700">
              <Sprout className="w-4 h-4" />
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm">
            {[
              { label: "Mã cây", value: formData.code },
              { label: "Tên cây", value: formData.name },
              { label: "Nhóm", value: formData.cropGroup },
              { label: "Loại cây", value: formData.cropType },
              { label: "Giống", value: formData.variety },
              { label: "Thu hoạch", value: formData.harvestMethod },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center py-1.5 border-b border-dashed last:border-0 border-zinc-100"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-bold text-foreground uppercase tracking-wide">
                  {item.value || "---"}
                </span>
              </div>
            ))}

            <div className="pt-2 border-t border-zinc-100 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Hạt giống được chọn
              </p>
              <div className="grid grid-cols-1 gap-2">
                {selectedSeeds.map((seed) => (
                  <div
                    key={seed.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50/50 ring-1 ring-zinc-100"
                  >
                    <img
                      src={seed.illustration}
                      className="w-8 h-8 rounded object-cover shadow-sm"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-[11px] text-foreground">
                        {seed.varietyName}
                      </span>
                      <span className="text-[9px] text-muted-foreground uppercase">
                        {seed.varietyCode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100/50">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-green-700">
              <CalendarDays className="w-4 h-4" />
              Cấu trúc sinh trưởng
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4 text-[11px] font-bold">
              <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full ring-1 ring-green-600/20 uppercase tracking-wider">
                {formData.growthCycles.length} Chu kỳ
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full ring-1 ring-blue-600/20 uppercase tracking-wider">
                {formData.selectedSeedIds.length} Hạt giống
              </div>
            </div>
            <div className="space-y-3">
              {formData.growthCycles.map((c, i) => (
                <div
                  key={c.id}
                  className="p-3 bg-zinc-50/50 rounded-lg ring-1 ring-zinc-200/50 flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Chu kỳ {i + 1}
                    </span>
                    <span className="font-bold text-foreground">{c.name || "---"}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-green-600">
                      {c.estimatedDays || "0"}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-1 font-medium">ngày</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100/50">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-green-700">
            <FlaskConical className="w-4 h-4" />
            Thông số nông học
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Tên KH",
                value: formData.technicalSpecs.scientificName,
              },
              {
                label: "Nhiệt độ",
                value: formData.technicalSpecs.tempRange,
              },
              {
                label: "Độ ẩm",
                value: formData.technicalSpecs.humidityRange,
              },
              { label: "Độ pH", value: formData.technicalSpecs.phRange },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</p>
                <p className="font-bold text-slate-900">{item.value || "--"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50 overflow-hidden">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100/50">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-green-700">
            <FileText className="w-4 h-4" />
            Hệ thống tài liệu
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-2 gap-8">
          {[
            { label: "Kỹ thuật canh tác", key: "farmingTechnique" },
            { label: "Tiêu chuẩn chất lượng", key: "qualityStandard" },
          ].map((item) => (
            <div key={item.key} className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {item.label}
              </p>
              <div className="flex items-center gap-2 p-3 bg-zinc-50/50 rounded-md ring-1 ring-zinc-100 text-xs">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    (formData.docs as any)[item.key].type === "editor"
                      ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                      : "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                  )}
                />
                <span className="font-bold text-foreground">
                  {(formData.docs as any)[item.key].type.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
