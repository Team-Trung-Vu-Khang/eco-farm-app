import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@tankhang1/eco-shared-ui";
import {
  Edit,
  Hash,
  ImageIcon,
  Leaf,
  Sprout,
  Building2,
  CalendarDays,
  ExternalLink,
  FileText,
  MapPin,
  User,
  Activity,
  ClipboardList,
  Stethoscope,
  TrendingUp,
  Cpu,
  Clock,
  History,
  ShieldAlert,
  FlaskConical,
  Thermometer,
  Droplets,
  Ruler,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { initialData, harvestMethodOptions } from "./mocks";

export default function CropDetailPage() {
  const { id } = useParams();
  const crop = initialData.find((c) => c.id.toString() === id);

  if (!crop) {
    return (
      <AdminLayout
        title="Chi tiết cây trồng"
        description="Thông tin chi tiết về cây trồng"
      >
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <Leaf className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            Không tìm thấy thông tin cây trồng này.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Chi tiết cây trồng"
      description={`Quản lý và theo dõi thông tin chi tiết về ${crop.name}`}
      actions={
        <Link href={`/crop/${crop.id}/edit`}>
          <Button className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/10 active:scale-95 transition-all">
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa thông tin
          </Button>
        </Link>
      }
    >
      <div className="space-y-8 pb-8">
        {/* Identity Section - Horizontal Layout */}
        {/* Identity Section - Horizontal Layout */}
        <Card className="border-none shadow-lg shadow-slate-200/40 bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Image - Compact & Clean */}
              <div className="md:w-[280px] shrink-0">
                <div className="w-full h-[180px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative group">
                  {crop.illustration ? (
                    <img
                      src={crop.illustration}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt={crop.name}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-slate-300">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span className="text-xs font-medium">No Image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Info - Streamlined */}
              <div className="flex-1 w-full">
                <div className="flex flex-col h-full justify-center space-y-6">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                      {crop.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 text-xs font-bold transition-colors">
                        {crop.cropGroup}
                      </Badge>
                      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 text-xs font-bold transition-colors">
                        {crop.cropType}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-16 gap-y-6 pt-2 border-t border-slate-50">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Mã cây trồng
                      </p>
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-slate-100/80 flex items-center justify-center text-slate-500">
                          <Hash className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-mono text-sm font-bold text-slate-700">
                          {crop.code}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Phương pháp thu hoạch
                      </p>
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <Sprout className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          {harvestMethodOptions.find(
                            (opt) => opt.value === crop.harvestMethod,
                          )?.label || crop.harvestMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Tabs Section */}
        <Tabs defaultValue="seed-info" className="w-full">
          <TabsList className="bg-slate-100/50 p-1 border border-slate-200 rounded-xl mb-6 flex overflow-x-auto h-auto max-w-full no-scrollbar">
            <TabsTrigger
              value="seed-info"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <Sprout className="w-4 h-4" />
              Thông tin giống
            </TabsTrigger>
            <TabsTrigger
              value="crop-info"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <Activity className="w-4 h-4" />
              Thông tin cây
            </TabsTrigger>
            <TabsTrigger
              value="technical-info"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <FlaskConical className="w-4 h-4" />
              Thông số KT
            </TabsTrigger>
            <TabsTrigger
              value="farming-history"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <ClipboardList className="w-4 h-4" />
              Lịch sử canh tác
            </TabsTrigger>
            <TabsTrigger
              value="disease-history"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <Stethoscope className="w-4 h-4" />
              Lịch sử bệnh
            </TabsTrigger>
            <TabsTrigger
              value="harvest-history"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <Clock className="w-4 h-4" />
              Lịch sử thu hoạch
            </TabsTrigger>
            <TabsTrigger
              value="iot-info"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <Cpu className="w-4 h-4" />
              IoT liên quan
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="seed-info"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Supply & Import - Spans 2 columns */}
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
                          {crop.seedInfo?.supplier || "Chưa cập nhật"}
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
                            {crop.seedInfo?.contractId || "N/A"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            asChild
                          >
                            <a
                              href={crop.seedInfo?.importLink || "#"}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Xem chi tiết{" "}
                              <ExternalLink className="w-3 h-3 ml-1" />
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
                              {crop.seedInfo?.importDate || "N/A"}
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

              {/* Documents - Spans 1 column */}
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
                    {crop.seedInfo?.documents?.map((doc, i) => (
                      <div
                        key={i}
                        className="group flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 group-hover:bg-amber-100 transition-colors">
                            <div className="text-[10px] font-bold uppercase">
                              Pdf
                            </div>
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
          </TabsContent>

          <TabsContent
            value="crop-info"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Khu vực & Vị trí
                        </p>
                        <p className="font-bold text-slate-900 text-lg">
                          {crop.statusInfo?.area} - {crop.statusInfo?.location}
                        </p>
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-slate-600 border-slate-200 mt-1"
                        >
                          {crop.statusInfo?.lote}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Chủ sở hữu
                        </p>
                        <p className="font-bold text-slate-900 text-lg">
                          {crop.statusInfo?.owner}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 shrink-0 border border-orange-100">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Thời gian trồng & Tuổi
                        </p>
                        <p className="font-bold text-slate-900 text-lg">
                          {crop.statusInfo?.plantDate}
                        </p>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                          Đã trồng: {crop.statusInfo?.age}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 shrink-0 border border-rose-100">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Hiện trạng sức khỏe
                        </p>
                        <p className="font-bold text-emerald-600 text-lg">
                          {crop.statusInfo?.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100 space-y-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Nhân sự phụ trách
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                            Thực hiện
                          </p>
                          <p className="text-sm font-medium text-slate-900">
                            {crop.statusInfo?.responsiblePerson.executor}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                            Quản lý
                          </p>
                          <p className="text-sm font-medium text-slate-900">
                            {crop.statusInfo?.responsiblePerson.manager}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                            Kiểm định
                          </p>
                          <p className="text-sm font-medium text-slate-900">
                            {crop.statusInfo?.responsiblePerson.inspector}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="technical-info"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl">
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
                          value: crop.technicalSpecs?.scientificName,
                        },
                        {
                          label: "Họ thực vật",
                          value: crop.technicalSpecs?.family,
                        },
                        {
                          label: "Nguồn gốc",
                          value: crop.technicalSpecs?.origin,
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0"
                        >
                          <span className="text-sm text-slate-500">
                            {item.label}
                          </span>
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
                          <span className="text-xs font-bold uppercase">
                            Nhiệt độ
                          </span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                          {crop.technicalSpecs?.tempRange || "--"}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Droplets className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase">
                            Độ ẩm
                          </span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                          {crop.technicalSpecs?.humidityRange || "--"}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                        <div className="flex items-center gap-2 text-purple-600">
                          <FlaskConical className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase">
                            Độ pH đất
                          </span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                          {crop.technicalSpecs?.phRange || "--"}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 space-y-2">
                        <div className="flex items-center gap-2 text-amber-600">
                          <Ruler className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase">
                            Mật độ
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 line-clamp-2">
                          {crop.technicalSpecs?.plantingDensity || "--"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="farming-history"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[150px]">
                        Thời gian
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Hoạt động
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Thực hiện
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Quản lý
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Kiểm định
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {crop.farmingHistory?.map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-3.5 text-sm font-medium text-slate-600">
                          {entry.time}
                        </td>
                        <td className="px-6 py-3.5 text-sm font-medium text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                            {entry.action}
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-sm text-slate-600">
                          {entry.executor}
                        </td>
                        <td className="px-6 py-3.5 text-sm text-slate-600">
                          {entry.manager}
                        </td>
                        <td className="px-6 py-3.5 text-sm text-slate-600">
                          {entry.inspector}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-16 text-center text-muted-foreground text-sm"
                        >
                          Chưa có dữ liệu lịch sử
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent
            value="disease-history"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <div className="grid grid-cols-1 gap-6">
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
          </TabsContent>

          <TabsContent
            value="harvest-history"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[200px]">
                        Thời điểm
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Sản lượng
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Người thu hoạch
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {crop.harvestHistory?.map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-3.5 text-sm font-medium text-slate-600">
                          {entry.time}
                        </td>
                        <td className="px-6 py-3.5 text-sm font-bold text-emerald-600">
                          {entry.yield}
                        </td>
                        <td className="px-6 py-3.5 text-sm font-medium text-slate-600">
                          {entry.harvester}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-16 text-center text-muted-foreground text-sm"
                        >
                          Chưa có lịch sử thu hoạch
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent
            value="iot-info"
            className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Chỉ số thời gian thực
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {crop.iotData?.current.map((metric, idx) => (
                  <Card
                    key={idx}
                    className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl overflow-hidden"
                  >
                    <CardContent className="p-6">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {metric.label}
                      </p>
                      <div className="flex items-end gap-2">
                        <h4 className="text-3xl font-bold text-slate-900">
                          {metric.value}
                        </h4>
                        <span className="text-sm font-medium text-slate-400 mb-1.5">
                          {metric.unit}
                        </span>
                      </div>
                      {metric.trend && (
                        <div
                          className={`mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                            metric.trend === "up"
                              ? "text-emerald-600"
                              : metric.trend === "down"
                                ? "text-rose-600"
                                : "text-slate-400"
                          }`}
                        >
                          {metric.trend === "up" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : metric.trend === "down" ? (
                            <TrendingUp className="w-3 h-3 rotate-180" />
                          ) : (
                            <TrendingUp className="w-3 h-3 rotate-90" />
                          )}
                          Xu hướng:{" "}
                          {metric.trend === "up"
                            ? "Tăng"
                            : metric.trend === "down"
                              ? "Giảm"
                              : "Ổn định"}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator className="bg-slate-100" />

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <History className="w-4 h-4" />
                Lịch sử so sánh
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    label: "Cách đây 3 ngày",
                    data: crop.iotData?.history3Days,
                  },
                  {
                    label: "Cách đây 1 tuần",
                    data: crop.iotData?.history1Week,
                  },
                  {
                    label: "Cách đây 1 tháng",
                    data: crop.iotData?.history1Month,
                  },
                ].map((comparative, idx) => (
                  <Card
                    key={idx}
                    className="border-none shadow-sm ring-1 ring-slate-200/50 bg-slate-50/50 rounded-xl"
                  >
                    <CardHeader className="pb-2 border-b border-slate-100">
                      <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {comparative.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-3">
                      {comparative.data?.map((m, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <p className="text-[10px] font-semibold text-slate-400 uppercase">
                            {m.label}
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {m.value}
                            {m.unit}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
