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
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";
import { EnterpriseSelector } from "../cultivation-zone/cultivation-region/components";
import { MapController } from "../region-chart/components/DraggableRectangle";
import { CertificateSelector } from "./components/CertificateSelector";
import { ManagerSelector } from "./components/ManagerSelector";
import { SeedSelectorDialog } from "./components/SeedSelectorDialog";
import { SubAreaSelectorDialog } from "./components/SubAreaSelectorDialog";
import { useCultivationAreaForm } from "./hooks/useCultivationAreaForm";
import useEnterpriseCertificateStore from "../../stores/useEnterpriseCertificateStore";
import usePersonnelStore from "../../stores/usePersonnelStore";
import useVarietyStore from "../../stores/useVarietyStore";

const customIcon = getMarkerIcon("blue");
const activeIcon = getMarkerIcon("green");
const invalidIcon = getMarkerIcon("red");

const CultivationAreaCreatePage = () => {
  const {
    isEdit,
    farmingMethods,
    irrigationSystems,
    seeds,
    name,
    setName,
    note,
    setNote,
    selectedEnterpriseId,
    setSelectedEnterpriseId,
    selectedRegion,
    setSelectedRegion,
    selectedArea,
    selectedCertIds,
    selectedManagerId,
    setSelectedManagerId,
    cropSearchTerm,
    setCropSearchTerm,
    areaPoints,
    setAreaPoints,
    mapCenter,
    activePointIndex,
    setActivePointIndex,
    pointWarnings,
    activeDragWarning,
    effectiveConfig,
    availableCrops,
    effectiveRegion,
    areaSelectorOpen,
    setAreaSelectorOpen,
    seedDialogOpen,
    setSeedDialogOpen,
    activeSeedVariety,
    handlePointDrag,
    handleAreaSelect,
    setConfigField,
    toggleCertificate,
    toggleCrop,
    handleSeedSelection,
    goBack,
    handleComplete,
  } = useCultivationAreaForm();

  const { standards } = useEnterpriseCertificateStore();
  const { personnel } = usePersonnelStore();
  const { varieties } = useVarietyStore();

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
                Tên khu vực canh tác <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: Khu vực canh tác Sầu riêng Bình Phước"
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
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700">
                  Khu vực canh tác <span className="text-red-500">*</span>
                </Label>
                {selectedArea && (
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
                <span className={selectedArea ? "text-primary font-bold" : ""}>
                  {selectedArea?.name || "Khu vực"}
                </span>
              </div>

              <div
                className={cn(
                  "group border rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer",
                  selectedArea
                    ? "bg-white border-slate-200"
                    : "bg-slate-50 border-dashed border-slate-300",
                  !selectedEnterpriseId && "opacity-60 cursor-not-allowed",
                )}
                onClick={() =>
                  selectedEnterpriseId && setAreaSelectorOpen(true)
                }
              >
                {selectedArea ? (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 font-bold text-slate-900 truncate">
                      {selectedArea.name}
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
                      ? "Nhấn để chọn khu vực canh tác"
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
                placeholder="Nhập thông tin ghi chú thêm..."
                className="min-h-20 border-slate-300 resize-none hover:border-slate-400 focus:border-primary"
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
              <Label className="text-sm font-medium">
                Giấy chứng nhận / Tiêu chuẩn
              </Label>
              <CertificateSelector
                selectedIds={selectedCertIds}
                onToggle={toggleCertificate}
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

            {selectedRegion?.cropVarieties?.length ? (
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-3 text-sm text-green-800 animate-in fade-in slide-in-from-top-2">
                <div className="bg-green-100 p-1.5 rounded-full h-fit">
                  <Sprout className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold mb-1">
                    Cây trồng chủ lực của vùng
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRegion.cropVarieties.map((crop) => (
                      <Badge
                        key={crop.id}
                        variant="outline"
                        className="bg-white text-green-700 border-green-200"
                      >
                        {crop.name} - {crop.variety}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMapPlotting = () => {
    if (!selectedRegion) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
          <MapPin className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            Vui lòng chọn khu vực canh tác ở bước 1
          </p>
        </div>
      );
    }

    const warning =
      activeDragWarning ||
      (activePointIndex !== null ? pointWarnings[activePointIndex] : null);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border shadow-inner bg-slate-100">
            <MapContainer
              center={mapCenter}
              zoom={15}
              className="h-full w-full"
            >
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
              <MapController center={mapCenter} />

              {selectedRegion.coordinates && (
                <Polygon
                  positions={selectedRegion.coordinates.map((coordinate) => [
                    coordinate.lat,
                    coordinate.lng,
                  ])}
                  pathOptions={{
                    color: "#64748b",
                    weight: 2,
                    dashArray: "5, 10",
                    fillColor: "#f1f5f9",
                    fillOpacity: 0.05,
                  }}
                >
                  <Tooltip
                    permanent
                    direction="top"
                    className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm text-[10px] font-bold text-slate-500 rounded-lg px-2 py-1"
                  >
                    Vùng: {selectedRegion.name}
                  </Tooltip>
                </Polygon>
              )}

              {(effectiveRegion?.subAreas || [])
                .filter((area) => area.id !== selectedArea?.id)
                .map((area) => (
                  <Polygon
                    key={area.id}
                    positions={(area.coordinates || []).map((coordinate) => [
                      coordinate.lat,
                      coordinate.lng,
                    ])}
                    pathOptions={{
                      color: "#f97316",
                      weight: 2,
                      dashArray: "4, 4",
                      fillColor: "#fb923c",
                      fillOpacity: 0.1,
                    }}
                  >
                    <Tooltip
                      permanent
                      direction="center"
                      className="bg-orange-900 border-none shadow-xl text-[9px] font-black text-white px-2 py-0.5 rounded uppercase tracking-tighter"
                    >
                      {area.name}
                    </Tooltip>
                  </Polygon>
                ))}

              {areaPoints.length > 0 && (
                <Polygon
                  positions={areaPoints.map((pointItem) => [
                    pointItem.lat,
                    pointItem.lng,
                  ])}
                  pathOptions={{
                    color: "#22c55e",
                    weight: 4,
                    fillColor: "#22c55e",
                    fillOpacity: 0.35,
                  }}
                />
              )}

              {areaPoints.map((pointItem, index) => (
                <Marker
                  key={index}
                  position={pointItem}
                  draggable
                  icon={
                    pointWarnings[index]
                      ? invalidIcon
                      : activePointIndex === index
                        ? activeIcon
                        : customIcon
                  }
                  zIndexOffset={activePointIndex === index ? 1000 : 0}
                  eventHandlers={{
                    drag: (event) =>
                      handlePointDrag(index, event.target.getLatLng(), false),
                    dragend: (event) =>
                      handlePointDrag(index, event.target.getLatLng(), true),
                    click: () => setActivePointIndex(index),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]}>
                    Điểm {index + 1}
                  </Tooltip>
                </Marker>
              ))}

              {warning?.suggested && activePointIndex !== null && (
                <>
                  <Polyline
                    positions={[
                      [warning.suggested.lat, warning.suggested.lng],
                      [
                        areaPoints[activePointIndex].lat,
                        areaPoints[activePointIndex].lng,
                      ],
                    ]}
                    pathOptions={{
                      color: "#ef4444",
                      weight: 1,
                      dashArray: "4, 4",
                    }}
                  />
                  <Marker
                    position={warning.suggested}
                    icon={activeIcon}
                    opacity={0.6}
                  >
                    <Tooltip>Vị trí đề xuất (hợp lệ)</Tooltip>
                  </Marker>
                </>
              )}
            </MapContainer>

            <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 pointer-events-none text-right">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Đang thiết lập
              </div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {name || "Khu vực mới"}
              </div>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto pr-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Tọa độ ranh giới
              </h3>
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-lg"
                onClick={() => {
                  const bounds = L.latLngBounds(areaPoints);
                  const center = bounds.isValid()
                    ? bounds.getCenter()
                    : mapCenter;
                  setAreaPoints((previous) => [
                    ...previous,
                    L.latLng(center.lat + 0.001, center.lng + 0.001),
                  ]);
                }}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Thêm điểm
              </Button>
            </div>

            <div className="space-y-2">
              {areaPoints.map((pointItem, index) => (
                <div
                  key={index}
                  onClick={() => setActivePointIndex(index)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all cursor-pointer bg-white group",
                    activePointIndex === index
                      ? "border-primary shadow-md"
                      : "border-slate-100 hover:border-slate-200",
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      Điểm {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-slate-300 hover:text-red-500 rounded-lg"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (areaPoints.length <= 3) return;
                        setAreaPoints((previous) =>
                          previous.filter(
                            (_, itemIndex) => itemIndex !== index,
                          ),
                        );
                        setActivePointIndex(null);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[9px] text-slate-400">
                        Vĩ độ (Lat)
                      </Label>
                      <Input
                        value={pointItem.lat.toFixed(6)}
                        readOnly
                        className="h-8 text-xs bg-slate-50 border-none pointer-events-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] text-slate-400">
                        Kinh độ (Lng)
                      </Label>
                      <Input
                        value={pointItem.lng.toFixed(6)}
                        readOnly
                        className="h-8 text-xs bg-slate-50 border-none pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {warning && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-3 text-red-700">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <X className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Vị trí không hợp lệ</div>
                    <p className="text-xs opacity-80">
                      {warning.type === "outside"
                        ? "Điểm nằm ngoài ranh giới vùng trồng."
                        : "Điểm chồng lấn với khu vực khác."}
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full mt-3 h-8 bg-red-600 hover:bg-red-700 text-xs"
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
                  Khắc phục tự động
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
      <div className="grid grid-cols-1 gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                  <Label className="text-sm font-medium">
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
                          <span className="font-medium">{method.name}</span>
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
                  <div className="py-8 text-center text-slate-400 text-sm">
                    Chọn loại hình canh tác để xem danh sách cây trồng
                  </div>
                ) : (
                  <>
                    <div className="mb-4 relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                      <Input
                        value={cropSearchTerm}
                        onChange={(event) =>
                          setCropSearchTerm(event.target.value)
                        }
                        placeholder="Tìm kiếm giống cây trồng..."
                        className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg"
                      />
                    </div>
                    <ScrollArea className="flex-1 overflow-y-auto">
                      <div className="space-y-2 pr-2">
                        {availableCrops.map((crop) => {
                          const isSelected =
                            effectiveConfig.selectedCrops?.includes(crop.id);
                          const selectedSeeds =
                            effectiveConfig.seedSelections?.[crop.id] || [];

                          return (
                            <div
                              key={crop.id}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer group",
                                isSelected
                                  ? "bg-green-50 border-green-300 shadow-sm"
                                  : "bg-white border-slate-100 hover:border-green-200 hover:shadow-sm",
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
                                <div className="text-[10px] text-muted-foreground mt-0.5 shrink">
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
                        {availableCrops.length === 0 && (
                          <div className="text-center py-8 text-sm text-slate-400">
                            Không tìm thấy cây trồng phù hợp
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Card className="border-none shadow-md bg-white">
        <CardHeader className="pb-3 border-b bg-linear-to-r from-primary/5 to-white">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            Thông tin chung
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Tên khu vực canh tác
              </p>
              <p className="font-bold text-slate-800">{name || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Vùng trồng
              </p>
              <p className="font-bold text-slate-800">
                {selectedRegion?.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Quản lý
              </p>
              <p className="font-bold text-slate-800">
                {selectedManager?.fullName || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Chứng nhận
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedCertIds.length > 0
                  ? selectedCertIds.map((id) => (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="text-[10px] bg-blue-50 text-blue-700"
                      >
                        {standards.find((item) => item.code === id)?.name || id}
                      </Badge>
                    ))
                  : "—"}
              </div>
            </div>
          </div>
          {note && (
            <div className="bg-yellow-50/50 border border-yellow-200/60 p-3 rounded-lg text-sm text-yellow-800">
              <span className="font-semibold mr-1">Ghi chú:</span> {note}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-white">
        <CardHeader className="pb-3 border-b bg-linear-to-r from-green-50/50 to-white">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-green-600" />
            </div>
            Cấu hình canh tác
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Phương pháp canh tác
              </p>
              <p className="font-bold text-slate-800">
                {farmingMethods.find(
                  (item) => item.id === effectiveConfig.farmingMethodId,
                )?.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Hệ thống tưới
              </p>
              <p className="font-bold text-slate-800">
                {irrigationSystems.find(
                  (item) => item.id === effectiveConfig.irrigationMethodId,
                )?.name || "—"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">
              Cây trồng đã chọn
            </p>
            <div className="space-y-2">
              {effectiveConfig.selectedCrops?.length ? (
                effectiveConfig.selectedCrops.map((cropId) => {
                  const crop = varieties.find((item) => item.id === cropId);
                  return (
                    <div
                      key={cropId}
                      className="flex items-center gap-3 flex-wrap"
                    >
                      <span className="font-bold text-slate-800">
                        {crop?.varietyName || cropId}
                      </span>
                      {effectiveConfig.seedSelections?.[cropId]?.length ? (
                        <div className="flex flex-wrap gap-1 items-center ml-4 sm:ml-0">
                          <span className="text-xs text-muted-foreground italic mr-1">
                            Hạt giống:
                          </span>
                          {effectiveConfig.seedSelections[cropId].map(
                            (seedId) => (
                              <Badge
                                key={seedId}
                                variant="secondary"
                                className="text-[10px] bg-slate-100"
                              >
                                {
                                  seeds.find((item) => item.id === seedId)
                                    ?.varietyName
                                }
                              </Badge>
                            ),
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <span className="text-red-500 italic text-sm">
                  Chưa chọn cây trồng
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const steps = [
    { id: "step-1", title: "Thông tin chung", content: renderGeneralInfo() },
    { id: "step-2", title: "Bản đồ ranh giới", content: renderMapPlotting() },
    {
      id: "step-3",
      title: "Cấu hình canh tác",
      content: renderConfiguration(),
    },
    { id: "step-4", title: "Xác nhận & Lưu", content: renderConfirmation() },
  ];

  return (
    <AdminLayout
      isDev={true}
      title={
        isEdit ? "Chỉnh sửa khu vực canh tác" : "Thiết lập khu vực canh tác"
      }
      description="Quy trình khởi tạo và cấu hình canh tác cho khu vực cụ thể"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
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
              completeLabel={
                isEdit
                  ? "Lưu thay đổi khu vực canh tác"
                  : "Khởi tạo Khu vực canh tác"
              }
              onComplete={handleComplete}
              onCancel={goBack}
            />
          </div>
        </CardContent>
      </Card>

      <SubAreaSelectorDialog
        open={areaSelectorOpen}
        onOpenChange={setAreaSelectorOpen}
        onSelect={handleAreaSelect}
        enterpriseId={selectedEnterpriseId}
        selectedRegionId={selectedRegion?.id.toString() || ""}
        selectedAreaId={selectedArea?.id || ""}
        onRegionChange={() => setSelectedRegion(null)}
      />
    </AdminLayout>
  );
};

export default CultivationAreaCreatePage;
