import { useState } from "react";
import { useLocation } from "wouter";
import type { BankAccount } from "../../../stores/useBankStore";
import useBankStore from "../../../stores/useBankStore";
import { bankColumns } from "../data/columns";
import { bankFilters } from "../data/constants";

export function useBankTable() {
  const [, setLocation] = useLocation();
  const bankAccounts = useBankStore((state) => state.bankAccounts);
  const deleteBankAccount = useBankStore((state) => state.deleteBankAccount);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<BankAccount | null>(null);

  const handleDelete = (item: BankAccount) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      deleteBankAccount(deleteItem.id);
      setDeleteOpen(false);
      setDeleteItem(null);
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
