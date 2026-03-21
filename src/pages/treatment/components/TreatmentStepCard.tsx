import {
  Badge,
  Button,
  Card,
  CardContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { DollarSign, Clock, Shield, AlertTriangle, Info } from "lucide-react";
import type { TreatmentStep } from "../types/treatment.types";

interface TreatmentStepCardProps {
  step: TreatmentStep;
  onViewMaterial: (pesticideId: string) => void;
}

export function TreatmentStepCard({
  step,
  onViewMaterial,
}: TreatmentStepCardProps) {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Step Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Bước {step.step}
              </Badge>
              <span className="font-medium text-sm">{step.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewMaterial(step.pesticideId)}
              className="text-xs h-7"
            >
              <Info className="w-3 h-3 mr-1" />
              Chi tiết thuốc
            </Button>
          </div>

          {/* Step Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Thuốc BVTV</p>
              <button
                onClick={() => onViewMaterial(step.pesticideId)}
                className="font-medium text-primary hover:underline text-left"
              >
                {step.pesticide}
              </button>
            </div>
            <div>
              <p className="text-muted-foreground">Liều lượng</p>
              <p className="font-medium">{step.dosage}</p>
              <p className="text-muted-foreground text-[10px]">
                ({step.dosagePerArea})
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Thời điểm</p>
              <p className="font-medium">{step.timing}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tần suất</p>
              <p className="font-medium">{step.frequency}</p>
            </div>
          </div>

          {/* Cost & Time */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-green-600" />
              <div>
                <p className="text-muted-foreground">Chi phí</p>
                <p className="font-medium">{step.cost}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-600" />
              <div>
                <p className="text-muted-foreground">Thời gian thực hiện</p>
                <p className="font-medium">{step.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-600" />
              <div>
                <p className="text-muted-foreground">Thời gian cách ly</p>
                <p className="font-medium">{step.safetyPeriod}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Phương pháp</p>
              <p className="font-medium text-[10px]">
                {step.applicationMethod}
              </p>
            </div>
          </div>

          {/* Safety Info */}
          <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div>
                  <span className="font-medium">Bảo hộ: </span>
                  <span>{step.ppeRequired}</span>
                </div>
                <div>
                  <span className="font-medium">Điều kiện thời tiết: </span>
                  <span>{step.weatherConditions}</span>
                </div>
                {step.notes && (
                  <div>
                    <span className="font-medium">Lưu ý: </span>
                    <span className="text-red-600">{step.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {step.description && (
            <p className="text-xs text-muted-foreground italic">
              {step.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
