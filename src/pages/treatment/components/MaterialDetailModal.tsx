import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Badge,
  Card,
  CardContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  Package,
  Factory,
  FlaskConical,
  Shield,
  Clock,
  FileText,
  Archive,
} from "lucide-react";
import type { Material } from "../types/treatment.types";

interface MaterialDetailModalProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MaterialDetailModal({
  material,
  open,
  onOpenChange,
}: MaterialDetailModalProps) {
  if (!material) return null;

  const getToxicityBadge = (level: string) => {
    const config = {
      high: { label: "Độc tính cao", variant: "destructive" as const },
      medium: { label: "Độc tính trung bình", variant: "default" as const },
      low: { label: "Độc tính thấp", variant: "outline" as const },
    };
    return config[level as keyof typeof config] || config.medium;
  };

  const toxicityBadge = getToxicityBadge(material.toxicityLevel);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">
                {material.name}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{material.code}</Badge>
                <Badge variant={toxicityBadge.variant}>
                  {toxicityBadge.label}
                </Badge>
                <Badge variant="secondary">
                  {material.type === "pesticide"
                    ? "Thuốc BVTV"
                    : material.type === "fertilizer"
                      ? "Phân bón"
                      : "Vật tư"}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Thông tin cơ bản */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Thông tin sản phẩm
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Nhà sản xuất</p>
                  <p className="font-medium flex items-center gap-1">
                    <Factory className="w-3 h-3" />
                    {material.manufacturer}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Hoạt chất chính
                  </p>
                  <p className="font-medium flex items-center gap-1">
                    <FlaskConical className="w-3 h-3" />
                    {material.activeIngredient}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Nồng độ</p>
                  <p className="font-medium">{material.concentration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Dạng bào chế</p>
                  <p className="font-medium">{material.formulation}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Số đăng ký</p>
                  <p className="font-medium">{material.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Hạn sử dụng</p>
                  <p className="font-medium">{material.expiryMonths} tháng</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hướng dẫn sử dụng */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Hướng dẫn sử dụng
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Cách pha chế
                  </p>
                  <p className="leading-relaxed">{material.instructions}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Liều lượng khuyến cáo
                  </p>
                  <p className="font-medium text-green-600">
                    {material.dosageGuide}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* An toàn */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Thông tin an toàn
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Thời gian cách ly
                  </p>
                  <p className="font-medium text-amber-600">
                    {material.safetyPeriod}
                  </p>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900 mb-2 text-xs">
                        Cảnh báo an toàn
                      </p>
                      <ul className="space-y-1">
                        {material.warnings.map((warning, index) => (
                          <li
                            key={index}
                            className="text-xs text-red-800 flex items-start gap-1"
                          >
                            <span className="text-red-600 mt-0.5">•</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bảo quản */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Archive className="w-4 h-4" />
                Hướng dẫn bảo quản
              </h3>
              <p className="text-sm leading-relaxed">{material.storage}</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
