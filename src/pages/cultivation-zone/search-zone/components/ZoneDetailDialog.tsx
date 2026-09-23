import {
  Badge,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle, Layers } from "lucide-react";
import { CultivationRegionDetailView } from "../../cultivation-region/components/CultivationRegionDetailView";

type ZoneDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Zone id whose profile is shown; null renders no content. */
  zoneId: number | null;
  /** Needed to read a zone that lives outside the active workspace. */
  workspaceId?: number | null;
  /** Zone name shown in the header title. */
  name?: string;
  /** Zone code shown in the header subtitle. */
  code?: string;
  /** Owning unit name shown in the header subtitle. */
  workspaceName?: string;
  /** Zone status drives the header badge. */
  status?: string;
};

export const ZoneDetailDialog = ({
  open,
  onOpenChange,
  zoneId,
  workspaceId,
  name,
  code,
  workspaceName,
  status,
}: ZoneDetailDialogProps) => {
  const isActive = (status ?? "active").toLowerCase() === "active";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-50 h-[92vh] w-[96vw] max-w-[96vw] overflow-hidden rounded-3xl border-none p-0 shadow-2xl">
        <div className="flex h-full flex-col overflow-y-auto bg-slate-50/50 p-6">
          {/* Header — shared with the /cultivation-region/{id} page */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg">
                <Layers size={24} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-800">
                  Hồ sơ vùng trồng: {name}
                </DialogTitle>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  {code && (
                    <>
                      Mã hiệu:{" "}
                      <span className="font-bold text-slate-700">{code}</span>
                    </>
                  )}
                  {code && workspaceName && " · "}
                  {workspaceName && (
                    <>
                      Đơn vị sở hữu:{" "}
                      <span className="font-bold text-slate-700">
                        {workspaceName}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <Badge
              variant={isActive ? "default" : "secondary"}
              className="mr-8 px-3 py-1"
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              {isActive ? "Đang hoạt động" : "Tạm ngưng"}
            </Badge>
          </div>

          {/* Full zone profile: all tabs */}
          {zoneId != null && (
            <CultivationRegionDetailView
              id={String(zoneId)}
              workspaceId={workspaceId}
              showAllTabs
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
