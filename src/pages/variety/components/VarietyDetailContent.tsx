import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Archive,
  ArrowLeft,
  BookOpen,
  Calendar,
  CloudUpload,
  Edit,
  FileText,
  FlaskConical,
  Hash,
  MapPin,
  Scale,
  Sprout,
} from "lucide-react";
import { Link } from "wouter";
import type { Variety } from "../types/types";

interface VarietyDetailContentProps {
  variety: Variety;
  isStandalone: boolean;
}

export function VarietyDetailContent({
  variety,
  isStandalone,
}: VarietyDetailContentProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isStandalone && (
            <Link href="/variety">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          )}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Chi tiết giống cây
            </h2>
            <p className="text-slate-500 text-sm">
              Xem và quản lý thông tin chi tiết của giống {variety.varietyName}
            </p>
          </div>
        </div>
        <Link href={`/variety/${variety.id}/edit`}>
          <Button className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all">
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa thông tin
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="overflow-hidden border-none shadow-md ring-1 ring-slate-200">
            <div className="aspect-square relative group">
              {variety.illustration ? (
                <img
                  src={
                    variety.illustration instanceof File
                      ? URL.createObjectURL(variety.illustration)
                      : variety.illustration
                  }
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={variety.varietyName}
                />
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <Sprout className="w-20 h-20 text-slate-300" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge
                  className={
                    variety.status === "active"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-slate-500 hover:bg-slate-600"
                  }
                >
                  {variety.status === "active"
                    ? "Đang kinh doanh"
                    : "Ngừng kinh doanh"}
                </Badge>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end">
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                  {variety.crop}
                </p>
                <h3 className="text-white text-2xl font-bold">
                  {variety.varietyName}
                </h3>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Mã giống
                  </p>
                  <p className="font-mono text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    {variety.varietyCode}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Cập nhật
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {new Date(variety.updatedAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-md ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                <Archive className="w-4 h-4 text-green-600" />
                Thông tin định danh
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Tên khoa học
                  </p>
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-slate-400" />
                    <p className="font-serif italic text-lg text-slate-700">
                      {variety.scientificName || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Nguồn gốc
                  </p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <p className="font-medium text-lg text-slate-700">
                      {variety.origin || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pl-6 border-l border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Mô tả đặc tính
                </p>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {variety.description || "Chưa có mô tả chi tiết."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                <BookOpen className="w-4 h-4 text-amber-600" />
                Đặc tính nông học
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      Thời gian sinh trưởng
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {variety.growthDuration || "---"}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      Năng suất bình quân
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {variety.averageYield || "---"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                <FileText className="w-4 h-4 text-purple-600" />
                Tài liệu kỹ thuật
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {variety.contentType === "editor" && variety.editorContent ? (
                <div className="prose prose-slate max-w-none animate-in fade-in duration-700">
                  <div
                    className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm font-serif text-lg leading-loose text-slate-700 editor-content-preview"
                    dangerouslySetInnerHTML={{ __html: variety.editorContent }}
                  />
                  <style>{`
                    .editor-content-preview h1 { font-size: 2rem; font-weight: 800; margin-bottom: 1.5rem; color: #0f172a; }
                    .editor-content-preview h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #1e293b; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }
                    .editor-content-preview p { margin-bottom: 1.25rem; }
                    .editor-content-preview ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
                    .editor-content-preview ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
                    .editor-content-preview strong { color: #0f172a; font-weight: 700; }
                  `}</style>
                </div>
              ) : variety.documents && variety.documents.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {variety.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                            {doc.name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            PDF Tài liệu • Đã sẵn sàng
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        asChild
                      >
                        <a href={doc.url} target="_blank" rel="noreferrer">
                          Tải về
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <CloudUpload className="w-6 h-6" />
                  </div>
                  <p className="text-slate-500 font-medium">
                    Chưa có tài liệu kỹ thuật nào.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
