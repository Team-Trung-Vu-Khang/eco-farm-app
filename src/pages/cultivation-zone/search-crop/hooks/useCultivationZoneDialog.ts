/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import type { Region } from "../../../region-chart/constants";
import useEnterpriseStore from "../../../../stores/useEnterpriseStore";
import useRegionStore from "../../../../stores/useRegionStore";
import { PROVINCES } from "../../../../constants/province";

type UseCultivationZoneDialogParams = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selections: Region[]) => void;
  initialSelections: Region[];
};

export function useCultivationZoneDialog({
  open,
  onOpenChange,
  onConfirm,
  initialSelections,
}: UseCultivationZoneDialogParams) {
  const { regions } = useRegionStore();
  const { enterprises } = useEnterpriseStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [entFilter, setEntFilter] = useState("all");
  const [provFilter, setProvFilter] = useState("all");
  const [distFilter, setDistFilter] = useState("all");
  const [tempSelections, setTempSelections] = useState<Region[]>(initialSelections);

  useEffect(() => {
    if (open) {
      setTempSelections(initialSelections);
    }
  }, [open, initialSelections]);

  useEffect(() => {
    if (provFilter === "all") {
      setDistFilter("all");
      return;
    }

    const districtExists = PROVINCES.find(
      (province) => province.code === provFilter,
    )?.districts.some((district) => district.code === distFilter);

    if (!districtExists) {
      setDistFilter("all");
    }
  }, [provFilter, distFilter]);

  const filteredRegions = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return regions.filter((region) => {
      const matchesSearch =
        !normalizedSearch ||
        region.name.toLowerCase().includes(normalizedSearch) ||
        region.code.toLowerCase().includes(normalizedSearch);
      const matchesEnterprise =
        entFilter === "all" || String(region.enterpriseId) === entFilter;
      const matchesProvince =
        provFilter === "all" || region.provinceId === provFilter;
      const matchesDistrict =
        distFilter === "all" || region.districtId === distFilter;

      return (
        matchesSearch &&
        matchesEnterprise &&
        matchesProvince &&
        matchesDistrict
      );
    });
  }, [regions, searchTerm, entFilter, provFilter, distFilter]);

  const provinceOptions = PROVINCES;
  const districtOptions =
    PROVINCES.find((province) => province.code === provFilter)?.districts ?? [];

  const toggleSelection = (region: Region) => {
    setTempSelections((currentSelections) => {
      const exists = currentSelections.some(
        (selection) => selection.id === region.id,
      );

      if (exists) {
        return currentSelections.filter(
          (selection) => selection.id !== region.id,
        );
      }

      return [...currentSelections, region];
    });
  };

  const isSelected = (id: number) => {
    return tempSelections.some((selection) => selection.id === id);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setEntFilter("all");
    setProvFilter("all");
    setDistFilter("all");
  };

  const handleConfirm = () => {
    onConfirm(tempSelections);
    onOpenChange(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    entFilter,
    setEntFilter,
    provFilter,
    setProvFilter,
    distFilter,
    setDistFilter,
    tempSelections,
    filteredRegions,
    enterprises,
    provinceOptions,
    districtOptions,
    toggleSelection,
    isSelected,
    resetFilters,
    handleConfirm,
  };
}
