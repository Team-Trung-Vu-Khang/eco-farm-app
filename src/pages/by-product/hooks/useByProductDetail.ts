import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { farmSupplyApi } from "@/features/farm-supply";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { SUPPLY_TYPE } from "../data/constants";

export function useByProductDetail() {
  const [location, setLocation] = useLocation();
  const [matchFarm, paramsFarm] = useRoute(
    "/cultivation-material/byproduct/:id",
  );
  const [matchAdmin, paramsAdmin] = useRoute("/admin/byproduct/:id");
  const params = paramsFarm || paramsAdmin;
  const scope = matchAdmin || location.startsWith("/admin") ? "admin" : "farm";
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [byProduct, setByProduct] = useState<any | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const sourceParam = (searchParams.get("source") as "MASTER" | "OWNER") || "OWNER";

  useEffect(() => {
    if (!params?.id) return;
    setLoading(true);
    farmSupplyApi
      .getById(SUPPLY_TYPE, Number(params.id), sourceParam, scope)
      .then((data) => {
        setByProduct(data);
      })
      .catch((err) => {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin chi tiết phụ phẩm",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params?.id, sourceParam, scope]);

  return {
    byProduct,
    loading,
    scope,
    goBack: () => {
      const redirectPath =
        scope === "admin"
          ? "/admin/byproduct"
          : "/cultivation-material/byproduct";
      setLocation(redirectPath);
    },
    goToEdit: () => {
      const redirectPath =
        scope === "admin"
          ? `/admin/byproduct/${params?.id}/edit`
          : `/cultivation-material/byproduct/${params?.id}/edit`;
      setLocation(redirectPath);
    },
  };
}
