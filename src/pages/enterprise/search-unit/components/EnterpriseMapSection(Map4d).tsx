// import React from "react";
// import { Button, Card, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
// import { Layers } from "lucide-react";
// import { MFMap, MFMarker, MFPolygon } from "react-map4d-map";

// interface EnterpriseMapSectionProps {
//   mapRef: React.MutableRefObject<any>;
//   mapRenderKey: number;
//   mapCurrentCenter: { lat: number; lng: number };
//   visiblePolygons: any[];
//   enterpriseMarkers: Array<{
//     id: number;
//     name: string;
//     code: string;
//     type: "enterprise" | "farm" | "cooperative";
//     image: string;
//     lat: number;
//     lng: number;
//   }>;
//   regionLogoMarkers: Array<{
//     id: string;
//     enterpriseId: number;
//     name: string;
//     image: string;
//     lat: number;
//     lng: number;
//   }>;
//   selectedEnterpriseId: number | null;
//   isDetailOpen: boolean;
// }

// const MapControls = ({ mapRef }: { mapRef: React.MutableRefObject<any> }) => {
//   return (
//     <div
//       className={cn(
//         "absolute bottom-6 right-6 z-20 flex flex-col gap-2 transition-all duration-300",
//       )}
//     >
//       <Button
//         variant="secondary"
//         size="icon"
//         className="w-10 h-10 rounded-md bg-white shadow-xl border border-slate-200 hover:bg-slate-50 transition-all group"
//         onClick={() => {
//           const map = mapRef.current;
//           if (!map) return;
//           const zoom = typeof map.getZoom === "function" ? map.getZoom() : 13;
//           if (typeof map.setZoom === "function") map.setZoom(zoom + 1);
//         }}
//       >
//         <span className="text-xl font-bold text-slate-700 group-hover:text-primary">
//           +
//         </span>
//       </Button>
//       <Button
//         variant="secondary"
//         size="icon"
//         className="w-10 h-10 rounded-md bg-white shadow-xl border border-slate-200 hover:bg-slate-50 transition-all group"
//         onClick={() => {
//           const map = mapRef.current;
//           if (!map) return;
//           const zoom = typeof map.getZoom === "function" ? map.getZoom() : 13;
//           if (typeof map.setZoom === "function") map.setZoom(zoom - 1);
//         }}
//       >
//         <span className="text-xl font-bold text-slate-700 group-hover:text-primary">
//           -
//         </span>
//       </Button>
//     </div>
//   );
// };

// export const EnterpriseMapSection: React.FC<EnterpriseMapSectionProps> = ({
//   mapRef,
//   mapRenderKey,
//   mapCurrentCenter,
//   visiblePolygons,
//   enterpriseMarkers,
//   regionLogoMarkers,
//   selectedEnterpriseId,
//   isDetailOpen,
// }) => {
//   const MAP4D_ACCESS_KEY = import.meta.env.VITE_MAP4D_ACCESS_KEY;
//   const toClosedPath = (coords: [number, number][]) => {
//     if (!coords || coords.length < 3) return [];
//     const path = coords.map(([lat, lng]) => ({ lat, lng }));
//     const first = path[0];
//     const last = path[path.length - 1];
//     const isClosed = first.lat === last.lat && first.lng === last.lng;
//     if (!isClosed) path.push({ ...first });
//     return path;
//   };

//   return (
//     <div className="flex-1 flex flex-col relative bg-slate-100">
//       <div className="flex-1 relative">
//         <MFMap
//           key={mapRenderKey}
//           center={mapCurrentCenter}
//           zoom={9}
//           accessKey={MAP4D_ACCESS_KEY}
//           options={{ mapType: "raster", controlOptions: {} }}
//           version="2.5"
//           onMapReady={(map) => {
//             if (map) mapRef.current = map;
//           }}
//         >
//           {visiblePolygons.map(
//             (poly) =>
//               toClosedPath(poly.coordinates).length > 0 && (
//                 <MFPolygon
//                   key={poly.id}
//                   paths={[toClosedPath(poly.coordinates)]}
//                   strokeColor={poly.color}
//                   strokeWidth={2}
//                   fillColor={poly.color}
//                   fillOpacity={0.2}
//                   clickable
//                   onClick={() => {
//                     const url = `/${poly.type}-distribution/detail/${poly.rawId}`;
//                     window.open(url, "_blank");
//                   }}
//                 />
//               ),
//           )}
//           {enterpriseMarkers.map((marker) => (
//             <MFMarker
//               key={`enterprise-marker-${marker.id}`}
//               position={{ lat: marker.lat, lng: marker.lng }}
//               icon={
//                 marker.image
//                   ? {
//                       url: marker.image,
//                       width: 34,
//                       height: 34,
//                     }
//                   : undefined
//               }
//               title={`${marker.code} - ${marker.name}`}
//               label={""}
//             />
//           ))}
//           {regionLogoMarkers.map((marker) => (
//             <MFMarker
//               key={`enterprise-region-logo-${marker.id}`}
//               position={{ lat: marker.lat, lng: marker.lng }}
//               icon={
//                 marker.image
//                   ? {
//                       url: marker.image,
//                       width: 30,
//                       height: 30,
//                     }
//                   : undefined
//               }
//               title={marker.name}
//               label={""}
//             />
//           ))}
//           <MapControls mapRef={mapRef} />
//         </MFMap>

//         {!isDetailOpen && (
//           <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-max max-w-[90%]">
//             <Card className="bg-white/95 backdrop-blur shadow-xl border rounded-md overflow-hidden">
//               <div className="px-6 py-4 flex items-center gap-4 border-b border-slate-100 bg-slate-100/30">
//                 <Layers className="text-primary animate-pulse" size={24} />
//                 <div>
//                   <h3 className="font-bold text-slate-800 tracking-tight text-sm">
//                     Vùng canh tác các đơn vị
//                   </h3>
//                   <p className="text-[10px] text-slate-500 font-medium tracking-tight">
//                     Vui lòng chọn một đơn vị để định vị vị trí trên bản đồ
//                   </p>
//                 </div>
//               </div>
//               <div className="px-6 py-2 bg-white flex items-center gap-6">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
//                   <span className="text-[10px] font-bold text-slate-600">
//                     Marker đơn vị
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
//                   <span className="text-[10px] font-bold text-slate-600">
//                     Vùng trồng
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
//                   <span className="text-[10px] font-bold text-slate-600">
//                     Khu vực
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />
//                   <span className="text-[10px] font-bold text-slate-600">
//                     Lô canh tác
//                   </span>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
