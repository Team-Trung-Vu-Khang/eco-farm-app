import { Badge, Button, Card, CardContent } from "@tankhang1/eco-shared-ui";
import {
  User,
  Shield,
  Leaf,
  Sprout,
  Bug,
  DollarSign,
  Clock,
  Heart,
  Calendar,
} from "lucide-react";
import type { Treatment } from "../types/treatment.types";
import { TreatmentStepCard } from "./TreatmentStepCard";

interface TreatmentCardProps {
  treatment: Treatment;
  onEdit: (treatment: Treatment) => void;
  onDelete: (treatment: Treatment) => void;
  onViewMaterial: (pesticideId: string) => void;
}

export function TreatmentCard({
  treatment,
  onEdit,
  onDelete,
  onViewMaterial,
}: TreatmentCardProps) {
  const getSeverityBadge = (severity: string) => {
    const config = {
      severe: { label: "Nghiêm trọng", variant: "destructive" as const },
      moderate: { label: "Trung bình", variant: "default" as const },
      mild: { label: "Nhẹ", variant: "outline" as const },
    };
    const item = config[severity as keyof typeof config];
    return <Badge variant={item.variant}>{item.label}</Badge>;
  };

  const getSafetyBadge = (rating: string) => {
    const config = {
      high: { label: "An toàn cao", variant: "default" as const },
      medium: { label: "An toàn trung bình", variant: "outline" as const },
      low: { label: "Cần thận trọng", variant: "destructive" as const },
    };
    const item = config[rating as keyof typeof config];
    return <Badge variant={item.variant}>{item.label}</Badge>;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline">{treatment.code}</Badge>
                {getSeverityBadge(treatment.severity)}
                <Badge
                  variant={
                    treatment.status === "active" ? "default" : "outline"
                  }
                >
                  {treatment.status === "active"
                    ? "Đang áp dụng"
                    : "Không áp dụng"}
                </Badge>
                <Badge variant="outline">v{treatment.version}</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">{treatment.name}</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>Người viết: {treatment.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Phê duyệt: {treatment.approvedBy}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(treatment)}
              >
                Sửa
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(treatment)}
                className="text-destructive"
              >
                Xóa
              </Button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Loại cây</p>
              <p className="font-medium flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                {treatment.cropType}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Cây trồng</p>
              <p className="font-medium flex items-center gap-1">
                <Sprout className="w-3 h-3" />
                {treatment.crop}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Giống</p>
              <p className="font-medium">{treatment.variety}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Hạt giống</p>
              <p className="font-medium">{treatment.seed}</p>
            </div>
          </div>

          {/* Disease & Summary Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="w-4 h-4 text-destructive" />
                <span className="font-medium text-sm">Bệnh/Sâu hại:</span>
                <span className="text-sm">{treatment.disease}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-muted-foreground">Tổng chi phí</p>
                  <p className="font-medium">{treatment.totalCost}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-muted-foreground">Thời gian</p>
                  <p className="font-medium">{treatment.totalDuration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <div>
                  <p className="text-muted-foreground">An toàn</p>
                  <div>{getSafetyBadge(treatment.safetyRating)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-muted-foreground">Hiệu quả</p>
                  <p className="font-medium">{treatment.efficacyRate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Steps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-medium text-sm">
                Các bước điều trị ({treatment.steps.length} bước)
              </span>
            </div>
            <div className="space-y-3">
              {treatment.steps.map((step) => (
                <TreatmentStepCard
                  key={step.id}
                  step={step}
                  onViewMaterial={onViewMaterial}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
