import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, CalendarDays, ExternalLink, FileText } from "lucide-react";
import type { CropFoundation } from "../../types/types";

interface SeedInfoTabProps {
  cropFoundation: CropFoundation;
}

export function SeedInfoTab({ cropFoundation }: SeedInfoTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Card className="md:col-span-2 border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2.5 text-slate-800">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm ring-1 ring-blue-100">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            Thông tin nguồn gốc & Nhập hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="group">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-600 transition-colors">
                  Nhà cung cấp
                </p>
                <p className="text-base font-bold text-slate-700 bg-slate-50/50 p-3 rounded-xl border border-slate-100/80">
                  {cropFoundation.seedInfo?.supplier || "Chưa cập nhật"}
                </p>
              </div>
              <div className="group">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-600 transition-colors">
                  Hợp đồng nhập khẩu
                </p>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold"
                  >
                    {cropFoundation.seedInfo?.contractId || "N/A"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    asChild
                  >
                    <a
                      href={cropFoundation.seedInfo?.importLink || "#"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Xem chi tiết <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-600 transition-colors">
                  Ngày nhập kho
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      {cropFoundation.seedInfo?.importDate || "N/A"}
                    </p>
                    <p className="text-xs font-medium text-slate-400">
                      Đã kiểm định
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-2xl overflow-hidden flex flex-col">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2.5 text-slate-800">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm ring-1 ring-amber-100">
              <FileText className="w-4.5 h-4.5" />
            </div>
            Tài liệu đính kèm
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex-1 bg-slate-50/30">
          <div className="space-y-3">
            {cropFoundation.seedInfo?.documents?.map((doc, i) => (
              <div
                key={i}
                className="group flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 group-hover:bg-amber-100 transition-colors">
                    <div className="text-[10px] font-bold uppercase">Pdf</div>
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate-700 truncate group-hover:text-amber-700 transition-colors">
                      {doc.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      1.2 MB • Cập nhật mới
                    </p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-amber-500" />
                </div>
              </div>
            )) || (
              <div className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <FileText className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-400">
                  Chưa có tài liệu
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
