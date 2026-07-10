// import {
//   Badge,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   ScrollArea,
// } from "@Team-Trung-Vu-Khang/eco-shared-ui";
// import { MFMap, MFMarker } from "react-map4d-map";
// import { Edit2, Layers, Navigation } from "lucide-react";
// import { MOCK_SEEDS } from "../constants";
// import type {
//   DistributionMethod,
//   PlantEntry,
//   PlantLocation,
//   RowConfig,
// } from "../constants";
// import treeMarkerIcon from "@/assets/tree.webp";
// type Props = {
//   distributionMethod: DistributionMethod;
//   plantEntries: PlantEntry[];
//   rowConfigs: RowConfig[];
//   plantLocations: PlantLocation[];
//   selectedPlantId: string | null;
//   getSeedColor: (seedId: string) => string;
//   setSelectedPlantId: (id: string | null) => void;
//   updatePlantLocation: (id: string, lat: number, lng: number) => void;
//   generatePlantLocations: () => void;
// };

// export const PlantDistributionGpsStep = ({
//   distributionMethod,
//   plantEntries,
//   rowConfigs,
//   plantLocations,
//   selectedPlantId,
//   getSeedColor,
//   setSelectedPlantId,
//   updatePlantLocation,
//   generatePlantLocations,
// }: Props) => {
//   const MAP4D_ACCESS_KEY = import.meta.env.VITE_MAP4D_ACCESS_KEY;
//   const totalPlants =
//     distributionMethod === "zone"
//       ? plantEntries.reduce((sum, entry) => sum + entry.quantity, 0)
//       : rowConfigs.reduce((sum, row) => sum + row.quantity, 0);

//   return (
//     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
//       <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 flex items-start gap-4">
//         <div className="bg-purple-100 p-2 rounded-full text-purple-600 shrink-0">
//           <Navigation className="w-6 h-6" />
//         </div>
//         <div className="text-purple-900">
//           <div className="font-bold text-lg mb-1">Bước 3: Định vị GPS</div>
//           <div className="text-sm opacity-90">
//             Xác định và điều chỉnh tọa độ GPS cho từng cây trồng. Bạn có thể kéo
//             thả marker trên bản đồ hoặc nhập tọa độ chính xác.
//           </div>
//         </div>
//       </div>

//       {plantLocations.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-2xl bg-slate-50 text-slate-500">
//           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
//             <Navigation className="w-10 h-10 text-purple-500 opacity-80" />
//           </div>
//           <h3 className="text-xl font-bold text-slate-800 mb-2">
//             Chưa có dữ liệu định vị
//           </h3>
//           <p className="text-muted-foreground text-center max-w-md mb-6">
//             Hệ thống sẽ tự động khởi tạo tọa độ GPS cho{" "}
//             <strong>{totalPlants}</strong> cây trồng dựa trên phương thức phân
//             bổ đã chọn.
//           </p>
//           <Button
//             onClick={generatePlantLocations}
//             size="lg"
//             className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200"
//           >
//             <Navigation className="w-5 h-5 mr-2" />
//             Khởi tạo {totalPlants} điểm GPS
//           </Button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
//           <div className="lg:col-span-2 flex flex-col gap-4 h-full">
//             <Card className="flex-1 border-none shadow-lg overflow-hidden flex flex-col relative ring-1 ring-slate-200">
//               <div className="absolute top-4 right-4 z-[1000] flex gap-2">
//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   onClick={generatePlantLocations}
//                   className="shadow-md bg-white/90 backdrop-blur hover:bg-white text-xs h-8"
//                 >
//                   <Edit2 className="w-3 h-3 mr-1.5" />
//                   Tạo lại tất cả
//                 </Button>
//               </div>

