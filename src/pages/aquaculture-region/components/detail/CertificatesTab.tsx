import React from "react";
import {
  Card,
  CardContent,
  Badge,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Award, ShieldCheck, Hash, FileText } from "lucide-react";
import type {
  CultivationRegionDetails,
  CertificateItem,
} from "../../useCultivationRegionDetail";

interface CertificatesTabProps {
  details: CultivationRegionDetails;
}

// Map well-known certificate codes to visual metadata
const CERT_VISUAL: Record<
  string,
  { color: string; bg: string; border: string; badgeBg: string; icon: string }
> = {
  VietGAP: {
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    badgeBg: "bg-green-100 text-green-700",
    icon: "🌿",
  },
  GlobalGAP: {
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badgeBg: "bg-blue-100 text-blue-700",
    icon: "🌍",
  },
  ISO_22000: {
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    badgeBg: "bg-orange-100 text-orange-700",
    icon: "🏅",
  },
  ORGANIC: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badgeBg: "bg-emerald-100 text-emerald-700",
    icon: "🍃",
  },
};

const DEFAULT_VISUAL = {
  color: "text-slate-600",
  bg: "bg-slate-50",
  border: "border-slate-200",
  badgeBg: "bg-slate-100 text-slate-600",
  icon: "📋",
};

const getVisual = (code: string) => CERT_VISUAL[code] ?? DEFAULT_VISUAL;

interface CertCardProps {
  cert: CertificateItem;
}

const CertCard = ({ cert }: CertCardProps) => {
  const visual = getVisual(cert.code);

  return (
    <Card
      className={`group overflow-hidden border-2 ${visual.border} hover:shadow-2xl transition-all duration-500 flex flex-col bg-white rounded-3xl`}
    >
      {/* Top banner */}
      <div
        className={`relative h-36 overflow-hidden ${visual.bg} flex items-center justify-center`}
      >
        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 backdrop-blur-md text-green-600 border-none shadow-lg font-black text-[10px] tracking-wider px-3 py-1 uppercase">
            Đang hiệu lực
          </Badge>
        </div>

        {/* Decorative circle */}
        <div
          className={`absolute -bottom-6 -left-6 w-24 h-24 rounded-full ${visual.bg} border-2 ${visual.border} opacity-40`}
        />
      </div>

      <CardContent className="p-6 flex-1 flex flex-col gap-5">
        {/* Header */}
        <div>
          <div
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${visual.color}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Tiêu chuẩn nông nghiệp
          </div>
          <h3
            className={`text-xl font-black text-slate-900 leading-tight group-hover:${visual.color} transition-colors`}
          >
            {cert.name}
          </h3>
        </div>

        <Separator className="opacity-40" />

        {/* Fields */}
        <div className="space-y-4 flex-1">
          {/* Code */}
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-xl ${visual.bg} border ${visual.border} flex items-center justify-center shrink-0 mt-0.5`}
            >
              <Hash className={`w-3.5 h-3.5 ${visual.color}`} />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-0.5">
                Mã tiêu chuẩn
              </span>
              <span className="text-sm font-black text-slate-800 tracking-tight">
                {cert.code}
              </span>
            </div>
          </div>

          {/* ID */}
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-xl ${visual.bg} border ${visual.border} flex items-center justify-center shrink-0 mt-0.5`}
            >
              <FileText className={`w-3.5 h-3.5 ${visual.color}`} />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-0.5">
                ID chứng nhận
              </span>
              <span className="text-sm font-black text-slate-800 tracking-tight">
                #{cert.id}
              </span>
            </div>
          </div>
        </div>

        {/* Tag */}
        <div className="pt-2">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${visual.badgeBg}`}
          >
            <ShieldCheck className="w-3 h-3" />
            {cert.code}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export const CertificatesTab = ({ details }: CertificatesTabProps) => {
  const certificates = details.certificates ?? [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Award className="w-7 h-7 text-orange-500" />
            Chứng nhận tiêu chuẩn
            <Badge className="bg-orange-100 text-orange-600 border-orange-200 h-6 px-2 font-black text-xs">
              {certificates.length}
            </Badge>
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Các tiêu chuẩn chất lượng và an toàn thực phẩm được áp dụng tại vùng
            trồng này.
          </p>
        </div>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertCard key={cert.id} cert={cert} />
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/30 h-80 flex flex-col items-center justify-center p-12 text-center group rounded-3xl">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-orange-200/20 rounded-full blur-2xl scale-150" />
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-200 relative z-10 border border-slate-100 shadow-xl">
              <Award className="w-10 h-10 text-orange-100" />
            </div>
          </div>
          <div className="relative z-10 space-y-2 max-w-xs">
            <h4 className="font-black text-lg text-slate-400 tracking-tight uppercase">
              Chưa có chứng nhận
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Vùng trồng này hiện chưa cập nhật các chứng nhận tiêu chuẩn kỹ
              thuật.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
