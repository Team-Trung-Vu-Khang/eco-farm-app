import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useContactStore, { type Contact } from "@/stores/useContactStore";
import {
  useContactGroups,
  useCreateContactGroup,
  useDeleteContactGroup,
  useUpdateContactGroup,
} from "@/features/contact-group";
import type {
  CategoryType,
  ContactGroup,
  ContactGroupFormData,
} from "../types/types";
const ALL_STATUS = "all" as const;
const DEFAULT_PAGE_SIZE = 10;

export function useContact() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CategoryType>("contacts");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<typeof ALL_STATUS | ContactGroup["status"]>(
    ALL_STATUS,
  );
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentIndex, setCurrentIndex] = useState(1);

  const contacts = useContactStore((state) => state.contacts);
  const deleteContact = useContactStore((state) => state.deleteContact);

  const groupsQuery = useContactGroups({
    params: {
      keyword: search.trim() || undefined,
      status: status === ALL_STATUS ? undefined : status,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const groups = useMemo(
    () => groupsQuery.items as ContactGroup[],
    [groupsQuery.items],
  );

  const createContactGroup = useCreateContactGroup({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã thêm nhóm danh bạ mới",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateContactGroup = useUpdateContactGroup({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã cập nhật nhóm danh bạ",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteContactGroup = useDeleteContactGroup({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã xóa nhóm danh bạ",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Contact | ContactGroup | null>(
    null,
  );

  const [groupFormOpen, setGroupFormOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<ContactGroup | null>(null);

  const handleAddGroup = () => {
    setEditGroup(null);
    setGroupFormOpen(true);
  };

  const handleEditGroup = (item: ContactGroup) => {
    setEditGroup(item);
    setGroupFormOpen(true);
  };

  const handleSubmitGroup = async (values: ContactGroupFormData) => {
    if (editGroup) {
      await updateContactGroup.updateContactGroup({
        id: editGroup.id,
        payload: values,
      });
    } else {
      await createContactGroup.createContactGroup(values);
    }

    setGroupFormOpen(false);
    setEditGroup(null);
  };

  const handleDelete = (item: Contact | ContactGroup) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      if (activeTab === "contacts") {
        deleteContact(deleteItem.id);
        toast({
          title: "Thành công",
          description: "Đã xóa liên hệ khỏi hệ thống",
        });
      } else {
        await deleteContactGroup.deleteContactGroup({ id: deleteItem.id });
      }
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(
        value === ALL_STATUS
          ? ALL_STATUS
          : (value as ContactGroup["status"]),
      );
      setCurrentIndex(1);
    }
  };

  return {
    activeTab,
    setActiveTab,
    contacts,
    groups,
    groupsLoading: groupsQuery.loading,
    groupsResponse: groupsQuery.response,
    search,
    status,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    deleteOpen,
    setDeleteOpen,
    groupFormOpen,
    setGroupFormOpen,
    editGroup,
    handleAddGroup,
    handleEditGroup,
    handleSubmitGroup,
    handleDelete,
    handleConfirmDelete,
    handleSearch,
    handleFilterChange,
  };
}
