import PageWrapper from "@/components/PageWrapper";
// import {
//   AdminLayout,
//   Badge,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   Checkbox,
//   cn,
//   DataTable,
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   Input,
//   Label,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   useToast,
//   type Column,
// } from "@Team-Trung-Vu-Khang/eco-shared-ui";
// import {
//   Activity,
//   Building2,
//   ChevronRight,
//   Filter,
//   Layers,
//   MapPin,
//   Maximize2,
//   PanelLeftClose,
//   PanelLeftOpen,
//   Search,
//   Sprout,
//   Target,
//   X,
// } from "lucide-react";
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { MFMap, MFMarker, MFPolygon } from "react-map4d-map";
// import { useLocation } from "wouter";
// import useCultivationRegionStore, {
//   type CultivationRegion,
// } from "../../../stores/useCultivationRegionStore";
// import useEnterpriseStore from "../../../stores/useEnterpriseStore";
// import useRegionStore from "../../../stores/useRegionStore";
// import {
//   LAND_TYPES,
//   type Coordinate,
//   type Region,
// } from "../../region-chart/constants";
// import { CultivationRegionDetailView } from "../cultivation-region/CultivationRegionDetailPage";

// interface AdvancedFilters {
//   // Nhóm 1: Thông tin cây trồng
//   crops?: string[];
//   varieties?: string[];
//   seedTypes?: string[];

//   // Nhóm 2: Doanh nghiệp & Địa điểm
//   enterpriseIds?: string[];
//   provinces?: string[];
//   districts?: string[];
//   wards?: string[];
//   certifications?: string[];

//   // Nhóm 3: Thông số & Trạng thái
//   status?: string[];
//   minArea?: number;
//   maxArea?: number;
//   hasActivePlan?: boolean;
// }

// const SearchZonePage = () => {
//   const MAP4D_ACCESS_KEY = import.meta.env.VITE_MAP4D_ACCESS_KEY;
//   const { toast } = useToast();
//   const { enterprises } = useEnterpriseStore();
//   const { regions } = useRegionStore();
//   const { areas: cultivationRegions } = useCultivationRegionStore();

//   const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
//     lat: 11.53,
//     lng: 106.88,
//   });
//   const [mapZoom, setMapZoom] = useState(13);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<
//     string | null
//   >(null);
//   const [selectedCultivationRegionId, setSelectedCultivationRegionId] =
//     useState<string | null>(null);
//   const [selectedUnit, setSelectedUnit] = useState<{
//     type: "region" | "area" | "plot";
//     data: any;
//   } | null>(null);

//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
//   const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});
//   const [isMapExpanded, setIsMapExpanded] = useState(false);
//   const [isCultivationRegionDetailOpen, setIsCultivationRegionDetailOpen] =
//     useState(false);
//   const [, setLocation] = useLocation();

//   const regionIndex = useMemo(() => {
//     const regionById = new Map<string, Region>();
//     const areaById = new Map<string, { area: any; region: Region }>();
//     const plotById = new Map<
//       string,
//       { plot: any; area: any; region: Region }
//     >();

//     for (const region of regions) {
//       regionById.set(String(region.id), region);
//       for (const area of region.subAreas || []) {
//         areaById.set(String(area.id), { area, region });
//         for (const plot of area.plots || []) {
//           plotById.set(String(plot.id), { plot, area, region });
//         }
//       }
//     }

//     return { regionById, areaById, plotById };
//   }, [regions]);

//   const selectedCultivationRegion = useMemo(() => {
//     if (!selectedCultivationRegionId) return null;
//     return (
//       cultivationRegions.find((cr) => cr.id === selectedCultivationRegionId) ??
//       null
//     );
//   }, [cultivationRegions, selectedCultivationRegionId]);

//   const selectedCultivationTargets = useMemo(() => {
//     const explicitRegionIds = new Set<number>();
//     const explicitAreaIds = new Set<string>();
//     const explicitPlotIds = new Set<string>();
//     const visibleRegionsMap = new Map<number, Region>();

//     const addRegion = (region: Region | undefined) => {
//       if (!region) return;
//       visibleRegionsMap.set(region.id, region);
//     };

//     const ids = selectedCultivationRegion?.targetIds || [];
//     for (const rawId of ids) {
//       const id = String(rawId);
//       const region = regionIndex.regionById.get(id);
//       if (region) {
//         explicitRegionIds.add(region.id);
//         addRegion(region);
//         continue;
//       }
//       const areaHit = regionIndex.areaById.get(id);
//       if (areaHit) {
//         explicitAreaIds.add(String(areaHit.area.id));
//         addRegion(areaHit.region);
//         continue;
//       }
//       const plotHit = regionIndex.plotById.get(id);
//       if (plotHit) {
//         explicitPlotIds.add(String(plotHit.plot.id));
//         addRegion(plotHit.region);
//         continue;
//       }
//     }

//     // Expand: region -> all areas + plots, area -> all plots
//     const targetRegionIds = new Set(explicitRegionIds);
//     const targetAreaIds = new Set(explicitAreaIds);
//     const targetPlotIds = new Set(explicitPlotIds);

//     for (const regionId of explicitRegionIds) {
//       const region = regionIndex.regionById.get(String(regionId));
//       if (!region) continue;
//       for (const area of region.subAreas || []) {
//         targetAreaIds.add(String(area.id));
//         for (const plot of area.plots || []) {
//           targetPlotIds.add(String(plot.id));
//         }
//       }
//     }

//     for (const areaId of explicitAreaIds) {
//       const areaHit = regionIndex.areaById.get(String(areaId));
//       if (!areaHit) continue;
//       for (const plot of areaHit.area.plots || []) {
//         targetPlotIds.add(String(plot.id));
//       }
//     }

//     return {
//       visibleRegions: Array.from(visibleRegionsMap.values()),
//       explicitRegionIds,
//       explicitAreaIds,
//       explicitPlotIds,
//       targetRegionIds,
//       targetAreaIds,
//       targetPlotIds,
//       targetSignature: ids.map(String).sort().join("|"),
//     };
//   }, [regionIndex, selectedCultivationRegion]);

//   const focusMapToBoundingCoordinates = useCallback(
//     (coordinates: Coordinate[]) => {
//       if (!coordinates.length) return;
//       const lats = coordinates.map((c) => c.lat);
//       const lngs = coordinates.map((c) => c.lng);
//       const minLat = Math.min(...lats);
//       const maxLat = Math.max(...lats);
//       const minLng = Math.min(...lngs);
//       const maxLng = Math.max(...lngs);
//       const span = Math.max(maxLat - minLat, maxLng - minLng);

//       setMapCenter({
//         lat: (minLat + maxLat) / 2,
//         lng: (minLng + maxLng) / 2,
//       });

//       const nextZoom =
//         span > 1
//           ? 8
//           : span > 0.5
//             ? 9
//             : span > 0.2
//               ? 10
//               : span > 0.1
//                 ? 11
//                 : span > 0.05
//                   ? 12
//                   : span > 0.02
//                     ? 13
//                     : span > 0.01
//                       ? 14
//                       : 15;
//       setMapZoom(nextZoom);
//     },
//     [],
//   );

//   const focusMapToCoordinates = useCallback(
//     (coordinates?: Coordinate[]) => {
//       if (!coordinates?.length) return;
//       focusMapToBoundingCoordinates(coordinates);
//     },
//     [focusMapToBoundingCoordinates],
//   );

//   const focusMapToCultivationTargets = () => {
//     const regions = selectedCultivationTargets.visibleRegions;
//     if (!regions.length) return;

//     const allCoords: Coordinate[] = [];
//     for (const region of regions) {
//       allCoords.push(...(region.coordinates || []));

//       for (const area of region.subAreas || []) {
//         const areaId = String(area.id);
//         const hasTargetPlot = (area.plots || []).some((p: any) =>
//           selectedCultivationTargets.targetPlotIds.has(String(p.id)),
//         );
//         const shouldRenderArea =
//           selectedCultivationTargets.targetAreaIds.size === 0 &&
//           selectedCultivationTargets.targetPlotIds.size === 0
//             ? true
//             : selectedCultivationTargets.targetAreaIds.has(areaId) ||
//               hasTargetPlot;
//         if (shouldRenderArea) allCoords.push(...(area.coordinates || []));

//         for (const plot of area.plots || []) {
//           if (selectedCultivationTargets.targetPlotIds.has(String(plot.id))) {
//             allCoords.push(...(plot.coordinates || []));
//           }
//         }
//       }
//     }

//     if (!allCoords.length) return;
//     focusMapToBoundingCoordinates(allCoords);
//   };

//   const clearSelectedUnit = () => {
//     setSelectedUnit(null);
//     focusMapToCultivationTargets();
//   };

//   const buildScopeTree = (cr: CultivationRegion | null) => {
//     if (!cr) return [];

//     type PlotNode = { plot: any; selected: boolean };
//     type AreaNode = {
//       area: any;
//       selected: boolean;
//       plots: PlotNode[];
//       plotMap: Map<string, PlotNode>;
//     };
//     type RegionNode = {
//       region: Region;
//       selected: boolean;
//       areas: AreaNode[];
//       areaMap: Map<string, AreaNode>;
//     };

//     const regionNodes: RegionNode[] = [];
//     const regionMap = new Map<string, RegionNode>();

//     const ensureRegion = (region: Region) => {
//       const key = String(region.id);
//       const existing = regionMap.get(key);
//       if (existing) return existing;
//       const next: RegionNode = {
//         region,
//         selected: false,
//         areas: [],
//         areaMap: new Map(),
//       };
//       regionMap.set(key, next);
//       regionNodes.push(next);
//       return next;
//     };

//     const ensureArea = (regionNode: RegionNode, area: any) => {
//       const key = String(area.id);
//       const existing = regionNode.areaMap.get(key);
//       if (existing) return existing;
//       const next: AreaNode = {
//         area,
//         selected: false,
//         plots: [],
//         plotMap: new Map(),
//       };
//       regionNode.areaMap.set(key, next);
//       regionNode.areas.push(next);
//       return next;
//     };

