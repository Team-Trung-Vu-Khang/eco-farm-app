import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useSelectedWorkspaceId,
  useWorkspaceById,
  workspaceKeys,
  workspaceApi,
  type WorkspaceUpdateRequest,
} from "@/features/workspace";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Sprout } from "lucide-react";

interface EditFarmNameBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditFarmNameBottomSheet({
  open,
  onOpenChange,
}: EditFarmNameBottomSheetProps) {
  const selectedWorkspaceId = useSelectedWorkspaceId();
  const { data: workspaceData } = useWorkspaceById(selectedWorkspaceId ?? "", {
    enabled: open && !!selectedWorkspaceId,
  });
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && workspaceData) {
      const currentName =
        ((workspaceData.metadataJson as Record<string, unknown>)
          ?.farmDisplayName as string) || "";
      setName(currentName.trim());
    }
  }, [open, workspaceData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập tên nông trại / nông hộ");
      return;
    }

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

      toast.success("Đã cập nhật tên nông hộ thành công!");
      onOpenChange(false);
    } catch {
      toast.error("Không thể lưu tên nông hộ. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-4 pb-8 pt-4 sm:max-w-md mx-auto"
      >
        <SheetHeader className="text-left pb-3 border-b border-slate-100">
          <SheetTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" />
            Đổi tên nông trại / nông hộ
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="farm-name-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Tên nông trại hiển thị
            </label>
            <input
              id="farm-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: MEVI Farm Tây Ninh, Vườn Bác Ba..."
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              autoFocus
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl text-slate-600 font-medium"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold"
              disabled={isSaving || !name.trim()}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
