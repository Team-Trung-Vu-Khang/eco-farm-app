import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin, Check, Layers, AlertCircle } from "lucide-react";
import type { AreaFormValues } from "../data/area-form.schema";
import { useRegions } from "@/features/farm/hooks/useRegions";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useOrganizationById } from "@/features/organization/hooks/useOrganizationById";
import { useSelectedWorkspaceId } from "@/features/workspace";

interface AreaReviewStepProps {
  showEnterprise?: boolean;
}

export function AreaReviewStep({ showEnterprise = false }: AreaReviewStepProps = {}) {
  const { watch } = useFormContext<AreaFormValues>();
  const formData = watch();

  const { data: regionsData } = useRegions({
    params: { size: 100 },
  });
  const regions = regionsData?.content || [];

  const { data: soilTypesData } = useCatalog("soil-types");
  const soilTypes = soilTypesData?.content || [];

  const { data: terrainFeaturesData } = useCatalog("terrain-features");
  const terrainFeatures = terrainFeaturesData?.content || [];

  const region = regions.find((r) => r.id === formData.regionId);
  const soilType = soilTypes.find((s) => s.id.toString() === formData.soilType);
  const terrainFeature = terrainFeatures.find(
    (t) => t.id.toString() === formData.terrainFeature,
  );

  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  const { item: selectedOrganization, loading: isLoadingSelected } =
    useOrganizationById(
      formData.enterpriseId || "",
      parsedWorkspaceId ?? "missing",
      { enabled: parsedWorkspaceId !== undefined && !!formData.enterpriseId },
    );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            Thông tin chung
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Tên khu vực</p>
            <p className="font-medium">{formData.name || "—"}</p>
          </div>
          {showEnterprise && (
            <div>
              <p className="text-muted-foreground mb-1">Đơn vị sở hữu</p>
              <p className="font-medium">
                {isLoadingSelected
                  ? "Đang tải..."
                  : selectedOrganization?.name || formData.enterpriseId || "—"}
              </p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground mb-1">Thuộc vùng</p>
            <p className="font-medium">{region?.name || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Diện tích</p>
            <p className="font-medium">
              {formData.acreage ? `${formData.acreage} ha` : "—"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Loại đất</p>
            <p className="font-medium">{soilType?.name || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Địa hình</p>
            <p className="font-medium">{terrainFeature?.name || "—"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Bản đồ khu vực
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-700">
              <span className="font-semibold text-lg">
                {formData.coordinates?.length || 0}
              </span>{" "}
              điểm
            </div>
            {formData.coordinates && formData.coordinates.length < 3 ? (
              <p className="text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Khu vực cần ít nhất 3 điểm
              </p>
            ) : (
              <p className="text-muted-foreground">
                Đã xác định tọa độ khu vực
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-500" />
            Danh sách Lô ({formData.plots?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.plots && formData.plots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.plots.map((plot, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-lg bg-slate-50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-slate-800">
                        {plot.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Diện tích: {plot.acreage ? `${plot.acreage} ha` : "—"}
                      {plot.elevation !== undefined &&
                        ` | Độ cao: ${plot.elevation}m`}
                      {plot.contourInterval !== undefined &&
                        ` | Bình độ: ${plot.contourInterval}`}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    {plot.coordinates?.length || 0} điểm
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa có lô nào được tạo.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
