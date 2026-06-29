import { AdminLayout, Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, Sparkles } from "lucide-react";

export function AppLoadingState() {
  return (
    <AdminLayout
      isDev={true}
      title="Đang tải ứng dụng"
      description="Vui lòng chờ vài giây, hệ thống đang nạp giao diện."
    >
      <div className="flex min-h-[55vh] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl rounded-3xl border border-emerald-100 bg-white px-6 py-5 shadow-sm">
          <div className="mb-5 flex items-start gap-4">
            <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <p className="text-sm font-semibold text-slate-900">
                  Đang chuẩn bị dữ liệu
                </p>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Giao diện đang được tải trong nền. Phần này sẽ tự động biến mất
                khi trang sẵn sàng.
              </p>
            </div>

            <Badge className="hidden shrink-0 border-emerald-200 bg-emerald-50 text-emerald-700 sm:inline-flex">
              Loading
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-emerald-50">
              <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-cyan-400 animate-pulse" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="h-2 rounded-full bg-slate-100" />
              <div className="h-2 rounded-full bg-slate-100" />
              <div className="h-2 rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
