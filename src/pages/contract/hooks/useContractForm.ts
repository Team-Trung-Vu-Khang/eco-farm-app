import { useState } from "react";
import { useLocation } from "wouter";
import type { ContractFormData, CommodityItem } from "../types";
import {
  mockEquipment,
  mockPesticides,
  mockFertilizers,
  mockMaterials,
} from "../data/constants";

export const allCommodities = [
  ...mockEquipment.map((c) => ({ ...c, type: "equipment" })),
  ...mockPesticides.map((c) => ({ ...c, type: "pesticide" })),
  ...mockFertilizers.map((c) => ({ ...c, type: "fertilizer" })),
  ...mockMaterials.map((c) => ({ ...c, type: "material" })),
];

export const useContractForm = () => {
  const [, setLocation] = useLocation();

  // Search states
  const [searchParentContract, setSearchParentContract] = useState("");
  const [searchPartyA, setSearchPartyA] = useState("");
  const [searchPartyB, setSearchPartyB] = useState("");

  const [formData, setFormData] = useState<ContractFormData>({
    code: "",
    name: "",
    nature: "",
    value: "",
    currency: "VND",
    signDate: new Date().toISOString().split("T")[0],
    isAppendix: false,
    parentContractId: "",
    contentType: "file",
    contentFile: null,
    contentText: "",
    commodities: [],
    partyAId: "",
    partyBId: "",
  });

  // Commodity Selection Logic (extracted from the page)
  const [pendingCommodityIds, setPendingCommodityIds] = useState<string[]>([]);
  const [isCommodityDialogOpen, setIsCommodityDialogOpen] = useState(false);
  const [tempSelectedCommodities, setTempSelectedCommodities] = useState<any[]>(
    [],
  );
  const [popupSearch, setPopupSearch] = useState("");
  const [popupType, setPopupType] = useState("all");

  const [currentCommodity, setCurrentCommodity] = useState({
    commodityType: "",
    commodityId: "",
    specType: "general" as "general" | "detailed",
    packagingSpec: "",
    quantity: "",
    unit: "",
  });

  const updateField = (field: keyof ContractFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField("contentFile", file);
    }
  };

  const handleToggleCommoditySelection = (item: any) => {
    setTempSelectedCommodities((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) return prev.filter((c) => c.id !== item.id);
      return [...prev, item];
    });
  };

  const handleConfirmPopupSelection = () => {
    const newIds = tempSelectedCommodities.map((c) => c.id.toString());
    const filteredNewIds = newIds.filter(
      (id) =>
        !pendingCommodityIds.includes(id) &&
        !formData.commodities.some((c) => c.commodityId === id),
    );
    setPendingCommodityIds((prev) => [...prev, ...filteredNewIds]);
    setIsCommodityDialogOpen(false);
    setTempSelectedCommodities([]);
  };

  const handleRemoveCommodity = (id: string) => {
    updateField(
      "commodities",
      formData.commodities.filter((c) => c.id !== id),
    );
  };

  const addCommoditySpec = () => {
    const baseItem = allCommodities.find(
      (c) => c.id.toString() === currentCommodity.commodityId,
    );
    if (!baseItem) return;

    const newItem: CommodityItem = {
      id: Date.now().toString(),
      commodityType: currentCommodity.commodityType,
      commodityId: currentCommodity.commodityId,
      commodityName: baseItem.name,
      commodityCode: baseItem.code,
      specType: currentCommodity.specType,
      packagingSpec: currentCommodity.packagingSpec,
      quantity: currentCommodity.quantity,
      unit: currentCommodity.unit,
    };

    updateField("commodities", [...formData.commodities, newItem]);
    setPendingCommodityIds((prev) =>
      prev.filter((pid) => pid !== currentCommodity.commodityId),
    );
    // Reset spec selection but maintain focus state if needed elsewhere
    setCurrentCommodity({
      commodityType: "",
      commodityId: "",
      specType: "general",
      packagingSpec: "",
      quantity: "",
      unit: "",
    });
  };

  const handleCancelSpec = () => {
    setCurrentCommodity({
      commodityType: "",
      commodityId: "",
      specType: "general" as "general" | "detailed",
      packagingSpec: "",
      quantity: "",
      unit: "",
    });
  };

  return {
    formData,
    setFormData,
    updateField,
    handleFileUpload,
    // Search states
    searchParentContract,
    setSearchParentContract,
    searchPartyA,
    setSearchPartyA,
    searchPartyB,
    setSearchPartyB,
    // Commodity Selection Logic
    pendingCommodityIds,
    setPendingCommodityIds,
    isCommodityDialogOpen,
    setIsCommodityDialogOpen,
    tempSelectedCommodities,
    setTempSelectedCommodities,
    popupSearch,
    setPopupSearch,
    popupType,
    setPopupType,
    currentCommodity,
    setCurrentCommodity,
    handleToggleCommoditySelection,
    handleConfirmPopupSelection,
    handleRemoveCommodity,
    addCommoditySpec,
    handleCancelSpec,
    setLocation,
  };
};
