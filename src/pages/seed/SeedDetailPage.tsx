import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Download,
  Edit,
  FileText,
  Hash,
  Info,
  Leaf,
  MapPin,
  Phone,
  Sprout,
  User,
} from "lucide-react";
import { Link, useParams } from "wouter";
import useSeedStore from "../../stores/useSeedStore";
import type { Variety } from "./types";

// Utility functions to generate random data for missing fields
const generateRepresentative = (): string => {
  const firstNames = [
    "Nguyễn Văn",
    "Trần Thị",
    "Lê Minh",
    "Phạm Hồng",
    "Hoàng Thị",
    "Võ Văn",
    "Đặng Minh",
    "Bùi Thị",
  ];
  const lastNames = [
    "An",
    "Bình",
    "Châu",
    "Dũng",
    "Hà",
    "Khoa",
    "Linh",
    "Mai",
    "Nam",
    "Phương",
  ];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

const generatePhone = (): string => {
  const prefixes = ["090", "091", "093", "094", "097", "098", "099"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, "0");
  return `${prefix}${number}`;
};

const generateYield = (): string => {
  const min = Math.floor(Math.random() * 10) + 15; // 15-25
  const max = min + Math.floor(Math.random() * 10) + 5; // +5-15
  return `${min}-${max} tấn/ha`;
};

export default function SeedDetailPage() {
  const { id } = useParams();
  const { getSeedById } = useSeedStore();
  const baseSeed = getSeedById(id || "");

  if (!baseSeed) {
    return (
      <AdminLayout
        title="Chi tiết hạt giống"
        description="Thông tin chi tiết về hạt giống"
      >
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-md border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-md flex items-center justify-center mb-6">
            <Sprout className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-slate-500 font-bold text-lg">
            Không tìm thấy thông tin hạt giống này.
          </p>
          <Link href="/seed">
            <Button variant="outline" className="mt-4">
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  // Enrich seed data with random values for missing fields
  const seed: Variety = {
    ...baseSeed,
    representative: baseSeed.representative || generateRepresentative(),
    phone: baseSeed.phone || generatePhone(),
    yield: baseSeed.yield || generateYield(),
  };

  return (
    <AdminLayout
      title="Chi tiết hạt giống"
      description={`Thông tin chi tiết về ${seed.varietyName}`}
      actions={
        <div className="flex items-center gap-3">
          <Link href="/seed">
            <Button
              variant="outline"
              className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm active:scale-95 transition-all rounded-md px-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <Link href={`/seed/${seed.id}/edit`}>
            <Button className="bg-green-600 hover:bg-green-700 shadow-xl shadow-green-600/20 hover:shadow-green-600/30 active:scale-95 transition-all rounded-md px-6">
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-8 pb-12">
        {/* Banner / Identity Section */}
        <div className="relative rounded-md overflow-hidden bg-white shadow-xl shadow-slate-200/50 border border-slate-100 p-2">
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-green-50/50">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-linear-to-br from-green-200/20 to-lime-200/20 rounded-md blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-linear-to-tr from-blue-200/20 to-teal-200/20 rounded-md blur-3xl -ml-20 -mb-20" />
          </div>

          <div className="relative p-6 md:p-10 flex flex-col md:flex-row gap-10 items-start">
            {/* Image Container with Float Effect */}
            <div className="shrink-0 relative group perspective-1000">
              <div className="absolute inset-0 bg-green-900/10 rounded-md transform translate-x-4 translate-y-4 blur-xl" />
              <div className="relative w-full md:w-72 h-72 bg-white rounded-md p-2 shadow-2xl shadow-green-900/10 transform transition-transform duration-700 hover:rotate-y-12 hover:rotate-x-12">
                <div className="w-full h-full rounded-md overflow-hidden relative">
                  {seed.illustration ? (
                    <img
                      src={
                        seed.illustration instanceof File
                          ? URL.createObjectURL(seed.illustration)
                          : seed.illustration
                      }
                      className="w-64 h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      alt={seed.varietyName}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                      <Sprout className="w-20 h-20 text-slate-200" />
                    </div>
                  )}
                  {/* Badge Overlay */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md shadow-lg border border-white/50 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-md bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Content */}
            <div className="flex-1 space-y-8 pt-2">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                    {seed.varietyCode}
                  </Badge>
                  <span className="text-sm font-medium text-slate-400 flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5" />
                    {seed.crop}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight mb-4">
                  {seed.varietyName}
                </h1>
                <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
                  Thông tin năng suất, khả năng nảy mầm và nguồn gốc chi tiết
                  của giống cây trồng.
                </p>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Xuất xứ
                  </p>
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {seed.origin}
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Nảy mầm
                  </p>
                  <div className="flex items-center gap-2 font-bold text-green-700">
                    <Sprout className="w-4 h-4 text-green-500" />
                    {seed.germinationRate}%
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Độ sạch
                  </p>
                  <div className="flex items-center gap-2 font-bold text-blue-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    {seed.uniformity}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info Columns (Left - 8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Timeline / Journey Section */}
            <Card className="border-none shadow-xl shadow-slate-200/40 ring-1 ring-slate-200/50 bg-white rounded-md overflow-hidden">
              <CardHeader className="bg-white px-8 pt-8 pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                    <Sprout className="w-5 h-5" />
                  </div>
                  Đặc tính sinh trưởng & Hiệu quả
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="relative pl-8 space-y-10 group">
                  {/* Connecting Line */}
                  <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-linear-to-b from-green-500 via-green-200 to-slate-100" />

                  {/* Milestone 1: Germination */}
                  <div className="relative flex gap-6 group/item">
                    <div className="relative z-10 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-green-100 border-[3px] border-white shadow-lg flex items-center justify-center group-hover/item:scale-110 group-hover/item:bg-green-500 group-hover/item:text-white transition-all duration-300 text-green-600">
                        <Sprout className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-50 hover:bg-green-50/30 p-5 rounded-2xl border border-slate-100 hover:border-green-100 transition-all cursor-default relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-800 text-lg">
                            Khả năng nảy mầm
                          </h4>
                          <span className="text-3xl font-black text-green-600 leading-none">
                            {seed.germinationRate}%
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm">
                          Tỷ lệ năng nảy mầm thực tế cao giúp đảm bảo mật độ cây
                          trồng.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Milestone 2: Uniformity */}
                  <div className="relative flex gap-6 group/item">
                    <div className="relative z-10 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 border-[3px] border-white shadow-lg flex items-center justify-center group-hover/item:scale-110 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all duration-300 text-blue-600">
                        <Hash className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-50 hover:bg-blue-50/30 p-5 rounded-2xl border border-slate-100 hover:border-blue-100 transition-all cursor-default">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-slate-800 text-lg">
                          Độ đồng đều
                        </h4>
                        <span className="text-3xl font-black text-blue-600 leading-none">
                          {seed.uniformity}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-md h-2 mb-3">
                        <div
                          className="bg-blue-500 h-2 rounded-md transition-all duration-1000"
                          style={{ width: `${seed.uniformity}%` }}
                        />
                      </div>
                      <p className="text-slate-500 text-sm">
                        Độ sạch và đồng nhất của hạt giống.
                      </p>
                    </div>
                  </div>

                  {/* Milestone 3: Yield */}
                  <div className="relative flex gap-6 group/item">
                    <div className="relative z-10 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-amber-100 border-[3px] border-white shadow-lg flex items-center justify-center group-hover/item:scale-110 group-hover/item:bg-amber-500 group-hover/item:text-white transition-all duration-300 text-amber-600">
                        <Leaf className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 bg-linear-to-br from-amber-50/80 to-orange-50/80 p-5 rounded-2xl border border-amber-100 hover:shadow-md transition-all cursor-default">
                      <h4 className="font-bold text-amber-900 text-lg mb-1">
                        Tiềm năng năng suất
                      </h4>
                      <p className="text-2xl font-black text-amber-600 mb-2">
                        {seed.yield || "25-30 tấn/ha"}
                      </p>
                      <p className="text-amber-800/70 text-sm font-medium">
                        Dự kiến trong điều kiện canh tác tiêu chuẩn.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description Card */}
            <Card className="border-none shadow-xl shadow-slate-200/40 ring-1 ring-slate-200/50 bg-white rounded-md overflow-hidden">
              <CardHeader className="bg-white px-8 pt-8 pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Info className="w-5 h-5" />
                  </div>
                  Mô tả chi tiết
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-slate-600 leading-relaxed prose prose-slate max-w-none prose-p:my-2 prose-headings:text-slate-800">
                  {seed.description ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: seed.description }}
                    />
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-slate-400 italic">
                        Chưa có mô tả chi tiết
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info (Right - 4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Supplier Card - Premium Dark */}
            <div className="relative rounded-md overflow-hidden bg-slate-900 text-white shadow-2xl shadow-slate-900/20 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-md blur-[80px] -mr-32 -mt-32 transition-opacity group-hover:opacity-70" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-md blur-[80px] -ml-32 -mb-32 transition-opacity group-hover:opacity-70" />

              <div className="relative p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-200 mb-6">
                    <Briefcase className="w-5 h-5 text-green-400" />
                    Nhà cung cấp
                  </h3>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-white/10 rounded-md flex items-center justify-center backdrop-blur-md mb-4 ring-1 ring-white/20 shadow-lg">
                      <span className="text-3xl font-black text-green-400">
                        {seed.supplier.charAt(0)}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold leading-tight mb-2">
                      {seed.supplier}
                    </h2>
                    <Badge className="bg-white/10 hover:bg-white/20 text-green-300 border-none">
                      Verified Partner
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center text-slate-300">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        Đại diện
                      </p>
                      <p className="font-semibold text-slate-100">
                        {seed.representative || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center text-slate-300">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        Hotline
                      </p>
                      <p className="font-semibold text-slate-100">
                        {seed.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-green-500 hover:bg-green-400 text-white font-bold h-12 rounded-2xl shadow-lg shadow-green-900/30 border-none">
                  Liên hệ ngay
                </Button>
              </div>
            </div>

            {/* Documents Grid - Gallery Style */}
            <Card className="border-none shadow-xl shadow-slate-200/40 ring-1 ring-slate-200/50 bg-white rounded-md overflow-hidden">
              <CardHeader className="bg-white px-6 pt-6 pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <FileText className="w-5 h-5 text-red-500" />
                  Hồ sơ tài liệu
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {seed.documents && seed.documents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {seed.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="group relative bg-slate-50 p-4 rounded-md border border-slate-100 hover:bg-white hover:border-red-100 hover:shadow-lg hover:shadow-red-500/5 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-8">
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300 ring-1 ring-slate-100 group-hover:ring-red-50">
                            <FileText className="w-6 h-6" />
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-10 h-10 rounded-md flex items-center justify-center text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            PDF Doc
                          </p>
                          <h4 className="font-bold text-slate-700 leading-snug group-hover:text-red-900 transition-colors line-clamp-2">
                            {doc.name}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-100 rounded-md bg-slate-50/50">
                    <FileText className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-400">
                      Chưa có tài liệu
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
