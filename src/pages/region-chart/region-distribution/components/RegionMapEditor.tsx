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
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize2, Plus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import readXlsxFile from "read-excel-file";
import { getBoundsFromPoints } from "../utils";

interface RegionMapEditorProps {
  markerIcon: L.Icon;
}

const DEFAULT_POINTS = [
  L.latLng(11.53, 106.88),
  L.latLng(11.55, 106.88),
  L.latLng(11.55, 106.91),
  L.latLng(11.53, 106.91),
];

interface MapLayoutProps {
  center: L.LatLng;
  regionPoints: L.LatLng[];
  markerIcon: L.Icon;
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
  handlePointDrag: (index: number, latlng: L.LatLng) => void;
  handlePointDragEnd: () => void;
  removePoint: (index: number) => void;
  handlePointInputChange: (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => void;
  handleAddPoint: () => void;
  justChanged: boolean;
  handleImportExcel: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownloadSampleExcel: () => void;
  mapFitTrigger: number;
}

const FitBoundsOnce = ({
  points,
  fitTrigger,
}: {
  points: L.LatLng[];
  fitTrigger?: number;
}) => {
  const map = useMap();
  const hasFitRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (points.length > 0 && !hasFitRef.current) {
      const bounds = L.latLngBounds(points);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
        hasFitRef.current = true;
      }
    }
  }, [points, map]);

  useEffect(() => {
    if (points.length > 0 && fitTrigger) {
      const bounds = L.latLngBounds(points);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [fitTrigger, points, map]);

  return null;
};

const MapLayout = ({
  center,
  regionPoints,
  markerIcon,
  handlePointDrag,
  handlePointDragEnd,
  removePoint,
  handlePointInputChange,
  handleAddPoint,
  justChanged,
  handleImportExcel,
  handleDownloadSampleExcel,
  isFullscreen,
  mapFitTrigger,
}: MapLayoutProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-0 gap-4 p-4 w-full">
      <div className="relative z-0 w-full flex-1 min-h-[500px] md:min-h-[600px] overflow-hidden rounded-lg border">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={14}
          className="z-0 h-full w-full"
        >
          <FitBoundsOnce points={regionPoints} fitTrigger={mapFitTrigger} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polygon
            positions={regionPoints}
            pathOptions={{ color: "blue", fillOpacity: 0.1 }}
          >
            {justChanged && (
              <Tooltip permanent sticky direction="top">
                Đã tự động điều chỉnh sắp xếp các điểm để phù hợp đường bao
              </Tooltip>
            )}
          </Polygon>

          {regionPoints.map((point, index) => (
            <Marker
              key={`point-${index}`}
              position={point}
              draggable={true}
              icon={markerIcon}
              eventHandlers={{
                drag: (event) => {
                  handlePointDrag(index, event.target.getLatLng());
                },
                dragend: () => {
                  handlePointDragEnd();
                },
              }}
            />
          ))}
        </MapContainer>
      </div>

      <div className="flex h-[450px] md:h-full md:w-75 shrink-0 flex-col overflow-hidden rounded-lg border bg-slate-50">
        <div className="flex flex-col border-b bg-white p-3 gap-2.5">
          <div>
            <h4 className="text-sm font-semibold">Danh sách toạ độ</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Kéo thả hoặc nhập Excel
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
              download="mau_toa_do_vung_trong.xlsx"
              className="h-8 flex-1 text-xs text-primary border border-primary/20 hover:bg-primary/5 flex items-center justify-center rounded-md font-medium transition-colors"
              href="https://minio-api.otechz.com/mevimedia/9d1b7b5e52496f389e93b4dc826286c4906e79f2006a86d7a06ec85f06a3dff4/static/2026/07/10/a8ebdb71-713f-4467-965c-990fc4aa77fb-mau_toa_do_vung_trong.xlsx"
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
        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {regionPoints.map((point, index) => (
            <div
              key={index}
              className="relative flex flex-col gap-2 rounded border bg-white p-2 text-xs"
            >
              <div className="absolute right-2 top-2 flex gap-1">
                {regionPoints.length > 3 && (
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

export const RegionMapEditor = ({ markerIcon }: RegionMapEditorProps) => {
  const { watch, setValue } = useFormContext();
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [justChanged, setJustChanged] = useState(false);
  const [mapFitTrigger, setMapFitTrigger] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const coordinates = watch("coordinates") || [];

  const regionPoints = useMemo(
    () => coordinates.map((c: any) => L.latLng(c.lat, c.lng)),
    [coordinates],
  );

  const setRegionPoints = useCallback(
    (points: L.LatLng[]) => {
      setValue(
        "coordinates",
        points.map((p) => ({ lat: p.lat, lng: p.lng })),
        { shouldValidate: true },
      );
    },
    [setValue],
  );

  const handlePointDrag = useCallback(
    (index: number, latlng: L.LatLng) => {
      const newPoints = [...regionPoints];
      newPoints[index] = latlng;
      setRegionPoints(newPoints);
    },
    [regionPoints, setRegionPoints],
  );

  const handlePointDragEnd = useCallback(() => {
    if (regionPoints.length <= 2) return;

    if (isSelfIntersecting(regionPoints)) {
      let latSum = 0;
      let lngSum = 0;
      for (const p of regionPoints) {
        latSum += p.lat;
        lngSum += p.lng;
      }
      const centroidLat = latSum / regionPoints.length;
      const centroidLng = lngSum / regionPoints.length;

      const sorted = [...regionPoints].sort((a, b) => {
        const angleA = Math.atan2(a.lat - centroidLat, a.lng - centroidLng);
        const angleB = Math.atan2(b.lat - centroidLat, b.lng - centroidLng);
        return angleA - angleB;
      });

      let isDifferent = false;
      for (let i = 0; i < regionPoints.length; i++) {
        if (
          regionPoints[i].lat !== sorted[i].lat ||
          regionPoints[i].lng !== sorted[i].lng
        ) {
          isDifferent = true;
          break;
        }
      }

      setRegionPoints(sorted);

      if (isDifferent) {
        triggerChangeTooltip();
      }
    }
  }, [regionPoints, setRegionPoints, triggerChangeTooltip]);

  const removePoint = useCallback(
    (index: number) => {
      if (regionPoints.length <= 3) {
        toast({
          title: "Không thể xóa",
          description: "Vùng trồng cần ít nhất 3 điểm để tạo thành hình",
          variant: "destructive",
        });
        return;
      }
      const newPoints = regionPoints.filter((_: any, i: number) => i !== index);
      setRegionPoints(newPoints);
    },
    [regionPoints, setRegionPoints, toast],
  );

  const handlePointInputChange = useCallback(
    (index: number, field: "lat" | "lng", value: string) => {
      const val = parseFloat(value);
      if (isNaN(val)) return;

      const newPoints = [...regionPoints];
      const currentPoint = newPoints[index];
      newPoints[index] = L.latLng(
        field === "lat" ? val : currentPoint.lat,
        field === "lng" ? val : currentPoint.lng,
      );
      setRegionPoints(newPoints);
      triggerChangeTooltip();
    },
    [regionPoints, setRegionPoints, triggerChangeTooltip],
  );

  const handleDownloadSampleExcel = useCallback(() => {
    const link = document.createElement("a");
    link.href =
      "https://minio-api.otechz.com/mevimedia/9d1b7b5e52496f389e93b4dc826286c4906e79f2006a86d7a06ec85f06a3dff4/static/2026/07/10/a8ebdb71-713f-4467-965c-990fc4aa77fb-mau_toa_do_vung_trong.xlsx";
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

        setRegionPoints(finalPoints);
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
    [setRegionPoints, triggerChangeTooltip, toast, setMapFitTrigger],
  );

  const handleAddPoint = useCallback(() => {
    if (regionPoints.length === 0) {
      setRegionPoints(DEFAULT_POINTS);
      return;
    }

    // 1. Calculate centroid
    let latSum = 0;
    let lngSum = 0;
    for (const p of regionPoints) {
      latSum += p.lat;
      lngSum += p.lng;
    }
    const centroidLat = latSum / regionPoints.length;
    const centroidLng = lngSum / regionPoints.length;

    // 2. Sort existing points by angle relative to centroid
    const sortedPoints = [...regionPoints].sort((a, b) => {
      const angleA = Math.atan2(a.lat - centroidLat, a.lng - centroidLng);
      const angleB = Math.atan2(b.lat - centroidLat, b.lng - centroidLng);
      return angleA - angleB;
    });

    // 3. Find the largest angular gap between consecutive points
    let maxGap = 0;
    let gapIndex = 0;
    const n = sortedPoints.length;

    for (let i = 0; i < n; i++) {
      const p1 = sortedPoints[i];
      const p2 = sortedPoints[(i + 1) % n];

      const angle1 = Math.atan2(p1.lat - centroidLat, p1.lng - centroidLng);
      let angle2 = Math.atan2(p2.lat - centroidLat, p2.lng - centroidLng);

      if (angle2 <= angle1) {
        angle2 += 2 * Math.PI;
      }

      const gap = angle2 - angle1;
      if (gap > maxGap) {
        maxGap = gap;
        gapIndex = i;
      }
    }

    // 4. Calculate midpoint angle of the largest gap
    const p1 = sortedPoints[gapIndex];
    const angle1 = Math.atan2(p1.lat - centroidLat, p1.lng - centroidLng);
    const newAngle = angle1 + maxGap / 2;

    // 5. Calculate average radius (distance from centroid)
    let distSum = 0;
    for (const p of regionPoints) {
      const dLat = p.lat - centroidLat;
      const dLng = p.lng - centroidLng;
      distSum += Math.sqrt(dLat * dLat + dLng * dLng);
    }
    const avgRadius = distSum / regionPoints.length;

    // 6. Generate the new point
    const newLat = centroidLat + avgRadius * Math.sin(newAngle);
    const newLng = centroidLng + avgRadius * Math.cos(newAngle);
    const newPoint = L.latLng(newLat, newLng);

    // 7. Insert the new point and keep the sorted list
    const finalPoints = [...sortedPoints];
    finalPoints.splice(gapIndex + 1, 0, newPoint);

    setRegionPoints(finalPoints);
    triggerChangeTooltip();
  }, [regionPoints, setRegionPoints, triggerChangeTooltip]);

  const center = useMemo(
    () => getBoundsFromPoints(regionPoints, DEFAULT_POINTS).getCenter(),
    [regionPoints],
  );

  return (
    <Card className="flex h-auto md:h-187.5 min-h-[600px] md:min-h-0 flex-col">
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
            regionPoints={regionPoints}
            markerIcon={markerIcon}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
            handlePointDrag={handlePointDrag}
            handlePointDragEnd={handlePointDragEnd}
            removePoint={removePoint}
            handlePointInputChange={handlePointInputChange}
            handleAddPoint={handleAddPoint}
            justChanged={justChanged}
            handleImportExcel={handleImportExcel}
            handleDownloadSampleExcel={handleDownloadSampleExcel}
            mapFitTrigger={mapFitTrigger}
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
                regionPoints={regionPoints}
                markerIcon={markerIcon}
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
                handlePointDrag={handlePointDrag}
                handlePointDragEnd={handlePointDragEnd}
                removePoint={removePoint}
                handlePointInputChange={handlePointInputChange}
                handleAddPoint={handleAddPoint}
                justChanged={justChanged}
                handleImportExcel={handleImportExcel}
                handleDownloadSampleExcel={handleDownloadSampleExcel}
                mapFitTrigger={mapFitTrigger}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
