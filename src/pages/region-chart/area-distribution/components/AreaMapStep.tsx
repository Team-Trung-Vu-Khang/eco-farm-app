import { useAreas } from "@/features/farm/hooks/useAreas";
import { useRegionById, useRegions } from "@/features/farm/hooks/useRegions";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import * as turf from "@turf/turf";
import L from "leaflet";
import { GoogleMap, InfoWindow, Marker, Polygon, useJsApiLoader } from "@react-google-maps/api";
import { Maximize2, Plus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import readXlsxFile from "read-excel-file";
import { getBoundsFromPoints } from "../utils/map";
import { getMarkerIcon as getGoogleMarkerIcon } from "@/pages/animal-husbandry-zone/animal-husbandry-region/components/mapUtils";

const mapContainerStyle = { width: "100%", height: "100%" };

interface AreaMapStepProps {
  markerIcon?: unknown;
}

const DEFAULT_POINTS = [
  L.latLng(11.53, 106.88),
  L.latLng(11.55, 106.88),
  L.latLng(11.55, 106.91),
  L.latLng(11.53, 106.91),
];

const isSegmentsIntersecting = (
  p1: L.LatLng,
  q1: L.LatLng,
  p2: L.LatLng,
  q2: L.LatLng,
) => {
  if (p1.equals(p2) || p1.equals(q2) || q1.equals(p2) || q1.equals(q2)) {
    return false;
  }
  const ccw = (A: L.LatLng, B: L.LatLng, C: L.LatLng) => {
    return (
      (C.lat - A.lat) * (B.lng - A.lng) > (B.lat - A.lat) * (C.lng - A.lng)
    );
  };
  return (
    ccw(p1, p2, q2) !== ccw(q1, p2, q2) && ccw(p1, q1, p2) !== ccw(p1, q1, q2)
  );
};

const isSelfIntersecting = (points: L.LatLng[]) => {
  const n = points.length;
  if (n < 4) return false;
  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const q1 = points[(i + 1) % n];
    for (let j = i + 2; j < n; j++) {
      if ((j + 1) % n === i) continue;
      const p2 = points[j];
      const q2 = points[(j + 1) % n];
      if (isSegmentsIntersecting(p1, q1, p2, q2)) {
        return true;
      }
    }
  }
  return false;
};

const useFitBoundsOnce = (
  mapRef: React.MutableRefObject<google.maps.Map | null>,
  isLoaded: boolean,
  points: L.LatLng[],
  regionPoints: L.LatLng[],
  regionCenter: L.LatLng | null | undefined,
  fitTrigger: number | undefined,
) => {
  const hasFitRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const map = mapRef.current;

    if (points.length > 0 && !hasFitRef.current) {
      const bounds = new google.maps.LatLngBounds();
      points.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(bounds, 40);
      hasFitRef.current = true;
    } else if (regionPoints.length > 0 && !hasFitRef.current) {
      const bounds = new google.maps.LatLngBounds();
      regionPoints.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(bounds, 40);
      hasFitRef.current = true;
    } else if (regionCenter && !hasFitRef.current) {
      // Region has no drawn boundary (e.g. created via the basic flow),
      // fall back to its center point so step 2 still follows it.
      map.setCenter({ lat: regionCenter.lat, lng: regionCenter.lng });
      map.setZoom(15);
      hasFitRef.current = true;
    }
  }, [isLoaded, points, regionPoints, regionCenter]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    if (points.length > 0 && fitTrigger) {
      const bounds = new google.maps.LatLngBounds();
      points.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
      mapRef.current.fitBounds(bounds, 40);
    }
  }, [isLoaded, fitTrigger, points]);
};

