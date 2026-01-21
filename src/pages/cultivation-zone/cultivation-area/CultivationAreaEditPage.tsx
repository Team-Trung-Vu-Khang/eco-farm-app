import { useState, useMemo, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import {
  AdminLayout,
  StepperForm,
  Card,
  CardContent,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Badge,
  ScrollArea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  CardHeader,
  CardTitle,
} from "@tankhang1/eco-shared-ui";
import {
  MOCK_REGIONS,
  MOCK_AREAS,
  MOCK_PLOTS,
} from "../../region-chart/constants";
import {
  MOCK_CERTIFICATES,
  MOCK_MANAGERS,
  FARMING_METHODS,
  IRRIGATION_METHODS,
  CROP_VARIETIES,
} from "./constants";
import {
  User,
  CheckCircle2,
  MapPin,
  Leaf,
  Award,
  Search,
  ChevronLeft,
  Target,
  Sprout,
  Droplets,
  ScrollText,
  Briefcase,
  Layers,
} from "lucide-react";

type ScopeType = "region" | "area" | "plot";

// Mock data - in real app, fetch from API
const mockExistingData = {
  id: "CA-001",
  name: "Vùng trồng Sầu riêng chất lượng cao",
  scope: "area" as ScopeType,
  selectedRegionId: "1",
  selectedAreaIds: ["1", "2"],
  selectedPlotIds: [] as string[],
  selectedCertId: "cert-1",
  selectedManagerId: "mgr-1",
  farmingMethodId: "organic",
  irrigationMethodId: "drip",
  selectedCrops: ["durian-1", "durian-2"],
  note: "Khu vực thí điểm áp dụng công nghệ cao trong canh tác sầu riêng",
};

// Reuse components from Create page
const CertificateSelector = ({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MOCK_CERTIFICATES.map((cert) => (
          <div
            key={cert.id}
            className={`cursor-pointer border rounded-xl p-3 relative flex items-start gap-3 transition-all ${
              selectedId === cert.id
                ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-sm"
                : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
            }`}
            onClick={() => onSelect(cert.id)}
          >
            <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center shrink-0 shadow-sm">
              <Award
                className={`w-5 h-5 ${selectedId === cert.id ? "text-primary" : "text-slate-400"}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate pr-4">
                {cert.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {cert.code}
              </div>
              <div className="text-xs text-slate-500 truncate mt-0.5">
                {cert.organization}
              </div>
            </div>
            {selectedId === cert.id && (
              <div className="absolute top-3 right-3 text-primary animate-in fade-in zoom-in">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ManagerSelector = ({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedManager = MOCK_MANAGERS.find((m) => m.id === selectedId);
  const filteredManagers = MOCK_MANAGERS.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div
        className={`group border rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer ${selectedManager ? "bg-white border-slate-200" : "bg-slate-50 border-dashed border-slate-300"}`}
        onClick={() => setIsOpen(true)}
      >
        {selectedManager ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-800">
                {selectedManager.name}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className="font-normal text-xs bg-slate-100"
                >
                  {selectedManager.role}
                </Badge>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs">{selectedManager.department}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 group-hover:text-primary"
            >
              Thay đổi
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <div className="w-10 h-10 rounded-full bg-white border border-dashed flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium">Chọn nhân viên quản lý</div>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn nhân viên quản lý</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, chức vụ..."
                className="pl-9 bg-slate-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {filteredManagers.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedId === m.id
                        ? "bg-primary/5 border border-primary/20 shadow-sm"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                    onClick={() => {
                      onSelect(m.id);
                      setIsOpen(false);
                    }}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${selectedId === m.id ? "bg-primary text-white" : "bg-slate-200 text-slate-600"}`}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-slate-900">
                        {m.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {m.role} - {m.department}
                      </div>
                    </div>
                    {selectedId === m.id && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const CultivationAreaEditPage = () => {
  const params = useParams();
  const [, setLocation] = useLocation();

  // State - Initialize with existing data
  const [scope, setScope] = useState<ScopeType>(mockExistingData.scope);
  const [name, setName] = useState(mockExistingData.name);
  const [note, setNote] = useState(mockExistingData.note);

  const [selectedRegionId, setSelectedRegionId] = useState(
    mockExistingData.selectedRegionId,
  );
  const [selectedAreaIds, setSelectedAreaIds] = useState(
    mockExistingData.selectedAreaIds,
  );
  const [selectedPlotIds, setSelectedPlotIds] = useState(
    mockExistingData.selectedPlotIds,
  );

  const [selectedCertId, setSelectedCertId] = useState(
    mockExistingData.selectedCertId,
  );
  const [selectedManagerId, setSelectedManagerId] = useState(
    mockExistingData.selectedManagerId,
  );

  const [farmingMethodId, setFarmingMethodId] = useState(
    mockExistingData.farmingMethodId,
  );
  const [irrigationMethodId, setIrrigationMethodId] = useState(
    mockExistingData.irrigationMethodId,
  );
  const [selectedCrops, setSelectedCrops] = useState(
    mockExistingData.selectedCrops,
  );

  // Computed
  const selectedRegion = MOCK_REGIONS.find(
    (r) => r.id.toString() === selectedRegionId,
  );
  const selectedAreas = MOCK_AREAS.filter((a) =>
    selectedAreaIds.includes(a.id.toString()),
  );
  const selectedPlots = MOCK_PLOTS.filter((p) =>
    selectedPlotIds.includes(p.id),
  );

  const availableCrops = useMemo(() => {
    const method = FARMING_METHODS.find((m) => m.id === farmingMethodId);
    if (!method) return [];
    return CROP_VARIETIES.filter((c) => method.allowedCrops.includes(c.id));
  }, [farmingMethodId]);

  const toggleCrop = (id: string) => {
    setSelectedCrops((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleArea = (id: string) => {
    setSelectedAreaIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const togglePlot = (id: string) => {
    setSelectedPlotIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  // Render steps (similar to Create page but with pre-filled data)
  const renderGeneralInfo = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <div className="text-blue-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="text-sm text-blue-800">
          <div className="font-semibold mb-1">Chế độ chỉnh sửa</div>
          <div>
            Bạn đang chỉnh sửa vùng canh tác{" "}
            <strong>{mockExistingData.id}</strong>. Các thay đổi sẽ được lưu sau
            khi hoàn tất.
          </div>
        </div>
      </div>

      {/* Scope - Read only in edit mode */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-slate-800">
          Phạm vi canh tác
        </Label>
        <div className="bg-slate-50 p-4 rounded-lg border">
          <Badge variant="outline" className="capitalize text-base px-4 py-2">
            {scope === "region"
              ? "Vùng trồng"
              : scope === "area"
                ? "Khu vực"
                : "Lô đất"}
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Phạm vi không thể thay đổi sau khi tạo
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <ScrollText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">Thông tin cơ bản</h3>
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Tên vùng canh tác <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: Vùng trồng Sầu riêng chất lượng cao"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 border-slate-300 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-sm font-medium text-slate-700 mb-2">
                Vị trí địa lý
              </div>

              <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">
                  Vùng trồng (Region)
                </Label>
                <div className="bg-white p-3 rounded border text-sm font-medium">
                  {selectedRegion?.name}
                </div>
                <p className="text-xs text-muted-foreground">
                  Vùng trồng không thể thay đổi
                </p>
              </div>

              {(scope === "area" || scope === "plot") && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Khu vực (Area)
                    {selectedAreaIds.length > 0 && (
                      <span className="ml-1 text-primary font-medium">
                        ({selectedAreaIds.length})
                      </span>
                    )}
                  </Label>
                  <ScrollArea className="max-h-[200px] border rounded-lg p-2 bg-white">
                    <div className="space-y-1">
                      {MOCK_AREAS.filter(
                        (a) => a.regionId.toString() === selectedRegionId,
                      ).map((a) => (
                        <div
                          key={a.id}
                          onClick={() => toggleArea(a.id.toString())}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                            selectedAreaIds.includes(a.id.toString())
                              ? "bg-primary/10 border border-primary/30"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-sm">{a.name}</span>
                          {selectedAreaIds.includes(a.id.toString()) && (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {scope === "plot" && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Lô trồng (Plot)
                    {selectedPlotIds.length > 0 && (
                      <span className="ml-1 text-primary font-medium">
                        ({selectedPlotIds.length})
                      </span>
                    )}
                  </Label>
                  <ScrollArea className="max-h-[200px] border rounded-lg p-2 bg-white">
                    <div className="space-y-1">
                      {MOCK_PLOTS.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => togglePlot(p.id)}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                            selectedPlotIds.includes(p.id)
                              ? "bg-primary/10 border border-primary/30"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-sm">{p.name}</span>
                          {selectedPlotIds.includes(p.id) && (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-medium">Ghi chú</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập thông tin ghi chú thêm..."
                className="min-h-[80px] border-slate-300 resize-none hover:border-slate-400 focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">
              Tiêu chuẩn & Quản lý
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Giấy chứng nhận / Tiêu chuẩn
              </Label>
              <CertificateSelector
                selectedId={selectedCertId}
                onSelect={setSelectedCertId}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Nhân viên chịu trách nhiệm
              </Label>
              <ManagerSelector
                selectedId={selectedManagerId}
                onSelect={setSelectedManagerId}
              />
            </div>

            {selectedRegion && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-sm text-blue-800">
                <div className="bg-blue-100 p-1.5 rounded-full h-fit">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Thông tin địa chỉ</div>
                  <div className="text-blue-700/80 mt-1">
                    {selectedRegion.address}
                  </div>
                  <div className="text-blue-700/80 mt-0.5 font-medium">
                    {selectedRegion.enterpriseId}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfiguration = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-linear-to-r from-primary/5 via-white to-primary/5 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border flex items-center justify-center text-primary">
              {scope === "plot" ? (
                <Target className="w-8 h-8" />
              ) : scope === "area" ? (
                <Layers className="w-8 h-8" />
              ) : (
                <MapPin className="w-8 h-8" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
                {scope === "region"
                  ? "Vùng trồng"
                  : scope === "area"
                    ? "Khu vực"
                    : "Lô đất"}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-slate-900 mt-0.5">
                {scope === "region"
                  ? selectedRegion?.name
                  : scope === "area"
                    ? `${selectedAreas.length} khu vực`
                    : `${selectedPlots.length} lô trồng`}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {scope === "region" && selectedRegion && (
                  <Badge
                    variant="outline"
                    className="bg-white font-mono text-xs"
                  >
                    {selectedRegion.code}
                  </Badge>
                )}
                {name && (
                  <span className="text-slate-500 text-sm border-l pl-2">
                    {name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sprout className="w-5 h-5 text-green-600" />
              Phương pháp canh tác
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label>
                Loại hình canh tác <span className="text-red-500">*</span>
              </Label>
              <Select
                value={farmingMethodId}
                onValueChange={setFarmingMethodId}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Chọn phương pháp (VD: Hữu cơ)" />
                </SelectTrigger>
                <SelectContent>
                  {FARMING_METHODS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <span className="font-medium">{m.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground ml-1">
                Quyết định danh sách cây trồng phù hợp.
              </p>
            </div>

            <div className="space-y-2">
              <Label>
                Hệ thống tưới tiêu <span className="text-red-500">*</span>
              </Label>
              <Select
                value={irrigationMethodId}
                onValueChange={setIrrigationMethodId}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Chọn phương pháp tưới..." />
                </SelectTrigger>
                <SelectContent>
                  {IRRIGATION_METHODS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span>{m.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white flex flex-col">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="w-5 h-5 text-green-600" />
              Giống cây trồng
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col">
            <div className="mb-4">
              <Label className="text-sm text-slate-600">
                Danh sách giống cây phù hợp
                {farmingMethodId && (
                  <span className="text-green-600 font-medium ml-1">
                    ({availableCrops.length})
                  </span>
                )}
              </Label>
            </div>

            {!farmingMethodId ? (
              <div className="flex-1 min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-400 gap-3">
                <Sprout className="w-8 h-8 opacity-50" />
                <span className="text-sm">
                  Vui lòng chọn phương pháp canh tác trước
                </span>
              </div>
            ) : (
              <ScrollArea className="flex-1 h-[240px] -mr-4 pr-4">
                {availableCrops.length > 0 ? (
                  <div className="space-y-2">
                    {availableCrops.map((crop) => (
                      <div
                        key={crop.id}
                        onClick={() => toggleCrop(crop.id)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                          selectedCrops.includes(crop.id)
                            ? "bg-green-50 border-green-200 ring-1 ring-green-500/30"
                            : "bg-white border-slate-200 hover:border-green-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedCrops.includes(crop.id) ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                          >
                            <Leaf className="w-4 h-4" />
                          </div>
                          <div>
                            <div
                              className={`text-sm font-semibold ${selectedCrops.includes(crop.id) ? "text-green-900" : "text-slate-700"}`}
                            >
                              {crop.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {crop.type}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedCrops.includes(crop.id) ? "bg-green-500 border-green-500 text-white" : "border-slate-300"}`}
                        >
                          {selectedCrops.includes(crop.id) && (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 h-full flex items-center justify-center text-muted-foreground text-sm italic">
                    Không có giống cây phù hợp
                  </div>
                )}
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderConfirmation = () => {
    const manager = MOCK_MANAGERS.find((m) => m.id === selectedManagerId);
    const certificate = MOCK_CERTIFICATES.find((c) => c.id === selectedCertId);
    const farming = FARMING_METHODS.find((m) => m.id === farmingMethodId);
    const irrigation = IRRIGATION_METHODS.find(
      (m) => m.id === irrigationMethodId,
    );

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm relative z-10">
            <CheckCircle2 className="w-10 h-10 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-orange-900 z-10 relative">
            Xác nhận cập nhật
          </h3>
          <p className="text-orange-700/80 mt-2 z-10 relative max-w-lg mx-auto">
            Vui lòng kiểm tra kỹ các thay đổi. Sau khi xác nhận, hệ thống sẽ cập
            nhật thông tin vùng canh tác.
          </p>

          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-600 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-slate-500" />
              <h4 className="font-semibold text-slate-800">Thông tin chung</h4>
            </div>
            <div className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-muted-foreground w-1/3">
                      Tên hiển thị
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {name || "Chưa đặt tên"}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-muted-foreground">Phạm vi</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className="capitalize bg-slate-50"
                      >
                        {scope}
                      </Badge>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-muted-foreground">
                      Đối tượng
                    </td>
                    <td className="py-3 px-4">
                      {scope === "region" ? (
                        <span className="font-medium text-slate-900">
                          {selectedRegion?.name}
                        </span>
                      ) : scope === "area" ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedAreas.map((a) => (
                            <Badge
                              key={a.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {a.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {selectedPlots.map((p) => (
                            <Badge
                              key={p.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {p.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                  {manager && (
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 text-muted-foreground">
                        Quản lý
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                            {manager.name.charAt(0)}
                          </div>
                          <span className="font-medium">{manager.name}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {certificate && (
                    <tr>
                      <td className="py-3 px-4 text-muted-foreground">
                        Chứng nhận
                      </td>
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-orange-50 text-orange-700 text-xs font-medium">
                          <Award className="w-3 h-3" />
                          {certificate.name}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <h4 className="font-semibold text-slate-800">
                Cấu hình kỹ thuật
              </h4>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border shadow-sm">
                  <div className="text-xs text-muted-foreground mb-1">
                    Phương pháp
                  </div>
                  <div className="font-semibold text-primary">
                    {farming?.name || "N/A"}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border shadow-sm">
                  <div className="text-xs text-muted-foreground mb-1">
                    Tưới tiêu
                  </div>
                  <div className="font-semibold text-blue-600">
                    {irrigation?.name || "N/A"}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-3">
                  Giống cây trồng ({selectedCrops.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCrops.length > 0 ? (
                    selectedCrops.map((cid) => {
                      const crop = CROP_VARIETIES.find((c) => c.id === cid);
                      return (
                        <Badge
                          key={cid}
                          variant="secondary"
                          className="pl-1 pr-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                        >
                          <span className="w-4 h-4 rounded-full bg-green-200 flex items-center justify-center mr-1.5 text-[10px]">
                            <Leaf className="w-2.5 h-2.5" />
                          </span>
                          {crop?.name}
                        </Badge>
                      );
                    })
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      Chưa chọn giống cây
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {note && (
          <div className="mt-6 bg-yellow-50/50 border border-yellow-200/60 p-4 rounded-lg text-sm text-yellow-800">
            <span className="font-semibold mr-1">Ghi chú:</span> {note}
          </div>
        )}
      </div>
    );
  };

  const steps = [
    { id: "step-1", title: "Thông tin chung", content: renderGeneralInfo() },
    {
      id: "step-2",
      title: "Cấu hình canh tác",
      content: renderConfiguration(),
    },
    { id: "step-3", title: "Xác nhận & Lưu", content: renderConfirmation() },
  ];

  return (
    <AdminLayout
      title="Chỉnh sửa vùng canh tác"
      description={`Cập nhật thông tin cho ${mockExistingData.id}`}
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation(`/cultivation-area/${params.id}`)}
          className="gap-2 text-muted-foreground hover:text-primary pl-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại chi tiết
        </Button>
      </div>

      <Card className="max-w-6xl mx-auto border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden ring-1 ring-slate-900/5">
        <CardContent className="p-0">
          <div className="p-6 md:p-8">
            <StepperForm
              steps={steps}
              completeLabel="Lưu thay đổi"
              onComplete={() => {
                console.log("Update:", {
                  id: params.id,
                  name,
                  scope,
                  selectedRegionId,
                  farmingMethodId,
                });
                setLocation(`/cultivation-area/${params.id}`);
              }}
              onCancel={() => setLocation(`/cultivation-area/${params.id}`)}
            />
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default CultivationAreaEditPage;
