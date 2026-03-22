import { useRoute, useLocation } from "wouter";
import { mockEnterprises } from "../data/constants";
import type { Contract } from "../types";

export const useContractDetail = () => {
  const [, params] = useRoute("/contract/:id");
  const [, setLocation] = useLocation();

  // Mock data - in real app, fetch from API
  const contract: Contract = {
    id: params?.id || "1",
    code: "HD001",
    name: "Hợp đồng mua bán phân bón NPK",
    type: "purchase",
    signDate: "2024-01-10",
    status: "active",
    isAppendix: false,
    parentContractCode: null,
    contentType: "file",
    contentFileName: "hop-dong-mua-ban-phan-bon.pdf",
    commodities: [
      {
        id: "1",
        commodityType: "fertilizer",
        commodityId: "1",
        commodityName: "Phân NPK 16-16-8",
        commodityCode: "PB001",
        specType: "detailed",
        packagingSpec: "",
        quantity: "100",
        unit: "bag",
      },
      {
        id: "2",
        commodityType: "pesticide",
        commodityId: "2",
        commodityName: "Thuốc trừ sâu Abamectin 1.8EC",
        commodityCode: "BVTV002",
        specType: "general",
        packagingSpec: "bottle500ml",
        quantity: "",
        unit: "",
      },
    ],
    partyA: mockEnterprises[0],
    partyB: mockEnterprises[1],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  };

  const handleBack = () => setLocation("/contract");
  const handleEdit = () => setLocation(`/contract/${contract.id}/edit`);
  const handleDelete = () => {
    // Implement delete logic here
    console.log("Delete contract", contract.id);
    setLocation("/contract");
  };
  const handleDownload = () => {
    console.log("Download contract", contract.id);
  };

  return {
    contract,
    handleBack,
    handleEdit,
    handleDelete,
    handleDownload,
    setLocation,
  };
};
