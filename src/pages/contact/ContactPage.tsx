import {
  AdminLayout,
  DeleteDialog,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { BookUser, Users } from "lucide-react";
import { GroupFormDialog } from "./components/GroupFormDialog";
import { ContactTab } from "./components/tabs/ContactTab";
import { GroupTab } from "./components/tabs/GroupTab";
import { useContact } from "./hooks/useContact";
import type { CategoryType } from "./types/types";

const GROUP_STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
];

/**
 * Contact management page.
 * Manages contacts and contact groups using tabs and Zustand store.
 */
export default function ContactPage() {
  const {
    activeTab,
    setActiveTab,
    contacts,
    groups,
    groupsLoading,
    groupsResponse,
    pageSize,
    currentIndex,
    setCurrentIndex,
    setPageSize,
    handleSearch,
    handleFilterChange,
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
  } = useContact();

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý thông tin liên hệ"
      description="Quản lý sổ danh bạ và nhóm danh bạ"
    >
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as CategoryType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="contacts" className="gap-2">
            <BookUser className="w-4 h-4" />
            Sổ danh bạ
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-2">
            <Users className="w-4 h-4" />
            Nhóm danh bạ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          <ContactTab
            contacts={contacts}
            groups={groups}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="groups">
          <GroupTab
            groups={groups}
            loading={groupsLoading}
            pageSize={pageSize}
            currentIndex={currentIndex}
            totalPages={groupsResponse?.totalPages}
            totalElements={groupsResponse?.totalElements}
            filters={[
              {
                key: "status",
                label: "Trạng thái",
                options: GROUP_STATUS_OPTIONS,
              },
            ]}
            onAdd={handleAddGroup}
            onEdit={handleEditGroup}
            onDelete={handleDelete}
            onSearch={handleSearch}
            onIndexChange={setCurrentIndex}
            onPageSize={setPageSize}
            onFilterChange={handleFilterChange}
          />
        </TabsContent>
      </Tabs>

      <GroupFormDialog
        open={groupFormOpen}
        onOpenChange={setGroupFormOpen}
        editItem={editGroup}
        onSubmit={handleSubmitGroup}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={`Bạn có chắc chắn muốn xóa ${
          activeTab === "contacts" ? "liên hệ" : "nhóm danh bạ"
        } này? Hoạt động này không thể hoàn tác.`}
      />
    </AdminLayout>
  );
}
