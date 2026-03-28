import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useContactStore, {
  type Contact,
  type ContactGroup,
} from "@/stores/useContactStore";
import { emptyContactGroupFormData } from "../data/constants";
import type { CategoryType, ContactGroupFormData } from "../types/types";

export function useContact() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CategoryType>("contacts");

  const contacts = useContactStore((state) => state.contacts);
  const groups = useContactStore((state) => state.groups);
  const deleteContact = useContactStore((state) => state.deleteContact);
  const deleteGroup = useContactStore((state) => state.deleteGroup);
  const addGroup = useContactStore((state) => state.addGroup);
  const updateGroup = useContactStore((state) => state.updateGroup);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Contact | ContactGroup | null>(
    null,
  );

  const [groupFormOpen, setGroupFormOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<ContactGroup | null>(null);
  const [groupFormData, setGroupFormData] =
    useState<ContactGroupFormData>(emptyContactGroupFormData);

  const handleAddGroup = () => {
    setEditGroup(null);
    setGroupFormData(emptyContactGroupFormData);
    setGroupFormOpen(true);
  };

  const handleEditGroup = (item: ContactGroup) => {
    setEditGroup(item);
    setGroupFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setGroupFormOpen(true);
  };

  const handleSubmitGroup = () => {
    if (editGroup) {
      updateGroup(editGroup.id, groupFormData);
      toast({ title: "Thành công", description: "Đã cập nhật nhóm danh bạ" });
    } else {
      const newId =
        groups.length > 0 ? Math.max(...groups.map((g) => g.id)) + 1 : 1;
      const newGroup: ContactGroup = {
        id: newId,
        ...groupFormData,
        contactCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      addGroup(newGroup);
      toast({ title: "Thành công", description: "Đã thêm nhóm danh bạ mới" });
    }
    setGroupFormOpen(false);
  };

  const handleDelete = (item: Contact | ContactGroup) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      if (activeTab === "contacts") {
        deleteContact(deleteItem.id);
        toast({
          title: "Thành công",
          description: "Đã xóa liên hệ khỏi hệ thống",
        });
      } else {
        deleteGroup(deleteItem.id);
        toast({ title: "Thành công", description: "Đã xóa nhóm danh bạ" });
      }
    }
    setDeleteOpen(false);
  };

  return {
    activeTab,
    setActiveTab,
    contacts,
    groups,
    deleteOpen,
    setDeleteOpen,
    groupFormOpen,
    setGroupFormOpen,
    editGroup,
    groupFormData,
    setGroupFormData,
    handleAddGroup,
    handleEditGroup,
    handleSubmitGroup,
    handleDelete,
    handleConfirmDelete,
  };
}
