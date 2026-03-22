import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Contract } from "../types";

export const useContract = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );

  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 1,
      code: "HD001",
      name: "Hợp đồng mua bán phân bón NPK",
      type: "purchase",
      signDate: "2024-01-10",
      status: "active",
      partyA: "Công ty TNHH Nông nghiệp Xanh",
      partyB: "Nông hộ Trần Văn B",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "HD002",
      name: "Hợp đồng thuê máy móc",
      type: "lease",
      signDate: "2024-01-15",
      status: "active",
      partyA: "HTX Nông nghiệp Hữu cơ",
      partyB: "Nông hộ Trần Văn B",
      createdAt: "2024-01-15",
    },
    {
      id: 3,
      code: "HD003",
      name: "Hợp đồng dịch vụ kỹ thuật",
      type: "service",
      signDate: "2024-02-01",
      status: "pending",
      partyA: "Công ty TNHH Nông nghiệp Xanh",
      partyB: "HTX Nông nghiệp Hữu cơ",
      createdAt: "2024-02-01",
    },
  ]);

  const handleView = (contract: Contract) => {
    setLocation(`/contract/${contract.id}`);
  };

  const handleEdit = (contract: Contract) => {
    setLocation(`/contract/${contract.id}/edit`);
  };

  const handleDeleteClick = (contract: Contract) => {
    setSelectedContract(contract);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedContract) {
      setContracts(contracts.filter((c) => c.id !== selectedContract.id));
      toast({
        title: "Đã xóa hợp đồng",
        description: `Hợp đồng ${selectedContract.code} đã được xóa thành công.`,
      });
      setDeleteDialogOpen(false);
      setSelectedContract(null);
    }
  };

  const handleCreate = () => {
    setLocation("/contract/create");
  };

  return {
    contracts,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedContract,
    handleView,
    handleEdit,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCreate,
  };
};
