import { useCurrentUser } from "@/features/auth";
import { ChevronDown } from "lucide-react";
import { getUserLogoText } from "../utils/user-logo.util";

interface HeroProfileBannerProps {
  onOpenWorkspacePicker?: () => void;
}

const CAN_SWITCH_WORKSPACE_ROLES = [
  "MEVI_SUPER_ADMIN",
  "MEVI_ADMIN",
  "MEVI_FARM_ADMIN",
  "MEVI_FACTORY_ADMIN",
];

// Ảnh phong cảnh thiên nhiên nông trại xanh mát mặc định chất lượng cao
const DEFAULT_FARM_BANNER =
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80";

export function HeroProfileBanner({
  onOpenWorkspacePicker,
}: HeroProfileBannerProps) {
  const { currentUser } = useCurrentUser();

  const userRoles = currentUser?.roleCodes ?? [];
  const canSwitchWorkspace = userRoles.some((role) =>
    CAN_SWITCH_WORKSPACE_ROLES.includes(role),
  );

  const displayName =
    currentUser?.fullName?.trim() || currentUser?.username?.trim() || "Nông hộ";

  const logoText = getUserLogoText(displayName);

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-sm">
      {/* Background Image với Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={DEFAULT_FARM_BANNER}
          alt="MEVI Farm Landscape"
          className="h-full w-full object-cover object-center filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10" />
      </div>

      {/* Nội dung Banner */}
      <div className="relative z-10 flex items-center gap-3.5 p-5 pt-7 pb-6">
        {/* Logo / Avatar bo tròn với màu xanh chủ đạo và tên của user */}
        <div
          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white/95 shadow-md bg-gradient-to-br from-[#16B371] to-[#139B62] flex items-center justify-center select-none"
          title={displayName}
          aria-label={`Logo ${displayName}`}
        >
          <span className="text-xl font-bold text-white tracking-wider">
            {logoText}
          </span>
        </div>

        {/* Lời chào & Tên người dùng */}
        <div className="min-w-0 flex-1 text-white">
          <p className="text-xs font-medium text-white/85 tracking-wide drop-shadow-sm">
            Xin chào,
          </p>

          {canSwitchWorkspace ? (
            <button
              type="button"
              onClick={onOpenWorkspacePicker}
              className="mt-0.5 flex items-center gap-1.5 text-left active:opacity-80 transition-opacity max-w-full group"
            >
              <h1 className="truncate text-lg font-bold tracking-tight text-white drop-shadow-md group-hover:text-emerald-200 transition-colors">
                {displayName}
              </h1>
              <ChevronDown className="h-4 w-4 shrink-0 text-white/90 group-hover:translate-y-0.5 transition-transform" />
            </button>
          ) : (
            <h1 className="mt-0.5 truncate text-lg font-bold tracking-tight text-white drop-shadow-md">
              {displayName}
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}