//     const ensurePlot = (areaNode: AreaNode, plot: any) => {
//       const key = String(plot.id);
//       const existing = areaNode.plotMap.get(key);
//       if (existing) return existing;
//       const next: PlotNode = { plot, selected: false };
//       areaNode.plotMap.set(key, next);
//       areaNode.plots.push(next);
//       return next;
//     };

//     for (const region of selectedCultivationTargets.visibleRegions) {
//       const rNode = ensureRegion(region);
//       rNode.selected = selectedCultivationTargets.explicitRegionIds.has(
//         region.id,
//       );

//       const includeAllAreas = selectedCultivationTargets.explicitRegionIds.has(
//         region.id,
//       );

//       for (const area of region.subAreas || []) {
//         const areaId = String(area.id);
//         const hasTargetPlot = (area.plots || []).some((p: any) =>
//           selectedCultivationTargets.targetPlotIds.has(String(p.id)),
//         );
//         const includeArea =
//           includeAllAreas ||
//           selectedCultivationTargets.targetAreaIds.has(areaId) ||
//           hasTargetPlot;

//         if (!includeArea) continue;

//         const aNode = ensureArea(rNode, area);
//         aNode.selected = selectedCultivationTargets.explicitAreaIds.has(areaId);

//         const includeAllPlots = includeAllAreas || aNode.selected;
//         for (const plot of area.plots || []) {
//           const plotId = String(plot.id);
//           const includePlot =
//             includeAllPlots ||
//             selectedCultivationTargets.targetPlotIds.has(plotId);
//           if (!includePlot) continue;

//           const pNode = ensurePlot(aNode, plot);
//           pNode.selected =
//             selectedCultivationTargets.explicitPlotIds.has(plotId);
//         }
//       }
//     }

//     return regionNodes;
//   };

//   const scopeTree = useMemo(
//     () => buildScopeTree(selectedCultivationRegion),
//     [selectedCultivationRegion, selectedCultivationTargets],
//   );

//   // Store does not currently provide soil type; fall back to unit landType.
//   const getUnitSoilType = () =>
//     selectedUnit?.data.landType
//       ? (LAND_TYPES.find((l) => l.id === selectedUnit.data.landType)?.name ??
//         selectedUnit.data.landType)
//       : "N/A";

//   // Get main crop: prefer cultivation config, then fallback to first cropVariety on the unit
//   const getUnitMainCrop = () => {
//     const varieties = selectedUnit?.data.cropVarieties as any[] | undefined;
//     if (varieties?.[0]?.name) return varieties[0].name;
//     if (selectedCultivationRegion?.selectedCrops?.length) {
//       // selectedCrops is currently stored as IDs; display raw if no mapping is available.
//       return selectedCultivationRegion.selectedCrops[0];
//     }
//     return "N/A";
//   };

//   const toggleFilter = (key: keyof AdvancedFilters, value: any) => {
//     setAdvancedFilters((prev) => {
//       const current = (prev[key] as any[]) || [];
//       const next = current.includes(value)
//         ? current.filter((v: any) => v !== value)
//         : [...current, value];
//       return { ...prev, [key]: next };
//     });
//   };

//   // Get unique values for filters from real stores (avoid page-level mock data)
//   const uniqueProvinces = Array.from(
//     new Set(
//       regions
//         .map((r) => (r.provinceId != null ? String(r.provinceId) : ""))
//         .filter(Boolean),
//     ),
//   );
//   const uniqueDistricts = Array.from(
//     new Set(
//       regions
//         .map((r) => (r.districtId != null ? String(r.districtId) : ""))
//         .filter(Boolean),
//     ),
//   );
//   const uniqueWards = Array.from(
//     new Set(regions.map((r) => r.ward).filter((w): w is string => !!w)),
//   );
//   const allCropVarieties = regions.flatMap(
//     (r) => (r.cropVarieties as any[]) || [],
//   );
//   const uniqueCropNames = Array.from(
//     new Set(allCropVarieties.map((v) => v?.name).filter(Boolean)),
//   );
//   const uniqueVarieties = Array.from(
//     new Set(allCropVarieties.map((v) => v?.variety).filter(Boolean)),
//   );
//   const uniqueSeedTypes = Array.from(
//     new Set(allCropVarieties.map((v) => v?.seedType).filter(Boolean)),
//   );
//   const uniqueCertNames = Array.from(
//     new Set(
//       cultivationRegions
//         .flatMap((cr) => cr.certificateIds || [])
//         .map(String)
//         .filter(Boolean),
//     ),
//   );

//   const activeFilterCount = Object.keys(advancedFilters).reduce(
//     (count, key) => {
//       const val = advancedFilters[key as keyof AdvancedFilters];
//       if (Array.isArray(val)) return count + (val.length > 0 ? 1 : 0);
//       return count + (val !== undefined ? 1 : 0);
//     },
//     0,
//   );

//   const handleNavigateToDetail = () => {
//     if (!selectedUnit) return;

//     let path = "";
//     const id = selectedUnit.data.id;

//     switch (selectedUnit.type) {
//       case "region":
//         path = `/region-distribution/detail/${id}`;
//         break;
//       case "area":
//         // area.id is a string like "sub-1-1", we need the numeric id or correct param
//         // Looking at App.tsx, area-distribution uses :id
//         path = `/area-distribution/detail/${id}`;
//         break;
//       case "plot":
//         path = `/plot-distribution/detail/${id}`;
//         break;
//     }

//     if (path) {
//       setLocation(path);
//     }
//   };

//   const openCultivationRegionDetail = (opts?: { closeMap?: boolean }) => {
//     if (!selectedCultivationRegion) return;
//     if (opts?.closeMap) setIsMapExpanded(false);
//     setIsCultivationRegionDetailOpen(true);
//   };

//   const getRegionsForCultivation = (cr: CultivationRegion) => {
//     const regionMap = new Map<number, Region>();
//     for (const rawId of cr.targetIds || []) {
//       const id = String(rawId);
//       const region = regionIndex.regionById.get(id);
//       if (region) {
//         regionMap.set(region.id, region);
//         continue;
//       }
//       const areaHit = regionIndex.areaById.get(id);
//       if (areaHit) {
//         regionMap.set(areaHit.region.id, areaHit.region);
//         continue;
//       }
//       const plotHit = regionIndex.plotById.get(id);
//       if (plotHit) {
//         regionMap.set(plotHit.region.id, plotHit.region);
//         continue;
//       }
//     }
//     return Array.from(regionMap.values());
//   };

//   const getApproxTotalArea = (cr: CultivationRegion) => {
//     let sum = 0;
//     const seenRegions = new Set<string>();
//     const seenAreas = new Set<string>();
//     const seenPlots = new Set<string>();

//     for (const rawId of cr.targetIds || []) {
//       const id = String(rawId);

//       const plotHit = regionIndex.plotById.get(id);
//       if (plotHit && !seenPlots.has(String(plotHit.plot.id))) {
//         seenPlots.add(String(plotHit.plot.id));
//         sum += Number(plotHit.plot.area || 0);
//         continue;
//       }

//       const areaHit = regionIndex.areaById.get(id);
//       if (areaHit && !seenAreas.has(String(areaHit.area.id))) {
//         seenAreas.add(String(areaHit.area.id));
//         sum += Number(areaHit.area.area || 0);
//         continue;
//       }

//       const region = regionIndex.regionById.get(id);
//       if (region && !seenRegions.has(String(region.id))) {
//         seenRegions.add(String(region.id));
//         sum += Number(region.area || 0);
//       }
//     }

//     return sum;
//   };

//   const baseFilteredCultivationRegions = cultivationRegions.filter((cr) => {
//     const enterprise = enterprises.find(
//       (e) => String(e.id) === String(cr.enterpriseId),
//     );
//     const enterpriseName = enterprise?.brandName || enterprise?.name || "";
//     const involvedRegions = getRegionsForCultivation(cr);

//     const matchesSearch =
//       cr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       cr.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       enterpriseName.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesCrops =
//       !advancedFilters.crops?.length ||
//       involvedRegions.some((r) =>
//         r.cropVarieties?.some((cv) => advancedFilters.crops?.includes(cv.name)),
//       );

//     const matchesVarieties =
//       !advancedFilters.varieties?.length ||
//       involvedRegions.some((r) =>
//         r.cropVarieties?.some((cv) =>
//           advancedFilters.varieties?.includes(cv.variety),
//         ),
//       );

//     const matchesSeedTypes =
//       !advancedFilters.seedTypes?.length ||
//       involvedRegions.some((r) =>
//         r.cropVarieties?.some((cv) =>
//           advancedFilters.seedTypes?.includes(cv.seedType || ""),
//         ),
//       );

//     const matchesEnterprisesFilter =
//       !advancedFilters.enterpriseIds?.length ||
//       advancedFilters.enterpriseIds.includes(String(cr.enterpriseId));

//     const matchesProv =
//       !advancedFilters.provinces?.length ||
//       involvedRegions.some((r) =>
//         advancedFilters.provinces?.includes(String(r.provinceId)),
//       );

//     const matchesDist =
//       !advancedFilters.districts?.length ||
//       involvedRegions.some((r) =>
//         advancedFilters.districts?.includes(String(r.districtId)),
//       );

//     const matchesWard =
//       !advancedFilters.wards?.length ||
//       involvedRegions.some(
//         (r) => r.ward && advancedFilters.wards?.includes(r.ward),
//       );

//     const matchesCert =
//       !advancedFilters.certifications?.length ||
//       advancedFilters.certifications.some((c) => cr.certificateIds.includes(c));

//     const matchesStatus =
//       !advancedFilters.status?.length ||
//       advancedFilters.status.includes(cr.status);

//     const approxTotalArea = getApproxTotalArea(cr);
//     const matchesAreaRange =
//       (!advancedFilters.minArea ||
//         approxTotalArea >= advancedFilters.minArea) &&
//       (!advancedFilters.maxArea || approxTotalArea <= advancedFilters.maxArea);

