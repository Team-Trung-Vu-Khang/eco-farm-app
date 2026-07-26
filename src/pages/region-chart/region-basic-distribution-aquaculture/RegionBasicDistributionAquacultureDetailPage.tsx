import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, Edit } from "lucide-react";

import { RegionChartStatusBadge } from "../components/RegionChartStatusBadge";
import { useRegionBasicAquacultureDetailPage } from "./hooks/useRegionBasicAquacultureDetailPage";

const RegionBasicDistributionAquacultureDetailPage = () => {
  const {
    setLocation,
    region,
    isLoading,
    provinceName,
    wardName,
    landTypeName,
    terrainName,
  } = useRegionBasicAquacultureDetailPage();

  if (isLoading) {
    return (
      <AdminLayout isDev={true} title="Đang tải...">
        <div className="flex flex-col items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">
            Đang tải thông tin vùng nuôi trồng thuỷ sản...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (!region) {
    return (
      <AdminLayout isDev={true} title="Không tìm thấy">
        <div className="flex flex-col items-center justify-center p-8">
          <p className="mb-4 text-xl">Vùng nuôi trồng thuỷ sản không tồn tại</p>
          <Button
            onClick={() =>
              setLocation("/cultivation-region-identification/aquaculture")
            }
          >
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isDev={true}
      title={`Chi tiết: ${region.name}`}
      description={`Mã vùng: ${region.code || "-"}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setLocation("/cultivation-region-identification/aquaculture")
            }
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button
            onClick={() =>
              setLocation(
                `/cultivation-region-identification/aquaculture/edit/${region.id}`,
              )
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 pb-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-3 gap-2 border-b py-1">
              <span className="text-muted-foreground">Mã vùng</span>
              <span className="col-span-2">{region.code || "-"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b py-1">
              <span className="text-muted-foreground">Tên vùng</span>
              <span className="col-span-2 font-medium">{region.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b py-1">
              <span className="text-muted-foreground">Trạng thái</span>
              <span className="col-span-2">
                <RegionChartStatusBadge status={region.status} />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b py-1">
              <span className="text-muted-foreground">Diện tích</span>
              <span className="col-span-2">
                {region.area ? `${region.area} ha` : "-"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b py-1">
              <span className="text-muted-foreground">Tỉnh / Thành phố</span>
              <span className="col-span-2">{provinceName || "-"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b py-1">
              <span className="text-muted-foreground">Phường / Xã</span>
              <span className="col-span-2">{wardName || "-"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b py-1">
              <span className="text-muted-foreground">Địa chỉ</span>
              <span className="col-span-2">{region.address || "-"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b py-1">
              <span className="text-muted-foreground">Loại đất</span>
              <span className="col-span-2">{landTypeName || "-"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b py-1">
              <span className="text-muted-foreground">Địa hình</span>
              <span className="col-span-2">{terrainName || "-"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="text-muted-foreground">Ghi chú</span>
              <span className="col-span-2 italic text-muted-foreground">
                {region.note || "Không có"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thời gian cập nhật</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-3 gap-2 border-b py-1">
              <span className="text-muted-foreground">Ngày tạo</span>
              <span className="col-span-2">{region.createdAt || "-"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="text-muted-foreground">Cập nhật lần cuối</span>
              <span className="col-span-2">{region.updatedAt || "-"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RegionBasicDistributionAquacultureDetailPage;
