// import {
//   AdminLayout,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@Team-Trung-Vu-Khang/eco-shared-ui";
// import { ChevronLeft, Edit, MapPin } from "lucide-react";
// import { MFMap, MFPolygon } from "react-map4d-map";
// import { RegionChartStatusBadge } from "../components/RegionChartStatusBadge";
// import { useAreaDetailPage } from "../hooks/useAreaDetailPage";

// const AreaDetailPage = () => {
//   const MAP4D_ACCESS_KEY = import.meta.env.VITE_MAP4D_ACCESS_KEY;
//   const { setLocation, area, region, center, landTypeName, terrainName } =
//     useAreaDetailPage();
//   const closePath = (points: Array<{ lat: number; lng: number }>) => {
//     if (!points || points.length < 3) return [];
//     const path = points.map((p) => ({ lat: p.lat, lng: p.lng }));
//     const first = path[0];
//     const last = path[path.length - 1];
//     if (first.lat !== last.lat || first.lng !== last.lng) {
//       path.push({ ...first });
//     }
//     return path;
//   };

//   if (!area) {
//     return (
//       <AdminLayout
//         isDev={true}
//         title="Chi tiết khu vực"
//         description="Không tìm thấy thông tin khu vực"
//         actions={
//           <Button
//             variant="outline"
//             onClick={() => setLocation("/area-distribution")}
//           >
//             <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
//           </Button>
//         }
//       >
//         <div className="flex items-center justify-center h-64">
//           <p className="text-muted-foreground">Khu vực không tồn tại</p>
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout
//       isDev={true}
//       description={`Mã khu vực: ${area.id}`}
//       title={`Chi tiết khu vực: ${area.name}`}
//       actions={
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={() => setLocation("/area-distribution")}
//           >
//             <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
//           </Button>
//           <Button
//             onClick={() => setLocation(`/area-distribution/edit/${area.id}`)}
//           >
//             <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
//           </Button>
//         </div>
//       }
//     >
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
//         {/* Left Column: Info */}
//         <div className="lg:col-span-1 space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Thông tin chung</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <span className="text-sm font-medium text-muted-foreground">
//                   Trạng thái
//                 </span>
//                 <div className="mt-1">
//                   <RegionChartStatusBadge
//                     status={area.status}
//                     activeLabel="Đang hoạt động"
//                     inactiveLabel="Ngừng hoạt động"
//                     subtle
//                   />
//                 </div>
//               </div>

//               <div>
//                 <span className="text-sm font-medium text-muted-foreground">
//                   Thuộc vùng trồng
//                 </span>
//                 <p className="font-medium mt-1">
//                   {region?.name || "Không xác định"}
//                 </p>
//               </div>

//               <div>
//                 <span className="text-sm font-medium text-muted-foreground">
//                   Diện tích
//                 </span>
//                 <p className="font-medium mt-1">{area.area} ha</p>
//               </div>

//               <div>
//                 <span className="text-sm font-medium text-muted-foreground">
//                   Loại đất
//                 </span>
//                 <p className="font-medium mt-1">{landTypeName}</p>
//               </div>

//               <div>
//                 <span className="text-sm font-medium text-muted-foreground">
//                   Địa hình
//                 </span>
//                 <p className="font-medium mt-1">{terrainName}</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Danh sách lô ({area.plots?.length || 0})</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {area.plots && area.plots.length > 0 ? (
//                   area.plots.map((plot: any) => (
//                     <div
//                       key={plot.id}
//                       className="border p-3 rounded-lg text-sm bg-muted/20"
//                     >
//                       <div className="flex justify-between items-center mb-2">
//                         <div className="flex items-center gap-2">
//                           <div className="w-2 h-2 rounded-full bg-orange-500"></div>
//                           <span className="font-semibold">{plot.name}</span>
//                         </div>
//                         <span className="text-muted-foreground text-xs font-mono">
//                           {plot.area} ha
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
//                         <div>Độ cao: {plot.altitude}m</div>
//                         <div>Đồng mức: {plot.contour || "-"}</div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-muted-foreground">
//                     Chưa có lô nào.
//                   </p>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Column: Map */}
//         <div className="lg:col-span-2">
//           <Card className="flex h-full min-h-[500px] flex-col">
//             <CardHeader>
//               <CardTitle>
//                 <span className="flex items-center gap-2">
//                   <MapPin className="h-5 w-5" /> Bản đồ khu vực & Lô
//                 </span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="relative flex-1 overflow-hidden rounded-b-lg p-0">
//               <div className="h-[600px] w-full">
//                 <MFMap
//                   center={{ lat: center[0], lng: center[1] }}
//                   zoom={15}
//                   accessKey={MAP4D_ACCESS_KEY}
//                   options={{ mapType: "raster" }}
//                   version="2.5"
//                 >
//                   {area.coordinates && area.coordinates.length >= 3 && (
//                     <MFPolygon
//                       paths={[closePath(area.coordinates)]}
//                       strokeColor="#2563eb"
//                       fillColor="#2563eb"
//                       fillOpacity={0.1}
//                       strokeWidth={2}
//                     />
//                   )}

//                   {area.plots?.map((plot: any) => {
//                     if (!plot.coordinates || plot.coordinates.length < 3) {
//                       return null;
//                     }

//                     return (
//                       <MFPolygon
//                         key={plot.id}
//                         paths={[closePath(plot.coordinates)]}
//                         strokeColor="#f59e0b"
//                         fillColor="#f59e0b"
//                         fillOpacity={0.3}
//                         strokeWidth={2}
//                       />
//                     );
//                   })}
//                 </MFMap>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default AreaDetailPage;
