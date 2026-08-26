import {
  useBankAccounts,
  useDeleteBankAccount,
  type BankAccountRecord,
} from "@/features/bank";
import { useState } from "react";
import { useLocation } from "wouter";
import { bankColumns } from "../data/columns";
import { bankFilters } from "../data/constants";

export interface BankTableRow {
  id: number | string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
  note: string;
  status: "active" | "inactive" | "archived" | (string & {});
  logo?: string;
}

export function useBankTable() {
  const [, setLocation] = useLocation();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<BankTableRow | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bankNameFilter, setBankNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);

  // The shared table emits "all" when an unfiltered option is selected.
  // It is a UI sentinel, not an API filter value.
  const selectedBankName = bankNameFilter.trim();
  const bankNameKeyword =
    selectedBankName.toLowerCase() === "all" ? undefined : selectedBankName;
  const selectedStatus = statusFilter.trim();
  const status =
    selectedStatus.toLowerCase() === "all" ? undefined : selectedStatus;
  const keywordParts = [searchTerm.trim(), bankNameKeyword].filter(Boolean);

  const bankAccountsQuery = useBankAccounts({
    params: {
      keyword: keywordParts.join(" ") || undefined,
      status,
      onlyOwner: true,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const deleteBankAccountMutation = useDeleteBankAccount();

  const bankAccounts: BankTableRow[] = bankAccountsQuery.items.map(
    (account: BankAccountRecord) => ({
      id: account.id,
      bankName: account.bank?.shortName || account.bank?.name || "",
      accountNumber: account.accountNumber || "",
      accountHolder: account.accountHolder || "",
      branch: account.branch || "",
      note: account.note || "",
      status: account.status || "active",
      logo: account.bank?.logoUrl || "",
    }),
  );

  const handleDelete = (item: BankTableRow) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatusFilter(value);
      setCurrentIndex(1);
    }

    if (key === "bankName") {
      setBankNameFilter(value);
      setCurrentIndex(1);
    }
  };

  const handlePageSize = (value: number) => {
    setPageSize(value);
    setCurrentIndex(1);
  };

  const handleIndexChange = (value: number) => {
    setCurrentIndex(value);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      await deleteBankAccountMutation.deleteBankAccount(deleteItem.id);
      setDeleteOpen(false);
      setDeleteItem(null);
      return;
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    bankAccounts,
    loading: bankAccountsQuery.loading,
    error: bankAccountsQuery.error,
    response: bankAccountsQuery.response,
    searchTerm,
    bankNameFilter,
    statusFilter,
    pageSize,
    currentIndex,
    handleSearch,
    handleFilterChange,
    handlePageSize,
    handleIndexChange,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleEdit: (item: BankTableRow) => setLocation(`/bank/${item.id}/edit`),
    columns: bankColumns,
    filters: [...bankFilters],
  };
}
