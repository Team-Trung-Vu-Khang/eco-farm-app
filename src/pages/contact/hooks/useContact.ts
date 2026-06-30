import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useContacts,
  useDeleteContact,
} from "@/features/contact";
import type { Contact } from "@/features/contact";
import {
  useContactGroups,
  useCreateContactGroup,
  useDeleteContactGroup,
  useUpdateContactGroup,
} from "@/features/contact-group";
import type { ContactGroup } from "@/features/contact-group";
import type { CategoryType, ContactGroupFormData } from "../types/types";

const ALL_STATUS = "all" as const;
const DEFAULT_PAGE_SIZE = 10;

export function useContact() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CategoryType>("contacts");

  const [contactSearch, setContactSearch] = useState("");
  const [contactStatus, setContactStatus] = useState<
    typeof ALL_STATUS | Contact["status"]
  >(ALL_STATUS);
  const [contactGroupId, setContactGroupId] = useState<typeof ALL_STATUS | string>(
    ALL_STATUS,
  );
  const [contactPageSize, setContactPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [contactCurrentIndex, setContactCurrentIndex] = useState(1);

  const [groupSearch, setGroupSearch] = useState("");
  const [groupStatus, setGroupStatus] = useState<
    typeof ALL_STATUS | ContactGroup["status"]
  >(ALL_STATUS);
  const [groupPageSize, setGroupPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [groupCurrentIndex, setGroupCurrentIndex] = useState(1);

  const contactsQuery = useContacts({
    params: {
      keyword: contactSearch.trim() || undefined,
      groupId: contactGroupId === ALL_STATUS ? undefined : contactGroupId,
      status: contactStatus === ALL_STATUS ? undefined : contactStatus,
      page: Math.max(contactCurrentIndex - 1, 0),
      size: contactPageSize,
    },
  });

  const groupsQuery = useContactGroups({
    params: {
      keyword: groupSearch.trim() || undefined,
      status: groupStatus === ALL_STATUS ? undefined : groupStatus,
      page: Math.max(groupCurrentIndex - 1, 0),
      size: groupPageSize,
    },
  });

  const contacts = useMemo(
    () => contactsQuery.items as Contact[],
    [contactsQuery.items],
  );
  const groups = useMemo(
    () => groupsQuery.items as ContactGroup[],
    [groupsQuery.items],
  );

  const deleteContact = useDeleteContact({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã xóa liên hệ khỏi hệ thống",
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
        await deleteContact.deleteContact({ id: deleteItem.id });
      } else {
        await deleteContactGroup.deleteContactGroup({ id: deleteItem.id });
      }
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  const handleContactSearch = (value: string) => {
    setContactSearch(value);
    setContactCurrentIndex(1);
  };

  const handleContactFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setContactStatus(
        value === ALL_STATUS ? ALL_STATUS : (value as Contact["status"]),
      );
      setContactCurrentIndex(1);
    }

    if (key === "groupId") {
      setContactGroupId(value === ALL_STATUS ? ALL_STATUS : value);
      setContactCurrentIndex(1);
    }
  };

  const handleGroupSearch = (value: string) => {
    setGroupSearch(value);
    setGroupCurrentIndex(1);
  };

  const handleGroupFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setGroupStatus(
        value === ALL_STATUS
          ? ALL_STATUS
          : (value as ContactGroup["status"]),
      );
      setGroupCurrentIndex(1);
    }
  };

  return {
    activeTab,
    setActiveTab,
    contacts,
    groups,
    contactsLoading: contactsQuery.loading,
    contactsResponse: contactsQuery.response,
    groupsLoading: groupsQuery.loading,
    groupsResponse: groupsQuery.response,
    contactPageSize,
    setContactPageSize,
    contactCurrentIndex,
    setContactCurrentIndex,
    groupPageSize,
    setGroupPageSize,
    groupCurrentIndex,
    setGroupCurrentIndex,
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
    handleContactSearch,
    handleContactFilterChange,
    handleGroupSearch,
    handleGroupFilterChange,
  };
}
