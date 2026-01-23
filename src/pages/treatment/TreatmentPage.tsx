import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@tankhang1/eco-shared-ui";
import {
  Activity,
  AlertTriangle,
  Beaker,
  ChevronRight,
  Clock,
  Edit,
  Info,
  Layers,
  ListFilter,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Check,
  Sprout,
  Workflow,
  Boxes,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { mockProtocols } from "./mocks";
import type { TreatmentProtocol } from "./types";

export default function TreatmentPage() {
  const [, setLocation] = useLocation();
  const [selectedProtocol, setSelectedProtocol] = useState<TreatmentProtocol>(
    mockProtocols[0],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCrop, setFilterCrop] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredProtocols = mockProtocols.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.diseaseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = filterCrop === "all" || p.crop === filterCrop;
    const matchesType = filterType === "all" || p.diseaseType === filterType;
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;

    return matchesSearch && matchesCrop && matchesType && matchesStatus;
  });

  return (
    <AdminLayout
      title="Phác Đồ Điều Trị"
      actions={
        <Button
          className="gap-2 font-semibold text-xs transition-all active:scale-[0.98]"
          onClick={() => setLocation("/treatment/create")}
        >
          <Plus className="w-4 h-4" />
          Thêm phác đồ mới
        </Button>
      }
      description="Quản lý phác đồ điều trị và phòng ngừa dịch bệnh"
    >
      <>
        <div className="flex h-[calc(100vh-160px)] gap-5 mt-2">
          {/* Master Sidebar */}
          <div className="w-[320px] flex flex-col gap-4 shrink-0 overflow-hidden bg-slate-50/50 p-4 border-r border-slate-200/60">
            <div className="space-y-4">
              <Input
                value={searchQuery}
                placeholder="Tìm kiếm phác đồ..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 bg-white border-slate-200 transition-all focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-lg text-sm"
              />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  <ListFilter className="w-3 h-3" />
                  Thu gọn bộ lọc
                </div>
                <Select value={filterCrop} onValueChange={setFilterCrop}>
                  <SelectTrigger className="h-9 bg-white border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                    <SelectValue placeholder="Lọc theo cây trồng" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">Tất cả cây trồng</SelectItem>
                    <SelectItem value="LÚA">Lúa</SelectItem>
                    <SelectItem value="BẮP (NGÔ)">Bắp (Ngô)</SelectItem>
                    <SelectItem value="SẦU RIÊNG">Sầu riêng</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="h-9 bg-white border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                      <SelectValue placeholder="Loại bệnh" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">Tất cả loại</SelectItem>
                      <SelectItem value="nấm">Nấm</SelectItem>
                      <SelectItem value="sâu hại">Sâu hại</SelectItem>
                      <SelectItem value="côn trùng">Côn trùng</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-9 bg-white border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="active">Đang áp dụng</SelectItem>
                      <SelectItem value="inactive">Ngừng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 mt-2">
              <div className="px-1 mb-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  DANH SÁCH ({filteredProtocols.length})
                </h4>
              </div>
              {filteredProtocols.map((protocol) => (
                <div
                  key={protocol.id}
                  onClick={() => setSelectedProtocol(protocol)}
                  className={cn(
                    "group p-3 rounded-xl transition-all cursor-pointer border flex gap-3 items-center relative overflow-hidden",
                    selectedProtocol.id === protocol.id
                      ? "bg-emerald-50/60 border-emerald-500/30 shadow-sm"
                      : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm",
                  )}
                >
                  {selectedProtocol.id === protocol.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                  )}
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                    {protocol.image ? (
                      <img
                        src={protocol.image}
                        alt={protocol.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Layers className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={cn(
                        "font-bold text-sm truncate mb-1",
                        selectedProtocol.id === protocol.id
                          ? "text-slate-900"
                          : "text-slate-700",
                      )}
                    >
                      {protocol.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight bg-slate-100 px-1.5 py-0.5 rounded leading-none">
                        {protocol.crop}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[9px] font-bold px-1.5 py-0 rounded border-none uppercase h-4 flex items-center",
                          protocol.severity === "CAO"
                            ? "bg-rose-50 text-rose-500"
                            : protocol.severity === "TRUNG-BINH"
                              ? "bg-orange-50 text-orange-500"
                              : "bg-emerald-50 text-emerald-500",
                        )}
                      >
                        {protocol.severity}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Content */}
          <div className="flex-1 flex flex-col gap-6 overflow-hidden bg-white rounded-3xl border border-slate-200/60 shadow-sm ml-1">
            <Tabs
              defaultValue="overview"
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Header Banner */}
              <div className="relative min-h-[160px] bg-slate-900 overflow-hidden flex items-center px-10 shrink-0">
                <div className="absolute inset-0 bg-linear-to-br from-slate-800/50 via-transparent to-emerald-500/10" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between w-full py-6">
                  <div className="text-left space-y-4">
                    <div className="flex items-center justify-start gap-4">
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none font-bold px-4 py-1.5 rounded-lg uppercase tracking-wider text-[10px]">
                        {selectedProtocol.crop}
                      </Badge>
                      <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                        <Settings className="w-3.5 h-3.5" />
                        {selectedProtocol.location}
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight leading-none">
                      {selectedProtocol.name}
                    </h2>
                    <p className="text-slate-400 font-medium text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      Áp dụng cho giống:{" "}
                      <span className="text-slate-200 font-bold">
                        OM5451 / ST25
                      </span>
                    </p>
                  </div>

                  {/* Expert Badge */}
                  <div className="shrink-0 bg-white/5 backdrop-blur-xl border border-white/10 pl-1.5 pr-5 py-1.5 rounded-full flex items-center gap-4 transition-all hover:bg-white/10 cursor-pointer group shadow-2xl">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-500/50 p-0.5 overflow-hidden shadow-lg transition-transform group-hover:scale-105">
                        <img
                          src={selectedProtocol.expert.avatar}
                          alt={selectedProtocol.expert.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-sm" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-white font-bold text-sm leading-tight group-hover:text-emerald-400 transition-colors">
                        {selectedProtocol.expert.name}
                      </p>
                      <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">
                        {selectedProtocol.expert.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub Navigation Bar */}
              <div className="bg-white border-b border-slate-100 flex items-center justify-between px-6 h-14 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <TabsList className="bg-transparent gap-6 p-0 h-full flex items-center">
                  <TabsTrigger
                    value="overview"
                    className="relative rounded-none px-0 h-full font-bold text-sm text-slate-400 data-[state=active]:text-emerald-600 transition-all border-b-2 border-transparent data-[state=active]:border-emerald-500 bg-transparent shadow-none"
                  >
                    Tổng quan
                  </TabsTrigger>
                  <TabsTrigger
                    value="process"
                    className="relative rounded-none px-0 h-full font-bold text-sm text-slate-400 data-[state=active]:text-emerald-600 transition-all border-b-2 border-transparent data-[state=active]:border-emerald-500 bg-transparent shadow-none"
                  >
                    Phác đồ & Thuốc
                  </TabsTrigger>
                  <TabsTrigger
                    value="safety"
                    className="relative rounded-none px-0 h-full font-bold text-sm text-slate-400 data-[state=active]:text-emerald-600 transition-all border-b-2 border-transparent data-[state=active]:border-emerald-500 bg-transparent shadow-none"
                  >
                    An toàn & Cảnh báo
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg h-9 border-slate-200 font-bold text-slate-600 gap-2 hover:bg-slate-50 transition-all shadow-sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit className="w-4 h-4 text-emerald-500" />
                    Chỉnh sửa
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-lg h-9 bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] px-5"
                    onClick={() => setIsApplyModalOpen(true)}
                  >
                    Áp dụng phác đồ
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 h-full divide-x divide-slate-100">
                  <div className="lg:col-span-2 overflow-y-auto custom-scrollbar p-6 space-y-6">
                    <TabsContent
                      value="overview"
                      className="mt-0 focus-visible:ring-0 outline-hidden"
                    >
                      <Card className="border border-slate-100 shadow-sm bg-slate-50/30 rounded-2xl p-6 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-rose-50 rounded-xl text-rose-500 flex items-center justify-center shadow-sm border border-rose-100">
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                              Thông tin bệnh hại
                            </h3>
                            <p className="text-slate-400 text-xs font-semibold mt-0.5 uppercase tracking-wide">
                              Phân tích dữ liệu & Triệu chứng
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                Tên khoa học
                              </p>
                              <h4 className="text-lg font-bold text-slate-900 leading-tight">
                                {selectedProtocol.diseaseScientificName}
                              </h4>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-2 py-0 text-[10px] font-bold h-5">
                                  Bệnh: {selectedProtocol.diseaseName}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                Triệu chứng chính
                              </p>
                              <div className="space-y-2.5">
                                {selectedProtocol.symptoms.map((symptom, i) => (
                                  <div
                                    key={i}
                                    className="flex gap-4 p-3.5 bg-white rounded-xl border border-slate-100 group hover:border-emerald-300 hover:shadow-md hover:shadow-slate-200/40 transition-all cursor-default"
                                  >
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                      <Check className="w-3 h-3" />
                                    </div>
                                    <p className="text-slate-600 font-bold text-sm leading-relaxed">
                                      {symptom}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-6">
                            <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col items-center text-center gap-4 shadow-sm hover:shadow-md transition-all">
                              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                                <Activity className="w-8 h-8 text-emerald-500" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                  Điều kiện phát sinh
                                </p>
                                <p className="text-base font-bold text-slate-700 leading-snug px-4">
                                  {selectedProtocol.condition}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent
                      value="process"
                      className="mt-0 focus-visible:ring-0 outline-hidden"
                    >
                      <div className="space-y-8">
                        <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl p-8">
                          <div className="flex items-center gap-3 py-1 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                              <Sprout className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-foreground">
                                Danh mục thuốc bảo vệ thực vật
                              </h3>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {selectedProtocol.medicines.map((m) => (
                              <div
                                key={m.id}
                                className="group p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
                              >
                                <div className="w-12 h-12 rounded-xl bg-white text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm border border-slate-100 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                  {m.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-slate-800 truncate mb-1 text-sm tracking-tight capitalize">
                                    {m.name}
                                  </h4>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-white px-2 py-0.5 rounded border border-slate-100">
                                      {m.type}
                                    </span>
                                  </div>
                                  <p className="text-[10px] font-bold text-emerald-600">
                                    Liều lượng:{" "}
                                    <span className="font-bold">
                                      {m.dosage}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>

                        <div className="space-y-8 pl-2">
                          <div className="flex items-center gap-3 border-l-4 border-orange-500 pl-4 py-1">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                              <Workflow className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-foreground">
                                Quy trình xử lý chi tiết
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Chu kỳ: {selectedProtocol.duration} ngày thực
                                hiện
                              </p>
                            </div>
                          </div>

                          <div className="relative pl-12 space-y-8 before:absolute before:left-[20px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
                            {selectedProtocol.steps.map((step) => (
                              <div key={step.id} className="relative group">
                                <div className="absolute -left-[42px] top-0 w-12 h-12 rounded-full border-[6px] border-white z-10">
                                  <div className="w-full h-full rounded-full bg-slate-50 shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all">
                                    {step.day}
                                  </div>
                                </div>

                                <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl p-6 transition-all hover:shadow-md hover:border-emerald-100 max-w-2xl relative group-hover:-translate-y-1">
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-lg font-bold text-slate-800 tracking-tight">
                                        {step.title}
                                      </h4>
                                      <Badge className="bg-slate-100 text-slate-500 border-none font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                                        Giai đoạn 0{step.day}
                                      </Badge>
                                    </div>

                                    <p className="text-slate-500 font-bold text-sm leading-relaxed">
                                      {step.description}
                                    </p>

                                    {step.medicineId && (
                                      <div className="mt-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between group/med">
                                        <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-lg bg-white text-emerald-500 flex items-center justify-center shadow-sm border border-emerald-100">
                                            <Beaker className="w-5 h-5" />
                                          </div>
                                          <div>
                                            <p className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest mb-0.5">
                                              Phối hợp dược phẩm
                                            </p>
                                            <p className="text-sm font-bold text-slate-800">
                                              {
                                                selectedProtocol.medicines.find(
                                                  (m) =>
                                                    m.id === step.medicineId,
                                                )?.name
                                              }
                                            </p>
                                          </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-emerald-500/40 group-hover/med:translate-x-1 transition-transform" />
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="safety"
                      className="mt-0 focus-visible:ring-0 outline-hidden"
                    >
                      <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl px-8 py-10 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12">
                          <ShieldCheck className="w-64 h-64 text-emerald-500" />
                        </div>

                        <div className="relative z-10 space-y-10">
                          <div className="text-center space-y-4">
                            <div className="inline-flex p-4 bg-emerald-50 rounded-3xl text-emerald-600 shadow-xl shadow-emerald-500/10 border border-emerald-100 transform -rotate-3 hover:rotate-0 transition-transform">
                              <ShieldCheck className="w-10 h-10" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Giao Thức An Toàn
                              </h3>
                              <p className="text-slate-400 font-bold max-w-md mx-auto leading-relaxed text-sm mt-2">
                                Các quy định bắt buộc nhằm bảo vệ sức khỏe con
                                người và chuẩn mực chất lượng nông sản.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4 mt-8">
                            {selectedProtocol.safetyNotes.map((note, i) => (
                              <div
                                key={i}
                                className="group flex gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 items-center hover:bg-white hover:border-emerald-300 hover:shadow-lg transition-all"
                              >
                                <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500 text-lg font-bold border border-slate-100 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all transform group-hover:scale-110">
                                  {i + 1}
                                </div>
                                <p className="text-slate-700 text-sm font-bold leading-snug flex-1">
                                  {note}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </TabsContent>
                  </div>

                  <div className="bg-slate-50/30 overflow-y-auto custom-scrollbar p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 border-l-4 border-slate-200 pl-4 py-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <Workflow className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground">
                            Quản trị phác đồ
                          </h3>
                        </div>
                      </div>

                      <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl p-4 space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                            TRẠNG THÁI
                          </p>
                          <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                            ĐANG ÁP DỤNG
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                            MỨC ĐỘ RỦI RO
                          </p>
                          <div className="flex items-center gap-2 px-2 py-1 bg-rose-50 rounded-lg border border-rose-100">
                            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse" />
                            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest leading-none">
                              {selectedProtocol.severity}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-emerald-200">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 leading-none text-center">
                              CHU KỲ XỬ LÝ
                            </p>
                            <div className="text-center ">
                              <span className="text-2xl font-bold text-slate-900">
                                {selectedProtocol.duration}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 ml-1.5 uppercase tracking-tighter">
                                Ngày
                              </span>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-emerald-200">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 leading-none text-center">
                              DỰ TOÁN / HA
                            </p>
                            <div className="text-center text-wrap overflow-hidden">
                              <span className="text-xl font-bold text-emerald-600">
                                {selectedProtocol.costPerHa.split(" ")[0]}
                              </span>
                              <span className="text-[10px] text-wrap font-bold text-slate-400 ml-1.5 uppercase">
                                Đ
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-4 bg-slate-300 rounded-full" />
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Ghi chú vận hành
                          </h4>
                        </div>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                          "Cần tuân thủ nghiêm ngặt khung thời gian phun thuốc
                          để đạt hiệu quả cao nhất. Ưu tiên phun vào sáng sớm
                          khi chưa có nắng gắt."
                        </p>
                        <div className="pt-2 flex items-center justify-between text-[10px] font-bold text-slate-400">
                          <span>CẬP NHẬT CUỐI:</span>
                          <span>23/01/2026</span>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Apply Protocol Modal */}
        <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
          <DialogContent className="max-w-lg rounded-2xl p-0 border-none shadow-2xl overflow-hidden ring-1 ring-slate-200/50">
            <div className="p-8 pb-0">
              <DialogTitle className="text-lg font-bold">
                Xác nhận áp dụng
              </DialogTitle>
              <DialogDescription>
                Thiết lập tham số triển khai thực tế trên đồng ruộng
              </DialogDescription>
            </div>

            <div className="p-5 pt-1 space-y-6">
              <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg text-emerald-500 shadow-sm border border-emerald-50 shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest mb-1 leading-none">
                      Phác đồ mục tiêu
                    </p>
                    <p className="text-sm font-bold text-emerald-900 leading-relaxed">
                      Đang thực thi{" "}
                      <span className="font-bold text-emerald-600">
                        {selectedProtocol.name}
                      </span>
                      . Quy trình kéo dài{" "}
                      <span className="font-bold text-emerald-600">
                        {selectedProtocol.duration} ngày
                      </span>{" "}
                      liên tục.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Chọn khu vực áp dụng{" "}
                    <span className="text-rose-500">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lô đất / vườn..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="z1">Khu vực A - Lô 01</SelectItem>
                      <SelectItem value="z2">Khu vực B - Lô 05</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Ngày kích hoạt
                    </Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      Người phụ trách
                    </Label>
                    <Input placeholder="Tên nhân sự..." />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 pt-2 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsApplyModalOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={() => setIsApplyModalOpen(false)}>
                Xác nhận triển khai
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Protocol Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-xl rounded-2xl p-0 border-none shadow-2xl overflow-hidden ring-1 ring-slate-200/50">
            <div className="p-8 pb-0">
              <DialogTitle className="text-lg font-bold">
                Chỉnh sửa nội dung
              </DialogTitle>
              <DialogDescription>
                Cập nhật đặc tính kỹ thuật và hướng dẫn phác đồ
              </DialogDescription>
            </div>

            <div className="p-6 pt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Tên gọi phác đồ
                  </Label>
                  <Input defaultValue={selectedProtocol.name} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Mã hệ thống</Label>
                  <Input defaultValue={selectedProtocol.code} disabled />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Trạng thái</Label>
                  <Select defaultValue={selectedProtocol.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang áp dụng</SelectItem>
                      <SelectItem value="inactive">Ngừng kích hoạt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Rủi ro</Label>
                  <Select defaultValue={selectedProtocol.severity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Thấp</SelectItem>
                      <SelectItem value="TRUNG-BINH">Trung bình</SelectItem>
                      <SelectItem value="CAO">Cao (Nghiêm trọng)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Dự toán/Ha (VNĐ)
                  </Label>
                  <Input defaultValue={selectedProtocol.costPerHa} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Thời gian (Ngày)
                  </Label>
                  <Input
                    type="number"
                    defaultValue={selectedProtocol.duration}
                  />
                </div>
              </div>
            </div>

            <div className="p-8 pt-2 flex justify-end gap-3 bg-slate-50/50">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Hủy bỏ
              </Button>
              <Button>Cập nhật</Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    </AdminLayout>
  );
}