//     const matchesPlans =
//       !advancedFilters.hasActivePlan ||
//       involvedRegions.some((r) =>
//         r.subAreas?.some((sa) => sa.status === "active"),
//       );

//     return (
//       matchesSearch &&
//       matchesCrops &&
//       matchesVarieties &&
//       matchesSeedTypes &&
//       matchesEnterprisesFilter &&
//       matchesProv &&
//       matchesDist &&
//       matchesWard &&
//       matchesCert &&
//       matchesStatus &&
//       matchesAreaRange &&
//       matchesPlans
//     );
//   });

//   const filteredEnterprises = enterprises.filter((enterprise) =>
//     baseFilteredCultivationRegions.some(
//       (cr) => String(cr.enterpriseId) === String(enterprise.id),
//     ),
//   );

//   const filteredCultivationRegions = baseFilteredCultivationRegions.filter(
//     (cr) =>
//       selectedEnterpriseId
//         ? String(cr.enterpriseId) === String(selectedEnterpriseId)
//         : true,
//   );

//   const totalCultivationRegions = baseFilteredCultivationRegions.length;

//   const handleSearch = () => {
//     toast({
//       title: "Tìm kiếm hoàn tất",
//       description: `Đã tìm thấy ${totalCultivationRegions} vùng canh tác phù hợp.`,
//     });
//   };

//   const columns: Column<CultivationRegion>[] = [
//     {
//       key: "name",
//       label: "Tên vùng canh tác",
//       render: (value) => (
//         <span className="font-bold text-slate-800 text-sm leading-tight">
//           {String(value)}
//         </span>
//       ),
//     },
//     {
//       key: "scope",
//       label: "Phạm vi",
//       render: (value) => {
//         const scope = value as CultivationRegion["scope"];
//         return (
//           <Badge
//             className={cn(
//               "uppercase font-bold text-[10px] px-2 py-1",
//               scope === "region"
//                 ? "bg-blue-500"
//                 : scope === "area"
//                 ? "bg-emerald-500"
//                 : "bg-orange-500",
//             )}
//           >
//             {scope === "region"
//               ? "Vùng trồng"
//               : scope === "area"
//                 ? "Khu vực"
//                 : "Lô"}
//           </Badge>
//         );
//       },
//     },
//     {
//       key: "status",
//       label: "Trạng thái",
//       render: (value) => getStatusBadge(String(value)),
//     },
//   ];

//   const EnterpriseListItem = ({
//     enterprise,
//     isActive,
//     onClick,
//   }: {
//     enterprise: any;
//     isActive: boolean;
//     onClick: () => void;
//   }) => {
//     const enterpriseRegions = cultivationRegions.filter(
//       (cr) => String(cr.enterpriseId) === String(enterprise.id),
//     );

//     return (
//       <div
//         className={cn(
//           "p-4 border-b hover:bg-slate-50 cursor-pointer transition-all duration-200 border-l-4",
//           isActive
//             ? "bg-primary/5 border-l-primary shadow-inner"
//             : "border-l-transparent bg-white",
//         )}
//         onClick={onClick}
//       >
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border shrink-0">
//             {enterprise.image ? (
//               <img
//                 src={enterprise.image}
//                 alt={enterprise.name}
//                 className="w-full h-full rounded-xl object-cover"
//               />
//             ) : (
//               <Building2 size={20} className="text-slate-300" />
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <h4
//               className={cn(
//                 "font-bold text-sm line-clamp-1",
//                 isActive ? "text-primary" : "text-slate-800",
//               )}
//             >
//               {enterprise.brandName || enterprise.name}
//             </h4>
//             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
//               {enterpriseRegions.length} vùng canh tác
//             </p>
//           </div>
//           <ChevronRight
//             size={14}
//             className={cn(
//               "transition-transform",
//               isActive ? "text-primary rotate-90" : "text-slate-300",
//             )}
//           />
//         </div>
//       </div>
//     );
//   };

//   const getStatusLabel = (status: string) => {
//     const config = {
//       active: "Hoạt động",
//       inactive: "Ngưng hoạt động",
//       "under-construction": "Đang xây dựng",
//     };
//     return config[status as keyof typeof config] || status;
//   };

//   const getStatusBadge = (status: string) => {
//     const config = {
//       active: { label: "Hoạt động", variant: "default" as const },
//       inactive: { label: "Ngưng hoạt động", variant: "destructive" as const },
//       "under-construction": {
//         label: "Đang xây dựng",
//         variant: "secondary" as const,
//       },
//     };
//     return (
//       <Badge
//         variant={config[status as keyof typeof config]?.variant || "default"}
//       >
//         {getStatusLabel(status)}
//       </Badge>
//     );
//   };

//   useEffect(() => {
//     if (!selectedEnterpriseId) {
//       setSelectedCultivationRegionId(null);
//       return;
//     }

//     const stillValid =
//       selectedCultivationRegionId &&
//       baseFilteredCultivationRegions.some(
//         (cr) =>
//           cr.id === selectedCultivationRegionId &&
//           String(cr.enterpriseId) === String(selectedEnterpriseId),
//       );
//     if (stillValid) return;

//     const first = baseFilteredCultivationRegions.find(
//       (cr) => String(cr.enterpriseId) === String(selectedEnterpriseId),
//     );
//     setSelectedCultivationRegionId(first?.id ?? null);
//     setSelectedUnit(null);
//   }, [
//     selectedEnterpriseId,
//     selectedCultivationRegionId,
//     baseFilteredCultivationRegions,
//   ]);

//   return (
//     <PageWrapper title="Tìm kiếm vùng canh tác">
//       <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
//         {/* TOP HEADER: Simple Search (Matched to temp.ts) */}
//         <div className="bg-white border-b p-4 z-40 shadow-sm rounded-md">
//           <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between">
//             <div className="relative flex-1 w-full">
//               <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
//               <Input
//                 placeholder="Tìm kiếm vùng canh tác theo tên, đối tượng áp dụng..."
//                 className="pl-10 rounded-xl border-slate-200 focus:ring-primary h-10"
//                 value={searchQuery}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                   setSearchQuery(e.target.value)
//                 }
//               />
//             </div>
//             <div className="flex gap-2 w-full md:w-auto">
//               <Button
//                 variant={isAdvancedSearchOpen ? "default" : "outline"}
//                 className="gap-2 rounded-xl"
//                 onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
//               >
//                 <Filter className="h-4 w-4" />
//                 Tìm kiếm nâng cao
//                 {activeFilterCount > 0 && (
//                   <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-5">
//                     {activeFilterCount}
//                   </Badge>
//                 )}
//               </Button>
//               <Button className="rounded-xl px-6" onClick={handleSearch}>
//                 Tìm kiếm
//               </Button>
//             </div>
//           </div>

//           <div className="relative overflow-hidden rounded-xl border border-green-200 bg-linear-to-r from-green-50 via-white to-green-50 p-5 shadow-sm mt-4">
//             <div className="relative z-10 flex items-center gap-4">
//               <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-green-100 flex items-center justify-center text-green-600 shrink-0">
//                 <Layers className="w-6 h-6" />
//               </div>
//               <div>
//                 <h3 className="text-base font-bold text-green-900 uppercase tracking-wide">
//                   Kết quả tìm kiếm
//                 </h3>
//                 <p className="text-sm text-green-700/80 font-medium">
//                   Đã tìm thấy{" "}
//                   <span className="text-green-600 font-black px-1.5 py-0.5 bg-white rounded-md border border-green-100 shadow-xs">
//                     {totalCultivationRegions}
//                   </span>{" "}
//                   vùng canh tác phù hợp với tiêu chí của bạn.
//                 </p>
//               </div>
//             </div>
//             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
//           </div>

//           {/* ADVANCED SEARCH PANEL: Grouped Layout (Matched to temp.ts Card style) */}
//           {isAdvancedSearchOpen && (
//             <div className="bg-white z-30 animate-in slide-in-from-top-2 duration-200 mt-4">
//               <div className="w-full">
//                 <Card className="border-none shadow-none">
//                   <CardHeader className="bg-slate-50 border rounded-t-xl pb-4">
//                     <div className="flex items-center justify-between">
//                       <CardTitle className="text-lg font-bold flex items-center gap-2">
//                         <Filter className="h-5 w-5 text-primary" />
//                         Bộ lọc nâng cao
//                       </CardTitle>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setAdvancedFilters({})}
//                         className="text-primary hover:text-primary/80 font-semibold"
//                       >
//                         Xóa tất cả bộ lọc
//                       </Button>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="p-6 border border-t-0 rounded-b-xl space-y-8 bg-white">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                       {/* Nhóm 1: Thông tin cây trồng */}
//                       <div className="space-y-4">
//                         <div className="flex items-center gap-2 text-primary">
//                           <Sprout className="h-5 w-5" />
//                           <h4 className="font-semibold">
//                             1. Cây trồng & Giống
//                           </h4>
//                         </div>
//                         <div className="grid grid-cols-1 gap-4">
//                           <MultiSelectField
//                             label="Cây trồng"
//                             options={uniqueCropNames.map((n) => ({
//                               id: n,
//                               name: n,
//                             }))}
//                             selectedValues={advancedFilters.crops}
//                             onToggle={(val) => toggleFilter("crops", val)}
//                           />
//                           <MultiSelectField
//                             label="Giống cây"
//                             options={uniqueVarieties.map((v) => ({
//                               id: v,
//                               name: v,
//                             }))}
//                             selectedValues={advancedFilters.varieties}
//                             onToggle={(val) => toggleFilter("varieties", val)}
//                           />
//                           <MultiSelectField
//                             label="Hạt giống / Cây giống"
//                             options={uniqueSeedTypes.map((s) => ({
//                               id: s,
//                               name: s,
//                             }))}
//                             selectedValues={advancedFilters.seedTypes}
//                             onToggle={(val) => toggleFilter("seedTypes", val)}
//                           />
//                         </div>
//                       </div>

