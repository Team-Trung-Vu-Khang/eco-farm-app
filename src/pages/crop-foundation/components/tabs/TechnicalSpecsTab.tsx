import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Droplets, FlaskConical, Ruler, Thermometer } from "lucide-react";
import type { FoundationCropResponse } from "../../../../features/foundation";

interface TechnicalSpecsTabProps {
  cropFoundation: FoundationCropResponse;
}

export function TechnicalSpecsTab({ cropFoundation }: TechnicalSpecsTabProps) {
  const specs = cropFoundation.technicalSpecs;

  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
          <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
            <FlaskConical className="w-4 h-4" />
          </div>
          Thông số nông học & Kỹ thuật
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900 border-l-4 border-cyan-500 pl-3">
              Đặc tính sinh học
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  label: "Tên khoa học",
                  value: specs?.scientificName,
                },
                {
                  label: "Họ thực vật",
                  value: specs?.family,
                },
                {
                  label: "Nguồn gốc",
                  value: specs?.origin,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0"
                >
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="text-sm font-bold text-slate-900">
                    {item.value || "---"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900 border-l-4 border-blue-500 pl-3">
              Điều kiện sinh trưởng
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-2">
                <div className="flex items-center gap-2 text-rose-600">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Nhiệt độ</span>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {specs?.temperatureFrom != null && specs?.temperatureTo != null
                    ? `${specs.temperatureFrom} - ${specs.temperatureTo}°C`
                    : "--"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <Droplets className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Độ ẩm</span>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {specs?.humidityFrom != null && specs?.humidityTo != null
                    ? `${specs.humidityFrom} - ${specs.humidityTo}%`
                    : "--"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                <div className="flex items-center gap-2 text-purple-600">
                  <FlaskConical className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Độ pH đất</span>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {specs?.phFrom != null && specs?.phTo != null
                    ? `${specs.phFrom} - ${specs.phTo}`
                    : "--"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 space-y-2">
                <div className="flex items-center gap-2 text-amber-600">
                  <Ruler className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Mật độ</span>
                </div>
                <p className="text-sm font-bold text-slate-900 line-clamp-2">
                  {specs?.plantingDensity || "--"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

