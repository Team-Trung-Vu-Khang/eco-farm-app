import { Search } from "lucide-react";

export function CultivationZoneDialogEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
        <Search size={40} className="text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-600">
        Không tìm thấy vùng nào
      </h3>
      <p className="mt-2 text-sm">
        Vui lòng điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm
      </p>
    </div>
  );
}
