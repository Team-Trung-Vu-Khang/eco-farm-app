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
  RadioGroup,
  RadioGroupItem,
} from "@tankhang1/eco-shared-ui";
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
        <div className="text-green-600">
          <Sprout className="w-5 h-5" />
        </div>
        <div className="text-sm text-green-800">
          <div className="font-semibold mb-1">
            Bước 2: Cấu hình phân bổ cây trồng
          </div>
          <div>
            Chọn hạt giống và thiết lập phương thức phân bổ (theo vùng hoặc theo
            hàng).
          </div>
        </div>
      </div>

      {/* Seed Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-slate-800">
          Chọn hạt giống
        </Label>
        <ScrollArea className="h-[200px] border rounded-lg p-3 bg-white">
          <div className="space-y-2">
            {MOCK_SEEDS.map((seed) => (
              <div
                key={seed.id}
                onClick={() => toggleSeed(seed.id)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedSeedIds.includes(seed.id)
                    ? "bg-green-50 border-green-200 ring-1 ring-green-500/30"
                    : "bg-white border-slate-200 hover:border-green-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedSeedIds.includes(seed.id) ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{seed.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {seed.code} • {seed.variety}
                    </div>
                  </div>
                </div>
                {selectedSeedIds.includes(seed.id) && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Distribution Method */}
      {selectedSeedIds.length > 0 && (
        <div className="space-y-3 animate-in slide-in-from-top-2">
          <Label className="text-base font-semibold text-slate-800">
            Phương thức phân bổ
          </Label>
          <RadioGroup
            value={distributionMethod}
            onValueChange={(v) => {
              setDistributionMethod(v as DistributionMethod);
              setPlantEntries([]);
              setRowConfigs([]);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  distributionMethod === "zone"
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 hover:border-primary/30"
                }`}
                onClick={() => {
                  setDistributionMethod("zone");
                  setPlantEntries([]);
                  setRowConfigs([]);
                }}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="zone" id="zone" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Grid3x3 className="w-4 h-4 text-primary" />
                      <Label
                        htmlFor="zone"
                        className="font-semibold cursor-pointer"
                      >
                        Phân bổ theo vùng
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Thiết lập danh sách cây cho toàn vùng
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  distributionMethod === "row"
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 hover:border-primary/30"
                }`}
                onClick={() => {
                  setDistributionMethod("row");
                  setPlantEntries([]);
                  setRowConfigs([]);
                }}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="row" id="row" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Rows className="w-4 h-4 text-primary" />
                      <Label
                        htmlFor="row"
                        className="font-semibold cursor-pointer"
                      >
                        Phân bổ theo hàng
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Thiết lập từng hàng cụ thể
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Zone Distribution Configuration */}
      {distributionMethod === "zone" && selectedSeedIds.length > 0 && (
        <Card className="border-slate-200 animate-in slide-in-from-top-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Danh sách cây trồng</span>
              <Button size="sm" onClick={addPlantEntry}>
                <Plus className="w-4 h-4 mr-1" />
                Thêm
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {plantEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Chưa có cây trồng nào. Nhấn "Thêm" để bắt đầu.
              </div>
            ) : (
              <div className="space-y-3">
                {plantEntries.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-12 gap-3 p-3 border rounded-lg bg-slate-50"
                  >
                    <div className="col-span-4">
                      <Label className="text-xs mb-1">Giống cây</Label>
                      <Select
                        value={entry.variety}
                        onValueChange={(v) =>
                          updatePlantEntry(entry.id, "variety", v)
                        }
                      >
                        <SelectTrigger className="h-9 bg-white">
                          <SelectValue placeholder="Chọn..." />
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
                    <div className="col-span-4">
                      <Label className="text-xs mb-1">Hạt giống</Label>
                      <Select
                        value={entry.seedId}
                        onValueChange={(v) =>
                          updatePlantEntry(entry.id, "seedId", v)
                        }
                      >
                        <SelectTrigger className="h-9 bg-white">
                          <SelectValue placeholder="Chọn..." />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedSeeds
                            .filter((s) => s.variety === entry.variety)
                            .map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Label className="text-xs mb-1">Số cây</Label>
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
                        className="h-9"
                      />
                    </div>
                    <div className="col-span-1 flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePlantEntry(entry.id)}
                        className="h-9 w-9 p-0 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Row Distribution Configuration */}
      {distributionMethod === "row" && selectedSeedIds.length > 0 && (
        <Card className="border-slate-200 animate-in slide-in-from-top-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Cấu hình theo hàng</span>
              <Button size="sm" onClick={addRowConfig}>
                <Plus className="w-4 h-4 mr-1" />
                Thêm hàng
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rowConfigs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Chưa có hàng nào. Nhấn "Thêm hàng" để bắt đầu.
              </div>
            ) : (
              <div className="space-y-3">
                {rowConfigs.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-12 gap-3 p-3 border rounded-lg bg-slate-50"
                  >
                    <div className="col-span-2">
                      <Label className="text-xs mb-1">Hàng số</Label>
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
                        className="h-9"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label className="text-xs mb-1">Giống cây</Label>
                      <Select
                        value={row.variety}
                        onValueChange={(v) =>
                          updateRowConfig(row.id, "variety", v)
                        }
                      >
                        <SelectTrigger className="h-9 bg-white">
                          <SelectValue placeholder="Chọn..." />
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
                    <div className="col-span-4">
                      <Label className="text-xs mb-1">Hạt giống</Label>
                      <Select
                        value={row.seedId}
                        onValueChange={(v) =>
                          updateRowConfig(row.id, "seedId", v)
                        }
                      >
                        <SelectTrigger className="h-9 bg-white">
                          <SelectValue placeholder="Chọn..." />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedSeeds
                            .filter((s) => s.variety === row.variety)
                            .map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs mb-1">Số cây</Label>
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
                        className="h-9"
                      />
                    </div>
                    <div className="col-span-1 flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRowConfig(row.id)}
                        className="h-9 w-9 p-0 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderStep3 = () => {
    const totalPlants =
      distributionMethod === "zone"
        ? plantEntries.reduce((sum, e) => sum + e.quantity, 0)
        : rowConfigs.reduce((sum, r) => sum + r.quantity, 0);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-purple-600">
            <Navigation className="w-5 h-5" />
          </div>
          <div className="text-sm text-purple-800">
            <div className="font-semibold mb-1">Bước 3: Định vị GPS</div>
            <div>
              Tạo tọa độ GPS cho từng cây trồng dựa trên cấu hình phân bổ.
            </div>
          </div>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Thông tin phân bổ</span>
              <Badge variant="outline" className="font-mono">
                {totalPlants} cây
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="text-xs text-muted-foreground">Phương thức</div>
                <div className="font-semibold">
                  {distributionMethod === "zone"
                    ? "Phân bổ theo vùng"
                    : "Phân bổ theo hàng"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Tổng số cây</div>
                <div className="font-semibold">{totalPlants} cây</div>
              </div>
            </div>

            {plantLocations.length === 0 ? (
              <div className="text-center py-8">
                <Button onClick={generatePlantLocations} size="lg">
                  <Navigation className="w-4 h-4 mr-2" />
                  Tạo định vị GPS
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Hệ thống sẽ tự động tạo tọa độ cho {totalPlants} cây
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Đã tạo {plantLocations.length} vị trí
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generatePlantLocations}
                  >
                    Tạo lại
                  </Button>
                </div>

                {/* Map View */}
                <div className="border rounded-lg overflow-hidden relative">
                  <MapContainer
                    center={[
                      plantLocations[0]?.coordinate.lat || 11.558,
                      plantLocations[0]?.coordinate.lng || 107.134,
                    ]}
                    zoom={16}
                    style={{ height: "400px", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                          <Tooltip
                            direction="top"
                            offset={[0, -8]}
                            opacity={0.9}
                          >
                            <div className="text-xs">
                              <div className="font-bold">{loc.plantCode}</div>
                              <div>{seed?.name}</div>
                            </div>
                          </Tooltip>
                          <Popup>
                            <div className="text-xs space-y-2 min-w-[200px]">
                              <div className="font-bold text-sm">
                                {loc.plantCode}
                              </div>
                              <div className="text-muted-foreground">
                                {seed?.name}
                              </div>
                              {loc.rowNumber && (
                                <div className="text-xs">
                                  Hàng: {loc.rowNumber}
                                </div>
                              )}

                              {/* Manual Coordinate Edit */}
                              <div className="pt-2 border-t space-y-2">
                                <div className="text-xs font-semibold">
                                  Tọa độ GPS
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <label className="text-xs w-12">Lat:</label>
                                    <input
                                      type="number"
                                      step="0.000001"
                                      value={loc.coordinate.lat}
                                      onChange={(e) => {
                                        const newLat = parseFloat(
                                          e.target.value,
                                        );
                                        if (!isNaN(newLat)) {
                                          updatePlantLocation(
                                            loc.id,
                                            newLat,
                                            loc.coordinate.lng,
                                          );
                                        }
                                      }}
                                      className="flex-1 px-2 py-1 text-xs border rounded"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <label className="text-xs w-12">Lng:</label>
                                    <input
                                      type="number"
                                      step="0.000001"
                                      value={loc.coordinate.lng}
                                      onChange={(e) => {
                                        const newLng = parseFloat(
                                          e.target.value,
                                        );
                                        if (!isNaN(newLng)) {
                                          updatePlantLocation(
                                            loc.id,
                                            loc.coordinate.lat,
                                            newLng,
                                          );
                                        }
                                      }}
                                      className="flex-1 px-2 py-1 text-xs border rounded"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="text-xs text-green-600 mt-2 bg-green-50 p-1.5 rounded flex items-center gap-1">
                                <Edit2 className="w-3 h-3" />
                                <span>Kéo marker để di chuyển</span>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg z-1000 border">
                    <div className="text-xs font-bold mb-2 flex items-center gap-1">
                      <Sprout className="w-3 h-3" />
                      Chú thích
                    </div>
                    <div className="space-y-1.5">
                      {Array.from(
                        new Set(plantLocations.map((l) => l.seedId)),
                      ).map((seedId) => {
                        const seed = MOCK_SEEDS.find((s) => s.id === seedId);
                        const count = plantLocations.filter(
                          (l) => l.seedId === seedId,
                        ).length;
                        return (
                          <div
                            key={seedId}
                            className="flex items-center gap-2 text-xs"
                          >
                            <div
                              className="w-3 h-3 rounded-full border-2"
                              style={{
                                backgroundColor: getSeedColor(seedId),
                                borderColor: getSeedColor(seedId),
                              }}
                            />
                            <span className="flex-1">{seed?.name}</span>
                            <span className="text-muted-foreground font-mono">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Edit2 className="w-3 h-3" />
                        <span>Kéo marker để di chuyển</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Target className="w-3 h-3" />
                        <span>Click để chỉnh sửa tọa độ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* List View */}
                <ScrollArea className="h-[200px] border rounded-lg p-3 bg-white">
                  <div className="space-y-2">
                    {plantLocations.slice(0, 50).map((loc) => {
                      const seed = MOCK_SEEDS.find((s) => s.id === loc.seedId);
                      const isSelected = selectedPlantId === loc.id;
                      return (
                        <div
                          key={loc.id}
                          className={`p-3 border rounded transition-all ${
                            isSelected
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Plant Info */}
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => setSelectedPlantId(loc.id)}
                            >
                              <div className="font-mono font-semibold text-sm">
                                {loc.plantCode}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {seed?.name}
                                {loc.rowNumber && ` • Hàng ${loc.rowNumber}`}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                📅 {loc.plantedDate}
                              </div>
                            </div>

                            {/* Coordinate Inputs */}
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <label className="text-xs text-muted-foreground w-8">
                                  Lat:
                                </label>
                                <input
                                  type="number"
                                  step="0.000001"
                                  value={loc.coordinate.lat}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const newLat = parseFloat(e.target.value);
                                    if (!isNaN(newLat)) {
                                      updatePlantLocation(
                                        loc.id,
                                        newLat,
                                        loc.coordinate.lng,
                                      );
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-32 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="text-xs text-muted-foreground w-8">
                                  Lng:
                                </label>
                                <input
                                  type="number"
                                  step="0.000001"
                                  value={loc.coordinate.lng}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const newLng = parseFloat(e.target.value);
                                    if (!isNaN(newLng)) {
                                      updatePlantLocation(
                                        loc.id,
                                        loc.coordinate.lat,
                                        newLng,
                                      );
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-32 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {plantLocations.length > 50 && (
                      <div className="text-center text-muted-foreground text-xs py-2">
                        ... và {plantLocations.length - 50} vị trí khác
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
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
