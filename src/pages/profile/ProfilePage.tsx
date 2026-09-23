import { useAuth } from "@/features/auth";
import {
  setSelectedWorkspaceId,
  useSelectedWorkspaceId,
  useWorkspaces,
} from "@/features/workspace";
import {
  setMobileUiMode,
  useMobileUiMode,
} from "@/shared/hooks/useMobileUiMode";
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Building2,
  LogOut,
  Phone,
  Smartphone,
  UserCheck,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
}) => (
  <div className="flex items-center gap-3 py-2.5">
    <span className="text-slate-400">{icon}</span>
    <div className="min-w-0">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="truncate text-sm font-medium text-slate-900">
        {value || "Chưa cập nhật"}
      </p>
    </div>
  </div>
);

/** Trang tài khoản (tab Profile của giao diện mobile) */
export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const mobileUiMode = useMobileUiMode();
  const selectedWorkspaceId = useSelectedWorkspaceId();
  const { items: workspaces } = useWorkspaces({ page: 0, size: 100 });

  const displayName = currentUser?.fullName || currentUser?.username || "";

  return (
    <div className="space-y-4">
      <section className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
          {displayName ? (
            displayName.trim().charAt(0).toUpperCase()
          ) : (
            <UserRound className="h-6 w-6" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-slate-900">
            {displayName || "Người dùng"}
          </p>
          <p className="truncate text-xs text-slate-500">
            @{currentUser?.username}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white px-4 py-1 divide-y divide-slate-100">
        <InfoRow
          icon={<Phone className="h-4 w-4" />}
          label="Số điện thoại"
          value={currentUser?.phoneNumber}
        />
        <InfoRow
          icon={<UserCheck className="h-4 w-4" />}
          label="Người giới thiệu"
          value={
            currentUser?.referrer
              ? [currentUser.referrer.fullName, currentUser.referrer.phoneNumber]
                  .filter(Boolean)
                  .join(" · ")
              : null
          }
        />
      </section>

      {workspaces.length > 0 && (
        <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Building2 className="h-4 w-4 text-slate-400" /> Đơn vị đang làm
            việc
          </Label>
          <Select
            value={selectedWorkspaceId !== null ? String(selectedWorkspaceId) : ""}
            onValueChange={(value) => setSelectedWorkspaceId(value)}
            disabled={workspaces.length === 1}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đơn vị" />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((workspace) => (
                <SelectItem key={workspace.id} value={String(workspace.id)}>
                  {workspace.brandName || workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>
      )}

      <section className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <Label htmlFor="mobile-ui-mode" className="text-sm font-semibold">
              Giao diện mobile mới
            </Label>
            <p className="text-xs text-slate-500">
              Tắt để dùng giao diện đầy đủ (menu bên trái)
            </p>
          </div>
        </div>
        <Switch
          id="mobile-ui-mode"
          checked={mobileUiMode === "app"}
          onCheckedChange={(checked) =>
            setMobileUiMode(checked ? "app" : "classic")
          }
        />
      </section>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={() => void logout()}
      >
        <LogOut className="h-4 w-4" /> Đăng xuất
      </Button>
    </div>
  );
}
