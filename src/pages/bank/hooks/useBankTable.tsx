import { bankColumns } from "../data/columns";
import { bankFilters } from "../data/constants";
import { useBankPage } from "./useBankPage";

export function useBankTable() {
  const {
    bankAccounts,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleEdit,
    handleView,
  } = useBankPage();

  return {
    bankAccounts,
    columns: bankColumns,
    filters: [...bankFilters],
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleEdit,
    handleView,
  };
}
