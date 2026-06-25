import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useBankDirectory } from "../../../features/bank/hooks/useBankDirectory";
import { useDeleteBank } from "../../../features/bank/hooks/useDeleteBank";
import type { BankDirectoryItem } from "../../../features/bank/types/bank.type";
import type { BankAccount } from "../../../stores/useBankStore";
import { bankColumns } from "../data/columns";
import { bankFilters } from "../data/constants";

const mapDirectoryToBankAccount = (
  item: BankDirectoryItem,
): BankAccount => ({
  id: item.id,
  bankName: item.shortName,
  accountNumber: item.bin,
  accountHolder: item.name,
  branch: item.swiftCode ?? "",
  note: item.code,
  status: item.status === "active" ? "active" : "inactive",
  logo: item.logoUrl,
  createdAt: item.createdAt,
});

export function useBankTable() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { banks } = useBankDirectory();
  const deleteBank = useDeleteBank({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã xóa tài khoản ngân hàng",
      });
    },
    onError: (error) => {
      toast({
        title: "Không thể xóa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const bankAccounts = banks.map(mapDirectoryToBankAccount);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<BankAccount | null>(null);

  const handleDelete = (item: BankAccount) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      try {
        await deleteBank.mutateAsync(deleteItem.id);
        setDeleteOpen(false);
        setDeleteItem(null);
      } catch {
        // Error toast is handled by the mutation callback.
      }
      return;
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    bankAccounts,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleEdit: (item: BankAccount) => setLocation(`/bank/${item.id}/edit`),
    handleView: (item: BankAccount) => setLocation(`/bank/${item.id}/edit`),
    columns: bankColumns,
    filters: [...bankFilters],
  };
}
