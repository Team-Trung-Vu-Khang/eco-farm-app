import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Info } from "lucide-react";

interface GeneralInfoTabProps {
  data: any;
}

export function GeneralInfoTab({ data }: GeneralInfoTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Thông tin thuế & Pháp lý
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Mã số thuế</div>
              <div className="font-medium text-base">{data.taxCode}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Ngày cấp</div>
              <div className="font-medium text-base">
                {data.issueDate
                  ? new Date(data.issueDate).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Cơ quan thuế</div>
              <div className="font-medium text-base">
                {data.taxAuthority || "Chưa cập nhật"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Địa chỉ đăng ký thuế
              </div>
              <div className="font-medium text-base">{data.taxAddress}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mô tả chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {data.description || "Chưa có mô tả chi tiết."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