//                       {/* Nhóm 2: Doanh nghiệp & Địa điểm */}
//                       <div className="space-y-4">
//                         <div className="flex items-center gap-2 text-primary">
//                           <MapPin className="h-5 w-5" />
//                           <h4 className="font-semibold">
//                             2. Đơn vị sở hữu & Địa điểm
//                           </h4>
//                         </div>
//                         <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-87.5 pr-2 split-scrollbar">
//                           <MultiSelectField
//                             label="Đơn vị sở hữu"
//                             options={enterprises.map((e) => ({
//                               id: String(e.id),
//                               name: e.brandName || e.name,
//                             }))}
//                             selectedValues={advancedFilters.enterpriseIds}
//                             onToggle={(val) =>
//                               toggleFilter("enterpriseIds", val)
//                             }
//                           />
//                           <div className="grid grid-cols-2 gap-3">
//                             <MultiSelectField
//                               label="Tỉnh thành"
//                               options={uniqueProvinces.map((p) => ({
//                                 id: p,
//                                 name: p,
//                               }))}
//                               selectedValues={advancedFilters.provinces}
//                               onToggle={(val) => toggleFilter("provinces", val)}
//                             />
//                             <MultiSelectField
//                               label="Quận / Huyện"
//                               options={uniqueDistricts.map((d) => ({
//                                 id: d,
//                                 name: d,
//                               }))}
//                               selectedValues={advancedFilters.districts}
//                               onToggle={(val) => toggleFilter("districts", val)}
//                             />
//                           </div>
//                           <MultiSelectField
//                             label="Phường / Xã"
//                             options={uniqueWards.map((w) => ({
//                               id: w,
//                               name: w,
//                             }))}
//                             selectedValues={advancedFilters.wards}
//                             onToggle={(val) => toggleFilter("wards", val)}
//                           />
//                           <MultiSelectField
//                             label="Chứng nhận đạt được"
//                             options={uniqueCertNames.map((c) => ({
//                               id: c,
//                               name: c,
//                             }))}
//                             selectedValues={advancedFilters.certifications}
//                             onToggle={(val) =>
//                               toggleFilter("certifications", val)
//                             }
//                           />
//                         </div>
//                       </div>

//                       {/* Nhóm 3: Thông số & Trạng thái */}
//                       <div className="space-y-4">
//                         <div className="flex items-center gap-2 text-primary">
//                           <Activity className="h-5 w-5" />
//                           <h4 className="font-semibold">
//                             3. Quy mô & Trạng thái
//                           </h4>
//                         </div>
//                         <div className="grid grid-cols-1 gap-4">
//                           <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                               <Label className="text-xs font-bold text-slate-500 uppercase ml-1">
//                                 Diện tích từ (ha)
//                               </Label>
//                               <Input
//                                 type="number"
//                                 placeholder="0"
//                                 className="rounded-xl"
//                                 value={advancedFilters.minArea || ""}
//                                 onChange={(e) =>
//                                   setAdvancedFilters((prev) => ({
//                                     ...prev,
//                                     minArea: e.target.value
//                                       ? Number(e.target.value)
//                                       : undefined,
//                                   }))
//                                 }
//                               />
//                             </div>
//                             <div className="space-y-2">
//                               <Label className="text-xs font-bold text-slate-500 uppercase ml-1">
//                                 Đến (ha)
//                               </Label>
//                               <Input
//                                 type="number"
//                                 placeholder="1000"
//                                 className="rounded-xl"
//                                 value={advancedFilters.maxArea || ""}
//                                 onChange={(e) =>
//                                   setAdvancedFilters((prev) => ({
//                                     ...prev,
//                                     maxArea: e.target.value
//                                       ? Number(e.target.value)
//                                       : undefined,
//                                   }))
//                                 }
//                               />
//                             </div>
//                           </div>
//                           <MultiSelectField
//                             label="Trạng thái hoạt động"
//                             options={[
//                               { id: "active", name: "Hoạt động" },
//                               { id: "inactive", name: "Ngưng hoạt động" },
//                               {
//                                 id: "under-construction",
//                                 name: "Đang xây dựng",
//                               },
//                             ]}
//                             selectedValues={advancedFilters.status}
//                             onToggle={(val) => toggleFilter("status", val)}
//                           />
//                           <div className="flex items-center gap-3 pt-2">
//                             <Checkbox
//                               id="hasActivePlan"
//                               checked={advancedFilters.hasActivePlan}
//                               onCheckedChange={(checked) =>
//                                 setAdvancedFilters((prev) => ({
//                                   ...prev,
//                                   hasActivePlan: !!checked,
//                                 }))
//                               }
//                             />
//                             <Label
//                               htmlFor="hasActivePlan"
//                               className="text-sm font-medium cursor-pointer"
//                             >
//                               Đang có kế hoạch triển khai
//                             </Label>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex justify-end pt-4 border-t">
//                       <Button
//                         className="rounded-xl px-10 font-bold"
//                         onClick={() => setIsAdvancedSearchOpen(false)}
//                       >
//                         Áp dụng bộ lọc
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="flex-1 flex relative">
//           {/* Sidebar Toggle Button */}
//           {isSidebarCollapsed && (
//             <button
//               onClick={() => setIsSidebarCollapsed(false)}
//               className="absolute left-4 top-4 z-40 w-10 h-10 bg-white shadow-xl border border-slate-100 rounded-xl flex items-center justify-center text-primary hover:bg-slate-50 transition-all animate-in fade-in zoom-in duration-300"
//             >
//               <PanelLeftOpen size={20} />
//             </button>
//           )}

//           {/* LEFT SIDEBAR: Enterprise List (Filtered) */}
//           <div
//             className={cn(
//               "bg-white border-r flex flex-col z-30 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out",
//               isSidebarCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-80",
//             )}
//           >
//             <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between min-w-60">
//               <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
//                 <Building2 size={14} className="text-primary" />
//                 Đơn vị sở hữu ({filteredEnterprises.length})
//               </h3>
//               <button
//                 onClick={() => setIsSidebarCollapsed(true)}
//                 className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
//                 title="Thu gọn"
//               >
//                 <PanelLeftClose size={18} />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto split-scrollbar min-w-60">
//               {filteredEnterprises.map((enterprise) => (
//                 <EnterpriseListItem
//                   key={enterprise.id}
//                   enterprise={enterprise}
//                   isActive={selectedEnterpriseId === String(enterprise.id)}
//                   onClick={() => {
//                     setSelectedEnterpriseId(String(enterprise.id));
//                     // Auto-select first cultivation region for this enterprise
//                     const firstCultivation =
//                       baseFilteredCultivationRegions.find(
//                         (cr) =>
//                           String(cr.enterpriseId) === String(enterprise.id),
//                       );
//                     setSelectedCultivationRegionId(
//                       firstCultivation?.id ?? null,
//                     );
//                     setSelectedUnit(null);
//                   }}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* RIGHT CONTENT: Map (Top) & DataTable (Bottom) */}
//           <div className="flex-1 flex flex-col bg-slate-50 relative p-6 space-y-6 overflow-hidden overflow-y-auto split-scrollbar">
//             {!selectedEnterpriseId ? (
//               <div className="flex-1 flex flex-col items-center justify-center opacity-40">
//                 <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center mb-6">
//                   <Building2 size={64} className="text-slate-200" />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest text-center px-10">
//                   Chọn đơn vị sở hữu để xem vùng canh tác
//                 </h3>
//               </div>
//             ) : (
//               <div className="flex flex-col gap-6">
//                 {/* Enterprise Header */}
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
//                     <MapPin size={20} />
//                   </div>
//                   <div>
//                     <h2 className="font-bold text-lg text-slate-800 leading-none">
//                       {enterprises.find(
//                         (e) => String(e.id) === selectedEnterpriseId,
//                       )?.brandName ||
//                         enterprises.find(
//                           (e) => String(e.id) === selectedEnterpriseId,
//                         )?.name ||
//                         "Đơn vị sở hữu"}
//                     </h2>
//                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
//                       Chi tiết bản đồ & Danh sách vùng canh tác
//                     </p>
//                   </div>
//                 </div>

//                 {/* Top Section: Map & Detail Panel */}
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-125">
//                   {/* Map Area */}
//                   <div
//                     className={cn(
//                       isCultivationRegionDetailOpen && "opacity-0 invisible",
//                       "lg:col-span-8 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-xl relative min-h-80 lg:min-h-125 transition-all duration-300 ease-in-out",
//                     )}
//                   >
//                     <MFMap
//                       center={mapCenter}
//                       zoom={mapZoom}
//                       accessKey={MAP4D_ACCESS_KEY}
//                       options={{ mapType: "raster", controlOptions: {} }}
//                       version="2.5"
//                     >
//                       <ZoneMapContent
//                         regions={selectedCultivationTargets.visibleRegions}
//                         enterprises={enterprises}
//                         selectedUnit={selectedUnit}
//                         targetRegionIds={
//                           selectedCultivationTargets.targetRegionIds
//                         }
//                         targetAreaIds={selectedCultivationTargets.targetAreaIds}
//                         targetPlotIds={selectedCultivationTargets.targetPlotIds}
//                         targetSignature={
//                           selectedCultivationTargets.targetSignature
//                         }
//                         onFocusCoordinates={focusMapToCoordinates}
//                         onSelectUnit={(type, data) =>
//                           setSelectedUnit({ type, data })
//                         }
//                       />
//                     </MFMap>

//                     {/* Map Controls */}
//                     <div className="absolute top-4 right-4 z-[1000]">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setIsMapExpanded(true);
//                         }}
//                         className="p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl hover:bg-white text-slate-600 transition-all active:scale-95"
//                       >
//                         <Maximize2 size={20} />
//                       </button>
//                     </div>

