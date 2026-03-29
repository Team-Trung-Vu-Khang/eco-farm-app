import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Award } from "lucide-react";
import type { CultivationRegionDetailBodyCommonProps } from "./types";

export const CultivationRegionCertificatesTab = ({
  details,
}: CultivationRegionDetailBodyCommonProps) => {
  return (
    <Card>
      <CardHeader className="border-b bg-slate-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Chứng nhận đạt được
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {details.selectedCerts.length === 0 ? (
          <div className="text-sm text-muted-foreground italic">
            Chưa có chứng nhận.
          </div>
        ) : (
          <div className="space-y-3">
            {details.selectedCerts.map((certificate) => (
              <div
                key={certificate.code}
                className="border rounded-lg p-4 bg-white"
              >
                <div className="font-bold text-slate-900">{certificate.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {certificate.code}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
