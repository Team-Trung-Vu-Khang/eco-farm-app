import { Card } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Crop } from "../../types/types";

interface FarmingHistoryTabProps {
  crop: Crop;
}

export function FarmingHistoryTab({ crop }: FarmingHistoryTabProps) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[150px]">
                Thời gian
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Hoạt động
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Thực hiện
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Quản lý
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Kiểm định
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {crop.farmingHistory?.map((entry) => (
              <tr
                key={entry.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-3.5 text-sm font-medium text-slate-600">
                  {entry.time}
                </td>
                <td className="px-6 py-3.5 text-sm font-medium text-slate-900">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                    {entry.action}
                  </div>
                </td>
                <td className="px-6 py-3.5 text-sm text-slate-600">
                  {entry.executor}
                </td>
                <td className="px-6 py-3.5 text-sm text-slate-600">
                  {entry.manager}
                </td>
                <td className="px-6 py-3.5 text-sm text-slate-600">
                  {entry.inspector}
                </td>
              </tr>
            )) || (
              <tr>
                <td
                  colSpan={5}
                  className="py-16 text-center text-muted-foreground text-sm"
                >
                  Chưa có dữ liệu lịch sử
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
