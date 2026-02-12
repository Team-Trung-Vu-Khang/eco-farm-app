import { useState, useMemo, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import {
  AdminLayout,
  StepperForm,
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
  Textarea,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Badge,
  ScrollArea,
  useToast,
  cn,
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
import useCultivationAreaStore from "../../../stores/useCultivationAreaStore";
import useRegionStore from "../../../stores/useRegionStore";
import useDepartmentStore from "../../../stores/useDepartmentStore";

type ScopeType = "region" | "area" | "plot";

// (Removed mockExistingData and switched to store)

// --- Enhanced Helper Components ---

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
            <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              {/* @ts-ignore - Assuming imageUrl exists on mock data, if not it falls back gracefully or shows empty box */}
              {(cert as any).imageUrl ? (
                <img
                  src={(cert as any).imageUrl}
                  alt={cert.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Award
                  className={`w-6 h-6 ${selectedId === cert.id ? "text-primary" : "text-slate-400"}`}
                />
              )}
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
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const selectedManager = MOCK_MANAGERS.find((m) => m.id === selectedId);
  const departmentsFromStore = useDepartmentStore((state) => state.departments);
  const departments = departmentsFromStore
    .filter((d) => d.status === "active")
    .map((d) => d.name);

  const filteredManagers = useMemo(() => {
    return MOCK_MANAGERS.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept =
        departmentFilter === "all" || m.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, departmentFilter]);

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
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên, chức vụ..."
                  className="pl-10 bg-slate-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Department Filter */}
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-[140px] bg-slate-50">
                  <SelectValue placeholder="Phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                {filteredManagers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Không tìm thấy nhân viên nào
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// --- Main Page Component ---

const CultivationAreaEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { getAreaById, updateArea } = useCultivationAreaStore();
  const { regions } = useRegionStore();

  const existingArea = useMemo(() => {
    if (!id) return null;
    return getAreaById(id);
  }, [id, getAreaById]);

  // State
  const [scope, setScope] = useState<ScopeType>("region");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
  const [selectedPlotIds, setSelectedPlotIds] = useState<string[]>([]);

  const [selectedCertId, setSelectedCertId] = useState<string>("");
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");

  const [activeConfigId, setActiveConfigId] = useState<string>("region-main");
  const [configs, setConfigs] = useState<
    Record<
      string,
      {
        farmingMethodId: string;
        irrigationMethodId: string;
        selectedCrops: string[];
      }
    >
  >({});

  // Initialize state with existing area data
  useEffect(() => {
    if (existingArea) {
      setScope(existingArea.scope);
      setName(existingArea.name);
      setNote(existingArea.note || "");
      setSelectedCertId(existingArea.certificateId || "");
      setSelectedManagerId(existingArea.managerId || "");
      setConfigs(existingArea.configs || {});

      // Locate IDs based on scope
      if (existingArea.scope === "region") {
        setSelectedRegionId(existingArea.targetIds[0] || "");
      } else if (existingArea.scope === "area") {
        const areaIds = existingArea.targetIds;
        setSelectedAreaIds(areaIds);
        // Find region of first area
        const allAreas = regions.flatMap((r) => r.subAreas || []);
        const firstArea = allAreas.find((a) => a.id.toString() === areaIds[0]);
        if (firstArea) {
          setSelectedRegionId(firstArea.regionId.toString());
        }
      } else if (existingArea.scope === "plot") {
        const plotIds = existingArea.targetIds;
        setSelectedPlotIds(plotIds);
        // Find areas of these plots
        const allAreas = regions.flatMap((r) => r.subAreas || []);
        const areasWithPlots = allAreas.filter((a) =>
          a.plots?.some((p) => plotIds.includes(p.id)),
        );
        setSelectedAreaIds(areasWithPlots.map((a) => a.id.toString()));
        if (areasWithPlots[0]) {
          setSelectedRegionId(areasWithPlots[0].regionId.toString());
        }
      }
    }
  }, [existingArea, regions]);

  // Computed values
  const currentRegion = useMemo(
    () => regions.find((r) => r.id.toString() === selectedRegionId),
    [regions, selectedRegionId],
  );
  const availableAreas = useMemo(
    () => currentRegion?.subAreas || [],
    [currentRegion],
  );
  const availablePlots = useMemo(() => {
    const filteredAreas = availableAreas.filter((a) =>
      selectedAreaIds.includes(a.id.toString()),
    );
    return filteredAreas.flatMap((a) => a.plots || []);
  }, [availableAreas, selectedAreaIds]);

  const selectedRegion = currentRegion;
  const selectedAreas = useMemo(
    () =>
      availableAreas.filter((a) => selectedAreaIds.includes(a.id.toString())),
    [availableAreas, selectedAreaIds],
  );
  const selectedPlots = useMemo(
    () => availablePlots.filter((p) => selectedPlotIds.includes(p.id)),
    [availablePlots, selectedPlotIds],
  );

  const toggleArea = (id: string) => {
    setSelectedAreaIds((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        // Remove plots associated with this area
        const area = availableAreas.find((a) => a.id.toString() === id);
        if (area?.plots) {
          const plotIdsToRemove = area.plots.map((p) => p.id);
          setSelectedPlotIds((plots) =>
            plots.filter((pid) => !plotIdsToRemove.includes(pid)),
          );
        }
        return prev.filter((a) => a !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const togglePlot = (id: string) => {
    setSelectedPlotIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  if (!existingArea) {
    return (
      <AdminLayout
        title="Không tìm thấy"
        description="Vùng canh tác không tồn tại"
      >
        <div className="flex flex-col items-center justify-center py-20">
          <Target className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-900">
            Không tìm thấy vùng canh tác
          </h2>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => setLocation("/cultivation-area")}
          >
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  // Steps Rendering
  const renderGeneralInfo = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Edit Mode Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <div className="text-blue-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="text-sm text-blue-800">
          <div className="font-semibold mb-1">Chế độ chỉnh sửa</div>
          <div>
            Bạn đang chỉnh sửa vùng canh tác <strong>{existingArea.id}</strong>.
            Các thay đổi sẽ được lưu sau khi hoàn tất.
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
        {/* 2. Basic Info & Location */}
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
                  Vùng trồng (Region) <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedRegionId}
                  onValueChange={(val) => {
                    setSelectedRegionId(val);
                    setSelectedAreaIds([]);
                    setSelectedPlotIds([]);
                  }}
                >
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Chọn vùng..." />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r.id} value={r.id.toString()}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(scope === "area" || scope === "plot") && selectedRegionId && (
                <div className="space-y-2 animate-in slide-in-from-top-2">
                  <Label className="text-xs text-muted-foreground">
                    Khu vực (Area) <span className="text-red-500">*</span>
                    {selectedAreaIds.length > 0 && (
                      <span className="ml-1 text-primary font-medium">
                        ({selectedAreaIds.length})
                      </span>
                    )}
                  </Label>
                  <ScrollArea className="max-h-[200px] border rounded-lg p-2 bg-white">
                    <div className="space-y-1">
                      {availableAreas.map((a) => (
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

              {scope === "plot" && selectedAreaIds.length > 0 && (
                <div className="space-y-2 animate-in slide-in-from-top-2">
                  <Label className="text-xs text-muted-foreground">
                    Lô trồng (Plot) <span className="text-red-500">*</span>
                    {selectedPlotIds.length > 0 && (
                      <span className="ml-1 text-primary font-medium">
                        ({selectedPlotIds.length})
                      </span>
                    )}
                  </Label>
                  <ScrollArea className="max-h-[200px] border rounded-lg p-2 bg-white">
                    <div className="space-y-1">
                      {availablePlots.map((p) => {
                        const parentArea = availableAreas.find((a) =>
                          a.plots?.some((pp) => pp.id === p.id),
                        );
                        return (
                          <div
                            key={p.id}
                            onClick={() => togglePlot(p.id)}
                            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                              selectedPlotIds.includes(p.id)
                                ? "bg-primary/10 border border-primary/30"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {p.name}
                              </span>
                              {parentArea && (
                                <span className="text-[10px] text-muted-foreground">
                                  Thuộc: {parentArea.name}
                                </span>
                              )}
                            </div>
                            {selectedPlotIds.includes(p.id) && (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            )}
                          </div>
                        );
                      })}
                      {availablePlots.length === 0 && (
                        <div className="text-center py-4 text-xs text-muted-foreground italic">
                          Không có lô nào trong khu vực đã chọn
                        </div>
                      )}
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

        {/* 3. Standards & Management */}
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

  const renderConfiguration = () => {
    // Determine entities based on scope
    let entities: { id: string; name: string; type: string }[] = [];
    if (scope === "region") {
      entities = [
        {
          id: "region-main",
          name: selectedRegion?.name || "Vùng trồng",
          type: "Vùng",
        },
      ];
    } else if (scope === "area") {
      entities = selectedAreas.map((a) => ({
        id: a.id.toString(),
        name: a.name,
        type: "Khu vực",
      }));
    } else if (scope === "plot") {
      entities = selectedPlots.map((p) => ({
        id: p.id,
        name: p.name,
        type: "Lô",
      }));
    }

    const effectiveId =
      entities.find((e) => e.id === activeConfigId)?.id ||
      entities[0]?.id ||
      "region-main";
    const effectiveConfig = configs[effectiveId] || {
      farmingMethodId: "",
      irrigationMethodId: "",
      selectedCrops: [],
    };

    const availableCropsForConfig = (() => {
      const method = FARMING_METHODS.find(
        (m) => m.id === effectiveConfig.farmingMethodId,
      );
      if (!method) return [];
      return CROP_VARIETIES.filter((c) => method.allowedCrops.includes(c.id));
    })();

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Scope Summary Banner - Full Width at Top */}
        <div className="relative overflow-hidden rounded-xl border border-green-200 bg-linear-to-r from-green-50 via-white to-green-50 p-6 shadow-sm">
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white shadow-sm border flex items-center justify-center text-primary shrink-0">
              {scope === "plot" ? (
                <Target className="w-7 h-7" />
              ) : scope === "area" ? (
                <Layers className="w-7 h-7" />
              ) : (
                <MapPin className="w-7 h-7" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {scope === "region"
                  ? "Vùng trồng"
                  : scope === "area"
                    ? "Khu vực"
                    : "Lô đất"}
              </div>
              <div className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5 truncate">
                {scope === "region"
                  ? selectedRegion?.name
                  : scope === "area"
                    ? `${selectedAreas.length} khu vực`
                    : `${selectedPlots.length} lô trồng`}
              </div>
              {(scope === "region" && selectedRegion) || name ? (
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {scope === "region" && selectedRegion && (
                    <Badge
                      variant="outline"
                      className="bg-white font-mono text-xs"
                    >
                      {selectedRegion.code}
                    </Badge>
                  )}
                  {name && (
                    <span className="text-slate-600 text-sm">{name}</span>
                  )}
                </div>
              ) : null}
            </div>
            {entities.length > 1 && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-lg border">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Tiến độ</div>
                  <div className="text-lg font-bold text-primary">
                    {
                      entities.filter((e) => {
                        const cfg = configs[e.id];
                        return (
                          cfg?.farmingMethodId &&
                          (cfg?.selectedCrops?.length || 0) > 0
                        );
                      }).length
                    }
                    /{entities.length}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
        </div>

        {/* Main Content Area */}
        <div
          className={cn(
            "grid grid-cols-1 gap-6",
            entities.length > 1 ? "lg:grid-cols-[1fr_3fr]" : "grid-cols-1",
          )}
        >
          {/* Sidebar for multiple entities */}
          {entities.length > 1 && (
            <div className="w-full lg:w-72 shrink-0">
              <div className="sticky top-6">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold text-slate-700">
                    Danh sách thiết lập
                  </Label>
                  <Badge variant="secondary" className="text-xs">
                    {entities.length}
                  </Badge>
                </div>
                <ScrollArea className="h-[600px] border rounded-xl bg-white shadow-sm">
                  <div className="p-2 space-y-1">
                    {entities.map((entity) => {
                      const isConfigured =
                        configs[entity.id]?.farmingMethodId &&
                        (configs[entity.id]?.selectedCrops?.length || 0) > 0;
                      const isActive = effectiveId === entity.id;

                      return (
                        <div
                          key={entity.id}
                          onClick={() => setActiveConfigId(entity.id)}
                          className={`group relative p-3 rounded-lg text-sm cursor-pointer transition-all border ${
                            isActive
                              ? "bg-primary/10 border-primary/30 shadow-sm"
                              : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isConfigured
                                  ? "bg-green-100 text-green-600"
                                  : isActive
                                    ? "bg-primary/20 text-primary"
                                    : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {isConfigured ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <span className="text-xs font-bold">
                                  {entities.indexOf(entity) + 1}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-muted-foreground uppercase font-medium">
                                {entity.type}
                              </div>
                              <div
                                className={`truncate font-medium ${
                                  isActive ? "text-slate-900" : "text-slate-700"
                                }`}
                              >
                                {entity.name}
                              </div>
                            </div>
                          </div>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Configuration Cards */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Entity Name Badge (for multiple entities) */}
            {entities.length > 1 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border rounded-lg">
                <span className="text-sm text-muted-foreground">
                  Đang thiết lập cho:
                </span>
                <Badge variant="default" className="font-semibold">
                  {entities.find((e) => e.id === effectiveId)?.name}
                </Badge>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Farming & Irrigation Card */}
              <Card className="border-none shadow-md bg-white">
                <CardHeader className="pb-3 border-b bg-gradient-to-r from-green-50/50 to-white">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Sprout className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Phương pháp canh tác</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Loại hình canh tác <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={effectiveConfig.farmingMethodId}
                      onValueChange={(val) => {
                        setConfigs((prev) => ({
                          ...prev,
                          [effectiveId]: {
                            ...prev[effectiveId],
                            farmingMethodId: val,
                          },
                        }));
                      }}
                    >
                      <SelectTrigger className="h-11 bg-white">
                        <SelectValue placeholder="Chọn phương pháp..." />
                      </SelectTrigger>
                      <SelectContent>
                        {FARMING_METHODS.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <span className="font-medium">{m.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Quyết định danh sách cây trồng phù hợp
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Hệ thống tưới tiêu <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={effectiveConfig.irrigationMethodId}
                      onValueChange={(val) => {
                        setConfigs((prev) => ({
                          ...prev,
                          [effectiveId]: {
                            ...prev[effectiveId],
                            irrigationMethodId: val,
                          },
                        }));
                      }}
                    >
                      <SelectTrigger className="h-11 bg-white">
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

                  {/* Auto-fill button */}
                  {entities.length > 1 && (
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-dashed hover:bg-primary/5"
                        onClick={() => {
                          const newConfigs = { ...configs };
                          entities.forEach((e) => {
                            newConfigs[e.id] = { ...effectiveConfig };
                          });
                          setConfigs(newConfigs);
                        }}
                      >
                        <span className="text-xs">
                          Áp dụng cho tất cả ({entities.length} mục)
                        </span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Crop Selection Card */}
              <Card className="border-none shadow-md bg-white flex flex-col xl:row-span-1">
                <CardHeader className="pb-3 border-b bg-gradient-to-r from-green-50/50 to-white">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Giống cây trồng</span>
                    {effectiveConfig.farmingMethodId && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {availableCropsForConfig.length} loại
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex-1 flex flex-col min-h-0">
                  {!effectiveConfig.farmingMethodId ? (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-400 gap-3 py-12">
                      <Sprout className="w-10 h-10 opacity-50" />
                      <span className="text-sm text-center px-4">
                        Vui lòng chọn phương pháp canh tác trước
                      </span>
                    </div>
                  ) : (
                    <ScrollArea className="flex-1 -mx-6 px-6 h-[400px]">
                      {availableCropsForConfig.length > 0 ? (
                        <div className="space-y-2 pr-2">
                          {availableCropsForConfig.map((crop) => {
                            const isSelected = (
                              effectiveConfig.selectedCrops || []
                            ).includes(crop.id);
                            return (
                              <div
                                key={crop.id}
                                onClick={() => {
                                  const current =
                                    effectiveConfig.selectedCrops || [];
                                  const newCrops = current.includes(crop.id)
                                    ? current.filter((c) => c !== crop.id)
                                    : [...current, crop.id];
                                  setConfigs((prev) => ({
                                    ...prev,
                                    [effectiveId]: {
                                      ...prev[effectiveId],
                                      selectedCrops: newCrops,
                                    },
                                  }));
                                }}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                  isSelected
                                    ? "bg-green-50 border-green-300 shadow-sm"
                                    : "bg-white border-slate-200 hover:border-green-200 hover:shadow-sm"
                                }`}
                              >
                                <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                  {crop.imageUrl ? (
                                    <img
                                      src={crop.imageUrl}
                                      alt={crop.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                      <Leaf className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div
                                    className={`text-sm font-semibold truncate ${
                                      isSelected
                                        ? "text-green-900"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    {crop.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {crop.type}
                                  </div>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                                    isSelected
                                      ? "bg-green-500 border-green-500"
                                      : "border-slate-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-muted-foreground text-sm italic py-10">
                          Không có giống cây phù hợp
                        </div>
                      )}
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConfirmation = () => {
    const manager = MOCK_MANAGERS.find((m) => m.id === selectedManagerId);
    const certificate = MOCK_CERTIFICATES.find((c) => c.id === selectedCertId);

    // Determine entities based on scope
    let entities: { id: string; name: string; type: string }[] = [];
    if (scope === "region") {
      entities = [
        {
          id: "region-main",
          name: selectedRegion?.name || "Vùng trồng",
          type: "Vùng",
        },
      ];
    } else if (scope === "area") {
      entities = selectedAreas.map((a) => ({
        id: a.id.toString(),
        name: a.name,
        type: "Khu vực",
      }));
    } else if (scope === "plot") {
      entities = selectedPlots.map((p) => ({
        id: p.id,
        name: p.name,
        type: "Lô",
      }));
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
        <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm relative z-10">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-900 z-10 relative">
            Xác nhận thông tin
          </h3>
          <p className="text-green-700/80 mt-2 z-10 relative max-w-lg mx-auto">
            Vui lòng kiểm tra kỹ các thông tin dưới đây. Sau khi xác nhận, hệ
            thống sẽ tiến hành khởi tạo vùng canh tác mới.
          </p>

          {/* Decor */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-600 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
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
                Cấu hình kỹ thuật ({entities.length} mục)
              </h4>
            </div>
            <div className="p-4 space-y-4">
              {entities.map((entity) => {
                const cfg = configs[entity.id] || {
                  farmingMethodId: "",
                  irrigationMethodId: "",
                  selectedCrops: [],
                };
                const farming = FARMING_METHODS.find(
                  (m) => m.id === cfg.farmingMethodId,
                );
                const irrigation = IRRIGATION_METHODS.find(
                  (m) => m.id === cfg.irrigationMethodId,
                );
                const selectedCrops = cfg.selectedCrops || [];

                return (
                  <div
                    key={entity.id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <span className="text-muted-foreground font-normal uppercase text-xs">
                        {entity.type}
                      </span>
                      {entity.name}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-50 p-3 rounded-lg border">
                        <div className="text-xs text-muted-foreground mb-1">
                          Phương pháp
                        </div>
                        <div className="font-semibold text-primary">
                          {farming?.name || (
                            <span className="text-red-500 italic">
                              Chưa chọn
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border">
                        <div className="text-xs text-muted-foreground mb-1">
                          Tưới tiêu
                        </div>
                        <div className="font-semibold text-blue-600">
                          {irrigation?.name || (
                            <span className="text-red-500 italic">
                              Chưa chọn
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">
                        Giống cây trồng ({selectedCrops.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCrops.length > 0 ? (
                          selectedCrops.map((cid: string) => {
                            const crop = CROP_VARIETIES.find(
                              (c) => c.id === cid,
                            );
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
                          <span className="text-red-500 italic text-xs">
                            Chưa chọn cây trồng
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
      title="Thiết lập vùng canh tác"
      description="Quy trình khởi tạo và cấu hình tiêu chuẩn cho đơn vị canh tác"
    >
      {/* Manual Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/cultivation-area")}
          className="gap-2 text-muted-foreground hover:text-primary pl-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <Card className="max-w-6xl mx-auto border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden ring-1 ring-slate-900/5">
        <CardContent className="p-0">
          <div className="p-6 md:p-8">
            <StepperForm
              steps={steps}
              completeLabel="Lưu thay đổi"
              onComplete={() => {
                // Determine target labels
                let targetName = "";
                let targetIds: string[] = [];
                if (scope === "region") {
                  targetName = selectedRegion?.name || "";
                  targetIds = [selectedRegionId];
                } else if (scope === "area") {
                  targetName = selectedAreas.map((a) => a.name).join(", ");
                  targetIds = selectedAreaIds;
                } else if (scope === "plot") {
                  targetName = selectedPlots.map((p) => p.name).join(", ");
                  targetIds = selectedPlotIds;
                }

                // Handle update
                updateArea(id!, {
                  name,
                  scope,
                  targetIds,
                  targetName,
                  configs,
                  certificateId: selectedCertId,
                  managerId: selectedManagerId,
                  note,
                });

                toast({
                  title: "Thành công",
                  description: "Đã cập nhật vùng canh tác",
                });
                setLocation(`/cultivation-area/${id}`);
              }}
              onCancel={() => setLocation(`/cultivation-area/${id}`)}
            />
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default CultivationAreaEditPage;
