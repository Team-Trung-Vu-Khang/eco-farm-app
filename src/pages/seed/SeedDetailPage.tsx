import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@tankhang1/eco-shared-ui";
import {
  Briefcase,
  Edit,
  FileText,
  Hash,
  Info,
  Leaf,
  Phone,
  Sprout,
  User,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { initialData } from "./mocks";

export default function SeedDetailPage() {
  const { id } = useParams();
  const seed = initialData.find((s) => s.id === id);

  if (!seed) {
    return (
      <AdminLayout
        title="Chi tiết hạt giống"
        description="Thông tin chi tiết về hạt giống"
      >
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <Sprout className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            Không tìm thấy thông tin hạt giống này.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Chi tiết hạt giống"
      description={`Thông tin chi tiết về ${seed.varietyName}`}
      actions={
        <Link href={`/seed/${seed.id}/edit`}>
          <Button className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/10 active:scale-95 transition-all">
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa thông tin
          </Button>
        </Link>
      }
    >
      <div className="space-y-8 pb-8">
        {/* Identity Section - Horizontal Layout */}
        <Card className="border-none shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/50 overflow-hidden bg-white rounded-3xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Image - Left Side */}
              <div className="shrink-0">
                <div className="w-full md:w-64 h-64 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 group">
                  {seed.illustration ? (
                    <img
                      src={
                        seed.illustration instanceof File
                          ? URL.createObjectURL(seed.illustration)
                          : seed.illustration
                      }
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt={seed.varietyName}
                    />
                  ) : (
                    <Sprout className="w-16 h-16 text-slate-200" />
                  )}
                </div>
              </div>

              {/* Key Info - Right Side */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                    {seed.varietyName}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Chi tiết thông số kỹ thuật và nguồn gốc hạt giống
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Mã hạt giống
                    </p>
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      <Hash className="w-3.5 h-3.5 opacity-60" />
                      {seed.varietyCode}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Loại cây trồng
                    </p>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50/50 border border-green-100 text-green-700 font-bold text-sm">
                      <Leaf className="w-4 h-4" />
                      {seed.crop}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Xuất xứ
                    </p>
                    <Badge
                      variant="outline"
                      className="px-3 py-1.5 text-xs font-bold rounded-full border-slate-200"
                    >
                      {seed.origin}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Supplier Section - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-green-50/30 p-6 rounded-2xl border border-green-100 space-y-2 hover:border-green-200 transition-colors cursor-default">
            <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">
              Tỷ lệ nảy mầm
            </p>
            <p className="text-3xl font-black text-green-600">
              {seed.germinationRate}%
            </p>
          </div>

          <div className="bg-green-50/30 p-6 rounded-2xl border border-green-100 space-y-2 hover:border-green-200 transition-colors cursor-default">
            <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">
              Độ đồng đều
            </p>
            <p className="text-3xl font-black text-green-600">
              {seed.uniformity}%
            </p>
          </div>

          <div className="bg-green-50/30 p-6 rounded-2xl border border-green-100 space-y-2 hover:border-green-200 transition-colors cursor-default">
            <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">
              Năng suất dự kiến
            </p>
            <p className="text-2xl font-black text-green-600 truncate">
              {seed.yield || "25-30 tấn/ha"}
            </p>
          </div>
        </div>

        {/* Supplier Card */}
        <Card className="border-none shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/50 bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100/50">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
              <Briefcase className="w-5 h-5 text-blue-500" />
              Nhà cung cấp
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {seed.supplier}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Đối tác cung ứng
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold truncate">
                  {seed.representative || "Đại diện công ty"}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium">
                  {seed.phone || "09x-xxx-xxxx"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description Section */}
        <Card className="border-none shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/50 bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 py-5">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
              <Info className="w-5 h-5 text-green-500" />
              Mô tả chi tiết
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-sm text-slate-600 leading-relaxed max-w-full overflow-hidden prose prose-slate">
              {seed.description ? (
                <div dangerouslySetInnerHTML={{ __html: seed.description }} />
              ) : (
                <p className="italic text-slate-400">
                  Không có mô tả chi tiết cho hạt giống này.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Technical Documents Section */}
        <Card className="border-none shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/50 bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 py-5">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
              <FileText className="w-5 h-5 text-blue-500" />
              Tài liệu kỹ thuật canh tác
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {seed.documents && seed.documents.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {seed.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 ring-1 ring-slate-100 hover:bg-slate-100 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-red-500 border border-slate-100 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 truncate max-w-[300px]">
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                          Hướng dẫn kỹ thuật (PDF)
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-slate-200 font-bold text-xs"
                      asChild
                    >
                      <a href={doc.url} target="_blank" rel="noreferrer">
                        Xem chi tiết
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-3xl border-slate-100 bg-slate-50/30">
                <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm font-bold tracking-tight">
                  Chưa có tài liệu kỹ thuật canh tác đính kèm
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
