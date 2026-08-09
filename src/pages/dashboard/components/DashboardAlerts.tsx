import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export function DashboardAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Cảnh báo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/certificate"
            className="p-4 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 transition-colors group"
          >
            <p className="font-medium text-red-800 flex items-center gap-1">
              Chứng chỉ sắp hết hạn
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
            <p className="text-sm text-red-600 mt-1">
              3 chứng chỉ VietGAP hết hạn trong 30 ngày
            </p>
          </Link>
          <Link
            to="/cultivation-material/material"
            className="p-4 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors group"
          >
            <p className="font-medium text-amber-800 flex items-center gap-1">
              Vật tư sắp hết
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
            <p className="text-sm text-amber-600 mt-1">
              5 loại phân bón cần bổ sung
            </p>
          </Link>
          <Link
            to="/contract"
            className="p-4 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors group"
          >
            <p className="font-medium text-blue-800 flex items-center gap-1">
              Hợp đồng cần gia hạn
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
            <p className="text-sm text-blue-600 mt-1">
              2 hợp đồng hết hạn trong tuần này
            </p>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
