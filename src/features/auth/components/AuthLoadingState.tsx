import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";

export function AuthLoadingState() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 text-slate-900">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:56px_56px] opacity-60" />
      <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-lime-200/50 blur-3xl" />

      <Card className="relative z-10 w-full max-w-md border-emerald-100 bg-white/90 shadow-2xl backdrop-blur">
        <CardHeader className="items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100">
            <div className="relative h-8 w-8">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          </div>
          <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Đang xác thực tài khoản
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="mx-auto max-w-sm text-sm leading-6 text-slate-600">
            Chúng tôi đang kết nối phiên đăng nhập với Authentik và chuyển bạn
            về bảng điều khiển.
          </p>

          <div className="flex items-center justify-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700 shadow-sm">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            Đang chuyển đến trang đăng nhập an toàn
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
