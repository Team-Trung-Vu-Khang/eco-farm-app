import {
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
} from "@tankhang1/eco-shared-ui";
import "leaflet/dist/leaflet.css";
import { Calendar, MapPin, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { Link } from "wouter";
import useRegionStore from "../../../../stores/useRegionStore";
import { type Plant } from "../../../region-chart/constants";

interface PlantIdentificationFormProps {
  initialData?: Partial<Plant>;
  onSubmit: (data: Omit<Plant, "id"> | Plant) => void;
}

// Map Event component to handle clicking on the map to set coordinate
const LocationPicker = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to recenter map when coordinates change manually
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

const PlantIdentificationForm = ({
  initialData,
  onSubmit,
}: PlantIdentificationFormProps) => {
  const { regions } = useRegionStore();

  const [formData, setFormData] = useState<Partial<Plant>>({
    code: "",
    name: "",
    type: "Cây ăn trái",
    status: "healthy",
    height: "",
    age: "",
    canopy: "",
    rootSpread: "",
    plantedDate: new Date().toISOString().split("T")[0],
    coordinate: { lat: 11.548, lng: 106.896 },
    plotId: "",
    ...initialData,
  });

  const [selectedRegionId, setSelectedRegionId] = useState<number | "">("");
  const [selectedAreaId, setSelectedAreaId] = useState<string | "">("");

  // Populate selections if initialData exists
  useEffect(() => {
    if (initialData?.plotId) {
      const regionStore = useRegionStore.getState();
      const plotContext = regionStore.getPlotById(initialData.plotId);
      if (plotContext) {
        setSelectedRegionId(plotContext.region.id);
        setSelectedAreaId(plotContext.area.id);
      }
    }
  }, [initialData]);

  const handleChange = (field: keyof Plant, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const currentRegion = regions.find((r) => r.id === selectedRegionId);
  const currentArea = currentRegion?.subAreas?.find(
    (a) => String(a.id) === String(selectedAreaId),
  );
  const currentPlot = currentArea?.plots?.find(
    (p) => String(p.id) === String(formData.plotId),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-sm font-semibold">
                Thông tin chung
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã định danh</Label>
                <Input
                  id="code"
                  placeholder="VD: PL-001"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên / Loại cây</Label>
                <Input
                  id="name"
                  placeholder="VD: Sầu riêng Dona"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Phân loại</Label>
                <Input
                  id="type"
                  placeholder="VD: Cây ăn trái"
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => handleChange("status", val)}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthy">Khỏe mạnh</SelectItem>
                    <SelectItem value="warning">Cần chú ý</SelectItem>
                    <SelectItem value="critical">Nguy kịch</SelectItem>
                    <SelectItem value="removed">Đã loại bỏ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-sm font-semibold">
                Thông số sinh trưởng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Chiều cao (m)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    placeholder="VD: 2.5"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Độ tuổi</Label>
                  <Input
                    id="age"
                    placeholder="VD: 3 năm"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="canopy">Độ rộng tán (m)</Label>
                  <Input
                    id="canopy"
                    type="number"
                    step="0.1"
                    placeholder="VD: 1.8"
                    value={formData.canopy}
                    onChange={(e) => handleChange("canopy", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rootSpread">Phạm vi rễ (m)</Label>
                  <Input
                    id="rootSpread"
                    type="number"
                    step="0.1"
                    placeholder="VD: 1.2"
                    value={formData.rootSpread}
                    onChange={(e) => handleChange("rootSpread", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plantedDate">Ngày trồng</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="plantedDate"
                    type="date"
                    className="pl-10"
                    value={formData.plantedDate}
                    onChange={(e) =>
                      handleChange("plantedDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Geography & Map */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-sm font-semibold">
                Vị trí địa lý
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Vùng trồng</Label>
                  <Select
                    value={String(selectedRegionId)}
                    onValueChange={(val) => {
                      const regionId = val ? parseInt(val) : "";
                      setSelectedRegionId(regionId);
                      setSelectedAreaId("");
                      handleChange("plotId", "");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn vùng" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Khu vực</Label>
                  <Select
                    value={String(selectedAreaId)}
                    onValueChange={(val) => {
                      setSelectedAreaId(val);
                      handleChange("plotId", "");
                    }}
                    disabled={!selectedRegionId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn khu vực" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentRegion?.subAreas?.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lô trồng</Label>
                  <Select
                    value={String(formData.plotId)}
                    onValueChange={(val) => handleChange("plotId", val)}
                    disabled={!selectedAreaId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn lô" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentArea?.plots?.map((p: any) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex justify-between items-center">
                  <span>Vị trí trên bản đồ</span>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Lat:
                      </span>
                      <input
                        type="number"
                        step="0.000001"
                        className="w-24 h-6 px-1 text-[10px] font-mono border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-primary/30"
                        value={formData.coordinate?.lat || ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            handleChange("coordinate", {
                              ...formData.coordinate,
                              lat: val,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Lng:
                      </span>
                      <input
                        type="number"
                        step="0.000001"
                        className="w-24 h-6 px-1 text-[10px] font-mono border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-primary/30"
                        value={formData.coordinate?.lng || ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            handleChange("coordinate", {
                              ...formData.coordinate,
                              lng: val,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </Label>
                <div className="h-80 rounded-xl overflow-hidden border border-slate-100 relative z-0">
                  <MapContainer
                    center={
                      formData.coordinate
                        ? [formData.coordinate.lat, formData.coordinate.lng]
                        : [11.548, 106.896]
                    }
                    zoom={17}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      attribution="Esri"
                    />

                    {currentRegion?.coordinates && (
                      <Polygon
                        positions={currentRegion.coordinates.map((c: any) => [
                          c.lat,
                          c.lng,
                        ])}
                        pathOptions={{
                          color: "#3b82f6",
                          weight: 1,
                          fillOpacity: 0.05,
                        }}
                      />
                    )}

                    {currentArea?.coordinates && (
                      <Polygon
                        positions={currentArea.coordinates.map((c: any) => [
                          c.lat,
                          c.lng,
                        ])}
                        pathOptions={{
                          color: "#10b981",
                          weight: 1,
                          fillOpacity: 0.1,
                        }}
                      />
                    )}

                    {currentPlot?.coordinates && (
                      <Polygon
                        positions={currentPlot.coordinates.map((c: any) => [
                          c.lat,
                          c.lng,
                        ])}
                        pathOptions={{
                          color: "#f59e0b",
                          weight: 2,
                          fillOpacity: 0.2,
                        }}
                      />
                    )}

                    {formData.coordinate && (
                      <Marker
                        position={[
                          formData.coordinate.lat,
                          formData.coordinate.lng,
                        ]}
                        draggable={true}
                        eventHandlers={{
                          dragend: (e) => {
                            const marker = e.target;
                            const position = marker.getLatLng();
                            handleChange("coordinate", {
                              lat: position.lat,
                              lng: position.lng,
                            });
                          },
                        }}
                      />
                    )}

                    <LocationPicker
                      onLocationSelect={(lat, lng) =>
                        handleChange("coordinate", { lat, lng })
                      }
                    />
                    {formData.coordinate && (
                      <RecenterMap
                        lat={formData.coordinate.lat}
                        lng={formData.coordinate.lng}
                      />
                    )}
                  </MapContainer>
                  <div className="absolute bottom-4 left-4 z-1000 bg-white/90 backdrop-blur shadow-sm border border-slate-100 px-3 py-1.5 rounded-lg text-[11px] text-slate-500 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-primary" />
                    Bấm vào bản đồ hoặc kéo marker để chọn vị trí
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 mt-4">
            <Link href="/plant-identification">
              <Button variant="outline" type="button">
                <X className="w-4 h-4 mr-2" />
                Hủy bỏ
              </Button>
            </Link>
            <Button type="submit" className="px-8">
              <Save className="w-4 h-4 mr-2" />
              Lưu thông tin
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlantIdentificationForm;
