import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  Textarea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  Polygon,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  Award,
  Building2,
  Check,
  ChevronLeft,
  Droplets,
  Layers,
  Leaf,
  MapPin,
  Plus,
  ScrollText,
  Search,
  Sprout,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import useEnterpriseCertificateStore from "../../stores/useEnterpriseCertificateStore";
import usePersonnelStore from "../../stores/usePersonnelStore";
import { EnterpriseSelector } from "../cultivation-zone/cultivation-region/components";
import { CertificateSelector } from "./components/CertificateSelector";
import { ManagerSelector } from "./components/ManagerSelector";
import { PlotSelectorDialog } from "./components/PlotSelectorDialog";
import { SeedSelectorDialog } from "./components/SeedSelectorDialog";
import { useCultivationPlotForm } from "./hooks/useCultivationPlotForm";
import type {
  CultivationPlotPointWarning,
  Region,
  SubArea,
} from "./types/types";

const mapContainerStyle = { width: "100%", height: "100%" };

const markerIconConfig = (color: "blue" | "green" | "red") => ({
  url:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-" +
    color +
    ".png",
  scaledSize: new google.maps.Size(25, 41),
  anchor: new google.maps.Point(12, 41),
});

type LatLng = { lat: number; lng: number };

const centroidOf = (points: LatLng[]): LatLng => {
  const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
  return { lat, lng };
};

const MapPlottingMap = ({
  mapCenter,
  selectedRegion,
  selectedArea,
  effectiveAreaPlots,
  selectedPlotId,
  plotPoints,
  activePointIndex,
  pointWarnings,
  warning,
  handlePointDrag,
  setActivePointIndex,
}: {
  mapCenter: LatLng;
  selectedRegion: Region | null;
  selectedArea: SubArea;
  effectiveAreaPlots: { id: string; name: string; coordinates?: LatLng[] }[];
  selectedPlotId: string | undefined;
  plotPoints: LatLng[];
  activePointIndex: number | null;
  pointWarnings: Record<number, CultivationPlotPointWarning>;
  warning: CultivationPlotPointWarning | null | undefined;
  handlePointDrag: (index: number, latlng: LatLng, finalize?: boolean) => void;
  setActivePointIndex: (index: number) => void;
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    mapRef.current?.panTo(mapCenter);
  }, [mapCenter.lat, mapCenter.lng]);

  const customIcon = markerIconConfig("blue");
  const activeIcon = markerIconConfig("green");
  const invalidIcon = markerIconConfig("red");

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Đang tải bản đồ...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={17}
      options={{ mapTypeId: "satellite" }}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {selectedRegion?.coordinates && (
        <>
          <Polygon
            paths={selectedRegion.coordinates.map((coordinate) => ({
              lat: coordinate.lat,
              lng: coordinate.lng,
            }))}
            options={{
              strokeColor: "#f8fafc",
              strokeWeight: 1.5,
              fillColor: "#000000",
              fillOpacity: 0.1,
            }}
          />
          <InfoWindow
            position={centroidOf(
              selectedRegion.coordinates.map((coordinate) => ({
                lat: coordinate.lat,
                lng: coordinate.lng,
              })),
            )}
            options={{ disableAutoPan: true }}
          >
            <div className="text-[10px] font-bold text-slate-500">
              Vùng: {selectedRegion.name}
            </div>
          </InfoWindow>
        </>
      )}

      {selectedArea.coordinates && (
        <>
          <Polygon
            paths={selectedArea.coordinates.map((coordinate) => ({
              lat: coordinate.lat,
              lng: coordinate.lng,
            }))}
            options={{
              strokeColor: "#38bdf8",
              strokeWeight: 3,
              fillColor: "#0ea5e9",
              fillOpacity: 0.1,
            }}
          />
          <InfoWindow
            position={centroidOf(
              selectedArea.coordinates.map((coordinate) => ({
                lat: coordinate.lat,
                lng: coordinate.lng,
              })),
            )}
            options={{ disableAutoPan: true }}
          >
            <div className="text-[10px] font-bold text-slate-500">
              Khu vực: {selectedArea.name}
            </div>
          </InfoWindow>
        </>
      )}

      {effectiveAreaPlots
        .filter((plot) => plot.id !== selectedPlotId)
        .map((plot) => {
          const path = (plot.coordinates || []).map((coordinate) => ({
            lat: coordinate.lat,
            lng: coordinate.lng,
          }));
          if (path.length < 3) return null;
          return (
            <div key={plot.id}>
              <Polygon
                paths={path}
                options={{
                  strokeColor: "#ef4444",
                  strokeWeight: 2.5,
                  fillColor: "#f87171",
                  fillOpacity: 0.2,
                }}
              />
              <InfoWindow
                position={centroidOf(path)}
                options={{ disableAutoPan: true }}
              >
                <div className="text-[9px] font-black uppercase tracking-tighter">
                  {plot.name}
                </div>
              </InfoWindow>
            </div>
          );
        })}

      {plotPoints.length > 0 && (
        <Polygon
          paths={plotPoints.map((point) => ({ lat: point.lat, lng: point.lng }))}
          options={{
            strokeColor: "#3b82f6",
            strokeWeight: 3,
            fillColor: "#3b82f6",
            fillOpacity: 0.3,
          }}
        />
      )}

      {plotPoints.map((point, index) => (
        <Marker
          key={index}
          position={point}
          draggable
          title={`Điểm ${index + 1}`}
          icon={
            pointWarnings[index]
              ? invalidIcon
              : activePointIndex === index
                ? activeIcon
                : customIcon
          }
          zIndex={activePointIndex === index ? 1000 : undefined}
          onDrag={(event) => {
            if (!event.latLng) return;
            handlePointDrag(
              index,
              { lat: event.latLng.lat(), lng: event.latLng.lng() },
              false,
            );
          }}
          onDragEnd={(event) => {
            if (!event.latLng) return;
            handlePointDrag(
              index,
              { lat: event.latLng.lat(), lng: event.latLng.lng() },
              true,
            );
          }}
          onClick={() => setActivePointIndex(index)}
        />
      ))}

      {warning?.suggested && activePointIndex !== null && (
        <>
          <Polyline
            path={[
              { lat: warning.suggested.lat, lng: warning.suggested.lng },
              {
                lat: plotPoints[activePointIndex].lat,
                lng: plotPoints[activePointIndex].lng,
              },
            ]}
            options={{
              strokeColor: "#ef4444",
              strokeWeight: 1,
              icons: [
                {
                  icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 3 },
                  offset: "0",
                  repeat: "8px",
                },
              ],
            }}
          />
          <Marker
            position={warning.suggested}
            icon={activeIcon}
            opacity={0.6}
            title="Vị trí đề xuất (hợp lệ)"
          />
        </>
      )}
    </GoogleMap>
  );
};

