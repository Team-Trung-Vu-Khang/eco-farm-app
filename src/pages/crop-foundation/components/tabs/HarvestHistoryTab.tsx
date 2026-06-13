import { Card } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { CropFoundation } from "../../types/types";

interface HarvestHistoryTabProps {
  cropFoundation: CropFoundation;
}

export function HarvestHistoryTab({ cropFoundation }: HarvestHistoryTabProps) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[200px]">
                Thời điểm
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sản lượng
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Người thu hoạch
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cropFoundation.harvestHistory?.map((entry) => (
              <tr
                key={entry.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-3.5 text-sm font-medium text-slate-600">
                  {entry.time}
                </td>
                <td className="px-6 py-3.5 text-sm font-bold text-emerald-600">
                  {entry.yield}
                </td>
                <td className="px-6 py-3.5 text-sm font-medium text-slate-600">
                  {entry.harvester}
                </td>
              </tr>
            )) || (
              <tr>
                <td
                  colSpan={3}
                  className="py-16 text-center text-muted-foreground text-sm"
                >
                  Chưa có lịch sử thu hoạch
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