//               <MFMap
//                 center={{
//                   lat: plantLocations[0]?.coordinate.lat || 11.558,
//                   lng: plantLocations[0]?.coordinate.lng || 107.134,
//                 }}
//                 zoom={18}
//                 accessKey={MAP4D_ACCESS_KEY}
//                 options={{ mapType: "raster", controlOptions: {} }}
//                 version="2.5"
//               >
//                 {plantLocations.map((location) => {
//                   const seed = MOCK_SEEDS.find(
//                     (item) => item.id === location.seedId,
//                   );
//                   const seedName = seed?.name || "Chưa xác định";

//                   return (
//                     <MFMarker
//                       key={location.id}
//                       position={{
//                         lat: location.coordinate.lat,
//                         lng: location.coordinate.lng,
//                       }}
//                       icon={{
//                         url: treeMarkerIcon,
//                         width: 32,
//                         height: 32,
//                       }}
//                       title={`${location.plantCode} - ${seedName}`}
//                       label={""}
//                       draggable
//                       clickable
//                       onDragEnd={(event: unknown) => {
//                         const eventWithLatLng = event as {
//                           latLng?: { lat?: number; lng?: number };
//                         };
//                         const lat = eventWithLatLng?.latLng?.lat;
//                         const lng = eventWithLatLng?.latLng?.lng;
//                         if (
//                           typeof lat === "number" &&
//                           typeof lng === "number"
//                         ) {
//                           updatePlantLocation(location.id, lat, lng);
//                         }
//                       }}
//                       onClick={() => {
//                         setSelectedPlantId(location.id);
//                       }}
//                     />
//                   );
//                 })}
//               </MFMap>

//               <div className="absolute bottom-4 left-4 right-auto bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-slate-200 max-w-[200px] z-[500]">
//                 <div className="text-xs font-bold mb-2 text-slate-800">
//                   Chú thích loại cây
//                 </div>
//                 <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
//                   {Array.from(
//                     new Set(plantLocations.map((location) => location.seedId)),
//                   ).map((seedId) => {
//                     const seed = MOCK_SEEDS.find((item) => item.id === seedId);
//                     const count = plantLocations.filter(
//                       (location) => location.seedId === seedId,
//                     ).length;
//                     const color = getSeedColor(seedId);

//                     return (
//                       <div
//                         key={seedId}
//                         className="flex items-center gap-2 text-[10px]"
//                       >
//                         <span
//                           className="w-2.5 h-2.5 rounded-full shadow-sm"
//                           style={{ backgroundColor: color }}
//                         />
//                         <span className="flex-1 truncate font-medium text-slate-700">
//                           {seed?.name}
//                         </span>
//                         <span className="text-slate-400 font-mono">
//                           {count}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </Card>
//           </div>

//           <div className="flex flex-col gap-4 h-full">
//             <Card className="flex-none bg-indigo-900 text-white border-none shadow-md overflow-hidden relative">
//               <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-6 -mt-6 blur-2xl" />
//               <CardContent className="p-5 relative z-10">
//                 <div className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">
//                   Tổng quan
//                 </div>
//                 <div className="flex items-end gap-2 mb-4">
//                   <span className="text-3xl font-bold">{totalPlants}</span>
//                   <span className="text-sm font-medium mb-1.5 text-white/80">
//                     cây đã định vị
//                   </span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3 text-xs">
//                   <div className="bg-white/10 rounded px-2 py-1.5 backdrop-blur-sm">
//                     <div className="text-white/50 mb-0.5">Phương thức</div>
//                     <div className="font-semibold">
//                       {distributionMethod === "zone"
//                         ? "Theo vùng"
//                         : "Theo hàng"}
//                     </div>
//                   </div>
//                   <div className="bg-white/10 rounded px-2 py-1.5 backdrop-blur-sm">
//                     <div className="text-white/50 mb-0.5">Mật độ</div>
//                     <div className="font-semibold">
//                       ~{totalPlants > 0 ? (totalPlants / 10).toFixed(1) : 0}/m²
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="flex-1 border-slate-200 shadow-sm flex flex-col min-h-0 bg-white">
//               <CardHeader className="py-3 px-4 border-b bg-slate-50 min-h-[48px] flex justify-center">
//                 <div className="flex items-center justify-between w-full">
//                   <span className="font-semibold text-sm text-slate-700 flex items-center gap-2">
//                     <Layers className="w-4 h-4 text-slate-400" />
//                     Danh sách tọa độ
//                   </span>
//                   <Badge
//                     variant="outline"
//                     className="bg-white text-xs font-normal"
//                   >
//                     {plantLocations.length} điểm
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent className="p-0 flex-1 relative">
//                 <div className="absolute inset-0">
//                   <ScrollArea className="h-full">
//                     <div className="divide-y divide-slate-100">
//                       {plantLocations.map((location) => {
//                         const seed = MOCK_SEEDS.find(
//                           (item) => item.id === location.seedId,
//                         );
//                         const isSelected = selectedPlantId === location.id;