//                     {/* Legend */}
//                     <div className="absolute bottom-4 left-4 z-1000 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/50 space-y-2">
//                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
//                         <div className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500" />
//                         <span>Vùng trồng (Zone)</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
//                         <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500" />
//                         <span>Khu vực (Area)</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
//                         <div className="w-3 h-3 rounded-sm bg-orange-500/20 border border-orange-500" />
//                         <span>Lô (Plot)</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Map Expansion Dialog - placed outside map container to avoid overflow clipping */}
//                   <Dialog open={isMapExpanded} onOpenChange={setIsMapExpanded}>
//                     <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] p-0 overflow-hidden border-none shadow-2xl rounded-3xl z-10000">
//                       {/* Accessibility-only title */}
//                       <DialogHeader className="sr-only">
//                         <DialogTitle>Bản đồ chi tiết</DialogTitle>
//                       </DialogHeader>

//                       <div className="flex h-full">
//                         {/* Left: Map */}
//                         <div className="flex-1 relative bg-slate-100">
//                           <MFMap
//                             center={mapCenter}
//                             zoom={mapZoom}
//                             accessKey={MAP4D_ACCESS_KEY}
//                             options={{ mapType: "raster", controlOptions: {} }}
//                             version="2.5"
//                           >
//                             <ZoneMapContent
//                               regions={
//                                 selectedCultivationTargets.visibleRegions
//                               }
//                               enterprises={enterprises}
//                               selectedUnit={selectedUnit}
//                               targetRegionIds={
//                                 selectedCultivationTargets.targetRegionIds
//                               }
//                               targetAreaIds={
//                                 selectedCultivationTargets.targetAreaIds
//                               }
//                               targetPlotIds={
//                                 selectedCultivationTargets.targetPlotIds
//                               }
//                               targetSignature={
//                                 selectedCultivationTargets.targetSignature
//                               }
//                               onFocusCoordinates={focusMapToCoordinates}
//                               onSelectUnit={(type, data) =>
//                                 setSelectedUnit({ type, data })
//                               }
//                             />
//                           </MFMap>

//                           {/* Close button */}
//                           <button
//                             onClick={() => setIsMapExpanded(false)}
//                             className="absolute top-4 right-4 z-[1000] p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl hover:bg-white text-slate-600 transition-all active:scale-95"
//                           >
//                             <X size={20} />
//                           </button>

//                           {/* Legend */}
//                           <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 space-y-3">
//                             <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
//                               <div className="w-4 h-4 rounded-md bg-blue-500/20 border-2 border-blue-500" />
//                               <span>Vùng trồng</span>
//                             </div>
//                             <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
//                               <div className="w-4 h-4 rounded-md bg-emerald-500/20 border-2 border-emerald-500" />
//                               <span>Khu vực</span>
//                             </div>
//                             <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
//                               <div className="w-4 h-4 rounded-md bg-orange-500/20 border-2 border-orange-500" />
//                               <span>Lô</span>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Right: Detail sidebar */}
//                         <div className="w-80 bg-white border-l border-slate-100 flex flex-col overflow-hidden shrink-0">
//                           <div className="px-5 pt-5 pb-4 border-b bg-slate-50/60">
//                             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
//                               <Activity size={14} className="text-primary" />
//                               Thông tin chi tiết
//                             </h3>
//                           </div>

//                           <div className="flex-1 overflow-y-auto split-scrollbar p-5">
//                             {selectedUnit ? (
//                               <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
//                                 {/* Type badge + code */}
//                                 <div className="flex items-center justify-between">
//                                   <Badge
//                                     className={cn(
//                                       "uppercase font-bold px-2 py-1",
//                                       selectedUnit.type === "region"
//                                         ? "bg-blue-500"
//                                         : selectedUnit.type === "area"
//                                           ? "bg-emerald-500"
//                                           : "bg-orange-500",
//                                     )}
//                                   >
//                                     {selectedUnit.type === "region"
//                                       ? "Vùng trồng"
//                                       : selectedUnit.type === "area"
//                                         ? "Khu vực"
//                                         : "Lô"}
//                                   </Badge>
//                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                     {selectedUnit.data.code || "N/A"}
//                                   </span>
//                                 </div>

//                                 <h3 className="text-xl font-bold text-slate-800 leading-tight">
//                                   {selectedUnit.data.name}
//                                 </h3>

//                                 <div className="grid grid-cols-2 gap-3">
//                                   <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
//                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                                       Diện tích
//                                     </p>
//                                     <p className="text-base font-bold text-slate-800">
//                                       {selectedUnit.data.area} ha
//                                     </p>
//                                   </div>
//                                   <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
//                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                                       Trạng thái
//                                     </p>
//                                     <code
//                                       className={cn(
//                                         "mt-1 font-bold text-sm",
//                                         selectedUnit.data.status === "active"
//                                           ? "text-primary"
//                                           : "text-red-500",
//                                       )}
//                                     >
//                                       {getStatusLabel(
//                                         selectedUnit.data.status || "active",
//                                       )}
//                                     </code>
//                                   </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                                     <Activity
//                                       size={12}
//                                       className="text-primary"
//                                     />
//                                     Thông tin chi tiết
//                                   </h4>
//                                   <div className="divide-y divide-slate-50">
//                                     <div className="flex justify-between items-center text-xs py-2">
//                                       <span className="text-slate-500">
//                                         Loại đất
//                                       </span>
//                                       <span className="font-bold text-slate-800">
//                                         {getUnitSoilType()}
//                                       </span>
//                                     </div>
//                                     <div className="flex justify-between items-center text-xs py-2">
//                                       <span className="text-slate-500">
//                                         Cây trồng chính
//                                       </span>
//                                       <span className="font-bold text-slate-800">
//                                         {getUnitMainCrop()}
//                                       </span>
//                                     </div>
//                                     <div className="flex justify-between items-start text-xs py-2">
//                                       <span className="text-slate-500 flex-3">
//                                         Tọa độ
//                                       </span>
//                                       <div className="flex flex-col gap-2 flex-7">
//                                         {selectedUnit.data.coordinates?.map(
//                                           (item: Coordinate, index: number) => {
//                                             return (
//                                               <span
//                                                 key={index + "item"}
//                                                 className="font-bold text-slate-800"
//                                               >
//                                                 Kinh độ: {item.lng}, Vĩ độ:{" "}
//                                                 {item.lat}
//                                               </span>
//                                             );
//                                           },
//                                         )}
//                                       </div>
//                                     </div>
//                                     <div className="flex justify-between items-center text-xs py-2">
//                                       <span className="text-slate-500">
//                                         Cao độ
//                                       </span>
//                                       <span className="font-bold text-slate-800">
//                                         {selectedUnit.data.altitude
//                                           ? `${selectedUnit.data.altitude}m`
//                                           : selectedUnit.data.contour || "N/A"}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {(selectedUnit.data.address ||
//                                   selectedUnit.data.note) && (
//                                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
//                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                       Ghi chú
//                                     </p>
//                                     <p className="text-xs text-slate-600 leading-relaxed">
//                                       {selectedUnit.data.address ||
//                                         selectedUnit.data.note}
//                                     </p>
//                                   </div>
//                                 )}

//                                 {selectedUnit.type === "region" &&
//                                   selectedUnit.data.cropVarieties && (
//                                     <div className="space-y-2">
//                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                         Cây trồng
//                                       </p>
//                                       <div className="flex flex-wrap gap-2">
//                                         {(
//                                           selectedUnit.data
//                                             .cropVarieties as any[]
//                                         ).map((cv, idx) => (
//                                           <Badge
//                                             key={idx}
//                                             variant="outline"
//                                             className="bg-white font-bold italic text-primary border-primary/20 text-[10px]"
//                                           >
//                                             {cv.name} — {cv.variety}
//                                           </Badge>
//                                         ))}
//                                       </div>
//                                     </div>
//                                   )}
//                               </div>
//                             ) : selectedCultivationRegion ? (
//                               <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
//                                 <div className="flex items-center justify-between">
//                                   <Badge className="uppercase font-bold px-2 py-1 bg-slate-700">
//                                     Vùng canh tác
//                                   </Badge>
//                                   <code
//                                     className={cn(
//                                       "mt-1 font-bold text-sm",
//                                       selectedCultivationRegion.status ===
//                                         "active"
//                                         ? "text-primary"
//                                         : "text-red-500",
//                                     )}
//                                   >
//                                     {getStatusLabel(
//                                       selectedCultivationRegion.status,
//                                     )}
//                                   </code>
//                                 </div>

//                                 <h3 className="text-lg font-bold text-slate-800 leading-tight">
//                                   {selectedCultivationRegion.name}
//                                 </h3>

//                                 <div className="space-y-2">
//                                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                                     <Layers
//                                       size={12}
//                                       className="text-primary"
//                                     />
//                                     Phạm vi địa lý
//                                   </h4>
//                                   <GeographyScopeTree
//                                     scopeTree={scopeTree}
//                                     selectedUnit={selectedUnit}
//                                     onSelectUnit={(type, data) =>
//                                       setSelectedUnit({ type, data })
//                                     }
//                                     onFocusCoordinates={focusMapToCoordinates}
//                                     fallbackText={
//                                       selectedCultivationRegion.targetName
//                                     }
//                                   />
//                                 </div>

//                                 <Button
//                                   className="w-full rounded-md font-bold text-xs shadow-lg shadow-primary/20"
//                                   onClick={() =>
//                                     openCultivationRegionDetail({
//                                       closeMap: true,
//                                     })
//                                   }
//                                 >
//                                   Xem chi tiết vùng canh tác
//                                 </Button>
//                               </div>
//                             ) : (
//                               <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-center text-sm px-4">
//                                 <Layers
//                                   size={40}
//                                   className="mb-3 text-slate-100"
//                                 />
//                                 Chọn vùng canh tác (bảng danh sách) hoặc chọn
//                                 đơn vị trên bản đồ để xem thông tin
//                               </div>
//                             )}
//                           </div>

