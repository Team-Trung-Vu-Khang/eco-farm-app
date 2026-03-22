import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { History, ShieldAlert } from "lucide-react";
import type { Crop } from "../../types/types";

interface DiseaseHistoryTabProps {
  crop: Crop;
}

export function DiseaseHistoryTab({ crop }: DiseaseHistoryTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {crop.diseaseHistory?.map((disease) => (
        <Card
          key={disease.id}
          className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl overflow-hidden"
        >
          <div className="bg-rose-50/50 p-6 border-b border-rose-100 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-rose-600 shadow-sm border border-rose-100">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {disease.diseaseName}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Ngày phát hiện: {disease.startTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">
                  Thời gian xử lý
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {disease.treatmentTime}
                </p>
              </div>
            </div>
          </div>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Quá trình xử lý
                </h4>
                <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {disease.treatmentProcess.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-rose-200 flex items-center justify-center z-10 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-slate-900 text-sm">
                            {step.milestone}
                          </p>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {step.date}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Ghi chú lúc phát hiện
                  </h4>
                  <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100/50 italic text-slate-600 text-sm font-medium">
                    "{disease.note}"
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Nguyên vật liệu đã tốn
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {disease.materialsUsed.map((mat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100"
                      >
                        <p className="text-sm font-medium text-slate-700">
                          {mat.name}
                        </p>
                        <p className="text-sm font-bold text-rose-600">
                          {mat.quantity} {mat.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )) || (
        <div className="py-20 text-center text-muted-foreground font-medium text-sm">
          Không có lịch sử bệnh
        </div>
      )}
    </div>
  );
}
