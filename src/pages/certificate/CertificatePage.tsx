import {
  AdminLayout,
  DeleteDialog,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Award, Building2 } from "lucide-react";
import { useCertificate } from "./hooks/useCertificate";
import { StandardTab } from "./components/StandardTab";
import { OrganizationTab } from "./components/OrganizationTab";
import { StandardFormDialog } from "./components/StandardFormDialog";
import { OrganizationFormDialog } from "./components/OrganizationFormDialog";
import type { CategoryType } from "./types/types";

/**
 * Certificate page component.
 * Manages standards and certification organizations using a tabbed interface.
 */
export default function CertificatePage() {
  const {
    activeTab,
    setActiveTab,
    standards,
    organizations,
    standardFormOpen,
    setStandardFormOpen,
    orgFormOpen,
    setOrgFormOpen,
    standardFormData,
    setStandardFormData,
    orgFormData,
    setOrgFormData,
    editStandard,
    editOrg,
    orgSearchQuery,
    setOrgSearchQuery,
    deleteOpen,
    setDeleteOpen,
    handleAddStandard,
    handleEditStandard,
    handleSubmitStandard,
    handleAddOrg,
    handleEditOrg,
    handleSubmitOrg,
    handleDelete,
    handleConfirmDelete,
  } = useCertificate();

  return (
    <AdminLayout
      isRice
      title="Danh mục tiêu chuẩn"
      description="Quản lý loại tiêu chuẩn và tổ chức chứng nhận (Master Data)"
    >
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as CategoryType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="standards" className="gap-2">
            <Award className="w-4 h-4" />
            Loại tiêu chuẩn
          </TabsTrigger>
          <TabsTrigger value="organizations" className="gap-2">
            <Building2 className="w-4 h-4" />
            Tổ chức chứng nhận
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standards">
          <StandardTab
            standards={standards}
            organizations={organizations}
            onAdd={handleAddStandard}
            onEdit={handleEditStandard}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="organizations">
          <OrganizationTab
            organizations={organizations}
            onAdd={handleAddOrg}
            onEdit={handleEditOrg}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      <StandardFormDialog
        open={standardFormOpen}
        onOpenChange={setStandardFormOpen}
        editItem={editStandard}
        formData={standardFormData}
        setFormData={setStandardFormData}
        organizations={organizations}
        onSubmit={handleSubmitStandard}
        searchQuery={orgSearchQuery}
        setSearchQuery={setOrgSearchQuery}
      />

      <OrganizationFormDialog
        open={orgFormOpen}
        onOpenChange={setOrgFormOpen}
        editItem={editOrg}
        formData={orgFormData}
        setFormData={setOrgFormData}
        onSubmit={handleSubmitOrg}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={`Bạn có chắc chắn muốn xóa ${
          activeTab === "standards" ? "loại tiêu chuẩn" : "tổ chức"
        } này?`}
      />
    </AdminLayout>
  );
}
