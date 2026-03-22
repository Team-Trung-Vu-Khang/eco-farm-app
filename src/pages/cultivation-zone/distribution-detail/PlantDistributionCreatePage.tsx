import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import {
  AdminLayout,
  StepperForm,
  type Step,
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
  Button,
  Badge,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapContainer, TileLayer, Popup, Tooltip, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MOCK_REGIONS,
  MOCK_AREAS,
  MOCK_PLOTS,
} from "../../region-chart/constants";
import {
  MOCK_SEEDS,
  type DistributionScope,
  type DistributionMethod,
  type PlantEntry,
  type RowConfig,
  type PlantLocation,
} from "./constants";
import {
  MapPin,
  Layers,
  Target,
  CheckCircle2,
  Sprout,
  Plus,
  Trash2,
  ChevronLeft,
  Grid3x3,
  Rows,
  Navigation,
  Edit2,
} from "lucide-react";

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const PlantDistributionCreatePage = () => {
  const [, setLocation] = useLocation();

  // Step 1: Scope Selection
  const [scope, setScope] = useState<DistributionScope>("region");
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
  const [selectedPlotIds, setSelectedPlotIds] = useState<string[]>([]);

  // Step 2: Distribution Configuration
  const [selectedSeedIds, setSelectedSeedIds] = useState<string[]>([]);
  const [distributionMethod, setDistributionMethod] =
    useState<DistributionMethod>("zone");
  const [plantEntries, setPlantEntries] = useState<PlantEntry[]>([]);
  const [rowConfigs, setRowConfigs] = useState<RowConfig[]>([]);

  // Step 3: GPS Location
  const [plantLocations, setPlantLocations] = useState<PlantLocation[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  // Get color for seed variety
  const getSeedColor = (seedId: string) => {
    const colors = [
      "#22c55e", // green
      "#3b82f6", // blue
      "#f59e0b", // amber
      "#ec4899", // pink
      "#8b5cf6", // purple
      "#06b6d4", // cyan
      "#ef4444", // red
      "#10b981", // emerald
    ];
    const index = MOCK_SEEDS.findIndex((s) => s.id === seedId);
    return colors[index % colors.length];
  };

  // Update plant location coordinates
  const updatePlantLocation = (id: string, lat: number, lng: number) => {
    setPlantLocations((prev) =>
      prev.map((p) => (p.id === id ? { ...p, coordinate: { lat, lng } } : p)),
    );
  };

  // Create custom icon for draggable marker
  const createCustomIcon = (color: string, isSelected: boolean) => {
    const size = isSelected ? 16 : 12;
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" 
          fill="${color}" 
          stroke="${isSelected ? "#fff" : color}" 
          stroke-width="${isSelected ? 2 : 1}" 
          opacity="${isSelected ? 1 : 0.8}"/>
      </svg>
    `;
    return L.divIcon({
      html: svg,
      className: "custom-plant-marker",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Computed values
  const selectedRegion = MOCK_REGIONS.find(
    (r) => r.id.toString() === selectedRegionId,
  );
  const selectedAreas = MOCK_AREAS.filter((a) =>
    selectedAreaIds.includes(a.id.toString()),
  );
  const selectedPlots = MOCK_PLOTS.filter((p) =>
    selectedPlotIds.includes(p.id),
  );
  const selectedSeeds = MOCK_SEEDS.filter((s) =>
    selectedSeedIds.includes(s.id),
  );

  // Get unique varieties from selected seeds
  const availableVarieties = useMemo(() => {
    return Array.from(new Set(selectedSeeds.map((s) => s.variety)));
  }, [selectedSeeds]);

  // Handlers
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

  const toggleSeed = (id: string) => {
    setSelectedSeedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const addPlantEntry = () => {
    setPlantEntries((prev) => [
      ...prev,
      {
        id: `entry-${Date.now()}`,
        variety: "",
        seedId: "",
        quantity: 0,
      },
    ]);
  };

  const updatePlantEntry = (
    id: string,
    field: keyof PlantEntry,
    value: string | number,
  ) => {
    setPlantEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const removePlantEntry = (id: string) => {
    setPlantEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const addRowConfig = () => {
    const nextRowNumber =
      rowConfigs.length > 0
        ? Math.max(...rowConfigs.map((r) => r.rowNumber)) + 1
        : 1;
    setRowConfigs((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        rowNumber: nextRowNumber,
        variety: "",
        seedId: "",
        quantity: 0,
      },
    ]);
  };

  const updateRowConfig = (
    id: string,
    field: keyof RowConfig,
    value: string | number,
  ) => {
    setRowConfigs((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const removeRowConfig = (id: string) => {
    setRowConfigs((prev) => prev.filter((row) => row.id !== id));
  };

  const generatePlantLocations = () => {
    // Auto-generate mock GPS locations based on distribution method
    const locations: PlantLocation[] = [];
    const baseCoord = selectedRegion
      ? selectedRegion.coordinates[0]
      : { lat: 11.53, lng: 106.88 };

    if (distributionMethod === "zone") {
      plantEntries.forEach((entry, idx) => {
        for (let i = 0; i < entry.quantity; i++) {
          locations.push({
            id: `loc-${Date.now()}-${idx}-${i}`,
            plantCode: `PLANT-${String(idx + 1).padStart(3, "0")}-${String(i + 1).padStart(4, "0")}`,
            seedId: entry.seedId,
            coordinate: {
              lat: baseCoord.lat + Math.random() * 0.01,
              lng: baseCoord.lng + Math.random() * 0.01,
            },
            plantedDate: new Date().toISOString().split("T")[0],
          });
        }
      });
    } else {
      rowConfigs.forEach((row) => {
        for (let i = 0; i < row.quantity; i++) {
          locations.push({
            id: `loc-${Date.now()}-${row.rowNumber}-${i}`,
            plantCode: `R${String(row.rowNumber).padStart(2, "0")}-P${String(i + 1).padStart(4, "0")}`,
            seedId: row.seedId,
            coordinate: {
              lat: baseCoord.lat + row.rowNumber * 0.0001,
              lng: baseCoord.lng + i * 0.0001,
            },
            plantedDate: new Date().toISOString().split("T")[0],
            rowNumber: row.rowNumber,
          });
        }
      });
    }

    setPlantLocations(locations);
  };

  // Step Renderers
  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <div className="text-blue-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="text-sm text-blue-800">
          <div className="font-semibold mb-1">Bước 1: Chọn phạm vi</div>
          <div>
            Xác định phạm vi phân bổ cây trồng: Vùng trồng, Khu vực, hoặc Lô đất
            cụ thể.
          </div>
        </div>
      </div>

      {/* Scope Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-slate-800">
          Chọn phạm vi thiết lập
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: "region",
              label: "Theo vùng trồng",
              icon: MapPin,
              desc: "Thiết lập cho toàn bộ vùng",
            },
            {
              id: "area",
              label: "Theo khu vực",
              icon: Layers,
              desc: "Thiết lập cho các khu vực",
            },
            {
              id: "plot",
              label: "Theo lô đất",
              icon: Target,
              desc: "Thiết lập cho từng lô",
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setScope(item.id as DistributionScope);
                setSelectedAreaIds([]);
                setSelectedPlotIds([]);
              }}
              className={`cursor-pointer border-2 rounded-xl p-4 transition-all relative ${
                scope === item.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-slate-100 bg-white hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              {scope === item.id && (
                <div className="absolute top-3 right-3 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${scope === item.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-800">{item.label}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Selection */}
      <div className="space-y-4 bg-slate-50 p-4 rounded-xl border">
        <div className="text-sm font-medium text-slate-700">
          Chọn vị trí địa lý
        </div>

        {/* Region */}
        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground">
            Vùng trồng <span className="text-red-500">*</span>
          </Label>
          <Select value={selectedRegionId} onValueChange={setSelectedRegionId}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Chọn vùng..." />
            </SelectTrigger>
            <SelectContent>
              {MOCK_REGIONS.map((r) => (
                <SelectItem key={r.id} value={r.id.toString()}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Areas */}
        {(scope === "area" || scope === "plot") && selectedRegionId && (
          <div className="space-y-2 animate-in slide-in-from-top-2">
            <Label className="text-xs text-muted-foreground">
              Khu vực <span className="text-red-500">*</span>
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

        {/* Plots */}
        {scope === "plot" && selectedAreaIds.length > 0 && (
          <div className="space-y-2 animate-in slide-in-from-top-2">
            <Label className="text-xs text-muted-foreground">
              Lô trồng <span className="text-red-500">*</span>
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
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-green-50 border border-green-200 rounded-lg p-5 flex items-start gap-4">
        <div className="bg-green-100 p-2 rounded-full text-green-600 shrink-0">
          <Sprout className="w-6 h-6" />
        </div>
        <div className="text-green-900">
          <div className="font-bold text-lg mb-1">
            Bước 2: Cấu hình phân bổ cây trồng
          </div>
          <div className="text-sm opacity-90 leading-relaxed max-w-2xl">
            Lựa chọn hạt giống và thiết lập phương thức phân bổ. Bạn có thể chọn
            nhiều loại hạt giống để phân bổ cho vùng trồng này.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        {/* Left Column: Seed Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-slate-800">
              Chọn hạt giống
            </Label>
            <Badge variant="outline" className="text-xs">
              Đã chọn: {selectedSeedIds.length}
            </Badge>
          </div>

          <ScrollArea className="h-[500px] -mr-4 pr-4">
            <div className="grid grid-cols-1 gap-3">
              {MOCK_SEEDS.map((seed) => {
                const isSelected = selectedSeedIds.includes(seed.id);
                return (
                  <div
                    key={seed.id}
                    onClick={() => toggleSeed(seed.id)}
                    className={`group relative flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-green-50/50 border-green-500 shadow-sm"
                        : "bg-white border-slate-100 hover:border-green-300 hover:shadow-md"
                    }`}
                  >
                    {/* Seed Image/Icon */}
                    <div className="relative w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      {seed.imageUrl ? (
                        <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={seed.imageUrl}
                            alt={seed.name}
                            className={`w-full h-full object-cover transition-all ${isSelected ? "opacity-100" : "opacity-90 group-hover:opacity-100"}`}
                          />
                          {!isSelected && (
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors"></div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center transition-colors ${isSelected ? "bg-green-100 text-green-600" : "text-slate-400 group-hover:text-green-500"}`}
                        >
                          <Sprout className="w-8 h-8" />
                        </div>
                      )}

                      {isSelected && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-[1px]">
                          <div className="bg-white rounded-full p-0.5 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 text-green-600 fill-green-100" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 py-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className={`font-semibold truncate ${isSelected ? "text-green-900" : "text-slate-900"}`}
                        >
                          {seed.name}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                        {seed.variety}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 h-5 bg-slate-100 text-slate-500 border-slate-200"
                        >
                          {seed.code}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Right Column: Configuration */}
        <div className="space-y-6">
          {selectedSeedIds.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-slate-50/50 text-slate-400 gap-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Navigation className="w-8 h-8 opacity-20" />
              </div>
              <div className="text-center max-w-xs">
                <span className="font-medium text-slate-600 block mb-1">
                  Chưa chọn hạt giống
                </span>
                <span className="text-sm">
                  Vui lòng chọn ít nhất một loại hạt giống từ danh sách bên trái
                  để tiếp tục cấu hình.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {/* Distribution Method Cards */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-slate-800">
                  Phương thức phân bổ
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: "zone",
                      label: "Phân bổ theo vùng",
                      desc: "Tự động phân bổ cây vào toàn bộ vùng đã chọn",
                      icon: Grid3x3,
                    },
                    {
                      id: "row",
                      label: "Phân bổ theo hàng",
                      desc: "Thiết lập chi tiết số lượng cây cho từng hàng",
                      icon: Rows,
                    },
                  ].map((method) => {
                    const isSelected = distributionMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => {
                          setDistributionMethod(
                            method.id as DistributionMethod,
                          );
                          setPlantEntries([]);
                          setRowConfigs([]);
                        }}
                        className={`cursor-pointer rounded-xl border-2 p-4 relative transition-all overflow-hidden ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-slate-200 bg-white hover:border-primary/30 hover:shadow-sm"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 -mr-8 -mt-8 rounded-full blur-xl"></div>
                        )}
                        <div className="flex items-start gap-3 relative z-10">
                          <div
                            className={`p-2 rounded-lg shrink-0 transition-colors ${isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}
                          >
                            <method.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div
                              className={`font-bold ${isSelected ? "text-primary dark:text-primary" : "text-slate-700"}`}
                            >
                              {method.label}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 leading-snug">
                              {method.desc}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-0 right-0">
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Configuration Panel */}
              <Card className="border-none shadow-lg bg-white overflow-hidden ring-1 ring-slate-200/50">
                <div className="h-1 bg-linear-to-r from-primary/40 to-primary/10"></div>
                <CardHeader className="border-b bg-slate-50/50 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Edit2 className="w-4 h-4 text-primary" />
                        {distributionMethod === "zone"
                          ? "Cấu hình chi tiết vùng"
                          : "Cấu hình chi tiết hàng"}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {distributionMethod === "zone"
                          ? "Thêm các mục để xác định số lượng cây cho từng loại hạt giống"
                          : "Xác định số lượng cây và loại hạt giống cho từng hàng cụ thể"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={
                        distributionMethod === "zone"
                          ? addPlantEntry
                          : addRowConfig
                      }
                      className="shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {distributionMethod === "zone"
                        ? "Thêm loại cây"
                        : "Thêm hàng mới"}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <ScrollArea className="h-[350px]">
                    <div className="p-4 space-y-3">
                      {(distributionMethod === "zone"
                        ? plantEntries
                        : rowConfigs
                      ).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <Plus className="w-6 h-6" />
                          </div>
                          <div className="text-slate-500 font-medium">
                            Chưa có cấu hình nào
                          </div>
                          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                            Nhấn nút "Thêm" ở góc trên để bắt đầu thiết lập số
                            lượng cây trồng
                          </p>
                        </div>
                      ) : (
                        // Dynamic content based on method
                        <>
                          {distributionMethod === "zone"
                            ? // ZONE ENTRIES
                              (plantEntries as PlantEntry[]).map((entry) => (
                                <div
                                  key={entry.id}
                                  className="group relative grid grid-cols-12 gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all hover:border-primary/20"
                                >
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 rounded-l-xl group-hover:bg-primary transition-colors"></div>

                                  <div className="col-span-5 sm:col-span-4">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                      Loại cây
                                    </Label>
                                    <Select
                                      value={entry.variety}
                                      onValueChange={(v) =>
                                        updatePlantEntry(entry.id, "variety", v)
                                      }
                                    >
                                      <SelectTrigger className="h-9 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20">
                                        <SelectValue placeholder="Chọn loại..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableVarieties.map((v) => (
                                          <SelectItem key={v} value={v}>
                                            {v}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="col-span-4 sm:col-span-5">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                      Hạt giống
                                    </Label>
                                    <Select
                                      value={entry.seedId}
                                      onValueChange={(v) =>
                                        updatePlantEntry(entry.id, "seedId", v)
                                      }
                                      disabled={!entry.variety}
                                    >
                                      <SelectTrigger className="h-9 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20">
                                        <SelectValue
                                          placeholder={
                                            entry.variety
                                              ? "Chọn hạt..."
                                              : "---"
                                          }
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {selectedSeeds
                                          .filter(
                                            (s) => s.variety === entry.variety,
                                          )
                                          .map((s) => (
                                            <SelectItem key={s.id} value={s.id}>
                                              <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                {s.name}
                                              </div>
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="col-span-3 sm:col-span-2">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                      Số lượng
                                    </Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={entry.quantity}
                                      onChange={(e) =>
                                        updatePlantEntry(
                                          entry.id,
                                          "quantity",
                                          parseInt(e.target.value) || 0,
                                        )
                                      }
                                      className="h-9 bg-slate-50 border-slate-200 focus:bg-white text-center font-medium"
                                    />
                                  </div>

                                  <div className="col-span-12 sm:col-span-1 flex items-end justify-end sm:justify-center">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removePlantEntry(entry.id)}
                                      className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            : // ROW CONFIGS
                              (rowConfigs as RowConfig[]).map((row) => (
                                <div
                                  key={row.id}
                                  className="group relative grid grid-cols-12 gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all hover:border-primary/20"
                                >
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 rounded-l-xl group-hover:bg-primary transition-colors"></div>

                                  <div className="col-span-3 sm:col-span-2">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                      Hàng #
                                    </Label>
                                    <div className="relative">
                                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Rows className="w-3 h-3" />
                                      </div>
                                      <Input
                                        type="number"
                                        value={row.rowNumber}
                                        onChange={(e) =>
                                          updateRowConfig(
                                            row.id,
                                            "rowNumber",
                                            parseInt(e.target.value) || 1,
                                          )
                                        }
                                        className="h-9 pl-8 bg-slate-50 border-slate-200 focus:bg-white font-bold text-slate-700"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-span-9 sm:col-span-4">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                      Loại cây
                                    </Label>
                                    <Select
                                      value={row.variety}
                                      onValueChange={(v) =>
                                        updateRowConfig(row.id, "variety", v)
                                      }
                                    >
                                      <SelectTrigger className="h-9 bg-slate-50 border-slate-200 focus:bg-white">
                                        <SelectValue placeholder="Chọn loại..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableVarieties.map((v) => (
                                          <SelectItem key={v} value={v}>
                                            {v}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="col-span-8 sm:col-span-4">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                      Hạt giống
                                    </Label>
                                    <Select
                                      value={row.seedId}
                                      onValueChange={(v) =>
                                        updateRowConfig(row.id, "seedId", v)
                                      }
                                      disabled={!row.variety}
                                    >
                                      <SelectTrigger className="h-9 bg-slate-50 border-slate-200 focus:bg-white">
                                        <SelectValue placeholder="Chọn hạt..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {selectedSeeds
                                          .filter(
                                            (s) => s.variety === row.variety,
                                          )
                                          .map((s) => (
                                            <SelectItem key={s.id} value={s.id}>
                                              {s.name}
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="col-span-4 sm:col-span-2">
                                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5 block">
                                      Số cây
                                    </Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={row.quantity}
                                      onChange={(e) =>
                                        updateRowConfig(
                                          row.id,
                                          "quantity",
                                          parseInt(e.target.value) || 0,
                                        )
                                      }
                                      className="h-9 bg-slate-50 border-slate-200 focus:bg-white text-center font-medium"
                                    />
                                  </div>

                                  <div className="absolute right-2 top-2 sm:static sm:col-span-12 sm:flex sm:justify-end sm:mt-2 md:col-span-1 md:mt-0 md:justify-center md:items-end">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeRowConfig(row.id)}
                                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const totalPlants =
      distributionMethod === "zone"
        ? plantEntries.reduce((sum, e) => sum + e.quantity, 0)
        : rowConfigs.reduce((sum, r) => sum + r.quantity, 0);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 flex items-start gap-4">
          <div className="bg-purple-100 p-2 rounded-full text-purple-600 shrink-0">
            <Navigation className="w-6 h-6" />
          </div>
          <div className="text-purple-900">
            <div className="font-bold text-lg mb-1">Bước 3: Định vị GPS</div>
            <div className="text-sm opacity-90">
              Xác định và điều chỉnh tọa độ GPS cho từng cây trồng. Bạn có thể
              kéo thả marker trên bản đồ hoặc nhập tọa độ chính xác.
            </div>
          </div>
        </div>

        {plantLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-2xl bg-slate-50 text-slate-500">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Navigation className="w-10 h-10 text-purple-500 opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Chưa có dữ liệu định vị
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Hệ thống sẽ tự động khởi tạo tọa độ GPS cho{" "}
              <strong>{totalPlants}</strong> cây trồng dựa trên phương thức phân
              bổ đã chọn.
            </p>
            <Button
              onClick={generatePlantLocations}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200"
            >
              <Navigation className="w-5 h-5 mr-2" />
              Khởi tạo {totalPlants} điểm GPS
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Left Column: Interactive Map */}
            <div className="lg:col-span-2 flex flex-col gap-4 h-full">
              <Card className="flex-1 border-none shadow-lg overflow-hidden flex flex-col relative ring-1 ring-slate-200">
                <div className="absolute top-4 right-4 z-[1000] flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={generatePlantLocations}
                    className="shadow-md bg-white/90 backdrop-blur hover:bg-white text-xs h-8"
                  >
                    <Edit2 className="w-3 h-3 mr-1.5" />
                    Tạo lại tất cả
                  </Button>
                </div>

                <MapContainer
                  center={[
                    plantLocations[0]?.coordinate.lat || 11.558,
                    plantLocations[0]?.coordinate.lng || 107.134,
                  ]}
                  zoom={18}
                  style={{ height: "100%", width: "100%" }}
                  className="z-0 bg-slate-100"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                  <TileLayer
                    attribution="Labels"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                  />

                  {plantLocations.map((loc) => {
                    const seed = MOCK_SEEDS.find((s) => s.id === loc.seedId);
                    const isSelected = selectedPlantId === loc.id;
                    const color = getSeedColor(loc.seedId);

                    return (
                      <Marker
                        key={loc.id}
                        position={[loc.coordinate.lat, loc.coordinate.lng]}
                        icon={createCustomIcon(color, isSelected)}
                        draggable={true}
                        eventHandlers={{
                          dragend: (e) => {
                            const marker = e.target;
                            const position = marker.getLatLng();
                            updatePlantLocation(
                              loc.id,
                              position.lat,
                              position.lng,
                            );
                          },
                          click: () => {
                            setSelectedPlantId(loc.id);
                          },
                        }}
                      >
                        {/* Simplified Tooltip for better performance/look */}
                        {isSelected && (
                          <Tooltip
                            direction="top"
                            offset={[0, -10]}
                            opacity={1}
                            permanent
                          >
                            <div className="text-[10px] font-bold px-1 py-0.5 bg-white border rounded shadow-sm">
                              {loc.plantCode}
                            </div>
                          </Tooltip>
                        )}

                        <Popup closeButton={false} className="custom-popup">
                          <div className="p-1">
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                              <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                                {seed?.imageUrl ? (
                                  <img
                                    src={seed.imageUrl}
                                    className="w-full h-full object-cover rounded"
                                  />
                                ) : (
                                  <Sprout className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-sm">
                                  {loc.plantCode}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {seed?.name}
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] uppercase text-muted-foreground font-bold">
                                    Vĩ độ (Lat)
                                  </label>
                                  <input
                                    className="w-full text-xs p-1 border rounded bg-slate-50 font-mono"
                                    type="number"
                                    step="0.000001"
                                    value={loc.coordinate.lat}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      if (!isNaN(val))
                                        updatePlantLocation(
                                          loc.id,
                                          val,
                                          loc.coordinate.lng,
                                        );
                                    }}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] uppercase text-muted-foreground font-bold">
                                    Kinh độ (Lng)
                                  </label>
                                  <input
                                    className="w-full text-xs p-1 border rounded bg-slate-50 font-mono"
                                    type="number"
                                    step="0.000001"
                                    value={loc.coordinate.lng}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      if (!isNaN(val))
                                        updatePlantLocation(
                                          loc.id,
                                          loc.coordinate.lat,
                                          val,
                                        );
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="text-[10px] text-green-600 italic flex items-center gap-1 justify-center bg-green-50 p-1 rounded">
                                <Navigation className="w-3 h-3" />
                                Kéo thả để điều chỉnh vị trí
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>

                {/* Legend Overlay */}
                <div className="absolute bottom-4 left-4 right-auto bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-slate-200 max-w-[200px] z-[500]">
                  <div className="text-xs font-bold mb-2 text-slate-800">
                    Chú thích loại cây
                  </div>
                  <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
                    {Array.from(
                      new Set(plantLocations.map((l) => l.seedId)),
                    ).map((seedId) => {
                      const seed = MOCK_SEEDS.find((s) => s.id === seedId);
                      const count = plantLocations.filter(
                        (l) => l.seedId === seedId,
                      ).length;
                      const color = getSeedColor(seedId);
                      return (
                        <div
                          key={seedId}
                          className="flex items-center gap-2 text-[10px]"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shadow-sm"
                            style={{ backgroundColor: color }}
                          ></span>
                          <span className="flex-1 truncate font-medium text-slate-700">
                            {seed?.name}
                          </span>
                          <span className="text-slate-400 font-mono">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: List & Details */}
            <div className="flex flex-col gap-4 h-full">
              <Card className="flex-none bg-indigo-900 text-white border-none shadow-md overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-6 -mt-6 blur-2xl"></div>
                <CardContent className="p-5 relative z-10">
                  <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">
                    Tổng quan
                  </div>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-bold">{totalPlants}</span>
                    <span className="text-sm font-medium mb-1.5 text-white/80">
                      cây đã định vị
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/10 rounded px-2 py-1.5 backdrop-blur-sm">
                      <div className="text-white/50 mb-0.5">Phương thức</div>
                      <div className="font-semibold">
                        {distributionMethod === "zone"
                          ? "Theo vùng"
                          : "Theo hàng"}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded px-2 py-1.5 backdrop-blur-sm">
                      <div className="text-white/50 mb-0.5">Mật độ</div>
                      <div className="font-semibold">
                        ~{totalPlants > 0 ? (totalPlants / 10).toFixed(1) : 0}
                        /m²
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1 border-slate-200 shadow-sm flex flex-col min-h-0 bg-white">
                <CardHeader className="py-3 px-4 border-b bg-slate-50 min-h-[48px] flex justify-center">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-400" />
                      Danh sách tọa độ
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-white text-xs font-normal"
                    >
                      {plantLocations.length} điểm
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 relative">
                  <div className="absolute inset-0">
                    <ScrollArea className="h-full">
                      <div className="divide-y divide-slate-100">
                        {plantLocations.map((loc) => {
                          const seed = MOCK_SEEDS.find(
                            (s) => s.id === loc.seedId,
                          );
                          const isSelected = selectedPlantId === loc.id;

                          return (
                            <div
                              key={loc.id}
                              onClick={() => setSelectedPlantId(loc.id)}
                              className={`p-3 text-sm cursor-pointer transition-colors hover:bg-slate-50 ${isSelected ? "bg-indigo-50/60" : ""}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span
                                      className={`font-mono font-bold text-xs ${isSelected ? "text-indigo-700" : "text-slate-700"}`}
                                    >
                                      {loc.plantCode}
                                    </span>
                                    {isSelected && (
                                      <Badge
                                        variant="secondary"
                                        className="text-[10px] h-4 px-1 bg-indigo-100 text-indigo-700"
                                      >
                                        Active
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                                    <span
                                      className="w-2 h-2 rounded-full flex-shrink-0"
                                      style={{
                                        backgroundColor: getSeedColor(
                                          loc.seedId,
                                        ),
                                      }}
                                    ></span>
                                    {seed?.name}
                                  </div>
                                </div>

                                <div className="flex flex-col gap-1 items-end">
                                  <div className="bg-slate-100 rounded text-[10px] font-mono px-1.5 py-0.5 text-slate-500 whitespace-nowrap">
                                    {loc.coordinate.lat.toFixed(6)},{" "}
                                    {loc.coordinate.lng.toFixed(6)}
                                  </div>
                                </div>
                              </div>

                              {isSelected && (
                                <div className="mt-2 grid grid-cols-2 gap-2 animate-in slide-in-from-top-1 bg-white p-2 rounded border border-indigo-100 shadow-sm">
                                  <div>
                                    <label className="text-[10px] text-muted-foreground block mb-0.5">
                                      Lat
                                    </label>
                                    <input
                                      className="w-full text-xs p-1 border rounded font-mono focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 outline-none"
                                      type="number"
                                      step="0.000001"
                                      value={loc.coordinate.lat}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        if (!isNaN(val))
                                          updatePlantLocation(
                                            loc.id,
                                            val,
                                            loc.coordinate.lng,
                                          );
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-muted-foreground block mb-0.5">
                                      Lng
                                    </label>
                                    <input
                                      className="w-full text-xs p-1 border rounded font-mono focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 outline-none"
                                      type="number"
                                      step="0.000001"
                                      value={loc.coordinate.lng}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        if (!isNaN(val))
                                          updatePlantLocation(
                                            loc.id,
                                            loc.coordinate.lat,
                                            val,
                                          );
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep4 = () => {
    const totalPlants =
      distributionMethod === "zone"
        ? plantEntries.reduce((sum, e) => sum + e.quantity, 0)
        : rowConfigs.reduce((sum, r) => sum + r.quantity, 0);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
        <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm relative z-10">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-900 z-10 relative">
            Xác nhận thông tin phân bổ
          </h3>
          <p className="text-green-700/80 mt-2 z-10 relative max-w-lg mx-auto">
            Kiểm tra kỹ thông tin trước khi lưu. Hệ thống sẽ tạo {totalPlants}{" "}
            cây trồng với định vị GPS.
          </p>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-600 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scope Info */}
          <Card className="border-slate-200 shadow-sm">
            <div className="bg-slate-50 border-b p-4">
              <h4 className="font-semibold text-slate-800">Phạm vi</h4>
            </div>
            <div className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-muted-foreground w-1/3">
                      Loại
                    </td>
                    <td className="py-3 px-4 font-medium">
                      <Badge variant="outline" className="capitalize">
                        {scope === "region"
                          ? "Vùng trồng"
                          : scope === "area"
                            ? "Khu vực"
                            : "Lô đất"}
                      </Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-muted-foreground">Vùng</td>
                    <td className="py-3 px-4 font-medium">
                      {selectedRegion?.name}
                    </td>
                  </tr>
                  {scope === "area" && (
                    <tr className="border-b">
                      <td className="py-3 px-4 text-muted-foreground">
                        Khu vực
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {selectedAreas.map((a) => (
                            <Badge key={a.id} variant="secondary">
                              {a.name}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                  {scope === "plot" && (
                    <tr className="border-b">
                      <td className="py-3 px-4 text-muted-foreground">Lô</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {selectedPlots.map((p) => (
                            <Badge key={p.id} variant="secondary">
                              {p.name}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Distribution Info */}
          <Card className="border-slate-200 shadow-sm">
            <div className="bg-slate-50 border-b p-4">
              <h4 className="font-semibold text-slate-800">Phân bổ</h4>
            </div>
            <div className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-muted-foreground w-1/3">
                      Phương thức
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {distributionMethod === "zone"
                        ? "Theo vùng"
                        : "Theo hàng"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-muted-foreground">
                      Hạt giống
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {selectedSeeds.length} loại
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 text-muted-foreground">
                      Tổng cây
                    </td>
                    <td className="py-3 px-4 font-medium text-green-600">
                      {totalPlants} cây
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-muted-foreground">
                      Định vị GPS
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {plantLocations.length > 0 ? (
                        <Badge className="bg-green-100 text-green-700">
                          Đã tạo
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Chưa tạo</Badge>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Details */}
        {distributionMethod === "zone" && plantEntries.length > 0 && (
          <Card className="border-slate-200 shadow-sm">
            <div className="bg-slate-50 border-b p-4">
              <h4 className="font-semibold text-slate-800">
                Chi tiết cây trồng
              </h4>
            </div>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {plantEntries.map((entry, idx) => {
                  const seed = MOCK_SEEDS.find((s) => s.id === entry.seedId);
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-medium">{entry.variety}</div>
                          <div className="text-xs text-muted-foreground">
                            {seed?.name}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{entry.quantity} cây</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {distributionMethod === "row" && rowConfigs.length > 0 && (
          <Card className="border-slate-200 shadow-sm">
            <div className="bg-slate-50 border-b p-4">
              <h4 className="font-semibold text-slate-800">
                Chi tiết theo hàng
              </h4>
            </div>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {rowConfigs.map((row) => {
                  const seed = MOCK_SEEDS.find((s) => s.id === row.seedId);
                  return (
                    <div
                      key={row.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                          {row.rowNumber}
                        </div>
                        <div>
                          <div className="font-medium">{row.variety}</div>
                          <div className="text-xs text-muted-foreground">
                            {seed?.name}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{row.quantity} cây</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const steps: Step[] = [
    {
      id: "scope",
      title: "Chọn phạm vi",
      description: "Xác định vùng/khu vực/lô",
      content: renderStep1(),
    },
    {
      id: "distribution",
      title: "Cấu hình phân bổ",
      description: "Thiết lập cây trồng",
      content: renderStep2(),
    },
    {
      id: "gps",
      title: "Định vị GPS",
      description: "Tạo tọa độ cây",
      content: renderStep3(),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: renderStep4(),
    },
  ];

  const handleComplete = () => {
    console.log("Distribution data:", {
      scope,
      selectedRegionId,
      selectedAreaIds,
      selectedPlotIds,
      selectedSeedIds,
      distributionMethod,
      plantEntries,
      rowConfigs,
      plantLocations,
    });
    // TODO: Save to API
    setLocation("/distribution-detail");
  };

  return (
    <AdminLayout
      title="Tạo phân bổ cây trồng"
      description="Thiết lập phân bổ cây trồng cho vùng, khu vực hoặc lô đất"
      actions={
        <Button
          variant="outline"
          onClick={() => setLocation("/distribution-detail")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      }
    >
      <StepperForm
        steps={steps}
        onComplete={handleComplete}
        onCancel={() => setLocation("/distribution-detail")}
      />
    </AdminLayout>
  );
};

export default PlantDistributionCreatePage;
