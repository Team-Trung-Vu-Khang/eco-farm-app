import { useEffect, useMemo, useState } from "react";
import { masterDataApi } from "@/features/master-data";
import type { MasterDataPageResponse } from "@/features/master-data/types/master-data.type";
import type { MasterDataStatus } from "@/features/master-data/types/master-data.type";
import type { ProvinceRow } from "../types";

const ALL_STATUS = "all" as const;
const DEFAULT_PAGE_SIZE = 20;

type ProvinceStatusFilter = MasterDataStatus | typeof ALL_STATUS;

export function useProvincePage() {
  const [data, setData] = useState<ProvinceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] =
    useState<MasterDataPageResponse<ProvinceRow> | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProvinceStatusFilter>(ALL_STATUS);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceRow | null>(
    null,
  );

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(null);

    masterDataApi
      .listGeoProvinces({
        keyword: search.trim() || undefined,
        status: status === ALL_STATUS ? undefined : status,
        page: Math.max(currentIndex - 1, 0),
        size: pageSize,
      })
      .then((response) => {
        if (!mounted) return;

        const rows: ProvinceRow[] = response.content.map((province) => ({
          id: province.code,
          code: province.code,
          name: province.name,
          fullName: province.fullName ?? province.name,
          wardCount: province.wards?.length ?? 0,
        }));

        setData(rows);
        setResponse({
          ...response,
          content: rows,
        });
      })
      .catch((err: Error) => {
        if (!mounted) return;
        setError(err.message || "Không thể tải dữ liệu tỉnh/thành.");
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [currentIndex, pageSize, search, status]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value === ALL_STATUS ? ALL_STATUS : (value as MasterDataStatus));
      setCurrentIndex(1);
    }
  };

  return {
    data,
    loading,
    error,
    response,
    search,
    status,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    selectedProvince,
    setSelectedProvince,
    handleSearch,
    handleFilterChange,
  };
}
