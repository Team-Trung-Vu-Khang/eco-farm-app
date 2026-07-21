import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import type { FarmCultivationZoneResponse } from "@/features/farm/types/farm.type";
import { getAquacultureRegionColumns } from "../data/columns";

const DUMMY_AQUACULTURE_REGIONS: FarmCultivationZoneResponse[] = [
  {
    id: 101,
    code: "AQ-101",
    name: "Vung nuoi bien Dong",
    scopes: [{ scopeType: "REGION" }],
    farmingMethod: { id: 1, name: "Bac thang" },
    irrigationSystem: { id: 1, name: "Tuoi nho giot" },
    status: "active",
    createdAt: "2026-07-10T08:00:00.000Z",
  },
  {
    id: 102,
    code: "AQ-102",
    name: "Vung nuoi tom Can Gio",
    scopes: [{ scopeType: "AREA" }],
    farmingMethod: { id: 2, name: "Ao lot bat" },
    irrigationSystem: { id: 2, name: "Tuoi phun" },
    status: "active",
    createdAt: "2026-07-08T08:00:00.000Z",
  },
  {
    id: 103,
    code: "AQ-103",
    name: "Lo nuoi ca Tra Vinh",
    scopes: [{ scopeType: "PLOT" }],
    farmingMethod: { id: 1, name: "Bac thang" },
    irrigationSystem: { id: 3, name: "Tuoi truyen thong" },
    status: "inactive",
    createdAt: "2026-06-29T08:00:00.000Z",
  },
  {
    id: 104,
    code: "AQ-104",
    name: "Vung nuoi ngao Ben Tre",
    scopes: [{ scopeType: "REGION" }],
    farmingMethod: { id: 3, name: "Long be" },
    irrigationSystem: { id: 2, name: "Tuoi phun" },
    status: "archived",
    createdAt: "2026-05-16T08:00:00.000Z",
  },
  {
    id: 105,
    code: "AQ-105",
    name: "Khu nuoi rong Phu Yen",
    scopes: [{ scopeType: "AREA" }],
    farmingMethod: { id: 2, name: "Ao lot bat" },
    irrigationSystem: { id: 1, name: "Tuoi nho giot" },
    status: "active",
    createdAt: "2026-06-21T08:00:00.000Z",
  },
];

export const useAquacultureRegionPage = () => {
  const basePath = "/aquaculture-region";
  const [, setLocation] = useLocation();

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [farmingMethodId, setFarmingMethodId] = useState<string>("all");
  const [irrigationSystemId, setIrrigationSystemId] = useState<string>("all");
  const [areas, setAreas] = useState<FarmCultivationZoneResponse[]>(
    DUMMY_AQUACULTURE_REGIONS,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value);
      setCurrentIndex(1);
    } else if (key === "farmingMethod") {
      setFarmingMethodId(value);
      setCurrentIndex(1);
    } else if (key === "irrigationSystem") {
      setIrrigationSystemId(value);
      setCurrentIndex(1);
    }
  };

  const filters = useMemo(
    () => [
      {
        key: "status",
        label: "Trạng thái",
        options: [
          { label: "Hoạt động", value: "active" },
          { label: "Ngừng hoạt động", value: "inactive" },
          { label: "Đã lưu trữ", value: "archived" },
        ],
      },
      {
        key: "farmingMethod",
        label: "Phương pháp canh tác",
        options: [
          { label: "Bậc thang", value: "1" },
          { label: "Ao lót bạt", value: "2" },
          { label: "Lồng bè", value: "3" },
        ],
      },
      {
        key: "irrigationSystem",
        label: "Hệ thống tưới tiêu",
        options: [
          { label: "Tưới nhỏ giọt", value: "1" },
          { label: "Tưới phun", value: "2" },
          { label: "Tưới truyền thống", value: "3" },
        ],
      },
    ],
    [],
  );

  const filteredAreas = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return areas.filter((area) => {
      const matchesKeyword =
        !keyword ||
        [area.code, area.name, area.notes]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(keyword));
      const matchesStatus = status === "all" || area.status === status;
      const matchesFarmingMethod =
        farmingMethodId === "all" ||
        String(area.farmingMethod?.id ?? "") === farmingMethodId;
      const matchesIrrigationSystem =
        irrigationSystemId === "all" ||
        String(area.irrigationSystem?.id ?? "") === irrigationSystemId;

      return (
        matchesKeyword &&
        matchesStatus &&
        matchesFarmingMethod &&
        matchesIrrigationSystem
      );
    });
  }, [areas, farmingMethodId, irrigationSystemId, search, status]);

  const pagedAreas = useMemo(() => {
    const start = (currentIndex - 1) * pageSize;
    return filteredAreas.slice(start, start + pageSize);
  }, [currentIndex, filteredAreas, pageSize]);

  const response = useMemo(
    () => ({
      totalElements: filteredAreas.length,
      totalPages: Math.max(1, Math.ceil(filteredAreas.length / pageSize)),
    }),
    [filteredAreas.length, pageSize],
  );

  const handleAdd = () => setLocation(`${basePath}/create`);
  const handleView = (id: number) => setLocation(`${basePath}/${id}`);
  const handleWorkflow = (id: number) =>
    setLocation(`${basePath}/${id}/workflow`);
  const handleEdit = (id: number) => setLocation(`${basePath}/${id}/edit`);

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const columns = useMemo(() => getAquacultureRegionColumns(basePath), [basePath]);

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setAreas((current) => current.filter((area) => area.id !== deletingId));
    setDeleteOpen(false);
    setDeletingId(null);
  };

  return {
    areas: pagedAreas,
    columns,
    isLoading: false,
    response,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleView,
    handleWorkflow,
    handleEdit,
    handleSearch,
    handleDelete,
    handleConfirmDelete,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    filters,
    handleFilterChange,
  };
};
