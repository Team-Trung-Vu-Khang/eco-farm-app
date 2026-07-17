import { Card, CardContent, CardHeader, CardTitle } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useFormContext } from "react-hook-form";

import { useAddressOptions } from "@/features/master-data/hooks/useAddressOptions";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import type { RegionBasicFormValues } from "../data/region-basic-form.schema";
import { RegionChartStatusBadge } from "../../components/RegionChartStatusBadge";

export const RegionBasicReviewStep = () => {
  const { watch } = useFormContext<RegionBasicFormValues>();
  const formData = watch();

  const { provinces, wards } = useAddressOptions(formData.provinceId);
  const { items: lands } = useCatalog("soil-types");
  const { items: terrains } = useCatalog("terrain-features");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xác nhận thông tin</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Mã vùng</p>
            <p className="mt-1 text-sm">{formData.code || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Tên vùng</p>
            <p className="mt-1 text-sm font-medium">{formData.name || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Diện tích</p>
            <p className="mt-1 text-sm">{formData.area ? `${formData.area} ha` : "-"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Trạng thái</p>
            <div className="mt-1">
              <RegionChartStatusBadge status={formData.status} />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Tỉnh / Thành phố</p>
            <p className="mt-1 text-sm">
              {provinces.find((item) => item.code === formData.provinceId)?.name || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Phường / Xã</p>
            <p className="mt-1 text-sm">
              {wards.find((item) => item.code === formData.wardId)?.name || "-"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-medium text-muted-foreground">Địa chỉ chi tiết</p>
            <p className="mt-1 text-sm">{formData.address || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Loại đất</p>
            <p className="mt-1 text-sm">
              {lands.find((item) => String(item.id || item.code) === String(formData.landType))?.name ||
                "-"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Địa hình</p>
            <p className="mt-1 text-sm">
              {terrains.find((item) => String(item.id || item.code) === String(formData.terrain))?.name ||
                "-"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-medium text-muted-foreground">Ghi chú</p>
            <p className="mt-1 text-sm">{formData.note || "-"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
