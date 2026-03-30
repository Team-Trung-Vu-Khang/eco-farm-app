import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Separator,
  TabsContent,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Calendar,
  Contact,
  CreditCard,
  Globe,
  Hash,
  Layers,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  Scale3d,
  Sprout,
  Tag,
  Target,
  User,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip as LeafletTooltip,
} from "react-leaflet";
import L from "leaflet";
import styles from "../styles.module.css";
import type {
  Coordinate,
  CropDetailOverviewProps,
  ScopeAreaGroup,
  ScopeRegionGroup,
} from "./types";

const ScopeTree = ({
  areaScope,
  groups,
  focusScopeMapToCoordinates,
  compact = false,
}: {
  areaScope: string;
  groups: ScopeRegionGroup[];
  focusScopeMapToCoordinates: (coordinates?: Coordinate[]) => void;
  compact?: boolean;
}) => (
  <div className="space-y-8">
    {groups.map((group) => (
      <div key={group.region.id} className="relative">
        <button
          type="button"
          className="relative z-10 -m-2 flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-slate-50"
          onClick={() => focusScopeMapToCoordinates(group.region.coordinates)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <MapPin className="h-5 w-5" />
          </div>
          <div className={compact ? "min-w-0" : undefined}>
            <div className="mb-1 text-[10px] font-bold uppercase leading-none tracking-wider text-primary">
              Vùng trồng
            </div>
            <div
              className={cn(
                "text-sm font-bold text-slate-900",
                compact && "truncate",
              )}
            >
              {group.region.name}
            </div>
          </div>
        </button>

        {areaScope !== "region" && (
          <div className="ml-5 space-y-8 border-l-2 border-slate-100 pl-6">
            {Object.values(group.areas).map((areaGroup) => (
              <ScopeAreaTree
                key={areaGroup.area?.id || "none"}
                areaGroup={areaGroup}
                focusScopeMapToCoordinates={focusScopeMapToCoordinates}
                compact={compact}
              />
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

const ScopeAreaTree = ({
  areaGroup,
  focusScopeMapToCoordinates,
  compact,
}: {
  areaGroup: ScopeAreaGroup;
  focusScopeMapToCoordinates: (coordinates?: Coordinate[]) => void;
  compact: boolean;
}) => {
  const plotEntities = areaGroup.entities.filter((item) => item.typeCode === "plot");
  const areaSelected = areaGroup.entities.some((item) => item.typeCode === "area");

  return (
    <div className="relative">
      <div className="absolute -left-6.5 top-5 h-px w-6 bg-slate-200" />

      {areaGroup.area ? (
        <>
          <button
            type="button"
            className="relative z-10 -m-2 mb-4 flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-slate-50"
            onClick={() => focusScopeMapToCoordinates(areaGroup.area?.coordinates)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white shadow-sm">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <div className={compact ? "min-w-0" : undefined}>
              <div className="mb-1 text-[10px] font-bold uppercase leading-none tracking-wider text-blue-500">
                Khu vực
              </div>
              <div
                className={cn(
                  "text-sm font-bold text-slate-900",
                  compact && "truncate",
                )}
              >
                {areaGroup.area.name}
              </div>
            </div>
          </button>

          <div className="ml-4.5 space-y-4 border-l-2 border-slate-100 pl-6">
            {plotEntities.map((plot) => (
              <button
                key={plot.id}
                type="button"
                className="relative -m-2 flex w-full items-center gap-3 rounded-lg p-2 py-1 text-left transition-colors hover:bg-slate-50"
                onClick={() => focusScopeMapToCoordinates(plot.coordinates)}
              >
                <div className="absolute -left-6.5 top-1/2 h-px w-6 bg-slate-200" />
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500 text-white shadow-xs">
                  <Target className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="mb-1 text-[10px] font-bold uppercase leading-none tracking-wider text-green-600">
                    Lô đất
                  </div>
                  <div className="truncate text-xs font-bold text-slate-800">
                    {plot.name}
                  </div>
                </div>
              </button>
            ))}

            {areaSelected && (
              <div className="relative flex items-center gap-3 py-1">
                <div className="absolute -left-6.5 top-1/2 h-px w-6 bg-slate-200" />
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50/50 text-[9px] font-bold uppercase text-blue-600"
                >
                  Đã chọn toàn bộ khu vực
                </Badge>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {areaGroup.entities.map((entity) => (
            <button
              key={entity.id}
              type="button"
              className="relative -m-2 flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-slate-50"
              onClick={() => focusScopeMapToCoordinates(entity.coordinates)}
            >
              <div className="absolute -left-6.5 top-1/2 h-px w-6 bg-slate-200" />
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-xs",
                  entity.typeCode === "region" ? "bg-primary" : "bg-green-500",
                )}
              >
                {entity.typeCode === "region" ? (
                  <MapPin className="h-4 w-4" />
                ) : (
                  <Target className="h-4 w-4" />
                )}
              </div>
              <div className={compact ? "min-w-0" : undefined}>
                <div
                  className={cn(
                    "mb-1 text-[10px] font-bold uppercase leading-none tracking-wider",
                    entity.typeCode === "region" ? "text-primary" : "text-green-600",
                  )}
                >
                  {entity.type}
                </div>
                <div
                  className={cn(
                    "text-xs font-bold text-slate-800",
                    compact && "truncate",
                  )}
                >
                  {entity.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ScopeMapPolygons = ({
  scopeMapData,
  formatFullAddress,
  focusScopeMapToCoordinates,
  regionIndex,
}: Pick<
  CropDetailOverviewProps,
  "scopeMapData" | "formatFullAddress" | "focusScopeMapToCoordinates" | "regionIndex"
>) => {
  if (!scopeMapData) return null;

  const handleClick = (coordinates?: Coordinate[]) => (event: L.LeafletEvent) => {
    L.DomEvent.stopPropagation(event);
    focusScopeMapToCoordinates(coordinates);
  };

  return (
    <>
      {scopeMapData.regions.map(({ region, explicit }) => {
        if (!region.coordinates || region.coordinates.length < 3) return null;

        return (
          <Polygon
            key={`scope-region-${region.id}`}
            positions={region.coordinates.map((item) => [item.lat, item.lng])}
            pathOptions={{
              color: "#3b82f6",
              weight: explicit ? 2.5 : 2,
              fillColor: "#3b82f6",
              fillOpacity: explicit ? 0.08 : 0,
              dashArray: explicit ? undefined : "6, 6",
            }}
            eventHandlers={{ click: handleClick(region.coordinates) }}
          >
            <LeafletTooltip sticky>
              <ScopeTooltip
                title="Vùng trồng"
                titleClassName="border-blue-100 text-blue-600"
                name={`${region.code}: ${region.name}`}
                area={region.area}
                address={formatFullAddress(region)}
              />
            </LeafletTooltip>
          </Polygon>
        );
      })}

      {scopeMapData.areas.map(({ area, explicit }) => {
        if (!area.coordinates || area.coordinates.length < 3) return null;

        return (
          <Polygon
            key={`scope-area-${area.id}`}
            positions={area.coordinates.map((item) => [item.lat, item.lng])}
            pathOptions={{
              color: "#10b981",
              weight: explicit ? 2.5 : 1.75,
              fillColor: "#10b981",
              fillOpacity: explicit ? 0.12 : 0.06,
              dashArray: explicit ? undefined : "4, 6",
            }}
            eventHandlers={{ click: handleClick(area.coordinates) }}
          >
            <LeafletTooltip sticky>
              <ScopeTooltip
                title="Khu vực"
                titleClassName="border-emerald-100 text-emerald-600"
                name={`${area.code}: ${area.name}`}
                area={area.area}
                address={formatFullAddress(regionIndex.areaById.get(String(area.id))?.region)}
              />
            </LeafletTooltip>
          </Polygon>
        );
      })}

      {scopeMapData.plots.map(({ plot, explicit }) => {
        if (!plot.coordinates || plot.coordinates.length < 3) return null;

        return (
          <Polygon
            key={`scope-plot-${plot.id}`}
            positions={plot.coordinates.map((item) => [item.lat, item.lng])}
            pathOptions={{
              color: "#f59e0b",
              weight: explicit ? 2.25 : 1.5,
              fillColor: "#f59e0b",
              fillOpacity: explicit ? 0.22 : 0.12,
              dashArray: explicit ? undefined : "3, 7",
            }}
            eventHandlers={{ click: handleClick(plot.coordinates) }}
          >
            <LeafletTooltip sticky>
              <ScopeTooltip
                title="Lô đất"
                titleClassName="border-amber-100 text-amber-600"
                name={`${plot.code}: ${plot.name}`}
                area={plot.area}
                address={formatFullAddress(regionIndex.plotById.get(String(plot.id))?.region)}
              />
            </LeafletTooltip>
          </Polygon>
        );
      })}
    </>
  );
};

const ScopeTooltip = ({
  title,
  titleClassName,
  name,
  area,
  address,
}: {
  title: string;
  titleClassName: string;
  name: string;
  area?: number;
  address: string;
}) => (
  <div className="w-64 px-3 py-2">
    <div
      className={cn(
        "mb-1 border-b pb-1 text-[10px] font-black uppercase tracking-widest",
        titleClassName,
      )}
    >
      {title}
    </div>

    <div className="mb-1 w-full min-w-0 overflow-hidden text-wrap text-sm font-bold text-slate-800">
      {name}
    </div>

    <div className="flex w-full items-start gap-1.5 text-[11px] leading-relaxed text-slate-500">
      <Scale3d className="mt-0.5 h-3 w-3 shrink-0 text-red-500" />
      <span className="block min-w-0 flex-1 overflow-hidden text-wrap">
        {area} ha
      </span>
    </div>

    <div className="flex w-full items-start gap-1.5 text-[11px] leading-relaxed text-slate-500">
      <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-red-500" />
      <span className="block min-w-0 flex-1 overflow-hidden text-wrap">
        {address}
      </span>
    </div>
  </div>
);

const CropMarker = ({
  activeCrop,
  cropMarkerIcon,
}: Pick<CropDetailOverviewProps, "activeCrop" | "cropMarkerIcon">) => {
  if (!activeCrop.coordinate) return null;

  return (
    <Marker
      position={[activeCrop.coordinate.lat, activeCrop.coordinate.lng]}
      icon={cropMarkerIcon}
    >
      <LeafletTooltip direction="top" offset={[0, -10]}>
        <div className="text-[10px] font-bold text-primary">
          {activeCrop.code || activeCrop.name}
        </div>
      </LeafletTooltip>
    </Marker>
  );
};

export const CropDetailOverviewTab = ({
  activeCrop,
  area,
  details,
  cropGeoRefs,
  scopedGroupedSelections,
  scopedSelectionCount,
  scopeMapData,
  scopeMapBounds,
  isScopeMapExpanded,
  setIsScopeMapExpanded,
  focusScopeMapToCoordinates,
  formatFullAddress,
  cropMarkerIcon,
  regionIndex,
  scopeMapRef,
  expandedScopeMapRef,
}: CropDetailOverviewProps) => {
  const groups = Object.values(scopedGroupedSelections);

  return (
    <TabsContent value="overview" className="space-y-4">
      <div className={styles.overviewGrid}>
        <div className={styles.areaEnterprise}>
          {details.enterprise && (
            <Card className="relative h-fit overflow-hidden shadow-md">
              <div className="relative flex h-50 items-center justify-center bg-gray-100">
                <img
                  src={
                    details.enterprise.image ||
                    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
                  }
                  alt="Cover"
                  className="h-full w-full object-cover"
                />
                <div className="absolute right-0 top-0 z-10">
                  <div
                    className={cn(
                      "rounded-bl-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg",
                      details.enterprise.status === "active"
                        ? "bg-green-600"
                        : "bg-gray-500",
                    )}
                  >
                    {details.enterprise.status === "active"
                      ? "Đang hoạt động"
                      : "Dừng hoạt động"}
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2 text-center">
                <div className="relative mx-auto -mt-12 mb-2 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-white shadow-sm">
                  {details.enterprise.image ? (
                    <img
                      src={details.enterprise.image}
                      alt="Logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {(
                        details.enterprise.brandName ||
                        details.enterprise.name ||
                        "?"
                      ).charAt(0)}
                    </span>
                  )}
                </div>
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                  {details.enterprise.brandName || details.enterprise.name}
                  {details.enterprise.status === "active" && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{details.enterprise.name}</CardDescription>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {(Array.isArray(details.enterprise.classification)
                    ? details.enterprise.classification
                    : [details.enterprise.classification]
                  ).map((item: string) => (
                    <Badge key={item} variant="outline" className="capitalize">
                      {item === "production"
                        ? "Sản xuất"
                        : item === "processing"
                          ? "Chế biến"
                          : item === "trading"
                            ? "Thương mại"
                            : "Dịch vụ"}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{details.enterprise.code}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Đại diện:{" "}
                      <span className="font-medium">
                        {details.enterprise.representative || "---"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Thành lập:{" "}
                      {details.enterprise.foundedDate
                        ? new Date(details.enterprise.foundedDate).toLocaleDateString(
                            "vi-VN",
                          )
                        : "---"}
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <span>
                      {details.enterprise.address}
                      {details.enterprise.ward ? `, ${details.enterprise.ward}` : ""}
                      {details.enterprise.district
                        ? `, ${details.enterprise.district}`
                        : ""}
                      {details.enterprise.province
                        ? `, ${details.enterprise.province}`
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {details.enterprise.phone ? (
                      <a
                        href={`tel:${details.enterprise.phone}`}
                        className="transition-colors hover:text-primary hover:underline"
                      >
                        {details.enterprise.phone}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">---</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {details.enterprise.email ? (
                      <a
                        href={`mailto:${details.enterprise.email}`}
                        className="transition-colors hover:text-primary hover:underline"
                      >
                        {details.enterprise.email}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">---</span>
                    )}
                  </div>
                  {details.enterprise.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={details.enterprise.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 transition-colors hover:text-primary hover:underline"
                      >
                        {details.enterprise.website}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card
          className={cn(
            styles.areaScope,
            "flex max-h-150 flex-col overflow-hidden border-slate-200 shadow-sm",
          )}
        >
          <CardHeader className="shrink-0 flex flex-row items-center justify-between border-b bg-slate-50/50 px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-lg">
                Phạm vi vùng canh tác ({scopedSelectionCount} mục)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="flex p-6">
              <div className="flex-4">
                <ScopeTree
                  areaScope={area.scope}
                  groups={groups}
                  focusScopeMapToCoordinates={focusScopeMapToCoordinates}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(styles.areaInfo, "overflow-hidden border")}>
          <CardHeader className="border-b bg-slate-50 px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <Contact className="h-4 w-4 text-primary" />
              <span className="text-lg">Thông tin vị trí cây trồng</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              <InfoItem icon={<Tag className="h-3.5 w-3.5 text-primary/70" />} label="Cây trồng">
                {activeCrop.name}
              </InfoItem>
              <InfoItem icon={<Hash className="h-3.5 w-3.5 text-blue-500/70" />} label="Mã số cây">
                <div className="inline-flex items-center rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-blue-700 shadow-sm transition-all hover:bg-blue-100/50">
                  <span className="font-mono text-xs font-bold">{activeCrop.code}</span>
                </div>
              </InfoItem>
              <InfoItem icon={<MapPin className="h-3.5 w-3.5 text-red-500/70" />} label="Vùng trồng">
                {cropGeoRefs.region?.name || activeCrop.regionName || "---"}
              </InfoItem>
              <InfoItem icon={<Layers className="h-3.5 w-3.5 text-blue-500/70" />} label="Khu vực">
                {cropGeoRefs.area?.name || activeCrop.areaName || "Chưa xác định"}
              </InfoItem>
              <InfoItem icon={<Target className="h-3.5 w-3.5 text-green-600/70" />} label="Lô đất">
                {cropGeoRefs.plot?.name || activeCrop.plotName || "Chưa xác định"}
              </InfoItem>
              <InfoItem icon={<Sprout className="h-3.5 w-3.5 text-emerald-600/70" />} label="Hàng trồng">
                {activeCrop.rowNumber ? `Hàng ${activeCrop.rowNumber}` : "Chưa cập nhật"}
              </InfoItem>
              <InfoItem icon={<Globe className="h-3.5 w-3.5 text-slate-500/70" />} label="Tọa độ">
                <div className="font-mono text-xs font-bold text-slate-900">
                  {activeCrop.coordinate
                    ? `${activeCrop.coordinate.lat.toFixed(5)}, ${activeCrop.coordinate.lng.toFixed(5)}`
                    : "Chưa cập nhật"}
                </div>
              </InfoItem>
              <div className="lg:col-span-2">
                <InfoItem icon={<MapPin className="h-3.5 w-3.5 text-orange-500/70" />} label="Địa chỉ vùng">
                  <div className="text-sm font-semibold leading-tight text-slate-900">
                    {cropGeoRefs.region
                      ? formatFullAddress(cropGeoRefs.region)
                      : "Chưa cập nhật"}
                  </div>
                </InfoItem>
              </div>
            </div>

            {activeCrop.notes && (
              <div className="mt-6 border-t border-slate-100 pt-4">
                <div className="mb-1 text-sm text-muted-foreground">
                  Ghi chú cây trồng
                </div>
                <p className="mt-1 text-sm text-slate-700">{activeCrop.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div
          className={cn(
            styles.areaMap,
            "relative z-10 aspect-video h-full min-h-[65vh] w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm",
          )}
        >
          <MapContainer
            ref={scopeMapRef}
            center={[11.53, 106.88]}
            zoom={13}
            bounds={scopeMapBounds ?? undefined}
            boundsOptions={{ padding: [40, 40] }}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            <ScopeMapPolygons
              scopeMapData={scopeMapData}
              formatFullAddress={formatFullAddress}
              focusScopeMapToCoordinates={focusScopeMapToCoordinates}
              regionIndex={regionIndex}
            />
            <CropMarker activeCrop={activeCrop} cropMarkerIcon={cropMarkerIcon} />
          </MapContainer>

          <button
            type="button"
            onClick={() => setIsScopeMapExpanded(true)}
            className="absolute right-3 top-3 z-[1000] rounded-xl bg-white/90 p-2.5 text-slate-600 shadow-lg backdrop-blur-md transition-all active:scale-95 hover:bg-white"
            aria-label="Mở rộng bản đồ"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        <Dialog open={isScopeMapExpanded} onOpenChange={setIsScopeMapExpanded}>
          <DialogContent className="z-10000 h-[92vh] w-[96vw] max-w-[96vw] overflow-hidden rounded-3xl border-none p-0 shadow-2xl">
            <DialogHeader className="sr-only">
              <DialogTitle>Bản đồ phạm vi vùng canh tác</DialogTitle>
            </DialogHeader>
            <div className="flex h-full">
              <div className="relative flex-1 bg-slate-100">
                <MapContainer
                  ref={expandedScopeMapRef}
                  center={[11.53, 106.88]}
                  zoom={13}
                  bounds={scopeMapBounds ?? undefined}
                  boundsOptions={{ padding: [60, 60] }}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                  <ScopeMapPolygons
                    scopeMapData={scopeMapData}
                    formatFullAddress={formatFullAddress}
                    focusScopeMapToCoordinates={focusScopeMapToCoordinates}
                    regionIndex={regionIndex}
                  />
                  <CropMarker activeCrop={activeCrop} cropMarkerIcon={cropMarkerIcon} />
                </MapContainer>

                <button
                  type="button"
                  onClick={() => setIsScopeMapExpanded(false)}
                  className="absolute right-4 top-4 z-[1000] rounded-2xl bg-white/90 p-3 text-slate-600 shadow-xl backdrop-blur-md transition-all active:scale-95 hover:bg-white"
                  aria-label="Đóng"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex w-[360px] shrink-0 flex-col overflow-hidden border-l border-slate-100 bg-white">
                <div className="border-b bg-slate-50/60 px-5 pb-4 pt-5">
                  <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <MapPin size={14} className="text-primary" />
                    Phạm vi địa lý
                  </h3>
                  <p className="mt-2 text-xs text-slate-500">
                    Bấm vào từng cấp để tự zoom bản đồ.
                  </p>
                </div>

                <div className="split-scrollbar flex-1 overflow-y-auto p-5">
                  <ScopeTree
                    areaScope={area.scope}
                    groups={groups}
                    focusScopeMapToCoordinates={focusScopeMapToCoordinates}
                    compact
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TabsContent>
  );
};

const InfoItem = ({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) => (
  <div>
    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
      {icon}
      {label}
    </div>
    <div className="font-bold leading-tight text-slate-900">{children}</div>
  </div>
);
