import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
  Label,
  Combobox,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useSelectedWorkspaceId,
  useWorkspaceById,
  useWorkspaces,
  workspaceKeys,
  workspaceApi,
  formatWorkspaceLabel,
  setSelectedWorkspaceId,
  type WorkspaceUpdateRequest,
} from "@/features/workspace";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, Check, Loader2, Sprout } from "lucide-react";

interface FarmInfoBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FarmInfoBottomSheet({
  open,
  onOpenChange,
}: FarmInfoBottomSheetProps) {
  const selectedWorkspaceId = useSelectedWorkspaceId();
  const { data: workspaceData } = useWorkspaceById(selectedWorkspaceId ?? "", {
    enabled: open && !!selectedWorkspaceId,
  });
  // const { items: workspaces } = useWorkspaces({ page: 0, size: 100 });
  const queryClient = useQueryClient();

  const currentFarmName =
    (
      (workspaceData?.metadataJson as Record<string, unknown>)
        ?.farmDisplayName as string
    )?.trim() ||
    workspaceData?.name ||
    "MEVI Farm";

  const [customName, setCustomName] = useState<string | null>(null);
  const name = customName ?? currentFarmName;
  const [isSaving, setIsSaving] = useState(false);

  const handleClose = () => {
    setCustomName(null);
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim() || "MEVI Farm";

    if (!selectedWorkspaceId) {
      toast.error("Không tìm thấy thông tin đơn vị làm việc");
      return;
    }

    setIsSaving(true);
    try {
      const currentMeta =
        (workspaceData?.metadataJson as Record<string, unknown>) || {};

      const orgTypeId =
        workspaceData?.organizationType?.id ??
        (workspaceData as unknown as { organizationTypeId?: number | string })
          ?.organizationTypeId ??
        6;

      const payload: WorkspaceUpdateRequest = {
        organizationTypeId: orgTypeId,
        name: workspaceData?.name || trimmed,
        code: workspaceData?.code || "",
        brandName: workspaceData?.brandName || "",
        taxCode: workspaceData?.taxCode || "",
        taxAuthority: workspaceData?.taxAuthority || "",
        taxAddress: workspaceData?.taxAddress || "",
        issueDate: workspaceData?.issueDate || "",
        businessLines: workspaceData?.businessLines || [],
        representative: workspaceData?.representative || "",
        foundedDate: workspaceData?.foundedDate || "",
        website: workspaceData?.website || "",
        province: workspaceData?.province || "",
        district: workspaceData?.district || "",
        ward: workspaceData?.ward || "",
        address: workspaceData?.address || "",
        latitude: workspaceData?.latitude || 0,
        longitude: workspaceData?.longitude || 0,
        imageUrl: workspaceData?.imageUrl || "",
        description: workspaceData?.description || "",
        totalAcreage: workspaceData?.totalAcreage,
        mainCropId: workspaceData?.mainCrop?.id,
        status: workspaceData?.status || "active",
        displayOrder: workspaceData?.displayOrder,
        metadataJson: {
          ...currentMeta,
          farmDisplayName: trimmed,
        },
      };

      await workspaceApi.update(selectedWorkspaceId, payload);

      // Invalidate queries để refetch dữ liệu mới
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
      queryClient.invalidateQueries({
        queryKey: ["workspace", selectedWorkspaceId],
      });
      window.dispatchEvent(new Event("eco-farm:workspace-change"));

      toast.success("Đã cập nhật tên Farm thành công!");
      onOpenChange(false);
    } catch {
      toast.error("Không thể lưu tên Farm. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(val) => {
        if (!val) setCustomName(null);
        onOpenChange(val);
      }}
    >
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-4 pb-8 pt-4 sm:max-w-md mx-auto max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader className="text-left pb-3 border-b border-slate-100">
          <SheetTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sprout className="h-5 w-5 text-emerald-600" />
            Thông tin Farm
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Card tên farm hiện tại */}
          {/* <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-slate-50 border border-emerald-100/70">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Tên Farm mặc định / hiện tại
            </span>
            <p className="text-base font-extrabold text-slate-900 mt-1">
              {name || "MEVI Farm"}
            </p>
          </div> */}

          {/* Ô nhập đổi tên Farm */}
          <div className="space-y-1.5">
            <Label
              htmlFor="farm-display-name-input"
              className="text-xs font-semibold text-slate-700"
            >
              Tên Farm hiển thị
            </Label>
            <input
              id="farm-display-name-input"
              type="text"
              value={name}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="MEVI Farm"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
            />
            <p className="text-[11px] text-slate-500">
              Mặc định là{" "}
              <span className="font-semibold text-emerald-700">MEVI Farm</span>.
              Bạn có thể thay đổi theo tên nông trại riêng của mình.
            </p>
          </div>

          {/* Chọn Đơn vị làm việc nếu có nhiều workspace */}
          {/* {workspaces.length > 1 && (
            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                Đơn vị / Nông trại đang chọn
              </Label>
              <Combobox
                options={workspaces.map((w) => ({
                  value: String(w.id),
                  label: formatWorkspaceLabel(w),
                }))}
                value={
                  selectedWorkspaceId !== null ? String(selectedWorkspaceId) : ""
                }
                placeholder="Chọn đơn vị..."
                searchPlaceholder="Tìm đơn vị..."
                onChange={(value) => {
                  if (value) {
                    setSelectedWorkspaceId(value);
                  }
                }}
              />
            </div>
          )} */}

          <div className="flex gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl text-slate-600 font-medium"
              onClick={handleClose}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
