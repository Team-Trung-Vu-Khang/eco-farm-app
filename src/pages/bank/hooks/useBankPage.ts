import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBankStore, { type BankAccount } from "../../../stores/useBankStore";

export function useBankPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const bankAccounts = useBankStore((state) => state.bankAccounts);
  const deleteBankAccount = useBankStore((state) => state.deleteBankAccount);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<BankAccount | null>(null);

  const handleDelete = (item: BankAccount) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteBankAccount(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa tài khoản ngân hàng",
      });
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
  };
}