//                         return (
//                           <div
//                             key={location.id}
//                             onClick={() => setSelectedPlantId(location.id)}
//                             className={`p-3 text-sm cursor-pointer transition-colors hover:bg-slate-50 ${isSelected ? "bg-indigo-50/60" : ""}`}
//                           >
//                             <div className="flex items-start gap-3">
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-center gap-2 mb-1">
//                                   <span
//                                     className={`font-mono font-bold text-xs ${isSelected ? "text-indigo-700" : "text-slate-700"}`}
//                                   >
//                                     {location.plantCode}
//                                   </span>
//                                   {isSelected && (
//                                     <Badge
//                                       variant="secondary"
//                                       className="text-[10px] h-4 px-1 bg-indigo-100 text-indigo-700"
//                                     >
//                                       Active
//                                     </Badge>
//                                   )}
//                                 </div>
//                                 <div className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
//                                   <span
//                                     className="w-2 h-2 rounded-full flex-shrink-0"
//                                     style={{
//                                       backgroundColor: getSeedColor(
//                                         location.seedId,
//                                       ),
//                                     }}
//                                   />
//                                   {seed?.name}
//                                 </div>
//                               </div>

//                               <div className="flex flex-col gap-1 items-end">
//                                 <div className="bg-slate-100 rounded text-[10px] font-mono px-1.5 py-0.5 text-slate-500 whitespace-nowrap">
//                                   {location.coordinate.lat.toFixed(6)},{" "}
//                                   {location.coordinate.lng.toFixed(6)}
//                                 </div>
//                               </div>
//                             </div>

//                             {isSelected && (
//                               <div className="mt-2 grid grid-cols-2 gap-2 animate-in slide-in-from-top-1 bg-white p-2 rounded border border-indigo-100 shadow-sm">
//                                 <div>
//                                   <label className="text-[10px] text-muted-foreground block mb-0.5">
//                                     Lat
//                                   </label>
//                                   <input
//                                     className="w-full text-xs p-1 border rounded font-mono focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 outline-none"
//                                     type="number"
//                                     step="0.000001"
//                                     value={location.coordinate.lat}
//                                     onChange={(event) => {
//                                       const value = parseFloat(
//                                         event.target.value,
//                                       );
//                                       if (!Number.isNaN(value)) {
//                                         updatePlantLocation(
//                                           location.id,
//                                           value,
//                                           location.coordinate.lng,
//                                         );
//                                       }
//                                     }}
//                                   />
//                                 </div>
//                                 <div>
//                                   <label className="text-[10px] text-muted-foreground block mb-0.5">
//                                     Lng
//                                   </label>
//                                   <input
//                                     className="w-full text-xs p-1 border rounded font-mono focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 outline-none"
//                                     type="number"
//                                     step="0.000001"
//                                     value={location.coordinate.lng}
//                                     onChange={(event) => {
//                                       const value = parseFloat(
//                                         event.target.value,
//                                       );
//                                       if (!Number.isNaN(value)) {
//                                         updatePlantLocation(
//                                           location.id,
//                                           location.coordinate.lat,
//                                           value,
//                                         );
//                                       }
//                                     }}
//                                   />
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </ScrollArea>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
