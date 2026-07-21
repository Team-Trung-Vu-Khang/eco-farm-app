import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { CultivationZoneFormValues } from "../data/cultivation-zone-form.schema";
import { AQUACULTURE_DRAFT_BY_ID } from "../data/create-dummy";

export function useAquacultureZoneCreateForm(
  reset: (values: Partial<CultivationZoneFormValues>) => void,
) {
  const basePath = "/aquaculture-region";
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [matchEdit, paramsEdit] = useRoute<{ id: string }>(
    `${basePath}/:id/edit`,
  );
  const isEditMode = matchEdit && !!paramsEdit?.id;
  const zoneId = Number(paramsEdit?.id ?? 0);

  useEffect(() => {
    if (hasInitialized) return;

    const draft = AQUACULTURE_DRAFT_BY_ID[zoneId as keyof typeof AQUACULTURE_DRAFT_BY_ID];

    if (isEditMode && draft) {
      reset({
        id: draft.id,
        code: draft.code,
        name: draft.name,
        enterpriseId: draft.enterpriseId,
        selections: draft.selections as CultivationZoneFormValues["selections"],
        farmingMethodId: draft.farmingMethodId,
        irrigationSystemId: draft.irrigationSystemId,
        seedIds: [...draft.seedIds],
        certificateIds: [...draft.certificateIds],
        personnelIds: [...draft.personnelIds],
        notes: draft.notes,
        status: draft.status,
      });
      setHasInitialized(true);
      return;
    }

    reset({
      name: "",
      code: "",
      enterpriseId: "",
      selections: [],
      farmingMethodId: 1,
      irrigationSystemId: 1,
      seedIds: [],
      certificateIds: [],
      personnelIds: [],
      notes: "",
      status: "active",
    });
    setHasInitialized(true);
  }, [hasInitialized, isEditMode, reset, zoneId]);

  const handleComplete = async (_data: CultivationZoneFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast({
        title: "Thành công",
        description: isEditMode
          ? "Đã lưu bản cập nhật vùng nuôi trồng"
          : "Đã tạo nháp vùng nuôi trồng thủy sản",
      });
      setLocation(basePath);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => setLocation(basePath);

  return { handleComplete, handleCancel, isSubmitting, isEditMode };
}