const CultivationPlotCreatePage = () => {
  const {
    isEdit,
    farmingMethods,
    irrigationSystems,
    varieties,
    seeds,
    name,
    setName,
    note,
    setNote,
    selectedEnterpriseId,
    setSelectedEnterpriseId,
    selectedRegion,
    setSelectedRegion,
    setSelectedArea,
    selectedArea,
    selectedPlot,
    internalRegionId,
    setInternalRegionId,
    selectedCertIds,
    selectedManagerId,
    setSelectedManagerId,
    cropSearchTerm,
    setCropSearchTerm,
    plotPoints,
    setPlotPoints,
    mapCenter,
    activePointIndex,
    setActivePointIndex,
    pointWarnings,
    activeDragWarning,
    effectiveConfig,
    availableCrops,
    effectiveArea,
    calculatedArea,
    areaDialogOpen,
    setAreaDialogOpen,
    seedDialogOpen,
    setSeedDialogOpen,
    activeSeedVariety,
    handlePointDrag,
    handlePlotSelect,
    toggleCertificate,
    setConfigField,
    toggleCrop,
    handleSeedSelection,
    goBack,
    handleComplete,
  } = useCultivationPlotForm();
  const { standards } = useEnterpriseCertificateStore();
  const { personnel } = usePersonnelStore();

  const selectedManager = personnel.find(
    (item) => item.id.toString() === selectedManagerId,
  );

  const renderGeneralInfo = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <ScrollText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">Thông tin cơ bản</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Tên lô <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: Lô Sầu riêng Khu A"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1.5 h-10 border-slate-300 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                Đơn vị sở hữu <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1.5">
                <EnterpriseSelector
                  selectedId={selectedEnterpriseId}
                  onSelect={(value) => {
                    setSelectedEnterpriseId(value);
                    setSelectedRegion(null);
                    setSelectedArea(null);
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700">
                  Lô đất canh tác <span className="text-red-500">*</span>
                </Label>
                {selectedPlot && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-none"
                  >
                    Đã chọn
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                <Building2 size={10} className="text-slate-400" />
                <span
                  className={
                    selectedEnterpriseId ? "text-slate-700 font-medium" : ""
                  }
                >
                  DN
                </span>
                <span className="text-slate-300">›</span>
                <MapPin size={10} className="text-slate-400" />
                <span
                  className={selectedRegion ? "text-slate-700 font-medium" : ""}
                >
                  {selectedRegion?.name || "Vùng"}
                </span>
                <span className="text-slate-300">›</span>
                <Layers size={10} className="text-slate-400" />
                <span
                  className={selectedArea ? "text-slate-700 font-medium" : ""}
                >
                  {selectedArea?.name || "Khu vực"}
                </span>
                <span className="text-slate-300">›</span>
                <Layers size={10} className="text-slate-400" />
                <span className={selectedPlot ? "text-primary font-bold" : ""}>
                  {selectedPlot?.name || "Lô đất"}
                </span>
              </div>

              <div
                className={cn(
                  "group border rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer",
                  selectedPlot
                    ? "bg-white border-slate-200"
                    : "bg-slate-50 border-dashed border-slate-300",
                  !selectedEnterpriseId && "opacity-60 cursor-not-allowed",
                )}
                onClick={() => selectedEnterpriseId && setAreaDialogOpen(true)}
              >
                {selectedPlot ? (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 font-bold text-slate-900 truncate">
                      {selectedPlot.name}
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
                  <div className="py-3 text-center text-sm text-slate-400 group-hover:text-primary transition-colors">
                    {selectedEnterpriseId
                      ? "Nhấn để chọn lô canh tác"
                      : "Chọn đơn vị sở hữu trước"}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2 pt-2">
              <Label className="text-sm font-medium">Ghi chú</Label>
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Thông tin bổ sung..."
                className="min-h-[80px] border-slate-300 resize-none hover:border-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">
              Chứng nhận & Quản lý
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Giấy chứng nhận</Label>
              <CertificateSelector
                selectedIds={selectedCertIds}
                onToggle={toggleCertificate}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Nhân viên quản lý</Label>
              <ManagerSelector
                selectedId={selectedManagerId}
                onSelect={setSelectedManagerId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMapPlotting = () => {
    if (!selectedArea) {
      return (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            Vui lòng chọn khu vực ở bước 1
          </p>
        </div>
      );
    }

    const warning =
      activeDragWarning ||
      (activePointIndex !== null ? pointWarnings[activePointIndex] : null);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[550px]">
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border shadow-inner bg-slate-100">
            <MapPlottingMap
              mapCenter={mapCenter}
              selectedRegion={selectedRegion}
              selectedArea={selectedArea}
              effectiveAreaPlots={effectiveArea?.plots || []}
              selectedPlotId={selectedPlot?.id}
              plotPoints={plotPoints}
              activePointIndex={activePointIndex}
              pointWarnings={pointWarnings}
              warning={warning}
              handlePointDrag={handlePointDrag}
              setActivePointIndex={setActivePointIndex}
            />

            <div className="absolute top-4 right-4 z-400 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 pointer-events-none text-right">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Đang thiết lập
              </div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-primary" />
                {name || "Lô mới"}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-primary">
                <div className="w-1 h-1 rounded-full bg-primary" />
                Diện tích: {calculatedArea} ha
              </div>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto pr-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Định vị tọa độ
              </h3>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[10px]"
                onClick={() => {
                  const center =
                    plotPoints.length > 0
                      ? centroidOf(plotPoints)
                      : mapCenter;
                  setPlotPoints((previous) => [
                    ...previous,
                    { lat: center.lat + 0.0002, lng: center.lng + 0.0002 },
                  ]);
                }}
              >
                <Plus className="w-3 h-3 mr-1" /> Thêm điểm
              </Button>
            </div>

            <div className="space-y-2">
              {plotPoints.map((point, index) => (
                <div
                  key={index}
                  onClick={() => setActivePointIndex(index)}
                  className={cn(
                    "p-2.5 rounded-lg border-2 text-[11px] transition-all cursor-pointer bg-white",
                    pointWarnings[index]
                      ? "border-red-200 bg-red-50/30"
                      : activePointIndex === index
                        ? "border-primary"
                        : "border-slate-100",
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-400 uppercase">
                      Điểm {index + 1}
                    </span>
                    {plotPoints.length > 3 && (
                      <Trash2
                        className="w-3.5 h-3.5 text-slate-300 hover:text-red-500"
                        onClick={(event) => {
                          event.stopPropagation();
                          setPlotPoints((previous) =>
                            previous.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          );
                          setActivePointIndex(null);
                        }}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div className="bg-slate-50 p-1.5 rounded truncate">
                      Lat: {point.lat.toFixed(6)}
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded truncate">
                      Lng: {point.lng.toFixed(6)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {warning && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 space-y-2">
                <div className="text-[11px] font-bold text-red-700 flex items-center gap-1.5">
                  <X className="w-3 h-3" />
                  Vị trí không hợp lệ
                </div>
                <Button
                  className="w-full h-7 text-[10px] bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    if (
                      warning.suggested &&
                      (warning.index !== undefined || activePointIndex !== null)
                    ) {
                      handlePointDrag(
                        warning.index ?? activePointIndex!,
                        warning.suggested,
                        true,
                      );
                    }
                  }}
                >
                  Tự động điều chỉnh
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderConfiguration = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-3 border-b bg-linear-to-r from-green-50/50 to-white">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-green-600" />
              </div>
              <span>Phương pháp canh tác</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-sm">
                Loại hình canh tác <span className="text-red-500">*</span>
              </Label>
              <Select
                value={effectiveConfig.farmingMethodId}
                onValueChange={(value) =>
                  setConfigField("farmingMethodId", value)
                }
              >
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="Chọn phương pháp..." />
                </SelectTrigger>
                <SelectContent>
                  {farmingMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Hệ thống tưới tiêu <span className="text-red-500">*</span>
              </Label>
              <Select
                value={effectiveConfig.irrigationMethodId}
                onValueChange={(value) =>
                  setConfigField("irrigationMethodId", value)
                }
              >
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue placeholder="Chọn phương pháp tưới..." />
                </SelectTrigger>
                <SelectContent>
                  {irrigationSystems.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span>{method.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white flex flex-col h-[420px]">
          <CardHeader className="pb-3 border-b bg-linear-to-r from-emerald-50/50 to-white">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-emerald-600" />
              </div>
              <span>Giống cây trồng</span>
              {effectiveConfig.farmingMethodId && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {availableCrops.length} loại
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col min-h-0">
            {!effectiveConfig.farmingMethodId ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">
                Hãy chọn phương pháp ở trên
              </div>
            ) : (
              <>
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    value={cropSearchTerm}
                    onChange={(event) => setCropSearchTerm(event.target.value)}
                    placeholder="Tìm kiếm giống cây trồng..."
                    className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg"
                  />
                </div>
                <ScrollArea className="flex-1 pr-2">
                  <div className="space-y-1.5">
                    {availableCrops.map((crop) => {
                      const isSelected =
                        effectiveConfig.selectedCrops?.includes(crop.id);
                      const selectedSeeds =
                        effectiveConfig.seedSelections?.[crop.id] || [];

                      return (
                        <div
                          key={crop.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                            isSelected
                              ? "bg-green-50 border-green-300 shadow-sm"
                              : "bg-white border-slate-200 hover:border-green-200 hover:shadow-sm",
                          )}
                          onClick={() => toggleCrop(crop)}
                        >
                          <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            {crop.illustration ? (
                              <img
                                src={crop.illustration as string}
                                alt={crop.varietyName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Leaf className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col flex-1 shrink min-w-0">
                            <div
                              className={cn(
                                "text-sm shrink font-semibold truncate",
                                isSelected
                                  ? "text-green-900"
                                  : "text-slate-700",
                              )}
                            >
                              {crop.varietyName}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 shrink">
                              {crop.crop}
                            </div>
                            {isSelected && selectedSeeds.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1.5 min-w-0">
                                {selectedSeeds.map((seedId) => {
                                  const seed = seeds.find(
                                    (item) => item.id === seedId,
                                  );
                                  if (!seed) return null;
                                  return (
                                    <Badge
                                      key={seedId}
                                      variant="secondary"
                                      className="whitespace-normal wrap-break-word h-auto py-0.5 leading-tight bg-primary/5 text-primary border-primary/20 text-[10px] px-1.5 font-semibold max-w-full"
                                    >
                                      Hạt giống: {seed.varietyName}
                                    </Badge>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                              isSelected
                                ? "bg-green-500 border-green-500"
                                : "border-slate-300",
                            )}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <SeedSelectorDialog
        isOpen={seedDialogOpen}
        variety={activeSeedVariety}
        selectedSeedIds={
          activeSeedVariety
            ? effectiveConfig.seedSelections?.[activeSeedVariety.id] || []
            : []
        }
        onSelect={handleSeedSelection}
        onOpenChange={setSeedDialogOpen}
      />
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-md overflow-hidden bg-white">
          <CardHeader className="bg-slate-50 py-3 border-b text-sm font-bold">
            Xác nhận thông tin
          </CardHeader>
          <CardContent className="pt-5 space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-400">Tên lô:</span>
              <span className="font-bold">{name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-400">Vùng trồng:</span>
              <span className="font-bold">{selectedRegion?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-400">Khu vực:</span>
              <span className="font-bold">{selectedArea?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-400">Quản lý:</span>
              <span className="font-bold">
                {selectedManager?.fullName || "Chưa gán"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedCertIds.map((id) => (
                <Badge key={id} variant="secondary" className="text-[10px]">
                  {standards.find((item) => item.code === id)?.name || id}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white">
          <CardHeader className="bg-slate-50 py-3 border-b text-sm font-bold">
            Kỹ thuật & Cây trồng
          </CardHeader>
          <CardContent className="pt-5 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm font-medium">
                {farmingMethods.find(
                  (item) => item.id === effectiveConfig.farmingMethodId,
                )?.name || "Chưa chọn"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm font-medium">
                {irrigationSystems.find(
                  (item) => item.id === effectiveConfig.irrigationMethodId,
                )?.name || "Chưa chọn"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {(effectiveConfig.selectedCrops || []).map((cropId) => (
                <Badge key={cropId} variant="outline" className="text-[10px]">
                  {varieties.find((item) => item.id === cropId)?.varietyName}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const steps = [
    {
      id: "step-1",
      title: "Thông tin chung",
      description: "Tên và vị trí khu vực",
      isValid: !!name && !!selectedEnterpriseId && !!selectedArea,
      content: renderGeneralInfo(),
    },
    {
      id: "step-2",
      title: "Bản đồ & Tọa độ",
      description: "Xác định ranh giới lô",
      isValid:
        plotPoints.length >= 3 && Object.keys(pointWarnings).length === 0,
      content: renderMapPlotting(),
    },
    {
      id: "step-3",
      title: "Cấu hình canh tác",
      description: "Phương pháp và cây trồng",
      isValid:
        !!effectiveConfig.farmingMethodId &&
        !!effectiveConfig.irrigationMethodId &&
        effectiveConfig.selectedCrops.length > 0,
      content: renderConfiguration(),
    },
    {
      id: "step-4",
      title: "Xác nhận & Lưu",
      description: "Kiểm tra lại thông tin",
      isValid: true,
      content: renderConfirmation(),
    },
  ];

  return (
    <PageWrapper
      title={isEdit ? "Chỉnh sửa lô" : "Thiết lập lô"}
      description="Quy trình khởi tạo và cấu hình canh tác theo Khu vực (Lô)"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="gap-2 text-muted-foreground hover:text-primary pl-0"
        >
          <ChevronLeft className="w-4 h-4" /> Quay lại
        </Button>
      </div>

      <Card className="max-w-6xl mx-auto border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 md:p-8">
            <StepperForm
              steps={steps}
              completeLabel={isEdit ? "Lưu thay đổi lô" : "Lưu thông tin Lô"}
              onComplete={handleComplete}
              onCancel={goBack}
            />
          </div>
        </CardContent>
      </Card>

      <PlotSelectorDialog
        open={areaDialogOpen}
        onOpenChange={setAreaDialogOpen}
        onSelect={handlePlotSelect}
        enterpriseId={selectedEnterpriseId}
        selectedRegionId={internalRegionId}
        selectedAreaId={selectedArea?.id.toString() || ""}
        selectedPlotId={selectedPlot?.id || ""}
        onRegionChange={setInternalRegionId}
      />
    </PageWrapper>
  );
};

export default CultivationPlotCreatePage;