interface MapLayoutProps {
  center: L.LatLng;
  areaPoints: L.LatLng[];
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
  handleMapClick: (latlng: L.LatLng) => void;
  handlePointDrag: (index: number, latlng: L.LatLng) => void;
  removePoint: (index: number) => void;
  handlePointInputChange: (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => void;
  handleAddPoint: () => void;
  handleImportExcel: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownloadSampleExcel: () => void;
  mapFitTrigger: number;
  handlePointDragEnd: () => void;
  justChanged: boolean;
  regionPoints: L.LatLng[];
  regionCenter: L.LatLng | null;
  otherAreas: Array<{ id: number; name: string; points: L.LatLng[] }>;
  selectedRegion: any;
  boundaryWarning: string | null;
}

const MapLayout = ({
  center,
  areaPoints,
  isFullscreen,
  setIsFullscreen,
  handleMapClick,
  handlePointDrag,
  removePoint,
  handlePointInputChange,
  handleAddPoint,
  handleImportExcel,
  handleDownloadSampleExcel,
  mapFitTrigger,
  handlePointDragEnd,
  justChanged,
  regionPoints,
  regionCenter,
  otherAreas,
  selectedRegion,
  boundaryWarning,
}: MapLayoutProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });

  useFitBoundsOnce(
    mapRef,
    isLoaded,
    areaPoints,
    regionPoints,
    regionCenter,
    mapFitTrigger,
  );

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const frame = window.requestAnimationFrame(() =>
      google.maps.event.trigger(map, "resize"),
    );
    const timer = window.setTimeout(
      () => google.maps.event.trigger(map, "resize"),
      200,
    );
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [isLoaded]);

  const areaMarkerIcon = useMemo(() => getGoogleMarkerIcon("blue"), []);
  const [hoveredPolygon, setHoveredPolygon] = useState<string | null>(null);

  const centroidOf = (points: L.LatLng[]) => {
    if (points.length === 0) return { lat: 0, lng: 0 };
    const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
    const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
    return { lat, lng };
  };

  return (
    <div className="grid h-full w-full flex-1 gap-4 overflow-y-auto p-4 md:grid-cols-[minmax(0,1fr)_300px] md:overflow-hidden">
      <div className="relative z-0 h-96 min-h-96 min-w-0 overflow-hidden rounded-lg border md:h-full">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: center.lat, lng: center.lng }}
            zoom={14}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            onClick={(e) => {
              if (!e.latLng) return;
              handleMapClick(L.latLng(e.latLng.lat(), e.latLng.lng()));
            }}
          >
            {/* Draw region polygon (green dashed border) */}
            {regionPoints && regionPoints.length >= 3 && (
              <>
                <Polygon
                  paths={regionPoints}
                  options={{
                    strokeColor: "#10b981",
                    fillColor: "transparent",
                    strokeWeight: 3,
                  }}
                  onMouseOver={() => setHoveredPolygon("region")}
                  onMouseOut={() =>
                    setHoveredPolygon((current) =>
                      current === "region" ? null : current,
                    )
                  }
                />
                {hoveredPolygon === "region" && (
                  <InfoWindow
                    position={centroidOf(regionPoints)}
                    options={{ disableAutoPan: true }}
                    onCloseClick={() => setHoveredPolygon(null)}
                  >
                    <div className="text-xs">
                      Vùng trồng: {selectedRegion?.name}
                    </div>
                  </InfoWindow>
                )}
              </>
            )}

            {/* Draw other areas in the region (dim slate) */}
            {otherAreas &&
              otherAreas.map(
                (area) =>
                  area.points.length >= 3 && (
                    <div key={`other-area-${area.id}`}>
                      <Polygon
                        paths={area.points}
                        options={{
                          strokeColor: "#64748b",
                          fillColor: "#64748b",
                          fillOpacity: 0.05,
                          strokeWeight: 1.5,
                        }}
                        onMouseOver={() =>
                          setHoveredPolygon(`other-${area.id}`)
                        }
                        onMouseOut={() =>
                          setHoveredPolygon((current) =>
                            current === `other-${area.id}` ? null : current,
                          )
                        }
                      />
                      {hoveredPolygon === `other-${area.id}` && (
                        <InfoWindow
                          position={centroidOf(area.points)}
                          options={{ disableAutoPan: true }}
                          onCloseClick={() => setHoveredPolygon(null)}
                        >
                          <div className="text-xs">
                            Khu vực khác: {area.name}
                          </div>
                        </InfoWindow>
                      )}
                    </div>
                  ),
              )}

            <Polygon
              paths={areaPoints}
              options={{ strokeColor: "blue", fillColor: "blue", fillOpacity: 0.1 }}
            />
            {justChanged && areaPoints.length > 0 && (
              <InfoWindow
                position={centroidOf(areaPoints)}
                options={{ disableAutoPan: true }}
              >
                <div className="text-xs font-medium">
                  Đã tự động điều chỉnh sắp xếp các điểm để phù hợp đường bao
                </div>
              </InfoWindow>
            )}

            {areaPoints.map((point, index) => (
              <Marker
                key={`point-${index}`}
                position={point}
                draggable
                icon={areaMarkerIcon}
                onDrag={(event) => {
                  if (!event.latLng) return;
                  handlePointDrag(
                    index,
                    L.latLng(event.latLng.lat(), event.latLng.lng()),
                  );
                }}
                onDragEnd={() => {
                  handlePointDragEnd();
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Đang tải bản đồ...
          </div>
        )}
      </div>

      <div className="flex h-[450px] w-full flex-col overflow-hidden rounded-lg border bg-slate-50 md:h-full">
        <div className="flex flex-col border-b bg-white p-3 gap-2.5">
          <div>
            <h4 className="text-sm font-semibold">Danh sách toạ độ</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Kéo thả điểm hoặc click bản đồ
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleImportExcel}
            />
            <a
              download="mau_toa_do_khu_vuc.xlsx"
              className="h-8 flex-1 text-xs text-primary border border-primary/20 hover:bg-primary/5 flex items-center justify-center rounded-md font-medium transition-colors"
              href="https://minio-api.otechz.com/mevimedia/9d1b7b5e52496f389e93b4dc826286c4906e79f2006a86d7a06ec85f06a3dff4/static/2026/07/10/4189c31a-0465-48af-95e9-77cce96e5499-mau_toa_do_khu_vuc.xlsx"
            >
              Tải file mẫu
            </a>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 flex-1 text-xs"
              onClick={() => fileInputRef.current?.click()}
            >
              Nhập Excel
            </Button>
          </div>
        </div>

        {boundaryWarning && (
          <div className="bg-red-50 text-red-600 p-2.5 text-xs border-b border-red-100 font-medium animate-in slide-in-from-top duration-200">
            ⚠️ {boundaryWarning}
          </div>
        )}
        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {areaPoints.map((point, index) => (
            <div
              key={index}
              className="relative flex flex-col gap-2 rounded border bg-white p-2 text-xs"
            >
              <div className="absolute right-2 top-2 flex gap-1">
                {areaPoints.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removePoint(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <span className="font-semibold">Điểm {index + 1}</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-500">Lat</label>
                  <input
                    className="w-full rounded border px-1 py-0.5"
                    type="number"
                    value={point.lat}
                    onChange={(event) =>
                      handlePointInputChange(index, "lat", event.target.value)
                    }
                    step="0.0001"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500">Lng</label>
                  <input
                    className="w-full rounded border px-1 py-0.5"
                    type="number"
                    value={point.lng}
                    onChange={(event) =>
                      handlePointInputChange(index, "lng", event.target.value)
                    }
                    step="0.0001"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="w-full border-dashed"
            onClick={handleAddPoint}
          >
            <Plus className="mr-2 h-4 w-4" /> Thêm điểm
          </Button>
        </div>
      </div>
    </div>
  );
};

// `markerIcon` (a Leaflet L.Icon from the caller) is accepted but unused now that
// this component renders its own Google Maps marker icon internally.
export const AreaMapStep = (_props: AreaMapStepProps) => {
  const { watch, setValue } = useFormContext();
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapFitTrigger, setMapFitTrigger] = useState(0);
  const [justChanged, setJustChanged] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const regionId = watch("regionId");
  const editingAreaId = watch("id");
  const coordinates = watch("coordinates") || [];

  const { data: regionsData } = useRegions({ params: { size: 100 } });
  const selectedRegionId = Number(regionId);
  const { data: selectedRegionDetail } = useRegionById(selectedRegionId, {
    enabled: Number.isFinite(selectedRegionId) && selectedRegionId > 0,
  });
  const { items: allAreas } = useAreas({
    params: { size: 100 },
    enabled: !!regionId,
  });

  const selectedRegion = useMemo(() => {
    if (selectedRegionDetail) return selectedRegionDetail;
    if (!regionId || !regionsData?.content) return null;
    return regionsData.content.find((r) => r.id === selectedRegionId) ?? null;
  }, [regionId, regionsData, selectedRegionDetail, selectedRegionId]);

  const regionPoints = useMemo(() => {
    if (!selectedRegion?.boundary) return [];
    return selectedRegion.boundary
      .filter((c) => c.latitude !== undefined && c.longitude !== undefined)
      .map((c) => L.latLng(c.latitude!, c.longitude!));
  }, [selectedRegion]);

  // Regions created via the basic flow have no drawn boundary, only a
  // center point — use that so step 2 still follows the selected region.
  const regionCenter = useMemo(() => {
    const lat = selectedRegion?.centerPoint?.latitude;
    const lng = selectedRegion?.centerPoint?.longitude;
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    return L.latLng(lat, lng);
  }, [selectedRegion]);

  const areaPoints = useMemo(
    () => coordinates.map((c: any) => L.latLng(c.lat, c.lng)),
    [coordinates],
  );

  const otherAreas = useMemo(() => {
    if (!regionId || !allAreas) return [];
    return allAreas
      .filter(
        (area) =>
          area.region?.id === Number(regionId) && area.id !== editingAreaId,
      )
      .map((area) => ({
        id: area.id,
        name: area.name || "",
        points: (area.boundary || [])
          .filter((c) => c.latitude !== undefined && c.longitude !== undefined)
          .map((c) => L.latLng(c.latitude!, c.longitude!)),
      }));
  }, [allAreas, regionId, editingAreaId]);

  const boundaryWarning = useMemo(() => {
    if (areaPoints.length < 3) return null;

    let regionPoly: any = null;
    if (regionPoints && regionPoints.length >= 3) {
      const regionCoords = [...regionPoints.map((p) => [p.lng, p.lat])];
      regionCoords.push(regionCoords[0]);
      regionPoly = turf.polygon([regionCoords]);
    }

    const otherPolys = (otherAreas || [])
      .filter((area) => area.points.length >= 3)
      .map((area) => {
        const coords = [...area.points.map((p: any) => [p.lng, p.lat])];
        coords.push(coords[0]);
        return {
          name: area.name,
          polygon: turf.polygon([coords]),
        };
      });

    const currentCoords = [...areaPoints.map((p: L.LatLng) => [p.lng, p.lat])];
    currentCoords.push(currentCoords[0]);
    const currentPoly = turf.polygon([currentCoords]);

    if (regionPoly) {
      for (const p of areaPoints) {
        const pt = turf.point([p.lng, p.lat]);
        if (!turf.booleanPointInPolygon(pt, regionPoly)) {
          return "Khu vực vượt ngoài ranh giới vùng trồng!";
        }
      }
    }

    for (const other of otherPolys) {
      for (const p of areaPoints) {
        const pt = turf.point([p.lng, p.lat]);
        if (turf.booleanPointInPolygon(pt, other.polygon)) {
          return `Khu vực bị chồng lấn với khu vực "${other.name}"!`;
        }
      }

      try {
        const intersects = turf.lineIntersect(currentPoly, other.polygon);
        if (intersects && intersects.features.length > 0) {
          return `Khu vực giao cắt ranh giới với khu vực "${other.name}"!`;
        }
      } catch (err) {
        console.error("lineIntersect error", err);
      }
    }

    return null;
  }, [areaPoints, regionPoints, otherAreas]);

  const triggerChangeTooltip = useCallback(() => {
    setJustChanged(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setJustChanged(false);
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const setAreaPoints = useCallback(
    (points: L.LatLng[]) => {
      setValue(
        "coordinates",
        points.map((p) => ({ lat: p.lat, lng: p.lng })),
        { shouldValidate: true },
      );
    },
    [setValue],
  );

  const handleDownloadSampleExcel = useCallback(() => {
    const link = document.createElement("a");
    link.href =
      "https://minio-api.otechz.com/mevimedia/9d1b7b5e52496f389e93b4dc826286c4906e79f2006a86d7a06ec85f06a3dff4/static/2026/07/10/4189c31a-0465-48af-95e9-77cce96e5499-mau_toa_do_khu_vuc.xlsx";
    link.download = "mau_toa_do_vung_trong.xlsx";
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleImportExcel = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const rows = await readXlsxFile(file);
        if (rows.length < 2) {
          toast({
            title: "Lỗi",
            description:
              "File excel chưa có thông tin hoặc không đúng định dạng.",
            variant: "destructive",
          });
          return;
        }

        const headers = rows[0] as string[];
        let latIdx = -1;
        let lngIdx = -1;

        headers.forEach((header, i) => {
          if (!header) return;
          const cleanHeader = header
            .toString()
            .normalize("NFC")
            .trim()
            .toLowerCase();
          const cleanHeaderNoDiacritics = cleanHeader
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
            .replace(/[èéẹẻẽêềếệểễ]/g, "e")
            .replace(/[ìíịỉĩ]/g, "i")
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
            .replace(/[ùúụủũưừứựửữ]/g, "u")
            .replace(/[ỳýỵỷỹ]/g, "y")
            .replace(/[đ]/g, "d");

          if (
            cleanHeader === "lat" ||
            cleanHeader.includes("latitude") ||
            cleanHeader.includes("vĩ độ") ||
            cleanHeaderNoDiacritics.includes("vi do")
          ) {
            latIdx = i;
          }
          if (
            cleanHeader === "lng" ||
            cleanHeader === "lon" ||
            cleanHeader.includes("longitude") ||
            cleanHeader.includes("kinh độ") ||
            cleanHeaderNoDiacritics.includes("kinh do")
          ) {
            lngIdx = i;
          }
        });

        if (latIdx === -1 || lngIdx === -1) {
          toast({
            title: "Lỗi",
            description:
              "Không tìm thấy cột Lat (Vĩ độ) hoặc Lng (Kinh độ) trong file Excel.",
            variant: "destructive",
          });
          return;
        }

        const parsedPoints: L.LatLng[] = [];
        const dataRows = rows.slice(1);

        for (const row of dataRows) {
          const latVal = parseFloat(row[latIdx]?.toString() || "");
          const lngVal = parseFloat(row[lngIdx]?.toString() || "");

          if (!isNaN(latVal) && !isNaN(lngVal)) {
            parsedPoints.push(L.latLng(latVal, lngVal));
          }
        }

        if (parsedPoints.length < 3) {
          toast({
            title: "Lỗi",
            description:
              "Cần ít nhất 3 điểm toạ độ hợp lệ để tạo thành đa giác vùng trồng.",
            variant: "destructive",
          });
          return;
        }

        let finalPoints = parsedPoints;
        if (isSelfIntersecting(parsedPoints)) {
          let latSum = 0;
          let lngSum = 0;
          for (const p of parsedPoints) {
            latSum += p.lat;
            lngSum += p.lng;
          }
          const centroidLat = latSum / parsedPoints.length;
          const centroidLng = lngSum / parsedPoints.length;

          finalPoints = [...parsedPoints].sort((a, b) => {
            const angleA = Math.atan2(a.lat - centroidLat, a.lng - centroidLng);
            const angleB = Math.atan2(b.lat - centroidLat, b.lng - centroidLng);
            return angleA - angleB;
          });
        }

        setAreaPoints(finalPoints);
        triggerChangeTooltip();
        setMapFitTrigger(Date.now());

        toast({
          title: "Thành công",
          description: `Đã nhập thành công ${finalPoints.length} điểm toạ độ từ file Excel.`,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi đọc file Excel.",
          variant: "destructive",
        });
      } finally {
        event.target.value = "";
      }
    },
    [toast, setAreaPoints, triggerChangeTooltip],
  );

  const handlePointDragEnd = useCallback(() => {
    if (areaPoints.length <= 2) return;

    if (isSelfIntersecting(areaPoints)) {
      let latSum = 0;
      let lngSum = 0;
      for (const p of areaPoints) {
        latSum += p.lat;
        lngSum += p.lng;
      }
      const centroidLat = latSum / areaPoints.length;
      const centroidLng = lngSum / areaPoints.length;

      const sorted = [...areaPoints].sort((a, b) => {
        const angleA = Math.atan2(a.lat - centroidLat, a.lng - centroidLng);
        const angleB = Math.atan2(b.lat - centroidLat, b.lng - centroidLng);
        return angleA - angleB;
      });

      let isDifferent = false;
      for (let i = 0; i < areaPoints.length; i++) {
        if (
          areaPoints[i].lat !== sorted[i].lat ||
          areaPoints[i].lng !== sorted[i].lng
        ) {
          isDifferent = true;
          break;
        }
      }

      setAreaPoints(sorted);

      if (isDifferent) {
        triggerChangeTooltip();
      }
    }
  }, [areaPoints, setAreaPoints, triggerChangeTooltip]);

  const handleMapClick = useCallback(
    (latlng: L.LatLng) => {
      setAreaPoints([...areaPoints, latlng]);
    },
    [areaPoints, setAreaPoints],
  );

  const handlePointDrag = useCallback(
    (index: number, latlng: L.LatLng) => {
      const newPoints = [...areaPoints];
      newPoints[index] = latlng;
      setAreaPoints(newPoints);
    },
    [areaPoints, setAreaPoints],
  );

  const removePoint = useCallback(
    (index: number) => {
      if (areaPoints.length <= 3) {
        toast({
          title: "Không thể xóa",
          description: "Khu vực cần ít nhất 3 điểm để tạo thành hình",
          variant: "destructive",
        });
        return;
      }
      const newPoints = areaPoints.filter((_: L.LatLng, i: number) => i !== index);
      setAreaPoints(newPoints);
    },
    [areaPoints, setAreaPoints, toast],
  );

  const handlePointInputChange = useCallback(
    (index: number, field: "lat" | "lng", value: string) => {
      const val = parseFloat(value);
      if (isNaN(val)) return;

      const newPoints = [...areaPoints];
      const currentPoint = newPoints[index];
      newPoints[index] = L.latLng(
        field === "lat" ? val : currentPoint.lat,
        field === "lng" ? val : currentPoint.lng,
      );
      setAreaPoints(newPoints);
    },
    [areaPoints, setAreaPoints],
  );

  const handleAddPoint = useCallback(() => {
    const mapCenter = getBoundsFromPoints(
      areaPoints.length > 0 ? areaPoints : DEFAULT_POINTS,
    ).getCenter();
    setAreaPoints([
      ...areaPoints,
      L.latLng(mapCenter.lat + 0.005, mapCenter.lng + 0.005),
    ]);
  }, [areaPoints, setAreaPoints]);

  const center = useMemo(() => {
    if (areaPoints.length > 0) {
      return getBoundsFromPoints(areaPoints).getCenter();
    }
    if (regionPoints.length > 0) {
      return getBoundsFromPoints(regionPoints).getCenter();
    }
    if (regionCenter) {
      return regionCenter;
    }
    return getBoundsFromPoints(DEFAULT_POINTS).getCenter();
  }, [areaPoints, regionPoints, regionCenter]);

  return (
    <Card className="flex h-auto md:h-[750px] min-h-[600px] md:min-h-0 flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-0 pt-3 px-4 space-y-0">
        <CardTitle>Bản đồ vị trí</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(true)}
          title="Phóng to toàn màn hình"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
        {!isFullscreen && (
          <MapLayout
            center={center}
            areaPoints={areaPoints}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
            handleMapClick={handleMapClick}
            handlePointDrag={handlePointDrag}
            removePoint={removePoint}
            handlePointInputChange={handlePointInputChange}
            handleAddPoint={handleAddPoint}
            handleImportExcel={handleImportExcel}
            handleDownloadSampleExcel={handleDownloadSampleExcel}
            mapFitTrigger={mapFitTrigger}
            handlePointDragEnd={handlePointDragEnd}
            justChanged={justChanged}
            regionPoints={regionPoints}
            regionCenter={regionCenter}
            otherAreas={otherAreas}
            selectedRegion={selectedRegion}
            boundaryWarning={boundaryWarning}
          />
        )}

        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-[95vw] h-[95vh] p-0 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">Bản đồ vị trí</h2>
            </div>
            {isFullscreen && (
              <MapLayout
                center={center}
                areaPoints={areaPoints}
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
                handleMapClick={handleMapClick}
                handlePointDrag={handlePointDrag}
                removePoint={removePoint}
                handlePointInputChange={handlePointInputChange}
                handleAddPoint={handleAddPoint}
                handleImportExcel={handleImportExcel}
                handleDownloadSampleExcel={handleDownloadSampleExcel}
                mapFitTrigger={mapFitTrigger}
                handlePointDragEnd={handlePointDragEnd}
                justChanged={justChanged}
                regionPoints={regionPoints}
                regionCenter={regionCenter}
                otherAreas={otherAreas}
                selectedRegion={selectedRegion}
                boundaryWarning={boundaryWarning}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
