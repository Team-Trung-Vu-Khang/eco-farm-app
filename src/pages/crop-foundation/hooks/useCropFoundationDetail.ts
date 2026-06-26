import { useParams } from "wouter";
import { useCropById } from "../../../features/foundation";
import { useEffect } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export function useCropFoundationDetail() {
  const { id } = useParams();
  const { toast } = useToast();

  const cropId = id ? Number(id) : 0;
  
  const { data: cropFoundation, isLoading: loading, error } = useCropById(
    cropId,
    { enabled: !!cropId }
  );

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Lỗi tải dữ liệu",
        description: error.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return {
    id,
    cropFoundation,
    loading,
  };
}

