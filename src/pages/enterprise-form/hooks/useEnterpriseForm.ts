import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import {
  INITIAL_BUSINESS_DATA,
  INITIAL_ORGANIZATION_DATA,
} from "../data/constants";
import type {
  CategoryType,
  EnterpriseType,
  EnterpriseTypeFormData,
} from "../types";

export function useEnterpriseForm() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CategoryType>("organization");

  // State for data
  const [organizationData, setOrganizationData] = useState<EnterpriseType[]>(
    INITIAL_ORGANIZATION_DATA,
  );
  const [businessData, setBusinessData] = useState<EnterpriseType[]>(
    INITIAL_BUSINESS_DATA,
  );

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<EnterpriseType | null>(null);
  const [deleteItem, setDeleteItem] = useState<EnterpriseType | null>(null);

  const [formData, setFormData] = useState<EnterpriseTypeFormData>({
    code: "",
    name: "",
    description: "",
    status: "active",
  });

  const getCurrentData = () => {
    return activeTab === "organization" ? organizationData : businessData;
  };

  const updateCurrentData = (
    updater: (prev: EnterpriseType[]) => EnterpriseType[],
  ) => {
    if (activeTab === "organization") {
      setOrganizationData(updater);
    } else {
      setBusinessData(updater);
    }
  };

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      status: "active",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: EnterpriseType) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: EnterpriseType) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const categoryName =
      activeTab === "organization" ? "loại hình tổ chức" : "lĩnh vực hoạt động";

    if (editItem) {
      updateCurrentData((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...formData } : item,
        ),
      );
      toast({
        title: "Thành công",
        description: `Đã cập nhật ${categoryName}`,
      });
    } else {
      const newItem: EnterpriseType = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      updateCurrentData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: `Đã thêm ${categoryName} mới`,
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    const categoryName =
      activeTab === "organization" ? "loại hình tổ chức" : "lĩnh vực hoạt động";

    if (deleteItem) {
      updateCurrentData((prev) =>
        prev.filter((item) => item.id !== deleteItem.id),
      );
      toast({
        title: "Thành công",
        description: `Đã xóa ${categoryName}`,
      });
    }
    setDeleteOpen(false);
  };

  const getDialogTitles = () => {
    if (activeTab === "organization") {
      return {
        add: "Thêm loại hình tổ chức",
        edit: "Chỉnh sửa loại hình tổ chức",
        deleteConfirm: "Bạn có chắc chắn muốn xóa loại hình tổ chức này?",
      };
    }
    return {
      add: "Thêm lĩnh vực hoạt động",
      edit: "Chỉnh sửa lĩnh vực hoạt động",
      deleteConfirm: "Bạn có chắc chắn muốn xóa lĩnh vực hoạt động này?",
    };
  };

  return {
    activeTab,
    setActiveTab,
    organizationData,
    businessData,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    getDialogTitles,
  };
}
