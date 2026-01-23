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
} from "lucide-react";
import { Link, useParams } from "wouter";
import { initialData } from "./mocks";

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
        <Card className="border-none shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/50 overflow-hidden bg-white rounded-3xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Image - Left Side */}
              <div className="shrink-0">
                <div className="w-full md:w-64 h-64 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 group">
                  {crop.illustration ? (
                    <img
                      src={crop.illustration}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt={crop.name}
                    />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-slate-200" />
                  )}
                </div>
              </div>

              {/* Key Info - Right Side */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                    {crop.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-bold px-3">
                      {crop.cropGroup}
                    </Badge>
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold px-3">
                      {crop.cropType}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Mã cây trồng
                    </p>
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      <Hash className="w-3.5 h-3.5 opacity-60" />
                      {crop.code}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Phương pháp thu hoạch
                    </p>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 font-medium text-sm">
                      {crop.harvestMethod}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Tabs Section */}
        <Tabs defaultValue="seed-info" className="w-full">
          <TabsList className="bg-white/50 backdrop-blur-sm p-1.5 border border-slate-200/60 rounded-2xl mb-6 flex overflow-x-auto h-auto scrollbar-hide">
            <TabsTrigger
              value="seed-info"
              className="rounded-xl px-5 py-2.5 gap-2.5 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/50"
            >
              <Sprout className="w-4 h-4" />
              Thông tin giống
            </TabsTrigger>
            <TabsTrigger
              value="crop-info"
              className="rounded-xl px-5 py-2.5 gap-2.5 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/50"
            >
              <Activity className="w-4 h-4" />
              Thông tin cây
            </TabsTrigger>
            <TabsTrigger
              value="farming-history"
              className="rounded-xl px-5 py-2.5 gap-2.5 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/50"
            >
              <ClipboardList className="w-4 h-4" />
              Lịch sử canh tác
            </TabsTrigger>
            <TabsTrigger
              value="disease-history"
              className="rounded-xl px-5 py-2.5 gap-2.5 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/50"
            >
              <Stethoscope className="w-4 h-4" />
              Lịch sử bệnh
            </TabsTrigger>
            <TabsTrigger
              value="harvest-history"
              className="rounded-xl px-5 py-2.5 gap-2.5 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/50"
            >
              <Clock className="w-4 h-4" />
              Lịch sử thu hoạch
            </TabsTrigger>
            <TabsTrigger
              value="iot-info"
              className="rounded-xl px-5 py-2.5 gap-2.5 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/50"
            >
              <Cpu className="w-4 h-4" />
              IoT liên quan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seed-info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-xl shadow-slate-200/60 bg-white rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-500" />
                    Cung cấp & Nhập hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Nhà cung cấp
                    </p>
                    <p className="font-bold text-slate-700">
                      {crop.seedInfo?.supplier || "N/A"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Ngày nhập
                      </p>
                      <p className="font-bold text-slate-700">
                        {crop.seedInfo?.importDate || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Hợp đồng
                      </p>
                      <Badge
                        variant="outline"
                        className="border-blue-100 text-blue-600 font-bold"
                      >
                        {crop.seedInfo?.contractId || "N/A"}
                      </Badge>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      asChild
                    >
                      <a
                        href={crop.seedInfo?.importLink || "#"}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Link thông tin nhập hàng
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl shadow-slate-200/60 bg-white rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" />
                    Tài liệu & Đặc tính
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {crop.seedInfo?.documents?.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-amber-200 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                            <FileText className="w-5 h-5" />
                          </div>
                          <p className="text-sm font-bold text-slate-700 group-hover:text-amber-700">
                            {doc.name}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="group-hover:text-amber-600"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    )) || (
                      <p className="text-sm text-slate-400 text-center py-8">
                        Chưa có tài liệu
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crop-info" className="space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/60 bg-white rounded-3xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Khu vực & Vị trí
                        </p>
                        <p className="font-bold text-slate-800 text-lg">
                          {crop.statusInfo?.area} - {crop.statusInfo?.location}
                        </p>
                        <Badge className="bg-slate-100 text-slate-600 border-none mt-1">
                          {crop.statusInfo?.lote}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Chủ sở hữu
                        </p>
                        <p className="font-bold text-slate-800 text-lg">
                          {crop.statusInfo?.owner}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                        <CalendarDays className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Thời gian trồng & Tuổi
                        </p>
                        <p className="font-bold text-slate-800 text-lg">
                          {crop.statusInfo?.plantDate}
                        </p>
                        <p className="text-sm text-slate-500 font-bold mt-1">
                          Đã trồng: {crop.statusInfo?.age}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Hiện trạng sức khỏe
                        </p>
                        <p className="font-bold text-emerald-600 text-lg">
                          {crop.statusInfo?.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Nhân sự phụ trách
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Thực hiện
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {crop.statusInfo?.responsiblePerson.executor}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Quản lý
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {crop.statusInfo?.responsiblePerson.manager}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Kiểm định
                          </p>
                          <p className="text-sm font-bold text-slate-700">
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

          <TabsContent value="farming-history" className="space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/60 bg-white rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Thời gian
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Hoạt động
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Thực hiện
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Quản lý
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
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
                        <td className="px-6 py-4 text-sm font-bold text-slate-600">
                          {entry.time}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            {entry.action}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                          {entry.executor}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                          {entry.manager}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                          {entry.inspector}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-20 text-center text-slate-400 font-bold"
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

          <TabsContent value="disease-history" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {crop.diseaseHistory?.map((disease) => (
                <Card
                  key={disease.id}
                  className="border-none shadow-xl shadow-slate-200/60 bg-white rounded-3xl overflow-hidden ring-1 ring-rose-100"
                >
                  <div className="bg-rose-50/50 p-6 border-b border-rose-100 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-rose-800 tracking-tight">
                          {disease.diseaseName}
                        </h3>
                        <p className="text-sm text-rose-600 font-bold">
                          Ngày phát hiện: {disease.startTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Thời gian xử lý
                        </p>
                        <p className="text-sm font-black text-slate-700">
                          {disease.treatmentTime}
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <History className="w-4 h-4" />
                          Quá trình xử lý (Milestones)
                        </h4>
                        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                          {disease.treatmentProcess.map((step, idx) => (
                            <div key={idx} className="relative">
                              <div className="absolute -left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-rose-400 flex items-center justify-center z-10 shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-rose-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <p className="font-black text-slate-800 text-sm">
                                    {step.milestone}
                                  </p>
                                  <span className="text-[10px] text-slate-400 font-bold">
                                    {step.date}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-500 font-medium">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                            Ghi chú lúc phát hiện
                          </h4>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-600 text-sm font-medium">
                            "{disease.note}"
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                            Nguyên vật liệu đã tốn
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {disease.materialsUsed.map((mat, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40"
                              >
                                <p className="text-sm font-bold text-slate-700">
                                  {mat.name}
                                </p>
                                <p className="text-sm font-black text-rose-600">
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
                <div className="py-20 text-center text-slate-400 font-bold">
                  Không có lịch sử bệnh
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="harvest-history" className="space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/60 bg-white rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Thời điểm
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Sản lượng
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
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
                        <td className="px-6 py-4 text-sm font-bold text-slate-600">
                          {entry.time}
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-emerald-600">
                          {entry.yield}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                          {entry.harvester}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-20 text-center text-slate-400 font-bold"
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

          <TabsContent value="iot-info" className="space-y-8">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Chỉ số thời gian thực
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {crop.iotData?.current.map((metric, idx) => (
                  <Card
                    key={idx}
                    className="border-none shadow-xl shadow-slate-200/60 bg-white rounded-3xl overflow-hidden"
                  >
                    <CardContent className="p-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        {metric.label}
                      </p>
                      <div className="flex items-end gap-2">
                        <h4 className="text-3xl font-black text-slate-800">
                          {metric.value}
                        </h4>
                        <span className="text-sm font-bold text-slate-400 mb-1.5">
                          {metric.unit}
                        </span>
                      </div>
                      {metric.trend && (
                        <div
                          className={`mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter ${
                            metric.trend === "up"
                              ? "text-emerald-500"
                              : metric.trend === "down"
                                ? "text-rose-500"
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
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
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
                    className="border-none shadow-xl shadow-slate-200/50 bg-slate-50 rounded-3xl"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-black text-slate-500 uppercase tracking-wider">
                        {comparative.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                      {comparative.data?.map((m, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            {m.label}
                          </p>
                          <p className="text-sm font-black text-slate-700">
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
