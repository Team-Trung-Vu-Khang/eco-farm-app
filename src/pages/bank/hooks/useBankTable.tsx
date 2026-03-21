import { useState } from "react";
import { useLocation } from "wouter";
import {
  Badge,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBankStore, { type BankAccount } from "../../../stores/useBankStore";
import BankLogo from "../components/BankLogo";
import { BANK_LIST } from "../data/bank-constants";

export function useBankTable() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const deleteBankAccount = useBankStore((state) => state.deleteBankAccount);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<BankAccount | null>(null);

  const columns: Column<BankAccount>[] = [
    {
      key: "bankName",
      label: "Ngân hàng",
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <BankLogo bankName={value as string} logo={item.logo} />
          <div className="font-medium">{value}</div>
        </div>
      ),
    },
    { key: "accountNumber", label: "Số tài khoản" },
    { key: "accountHolder", label: "Chủ tài khoản" },
    { key: "branch", label: "Chi nhánh" },
    { key: "note", label: "Ghi chú" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
          {value === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Không hoạt động", value: "inactive" },
      ],
    },
    {
      key: "bankName",
      label: "Ngân hàng",
      options: BANK_LIST,
    },
  ];

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
  };

  const handleEdit = (item: BankAccount) => {
    setLocation(`/bank/${item.id}/edit`);
  };

  const handleView = (item: BankAccount) => {
    setLocation(`/bank/${item.id}/edit`);
  };

  return {
    columns,
    filters,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleEdit,
    handleView,
  };
}
