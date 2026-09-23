import { setMobileUiMode } from "@/shared/hooks/useMobileUiMode";
import { Smartphone } from "lucide-react";

/** Nút nổi ở giao diện hiện tại (trên điện thoại) để quay về giao diện mobile mới */
export function SwitchToMobileAppButton() {
  return (
    <button
      type="button"
      onClick={() => setMobileUiMode("app")}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-lg active:scale-95"
    >
      <Smartphone className="h-4 w-4" />
      Giao diện mobile
    </button>
  );
}
