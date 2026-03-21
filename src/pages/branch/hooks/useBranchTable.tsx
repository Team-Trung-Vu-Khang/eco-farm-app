import { useState } from "react";
import { useLocation } from "wouter";
import {
  Badge,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBranchStore, { type Branch } from "../../../stores/useBranchStore";

export function useBranchTable() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const deleteBranch = useBranchStore((state) => state.deleteBranch);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Branch | null>(null);

  const columns: Column<Branch>[] = [
    { key: "code", label: "Mã" },
    { key: "name", label: "Tên chi nhánh" },
    { key: "enterpriseName", label: "Đơn vị chủ quản" },
    { key: "phone", label: "Điện thoại" },
    { key: "email", label: "Email" },
    { key: "address", label: "Địa chỉ" },
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
  ];

  const handleDelete = (item: Branch) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteBranch(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa chi nhánh khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  const handleView = (item: Branch) => {
    setLocation(`/branch/${item.id}/detail`);
  };

  const handleEdit = (item: Branch) => {
    setLocation(`/branch/${item.id}/edit`);
  };

  return {
    columns,
    filters,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit,
  };
}
