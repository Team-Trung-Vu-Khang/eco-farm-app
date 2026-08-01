import PageWrapper from "@/components/PageWrapper";
// import {
//   AdminLayout,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@Team-Trung-Vu-Khang/eco-shared-ui";
// import { MFMap, MFPolygon } from "react-map4d-map";
// import { ChevronLeft, Edit } from "lucide-react";
// import { LAND_TYPES } from "../constants";
// import { RegionChartStatusBadge } from "../components/RegionChartStatusBadge";
// import { useRegionDetailPage } from "../hooks/useRegionDetailPage";

// const RegionDetailPage = () => {
//   const MAP4D_ACCESS_KEY = import.meta.env.VITE_MAP4D_ACCESS_KEY;
//   const closePath = (points: { lat: number; lng: number }[]) => {
//     if (!points || points.length < 3) return [];
//     const path = points.map((p) => ({ lat: p.lat, lng: p.lng }));
//     const first = path[0];
//     const last = path[path.length - 1];
//     if (first.lat !== last.lat || first.lng !== last.lng) {
//       path.push({ ...first });
//     }
//     return path;
//   };
//   const {
//     setLocation,
//     region,
//     center,
//     provinceName,
//     districtName,
//     enterpriseName,
//     landTypeName,
//     terrainName,
//   } = useRegionDetailPage();

//   if (!region) {
//     return (
//       <PageWrapper  title="Không tìm thấy">
//         <div className="flex flex-col items-center justify-center p-8">
//           <p className="text-xl mb-4">Vùng trồng không tồn tại</p>
//           <Button onClick={() => setLocation("/region-distribution")}>
//             Quay lại danh sách
//           </Button>
//         </div>
//       </PageWrapper>//     );
//   }

//   return (
//     <PageWrapper
//
//       title={`Chi tiết: ${region.name}`}
//       description={`Mã vùng: ${region.code}`}
//       actions={
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={() => setLocation("/region-distribution")}
//           >
//             <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
//           </Button>
//           <Button
//             onClick={() =>
//               setLocation(`/region-distribution/edit/${region.id}`)
//             }
//           >
//             <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
//           </Button>
//         </div>
//       }
//     >
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
//         {/* Left Col: Info */}
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Thông tin chung</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4 text-sm">
//               <div className="grid grid-cols-3 gap-2 py-1 border-b">
//                 <span className="text-muted-foreground">Trạng thái</span>
//                 <span className="col-span-2">
//                   <RegionChartStatusBadge status={region.status} />
//                 </span>
//               </div>
//               <div className="grid grid-cols-3 gap-2 py-1 border-b">
//                 <span className="text-muted-foreground">Đơn vị sở hữu</span>
//                 <span className="col-span-2 font-medium">{enterpriseName}</span>
//               </div>
//               <div className="grid grid-cols-3 gap-2 py-1 border-b">
//                 <span className="text-muted-foreground">Địa chỉ</span>
//                 <span className="col-span-2">
//                   {region.address}
//                   <br />
//                   {districtName}, {provinceName}
//                 </span>
//               </div>
//               <div className="grid grid-cols-3 gap-2 py-1 border-b">
//                 <span className="text-muted-foreground">Diện tích</span>
//                 <span className="col-span-2 font-medium">{region.area} ha</span>
//               </div>
//               <div className="grid grid-cols-3 gap-2 py-1 border-b">
//                 <span className="text-muted-foreground">Loại đất</span>
//                 <span className="col-span-2">{landTypeName}</span>
//               </div>
//               <div className="grid grid-cols-3 gap-2 py-1 border-b">
//                 <span className="text-muted-foreground">Địa hình</span>
//                 <span className="col-span-2">{terrainName}</span>
//               </div>
//               <div className="grid grid-cols-3 gap-2 py-1">
//                 <span className="text-muted-foreground">Ghi chú</span>
//                 <span className="col-span-2 italic text-muted-foreground">
//                   {region.note || "Không có"}
//                 </span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>
//                 Danh sách tiểu vùng ({region.subAreas?.length || 0})
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {!region.subAreas || region.subAreas.length === 0 ? (
//                 <p className="text-sm text-muted-foreground">
//                   Chưa có tiểu vùng nào.
//                 </p>
//               ) : (
//                 <div className="space-y-2">
//                   {region.subAreas.map((sub) => (
//                     <div key={sub.id} className="border p-3 rounded-md text-sm">
//                       <div className="flex justify-between mb-1">
//                         <span className="font-semibold">{sub.name}</span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
//                         <span>DT: {sub.area} ha</span>
//                         <span>
//                           {LAND_TYPES.find((l) => l.id === sub.landType)?.name}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Col: Map */}
//         <div className="lg:col-span-2">
//           <Card className="flex h-full min-h-[500px] flex-col">
//             <CardHeader>
//               <CardTitle>Bản đồ phân bố</CardTitle>
//             </CardHeader>
//             <CardContent className="relative flex-1 overflow-hidden rounded-b-lg p-0">
//               <div className="h-[600px] w-full">
//                 <MFMap
//                   center={{ lat: center[0], lng: center[1] }}
//                   zoom={14}
//                   accessKey={MAP4D_ACCESS_KEY}
//                   options={{ mapType: "raster" }}
//                   version="2.5"
//                 >
//                   {region.coordinates && region.coordinates.length > 0 && (
//                     <MFPolygon
//                       paths={[closePath(region.coordinates)]}
//                       strokeColor="#2563eb"
//                       strokeWidth={2}
//                       fillColor="#2563eb"
//                       fillOpacity={0}
//                     />
//                   )}

//                   {region.subAreas?.map((sub) => {
//                     if (!sub.coordinates || sub.coordinates.length < 3) {
//                       return null;
//                     }

//                     return (
//                       <MFPolygon
//                         key={sub.id}
//                         paths={[closePath(sub.coordinates)]}
//                         strokeColor="#16a34a"
//                         strokeWidth={2}
//                         fillColor="#16a34a"
//                         fillOpacity={0.08}
//                       />
//                     );
//                   })}
//                 </MFMap>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </PageWrapper>//   );
// };

// export default RegionDetailPage;
