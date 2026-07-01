import { useQuery } from "@tanstack/react-query";
import { masterDataApi } from "../api/master-data.api";

export function useAddressOptions(provinceCode?: string) {
  // Tỉnh/Thành phố (khoảng 63 tỉnh, lấy tất cả các trang phòng trường hợp API trả về ít hơn 100/trang)
  const { data: provinces = [], isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["geo-locations", "provinces-all"],
    queryFn: async () => {
      const firstPage = await masterDataApi.listGeoProvinces({
        size: 100,
        page: 0,
      });
      let allProvinces = [...firstPage.content];
      if (firstPage.totalPages > 1) {
        const promises = [];
        for (let i = 1; i < firstPage.totalPages; i++) {
          promises.push(masterDataApi.listGeoProvinces({ size: 100, page: i }));
        }
        const restPages = await Promise.all(promises);
        restPages.forEach((p) => {
          allProvinces = allProvinces.concat(p.content);
        });
      }
      return allProvinces;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Phường/Xã (Một tỉnh có thể có > 500 phường/xã, cần fetch tất cả các trang)
  const { data: wards = [], isLoading: isLoadingWards } = useQuery({
    queryKey: ["geo-locations", "wards-all", provinceCode],
    queryFn: async () => {
      if (!provinceCode) return [];
      const firstPage = await masterDataApi.listGeoWards({
        provinceCode,
        size: 100,
        page: 0,
      });
      let allWards = [...firstPage.content];
      if (firstPage.totalPages > 1) {
        const promises = [];
        for (let i = 1; i < firstPage.totalPages; i++) {
          promises.push(
            masterDataApi.listGeoWards({ provinceCode, size: 100, page: i }),
          );
        }
        const restPages = await Promise.all(promises);
        restPages.forEach((p) => {
          allWards = allWards.concat(p.content);
        });
      }
      return allWards;
    },
    enabled: !!provinceCode,
    staleTime: 5 * 60 * 1000,
  });

  return {
    provinces,
    wards,
    isLoadingProvinces,
    isLoadingWards,
  };
}
