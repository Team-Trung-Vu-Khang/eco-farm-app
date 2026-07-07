import { useCallback, useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { PlotFormValues } from "../data/plot-form.schema";
import { usePlotMutations } from "@/features/farm/hooks/usePlotMutations";
import { usePlotById } from "@/features/farm/hooks/usePlots";
import { useAreaById } from "@/features/farm/hooks/useAreas";

export function usePlotCreateForm(
  reset: (values: Partial<PlotFormValues>) => void,
) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [editMatch, editParams] = useRoute("/plot-distribution/edit/:id");
  const isEditMode = editMatch && !!editParams?.id;
  const plotId = parseInt(editParams?.id || "0", 10);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const { data: plotData } = usePlotById(plotId, {
    enabled: isEditMode && plotId > 0,
  });

  const parentAreaId = plotData?.area?.id;
  const { data: areaData } = useAreaById(parentAreaId || 0, {
    enabled: !!parentAreaId,
  });

  const { createPlot, updatePlot } = usePlotMutations();



  useEffect(() => {
    if (hasInitialized) return;

    if (isEditMode) {
      if (plotData && areaData) {
        reset({
          enterpriseId: Number(areaData.metadataJson?.enterpriseId) || undefined,
          regionId: plotData.area?.region?.id,
          areaId: plotData.area?.id,
          code: plotData.code,
          name: plotData.name || "",
          acreage: plotData.acreage || undefined,
          contourInterval: plotData.contourInterval ? `${plotData.contourInterval}m` : "",
          elevation: plotData.elevation || undefined,
          coordinates: (plotData.boundary || []).map((b) => ({
            lat: b.latitude || 0,
            lng: b.longitude || 0,
          })),
        });
        setHasInitialized(true);
      }
    } else {
      reset({
        name: "",
        coordinates: [],
      });
      setHasInitialized(true);
    }
  }, [isEditMode, plotData, areaData, reset, hasInitialized]);

  const handleComplete = async (values: PlotFormValues) => {
    setIsSubmitting(true);
    const coords = (values.coordinates || []).map((p) => ({ lat: p.lat, lng: p.lng }));
    const plotRequest = {
      code: values.code,
      name: values.name,
      acreage: values.acreage,
      elevation: values.elevation,
      contourInterval: values.contourInterval
        ? parseInt(values.contourInterval.replace(/[^0-9]/g, ""), 10) || undefined
        : undefined,
      boundary: coords.map((c) => ({ latitude: c.lat, longitude: c.lng })),
    };

    if (isEditMode && plotId > 0) {
      updatePlot.mutate(
        { id: plotId, data: plotRequest },
        {
          onSuccess: () => {
            toast({
              title: "Thành công",
              description: "Đã cập nhật lô thành công",
            });
            setLocation("/plot-distribution");
          },
          onError: (err: any) => {
            toast({
              title: "Lỗi",
              description: err?.message || "Đã xảy ra lỗi khi cập nhật",
              variant: "destructive",
            });
          },
          onSettled: () => {
            setIsSubmitting(false);
          },
        },
      );
    } else {
      if (!values.areaId) {
        toast({
          title: "Lỗi",
          description: "Chưa chọn khu vực",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      createPlot.mutate(
        { areaId: values.areaId, data: plotRequest },
        {
          onSuccess: () => {
            toast({
              title: "Thành công",
              description: "Đã tạo mới lô thành công",
            });
            setLocation("/plot-distribution");
          },
          onError: (err: any) => {
            toast({
              title: "Lỗi",
              description: err?.message || "Đã xảy ra lỗi khi tạo mới",
              variant: "destructive",
            });
          },
          onSettled: () => {
            setIsSubmitting(false);
          },
        },
      );
    }
  };

  const handleCancel = () => {
    setLocation("/plot-distribution");
  };

  return {
    isEditMode,
    isSubmitting: isSubmitting || createPlot.isPending || updatePlot.isPending,
    handleComplete,
    handleCancel,
  };
}