//                           {selectedUnit && (
//                             <div className="p-4 border-t bg-slate-50/60 space-y-2">
//                               <Button
//                                 variant="outline"
//                                 className="w-full rounded-md font-bold text-xs"
//                                 onClick={clearSelectedUnit}
//                               >
//                                 Hủy lựa chọn
//                               </Button>
//                               {/* <Button
//                                 variant="outline"
//                                 className="w-full rounded-xl font-bold text-xs"
//                                 onClick={() => {
//                                   setIsMapExpanded(false);
//                                   setIsDetailExpanded(true);
//                                 }}
//                               >
//                                 <Maximize2 size={14} className="mr-2" />
//                                 Xem chi tiết đầy đủ
//                               </Button> */}
//                               <Button
//                                 className="w-full rounded-md font-bold text-xs shadow-lg shadow-primary/20"
//                                 onClick={() => {
//                                   setIsMapExpanded(false);
//                                   handleNavigateToDetail();
//                                 }}
//                               >
//                                 Vào trang quản lý
//                               </Button>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </DialogContent>
//                   </Dialog>

//                   <Dialog
//                     open={isCultivationRegionDetailOpen}
//                     onOpenChange={setIsCultivationRegionDetailOpen}
//                   >
//                     <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] p-0 overflow-hidden border-none shadow-2xl rounded-3xl z-50">
//                       <div className="h-full overflow-y-auto p-6">
//                         <div className="flex items-center gap-4 mb-4">
//                           <div
//                             className={cn(
//                               "w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg bg-blue-500",
//                             )}
//                           >
//                             <Layers size={24} />
//                           </div>
//                           <div>
//                             <DialogTitle className="text-xl font-bold text-slate-800">
//                               Chi tiết vùng trồng
//                             </DialogTitle>
//                           </div>
//                         </div>
//                         {selectedCultivationRegion && (
//                           <CultivationRegionDetailView
//                             id={selectedCultivationRegion.id}
//                           />
//                         )}
//                       </div>
//                     </DialogContent>
//                   </Dialog>

//                   {/* Detail Panel */}
//                   <div className="lg:col-span-4 flex flex-col gap-6">
//                     <div className="flex-1 bg-white rounded-2xl shadow-xl border-4 border-white overflow-y-auto split-scrollbar p-4">
//                       {selectedUnit ? (
//                         <div className="animate-in fade-in slide-in-from-right-4 duration-300">
//                           <div className="flex items-center justify-between mb-4">
//                             <Badge
//                               className={cn(
//                                 "uppercase font-bold px-2 py-1",
//                                 selectedUnit.type === "region"
//                                   ? "bg-blue-500"
//                                   : selectedUnit.type === "area"
//                                     ? "bg-emerald-500"
//                                     : "bg-orange-500",
//                               )}
//                             >
//                               {selectedUnit.type === "region"
//                                 ? "Vùng trồng"
//                                 : selectedUnit.type === "area"
//                                   ? "Khu vực"
//                                   : "Lô"}
//                             </Badge>
//                             <div className="flex items-center gap-2">
//                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                 {selectedUnit.data.code || "N/A"}
//                               </span>
//                               {/* <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100"
//                                 onClick={() => setIsDetailExpanded(true)}
//                               >
//                                 <Maximize2
//                                   size={16}
//                                   className="text-slate-400"
//                                 />
//                               </Button> */}
//                             </div>
//                           </div>

//                           {/* <Dialog
//                             open={isDetailExpanded}
//                             onOpenChange={setIsDetailExpanded}
//                           >
//                             <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden border-none shadow-2xl z-1000">
//                               <DialogHeader className="bg-slate-50 border-b p-6">
//                                 <div className="flex items-center gap-4">
//                                   <div
//                                     className={cn(
//                                       "w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg",
//                                       selectedUnit.type === "region"
//                                         ? "bg-blue-500"
//                                         : selectedUnit.type === "area"
//                                           ? "bg-emerald-500"
//                                           : "bg-orange-500",
//                                     )}
//                                   >
//                                     <Layers size={24} />
//                                   </div>
//                                   <div>
//                                     <DialogTitle className="text-xl font-bold text-slate-800">
//                                       {selectedUnit.data.name}
//                                     </DialogTitle>
//                                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
//                                       {selectedUnit.type === "region"
//                                         ? "Chi tiết vùng trồng"
//                                         : selectedUnit.type === "area"
//                                           ? "Chi tiết khu vực"
//                                           : "Chi tiết lô"}{" "}
//                                       — {selectedUnit.data.code}
//                                     </p>
//                                   </div>
//                                 </div>
//                               </DialogHeader>

//                               <div className="p-8 bg-white space-y-8 max-h-[70vh] overflow-y-auto split-scrollbar">
//                                 <div className="grid grid-cols-3 gap-6">
//                                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
//                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                                       Diện tích
//                                     </p>
//                                     <p className="text-xl font-bold text-slate-800">
//                                       {selectedUnit.data.area} ha
//                                     </p>
//                                   </div>
//                                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
//                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                                       Trạng thái
//                                     </p>
//                                     <div className="flex justify-center mt-1">
//                                       {getStatusBadge(
//                                         selectedUnit.data.status || "active",
//                                       )}
//                                     </div>
//                                   </div>
//                                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
//                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                                       Mã hiệu
//                                     </p>
//                                     <p className="text-xl font-bold text-slate-800">
//                                       {selectedUnit.data.code}
//                                     </p>
//                                   </div>
//                                 </div>

//                                 <div className="space-y-4">
//                                   <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-l-4 border-primary pl-3">
//                                     Thông số địa lý
//                                   </h4>
//                                   <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
//                                     <div className="flex justify-between items-center border-b border-slate-100 pb-2">
//                                       <span className="text-slate-500 font-medium italic">
//                                         Loại đất
//                                       </span>
//                                       <span className="text-slate-800 font-bold uppercase">
//                                         {selectedUnit.data.landType ||
//                                           "Chưa xác định"}
//                                       </span>
//                                     </div>
//                                     <div className="flex justify-between items-center border-b border-slate-100 pb-2">
//                                       <span className="text-slate-500 font-medium italic">
//                                         Địa hình
//                                       </span>
//                                       <span className="text-slate-800 font-bold uppercase">
//                                         {selectedUnit.data.terrain ||
//                                           "Chưa xác định"}
//                                       </span>
//                                     </div>
//                                     <div className="flex justify-between items-center border-b border-slate-100 pb-2">
//                                       <span className="text-slate-500 font-medium italic">
//                                         Tọa độ trung tâm
//                                       </span>
//                                       <span className="text-slate-800 font-bold">
//                                         11.53, 106.88
//                                       </span>
//                                     </div>
//                                     <div className="flex justify-between items-center border-b border-slate-100 pb-2">
//                                       <span className="text-slate-500 font-medium italic">
//                                         Cao độ / Đường đồng mức
//                                       </span>
//                                       <span className="text-slate-800 font-bold italic">
//                                         {selectedUnit.data.altitude
//                                           ? `${selectedUnit.data.altitude}m`
//                                           : selectedUnit.data.contour || "N/A"}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 <div className="space-y-4">
//                                   <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-l-4 border-primary pl-3">
//                                     Thông tin bổ sung
//                                   </h4>
//                                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
//                                     <div className="space-y-2">
//                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                         Địa chỉ chi tiết / Ghi chú
//                                       </p>
//                                       <p className="text-sm text-slate-600 leading-relaxed font-medium">
//                                         {selectedUnit.data.address ||
//                                           selectedUnit.data.note ||
//                                           "Không có thông tin mô tả chi tiết cho đơn vị này."}
//                                       </p>
//                                     </div>
//                                     {selectedUnit.type === "region" &&
//                                       selectedUnit.data.cropVarieties && (
//                                         <div className="pt-4 border-t border-slate-100 space-y-2">
//                                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                             Cây trồng hiện tại
//                                           </p>
//                                           <div className="flex flex-wrap gap-2">
//                                             {(
//                                               selectedUnit.data
//                                                 .cropVarieties as any[]
//                                             ).map((cv, idx) => (
//                                               <Badge
//                                                 key={idx}
//                                                 variant="outline"
//                                                 className="bg-white font-bold italic text-primary border-primary/20"
//                                               >
//                                                 {cv.name} — {cv.variety}
//                                               </Badge>
//                                             ))}
//                                           </div>
//                                         </div>
//                                       )}
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
//                                 <Button
//                                   variant="outline"
//                                   className="rounded-xl font-bold px-6"
//                                   onClick={() => setIsDetailExpanded(false)}
//                                 >
//                                   Đóng
//                                 </Button>
//                                 <Button
//                                   className="rounded-xl font-bold px-8 shadow-lg shadow-primary/20"
//                                   onClick={() => {
//                                     setIsDetailExpanded(false);
//                                     handleNavigateToDetail();
//                                   }}
//                                 >
//                                   Vào trang quản lý
//                                 </Button>
//                               </div>
//                             </DialogContent>
//                           </Dialog> */}

//                           <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">
//                             {selectedUnit.data.name}
//                           </h3>

//                           <div className="grid grid-cols-2 gap-4 mt-6">
//                             <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                                 Diện tích
//                               </p>
//                               <p className="text-lg font-bold text-slate-800">
//                                 {selectedUnit.data.area} ha
//                               </p>
//                             </div>
//                             <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                                 Trạng thái
//                               </p>
//                               <code
//                                 className={cn(
//                                   "mt-1 font-bold text-sm",
//                                   selectedUnit.data.status === "active"
//                                     ? "text-primary"
//                                     : "text-red-500",
//                                 )}
//                               >
//                                 {getStatusLabel(
//                                   selectedUnit.data.status || "active",
//                                 )}
//                               </code>
//                             </div>
//                           </div>

//                           <div className="mt-8 space-y-6">
//                             <div className="space-y-3">
//                               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                                 <Activity size={14} className="text-primary" />
//                                 Thông tin chi tiết
//                               </h4>
//                               <div className="space-y-2">
//                                 <div className="flex justify-between items-center text-xs">
//                                   <span className="text-slate-500 font-medium">
//                                     Loại đất
//                                   </span>
//                                   <span className="text-slate-800 font-bold">
//                                     {getUnitSoilType()}
//                                   </span>
//                                 </div>
//                                 <div className="flex justify-between items-center text-xs">
//                                   <span className="text-slate-500 font-medium">
//                                     Cây trồng chính
//                                   </span>
//                                   <span className="text-slate-800 font-bold">
//                                     {getUnitMainCrop()}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                           <Button
//                             variant="outline"
//                             className="w-full mt-12 h-12 rounded-xl font-bold uppercase text-xs tracking-widest"
//                             onClick={clearSelectedUnit}
//                           >
//                             Hủy lựa chọn
//                           </Button>

