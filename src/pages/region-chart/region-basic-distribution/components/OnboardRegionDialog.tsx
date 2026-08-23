import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useRegionMutations } from "@/features/farm/hooks/useRegionMutations";
import { useCultivationZoneMutations } from "@/features/farm/hooks/useCultivationZoneMutations";
import type {
  FarmRegionRequest,
  FarmCultivationZoneRequest,
} from "@/features/farm/types/farm.type";
import {
  regionBasicFormSchema,
  type RegionBasicFormValues,
} from "../data/region-basic-form.schema";
import { RegionBasicDistributionForm } from "./RegionBasicDistributionForm";

interface OnboardRegionDialogProps {
  open: boolean;
  onSuccess: () => void;
}

export const OnboardRegionDialog: React.FC<OnboardRegionDialogProps> = ({
  open,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createRegion } = useRegionMutations();
  const { createCultivationZone } = useCultivationZoneMutations();

  const form = useForm<RegionBasicFormValues>({
    resolver: zodResolver(regionBasicFormSchema) as any,
    mode: "onChange",
    defaultValues: {
      code: "",
      name: "",
      cropIds: [],
      area: undefined,
      provinceId: "",
      wardId: "",
      address: "",
      landType: "",
      terrain: "",
      note: "",
      centerPoint: {
        lat: 11.54,
        lng: 106.895,
      },
      metadataJson: {
        address: "",
      },
      isDetailed: false,
      status: "active",
      farmingMethodId: undefined,
      rearingMethodId: undefined,
      seedIds: [],
    },
  });

  const handleComplete = async (data: RegionBasicFormValues) => {
    setIsSubmitting(true);
    try {
      const regionRequest: FarmRegionRequest = {
        code: data.code || undefined,
        name: data.name,
        acreage: data.area,
        province: data.provinceId || "",
        district: data.wardId || "",
        ward: data.wardId || "",
        address: data.address || "",
        soilTypeId: data.landType ? parseInt(data.landType, 10) : undefined,
        terrainFeatureId: data.terrain ? parseInt(data.terrain, 10) : undefined,
        description: data.note || "",
        status: data.status,
        metadataJson: {
          address: data.metadataJson?.address,
          formType: "basic",
        },
        centerPoint:
          data.centerPoint?.lat && data.centerPoint?.lng
            ? {
                latitude: data.centerPoint.lat,
                longitude: data.centerPoint.lng,
              }
            : undefined,
        crops: data.cropIds?.length
          ? data.cropIds.map((id) => ({
              cropId: parseInt(id, 10),
              role: "MAIN",
            }))
          : undefined,
        domainCode: "CROP",
      };

      // 1. Create Region
      const createdRegion = await createRegion.mutateAsync(regionRequest);
      const savedRegionId = createdRegion.id;

      // 2. Create Cultivation Zone
      const zoneRequest: FarmCultivationZoneRequest = {
        name: data.name,
        domainCode: "CROP",
        farmingMethodId: data.farmingMethodId || 0,
        rearingMethodId: data.rearingMethodId || undefined,
        seedIds: data.seedIds || [],
        status: data.status,
        scopes: [
          {
            scopeType: "REGION",
            scopeId: savedRegionId,
          },
        ],
        metadataJson: {
          formType: "basic",
          address: data.address || data.metadataJson?.address || "",
          area: data.area || 0,
        },
      };

      await createCultivationZone.mutateAsync(zoneRequest);

      toast({
        title: "Thành công",
        description: "Khởi tạo vùng trồng đầu tiên thành công",
      });
      form.reset();

      onSuccess();
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          "Không thể khởi tạo vùng trồng đầu tiên. Vui lòng kiểm tra lại dữ liệu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-49 backdrop-blur-md" />}
      <Dialog open={open}>
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()} // Disable closing via ESC key
          onPointerDownOutside={(e) => e.preventDefault()} // Disable closing via clicking outside
          onInteractOutside={(e) => e.preventDefault()} // Prevent pointer and focus events outside from closing the dialog
          className="max-w-4xl p-6 rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh] [&>button]:hidden"
        >
          <DialogHeader className="border-b pb-4 mb-4">
            <DialogTitle className="text-xl font-bold text-slate-800 text-center sm:text-left">
              Chào mừng! Hãy tạo vùng trồng đầu tiên của bạn
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-1">
            <RegionBasicDistributionForm
              form={form}
              onSubmit={handleComplete}
              onCancel={() => {}}
              isLoading={isSubmitting}
              isEditMode={false}
              isDialogMode={true}
              completeLabel="Hoàn tất và Khởi tạo"
              bypassSeedSelection={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OnboardRegionDialog;
