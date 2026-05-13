import { Database, Package } from "lucide-react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  ReportMaterialRow,
  ReportSourceRow,
  ReportTableRow,
} from "../types";
import { getToneClass } from "../utils/ui";

export function ReportDetailTable({ rows }: { rows: ReportTableRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dữ liệu chi tiết theo kế hoạch</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Kế hoạch</th>
                <th className="px-4 py-3 font-semibold">Phạm vi</th>
                <th className="px-4 py-3 font-semibold">Cây trồng</th>
                <th className="px-4 py-3 font-semibold">Thời gian</th>
                <th className="px-4 py-3 font-semibold">Tiến độ</th>
                <th className="px-4 py-3 font-semibold">Sản lượng</th>
                <th className="px-4 py-3 font-semibold">Vật tư</th>
                <th className="px-4 py-3 font-semibold">Rủi ro</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Không có dữ liệu phù hợp với kỳ và phạm vi đã chọn.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="bg-white">
                    <td className="px-4 py-3 font-medium">{row.name}</td>
                    <td className="px-4 py-3">{row.scope}</td>
                    <td className="px-4 py-3">{row.crop}</td>
                    <td className="px-4 py-3">{row.period}</td>
                    <td className="px-4 py-3">{row.progress}</td>
                    <td className="px-4 py-3">{row.yield}</td>
                    <td className="px-4 py-3">{row.material}</td>
                    <td className="px-4 py-3">{row.risk}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportMaterialsTable({ rows }: { rows: ReportMaterialRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="w-5 h-5 text-primary" />
          Danh mục vật tư trong phạm vi báo cáo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Kế hoạch</th>
                <th className="px-4 py-3 font-semibold">Giai đoạn</th>
                <th className="px-4 py-3 font-semibold">Nhóm</th>
                <th className="px-4 py-3 font-semibold">Vật tư</th>
                <th className="px-4 py-3 font-semibold">Số lượng</th>
                <th className="px-4 py-3 font-semibold">Đơn vị</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Chưa có vật tư trong phạm vi báo cáo.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="bg-white">
                    <td className="px-4 py-3 font-medium">{row.planName}</td>
                    <td className="px-4 py-3">{row.stage}</td>
                    <td className="px-4 py-3">{row.category}</td>
                    <td className="px-4 py-3">{row.materialName}</td>
                    <td className="px-4 py-3">{row.quantity}</td>
                    <td className="px-4 py-3">{row.unit}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportSourcesPanel({ rows }: { rows: ReportSourceRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="w-5 h-5 text-primary" />
          Độ phủ dữ liệu nguồn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rows.map((row) => (
            <div key={row.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{row.source}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {row.note}
                  </p>
                </div>
                <Badge variant="outline" className={getToneClass(row.tone)}>
                  {row.coverage}
                </Badge>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {row.records}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