//                           <Button
//                             className="w-full mt-2 h-12 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
//                             onClick={handleNavigateToDetail}
//                           >
//                             Xem quản lý chi tiết
//                             <ChevronRight size={16} className="ml-2" />
//                           </Button>
//                         </div>
//                       ) : selectedCultivationRegion ? (
//                         <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
//                           <div className="flex items-center justify-between">
//                             <Badge className="uppercase font-bold px-2 py-1 bg-slate-700">
//                               Vùng canh tác
//                             </Badge>
//                             <code
//                               className={cn(
//                                 "mt-1 font-bold text-sm",
//                                 selectedCultivationRegion.status === "active"
//                                   ? "text-primary"
//                                   : "text-red-500",
//                               )}
//                             >
//                               {getStatusLabel(selectedCultivationRegion.status)}
//                             </code>
//                           </div>

//                           <h3 className="text-xl font-bold text-slate-800 leading-tight">
//                             {selectedCultivationRegion.name}
//                           </h3>

//                           <div className="space-y-2">
//                             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                               <Layers size={12} className="text-primary" />
//                               Phạm vi địa lý
//                             </h4>
//                             <GeographyScopeTree
//                               scopeTree={scopeTree}
//                               selectedUnit={selectedUnit}
//                               onSelectUnit={(type, data) =>
//                                 setSelectedUnit({ type, data })
//                               }
//                               onFocusCoordinates={focusMapToCoordinates}
//                               fallbackText={
//                                 selectedCultivationRegion.targetName
//                               }
//                             />
//                           </div>

//                           <Button
//                             className="w-full mt-6 h-12 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
//                             onClick={() => openCultivationRegionDetail()}
//                           >
//                             Xem chi tiết vùng canh tác
//                             <ChevronRight size={16} />
//                           </Button>
//                         </div>
//                       ) : (
//                         <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-center text-sm px-10">
//                           <Layers size={48} className="mb-4 text-slate-100" />
//                           Chọn một vùng canh tác trong danh sách để hiển thị các
//                           đơn vị địa lý trên bản đồ
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Bottom Section: Cultivation Region DataTable */}
//                 <div className="flex-1 bg-white rounded-xl overflow-hidden flex flex-col">
//                   <div className="flex items-center justify-between px-2  bg-slate-50/50 border-b ">
//                     <div className="p-4 font-black text-xs uppercase tracking-widest text-slate-500">
//                       Danh sách vùng canh tác
//                     </div>
//                     <Badge variant="outline" className="font-bold">
//                       {filteredCultivationRegions.length} vùng canh tác
//                     </Badge>
//                   </div>
//                   <div className="flex-1 overflow-hidden p-4">
//                     <DataTable
//                       columns={columns}
//                       data={filteredCultivationRegions}
//                       onView={(cr) => {
//                         setSelectedCultivationRegionId(cr.id);
//                         setSelectedUnit(null);
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </PageWrapper>//   );
// };

// const GeographyScopeTree = ({
//   scopeTree,
//   selectedUnit,
//   onSelectUnit,
//   onFocusCoordinates,
//   fallbackText,
// }: {
//   scopeTree: any[];
//   selectedUnit: any;
//   onSelectUnit: (type: "region" | "area" | "plot", data: any) => void;
//   onFocusCoordinates: (coordinates?: Coordinate[]) => void;
//   fallbackText: string;
// }) => {
//   return (
//     <div className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-2xl p-4">
//       {scopeTree.length > 0 ? (
//         <div className="mt-1 ml-1 relative">
//           <div className="absolute left-0 top-0 bottom-4 w-px bg-slate-200" />

//           <div className="space-y-4">
//             {scopeTree.map((rNode) => {
//               const regionActive =
//                 selectedUnit?.type === "region" &&
//                 String(selectedUnit.data?.id) === String(rNode.region.id);

//               return (
//                 <div key={rNode.region.id} className="relative">
//                   {/* Region Level */}
//                   <button
//                     type="button"
//                     className={cn(
//                       "flex items-center gap-3 relative z-10 pl-4 w-full text-left rounded-lg p-2 -mx-2 hover:bg-white transition-colors",
//                       regionActive && "bg-white ring-1 ring-primary/20",
//                     )}
//                     onClick={() => {
//                       onSelectUnit("region", rNode.region);
//                       onFocusCoordinates(rNode.region.coordinates);
//                     }}
//                   >
//                     <div className="absolute left-0 w-4 h-px bg-slate-200 top-1/2" />
//                     <div
//                       className={cn(
//                         "w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0",
//                         rNode.selected
//                           ? "bg-primary/5 border-primary/20"
//                           : "bg-white border-slate-100",
//                       )}
//                     >
//                       <MapPin
//                         className={cn(
//                           "w-3.5 h-3.5",
//                           rNode.selected ? "text-primary" : "text-slate-400",
//                         )}
//                       />
//                     </div>
//                     <div className="min-w-0">
//                       <div
//                         className={cn(
//                           "text-[10px] font-bold uppercase tracking-wider leading-none mb-1",
//                           rNode.selected ? "text-primary/60" : "text-slate-400",
//                         )}
//                       >
//                         Vùng trồng
//                       </div>
//                       <div
//                         className={cn(
//                           "text-xs font-bold truncate",
//                           regionActive
//                             ? "text-primary"
//                             : rNode.selected
//                               ? "text-slate-900"
//                               : "text-slate-700",
//                         )}
//                       >
//                         {rNode.region.name}
//                       </div>
//                     </div>
//                     {rNode.selected && (
//                       <Badge className="ml-auto bg-primary/10 text-primary border-none text-[10px]">
//                         Áp dụng
//                       </Badge>
//                     )}
//                   </button>

//                   {/* Area + Plot Levels */}
//                   {rNode.areas.length > 0 && (
//                     <div className="ml-5 border-l-2 border-slate-100 pl-6 space-y-5 mt-3">
//                       {rNode.areas.map((aNode: any) => {
//                         const areaActive =
//                           selectedUnit?.type === "area" &&
//                           String(selectedUnit.data?.id) ===
//                             String(aNode.area.id);

//                         return (
//                           <div key={aNode.area.id} className="relative">
//                             <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-5" />

//                             <button
//                               type="button"
//                               className={cn(
//                                 "flex items-center gap-3 relative z-10 w-full text-left rounded-lg p-2 -mx-2 hover:bg-white transition-colors",
//                                 areaActive && "bg-white ring-1 ring-primary/20",
//                               )}
//                               onClick={() => {
//                                 onSelectUnit("area", aNode.area);
//                                 onFocusCoordinates(aNode.area.coordinates);
//                               }}
//                             >
//                               <div
//                                 className={cn(
//                                   "w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0",
//                                   aNode.selected
//                                     ? "bg-primary/5 border-primary/20"
//                                     : "bg-white border-slate-100",
//                                 )}
//                               >
//                                 <Layers
//                                   className={cn(
//                                     "w-3.5 h-3.5",
//                                     aNode.selected
//                                       ? "text-primary"
//                                       : "text-slate-400",
//                                   )}
//                                 />
//                               </div>
//                               <div className="min-w-0">
//                                 <div
//                                   className={cn(
//                                     "text-[10px] uppercase font-bold tracking-wider leading-none mb-1",
//                                     aNode.selected
//                                       ? "text-primary/60"
//                                       : "text-slate-400",
//                                   )}
//                                 >
//                                   Khu vực
//                                 </div>
//                                 <div
//                                   className={cn(
//                                     "text-xs font-bold truncate",
//                                     areaActive
//                                       ? "text-primary"
//                                       : aNode.selected
//                                         ? "text-slate-900"
//                                         : "text-slate-700",
//                                   )}
//                                 >
//                                   {aNode.area.name}
//                                 </div>
//                               </div>
//                               {aNode.selected && (
//                                 <Badge className="ml-auto bg-primary/10 text-primary border-none text-[10px]">
//                                   Áp dụng
//                                 </Badge>
//                               )}
//                             </button>

//                             {aNode.plots.length > 0 && (
//                               <div className="ml-4.5 border-l-2 border-slate-100 pl-6 space-y-3 mt-3">
//                                 {aNode.plots.map((pNode: any) => {
//                                   const plotActive =
//                                     selectedUnit?.type === "plot" &&
//                                     String(selectedUnit.data?.id) ===
//                                       String(pNode.plot.id);

//                                   return (
//                                     <div
//                                       key={pNode.plot.id}
//                                       className="relative"
//                                     >
//                                       <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-5" />
//                                       <button
//                                         type="button"
//                                         className={cn(
//                                           "flex items-center gap-3 relative z-10 w-full text-left rounded-lg p-2 -mx-2 hover:bg-white transition-colors",
//                                           plotActive &&
//                                             "bg-white ring-1 ring-primary/20",
//                                         )}
//                                         onClick={() => {
//                                           onSelectUnit("plot", pNode.plot);
//                                           onFocusCoordinates(
//                                             pNode.plot.coordinates,
//                                           );
//                                         }}
//                                       >
//                                         <div
//                                           className={cn(
//                                             "w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0",
//                                             pNode.selected
//                                               ? "bg-primary/5 border-primary/20"
//                                               : "bg-white border-slate-100",
//                                           )}
//                                         >
//                                           <Target
//                                             className={cn(
//                                               "w-3.5 h-3.5",
//                                               pNode.selected
//                                                 ? "text-primary"
//                                                 : "text-slate-400",
//                                             )}
//                                           />
//                                         </div>
//                                         <div className="min-w-0">
//                                           <div
//                                             className={cn(
//                                               "text-[10px] uppercase font-bold tracking-wider leading-none mb-1",
//                                               pNode.selected
//                                                 ? "text-primary/60"
//                                                 : "text-slate-400",
//                                             )}
//                                           >
//                                             Lô
//                                           </div>
//                                           <div
//                                             className={cn(
//                                               "text-xs font-bold truncate",
//                                               plotActive
//                                                 ? "text-primary"
//                                                 : pNode.selected
//                                                   ? "text-slate-900"
//                                                   : "text-slate-700",
//                                             )}
//                                           >
//                                             {pNode.plot.name}
//                                           </div>
//                                         </div>
//                                         {pNode.selected && (
//                                           <Badge className="ml-auto bg-primary/10 text-primary border-none text-[10px]">
//                                             Áp dụng
//                                           </Badge>
//                                         )}
//                                       </button>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       ) : (
//         <div className="text-xs text-slate-700">{fallbackText}</div>
//       )}
//     </div>
//   );
// };

