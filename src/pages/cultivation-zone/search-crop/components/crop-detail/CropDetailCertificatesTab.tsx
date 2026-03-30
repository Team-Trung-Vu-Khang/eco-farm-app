import {
  Badge,
  Button,
  Card,
  CardContent,
  Label,
  Separator,
  TabsContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Award,
  Calendar,
  ChevronRight,
  Clock,
  Globe,
  Image as ImageIcon,
  ShieldCheck,
} from "lucide-react";
import type { CropDetailCertificatesProps } from "./types";

export const CropDetailCertificatesTab = ({
  details,
}: CropDetailCertificatesProps) => {
  return (
    <TabsContent
      value="certificates"
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-800">
            <Award className="h-7 w-7 text-orange-500" />
            Chứng nhận tiêu chuẩn
            <Badge className="h-6 border-orange-200 bg-orange-100 px-2 text-xs font-black text-orange-600">
              {details.selectedCerts.length}
            </Badge>
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Các tiêu chuẩn chất lượng và an toàn thực phẩm được áp dụng tại
            vùng trồng này.
          </p>
        </div>
      </div>

      {details.selectedCerts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {details.selectedCerts.map((cert) => (
            <Card
              key={cert.code}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-500 hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-100"
            >
              <div className="relative h-48 overflow-hidden bg-slate-50">
                <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {cert.imageUrl ? (
                  <img
                    src={cert.imageUrl}
                    alt={cert.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-orange-50/50 text-orange-200">
                    <ImageIcon className="h-16 w-16" />
                  </div>
                )}

                <div className="absolute right-4 top-4 z-20">
                  <Badge className="border-none bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-green-600 shadow-lg backdrop-blur-md">
                    Đang hiệu lực
                  </Badge>
                </div>
              </div>

              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Tiêu chuẩn nông nghiệp
                  </div>
                  <h3 className="text-xl font-black leading-tight text-slate-900 transition-colors group-hover:text-orange-600">
                    {cert.name}
                  </h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                    {cert.code}
                  </p>
                </div>

                <Separator className="mb-6 opacity-40" />

                <div className="flex-1 space-y-5">
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <Globe className="h-3 w-3" />
                      Tổ chức chứng nhận
                    </Label>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cert.organizations?.length > 0 ? (
                        cert.organizations.map((org, index) => (
                          <Badge
                            key={`${cert.code}-${index}`}
                            variant="outline"
                            className="bg-slate-50 py-0.5 text-[10px] font-bold text-slate-600 border-slate-200"
                          >
                            {org}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          Đang cập nhật...
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-orange-100/50 bg-orange-50/30 p-3">
                      <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-orange-400">
                        Ngày cấp
                      </span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-orange-300" />
                        <span className="text-xs font-black text-slate-700">
                          01/01/2024
                        </span>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-orange-100/50 bg-orange-50/30 p-3">
                      <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-orange-400">
                        Hết hạn
                      </span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-orange-300" />
                        <span className="text-xs font-black text-slate-700">
                          01/01/2025
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-2">
                  <Button
                    variant="outline"
                    className="h-11 w-full rounded-2xl border-2 border-slate-100 text-xs font-black uppercase tracking-widest text-slate-600 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                  >
                    Xem tài liệu <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex h-80 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/30 p-12 text-center group">
          <div className="relative mb-6">
            <div className="absolute inset-0 scale-150 rounded-full bg-orange-200/20 blur-2xl" />
            <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-200 shadow-xl">
              <Award className="h-10 w-10 text-orange-100" />
            </div>
          </div>
          <div className="relative z-10 max-w-xs space-y-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-slate-400">
              Chưa có chứng nhận
            </h4>
            <p className="text-xs font-medium leading-relaxed text-slate-400">
              Vùng trồng này hiện chưa cập nhật các chứng nhận tiêu chuẩn kỹ
              thuật.
            </p>
          </div>
        </Card>
      )}
    </TabsContent>
  );
};