// const ZoneMapContent = ({
//   regions,
//   enterprises,
//   selectedUnit,
//   targetRegionIds,
//   targetAreaIds,
//   targetPlotIds,
//   targetSignature,
//   onFocusCoordinates,
//   onSelectUnit,
// }: {
//   regions: Region[];
//   enterprises: any[];
//   selectedUnit: any;
//   targetRegionIds: Set<number>;
//   targetAreaIds: Set<string>;
//   targetPlotIds: Set<string>;
//   targetSignature: string;
//   onFocusCoordinates: (coordinates?: Coordinate[]) => void;
//   onSelectUnit: (type: "region" | "area" | "plot", data: any) => void;
// }) => {
//   useEffect(() => {
//     if (!regions?.length) return;

//     const allCoords: Coordinate[] = [];
//     for (const region of regions) {
//       allCoords.push(...(region.coordinates || []));

//       for (const area of region.subAreas || []) {
//         const areaId = String(area.id);
//         const hasTargetPlot = (area.plots || []).some((p) =>
//           targetPlotIds.has(String(p.id)),
//         );
//         const shouldRenderArea =
//           targetAreaIds.size === 0 && targetPlotIds.size === 0
//             ? true
//             : targetAreaIds.has(areaId) || hasTargetPlot;
//         if (shouldRenderArea) allCoords.push(...(area.coordinates || []));

//         for (const plot of area.plots || []) {
//           if (targetPlotIds.has(String(plot.id))) {
//             allCoords.push(...(plot.coordinates || []));
//           }
//         }
//       }
//     }

//     if (!allCoords.length) return;
//     onFocusCoordinates(allCoords);
//   }, [
//     regions,
//     targetSignature,
//     targetAreaIds,
//     targetPlotIds,
//     onFocusCoordinates,
//   ]);

//   if (!regions?.length) return null;

//   const filterMode =
//     targetRegionIds.size > 0 ||
//     targetAreaIds.size > 0 ||
//     targetPlotIds.size > 0;

//   const toClosedPath = (coordinates?: Coordinate[]) => {
//     if (!coordinates || coordinates.length < 3) return [];

//     const path = coordinates.map((c) => ({ lat: c.lat, lng: c.lng }));
//     const first = path[0];
//     const last = path[path.length - 1];

//     if (first.lat !== last.lat || first.lng !== last.lng) {
//       path.push({ ...first });
//     }

//     return path;
//   };

//   const getRegionCenter = (coordinates?: Coordinate[]) => {
//     if (!coordinates?.length) return null;
//     const sum = coordinates.reduce(
//       (acc, coord) => ({
//         lat: acc.lat + coord.lat,
//         lng: acc.lng + coord.lng,
//       }),
//       { lat: 0, lng: 0 },
//     );
//     return {
//       lat: sum.lat / coordinates.length,
//       lng: sum.lng / coordinates.length,
//     };
//   };

//   return (
//     <>
//       {/* Owner Logo Markers */}
//       {regions.map((region) => {
//         const center = getRegionCenter(region.coordinates);
//         if (!center) return null;

//         const ownerEnterprise = enterprises.find(
//           (enterprise) =>
//             String(enterprise.id) === String((region as any).enterpriseId),
//         );

//         if (!ownerEnterprise?.image) return null;

//         return (
//           <MFMarker
//             key={`region-owner-${region.id}`}
//             position={center}
//             icon={{
//               url: ownerEnterprise.image,
//               width: 34,
//               height: 34,
//             }}
//             title={ownerEnterprise.brandName || ownerEnterprise.name}
//             clickable
//             label={""}
//             onClick={() => {
//               onFocusCoordinates(region.coordinates);
//               onSelectUnit("region", region);
//             }}
//           />
//         );
//       })}

//       {/* Regions */}
//       {regions.map((region) => {
//         const isTargetRegion = targetRegionIds.has(region.id);
//         const regionPath = toClosedPath(region.coordinates);
//         if (!regionPath.length) return null;
//         return (
//           <MFPolygon
//             key={`region-${region.id}`}
//             paths={[regionPath]}
//             strokeColor="#3b82f6"
//             strokeWidth={
//               selectedUnit?.type === "region" &&
//               selectedUnit.data.id === region.id
//                 ? 4
//                 : isTargetRegion
//                   ? 3
//                   : 2
//             }
//             fillColor="#3b82f6"
//             fillOpacity={0.1}
//             clickable
//             onClick={() => {
//               onFocusCoordinates(region.coordinates);
//               onSelectUnit("region", region);
//             }}
//           />
//         );
//       })}

//       {/* Sub-Areas (filtered when a cultivation region is selected) */}
//       {regions.flatMap((region) =>
//         (region.subAreas || []).flatMap((area) => {
//           const areaId = String(area.id);
//           const hasTargetPlot = (area.plots || []).some((p) =>
//             targetPlotIds.has(String(p.id)),
//           );
//           const shouldRenderArea = !filterMode
//             ? true
//             : targetAreaIds.has(areaId) || hasTargetPlot;

//           if (!shouldRenderArea) return [];
//           const isTargetArea = targetAreaIds.has(areaId);
//           const areaPath = toClosedPath(area.coordinates);
//           if (!areaPath.length) return [];

//           return [
//             <MFPolygon
//               key={`area-${area.id}`}
//               paths={[areaPath]}
//               strokeColor="#10b981"
//               strokeWidth={
//                 selectedUnit?.type === "area" &&
//                 selectedUnit.data.id === area.id
//                   ? 4
//                   : isTargetArea || hasTargetPlot
//                     ? 2.5
//                     : 1.5
//               }
//               fillColor="#10b981"
//               fillOpacity={isTargetArea ? 0.2 : 0.1}
//               clickable
//               onClick={() => {
//                 onFocusCoordinates(area.coordinates);
//                 onSelectUnit("area", area);
//               }}
//             />,
//           ];
//         }),
//       )}

//       {/* Plots */}
//       {regions.flatMap((region) =>
//         (region.subAreas || []).flatMap((area) =>
//           (area.plots || []).flatMap((plot) => {
//             const plotId = String(plot.id);
//             const shouldRenderPlot = !filterMode
//               ? true
//               : targetPlotIds.has(plotId);
//             if (!shouldRenderPlot) return [];
//             const isTargetPlot = targetPlotIds.has(plotId);
//             const plotPath = toClosedPath(plot.coordinates);
//             if (!plotPath.length) return [];

//             return [
//               <MFPolygon
//                 key={`plot-${plot.id}`}
//                 paths={[plotPath]}
//                 strokeColor="#f59e0b"
//                 strokeWidth={
//                   selectedUnit?.type === "plot" &&
//                   selectedUnit.data.id === plot.id
//                     ? 4
//                     : isTargetPlot
//                       ? 2
//                       : 1
//                 }
//                 fillColor="#f59e0b"
//                 fillOpacity={isTargetPlot ? 0.25 : 0.15}
//                 clickable
//                 onClick={() => {
//                   onFocusCoordinates(plot.coordinates);
//                   onSelectUnit("plot", plot);
//                 }}
//               />,
//             ];
//           }),
//         ),
//       )}
//     </>
//   );
// };

// const MultiSelectField = ({
//   label,
//   options,
//   selectedValues,
//   onToggle,
//   placeholder = "Tất cả",
// }: {
//   label: string;
//   options: { id: any; name: string }[];
//   selectedValues?: any[];
//   onToggle: (val: any) => void;
//   placeholder?: string;
// }) => (
//   <div className="space-y-2">
//     <Label className="text-xs font-bold text-slate-500 uppercase ml-1">
//       {label}
//     </Label>
//     <Select
//       value={selectedValues?.[0]?.toString() || ""}
//       onValueChange={(v) => {
//         onToggle(v);
//       }}
//     >
//       <SelectTrigger className="rounded-xl bg-white border-slate-200">
//         <SelectValue
//           placeholder={
//             selectedValues && selectedValues.length > 0
//               ? `Đã chọn ${selectedValues.length}`
//               : placeholder
//           }
//         />
//       </SelectTrigger>
//       <SelectContent>
//         {options.map((opt) => (
//           <SelectItem
//             key={opt.id}
//             value={opt.id.toString()}
//             className={cn(
//               selectedValues?.includes(opt.id) && "bg-primary/10 font-bold",
//             )}
//           >
//             <div className="flex items-center gap-2">
//               <Checkbox
//                 checked={selectedValues?.includes(opt.id)}
//                 onCheckedChange={() => onToggle(opt.id)}
//                 className="mr-2"
//               />
//               {opt.name}
//             </div>
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//     {selectedValues && selectedValues.length > 0 && (
//       <div className="flex flex-wrap gap-1 mt-1">
//         {selectedValues.map((val) => {
//           const opt = options.find((o) => o.id.toString() === val.toString());
//           return (
//             <Badge
//               key={val}
//               variant="secondary"
//               className="text-[10px] h-5 bg-primary/10 text-primary border-primary/20 gap-1 pr-1"
//             >
//               {opt?.name || val}
//               <X
//                 size={10}
//                 className="cursor-pointer hover:text-destructive"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onToggle(val);
//                 }}
//               />
//             </Badge>
//           );
//         })}
//       </div>
//     )}
//   </div>
// );

// export default SearchZonePage;
