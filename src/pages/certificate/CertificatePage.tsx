import PageWrapper from "@/components/PageWrapper";
import {
  DeleteDialog,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Award, Building2 } from "lucide-react";
import { OrganizationFormDialog } from "./components/OrganizationFormDialog";
import { OrganizationTab } from "./components/OrganizationTab";
import { StandardFormDialog } from "./components/StandardFormDialog";
import { StandardTab } from "./components/StandardTab";
import { useCertificate } from "./hooks/useCertificate";
import type { CategoryType } from "./types/types";

const ORGANIZATION_STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
];

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
    setOrganizationSearchQuery,
    setOrganizationStatusFilter,
    standardsLoading,
    standardsError,
    standardFormOpen,
    setStandardFormOpen,
    orgFormOpen,
    setOrgFormOpen,
    editStandard,
    editOrg,
    organizationsLoading,
    organizationsError,
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
    standardsPending,
    organizationsPending,
  } = useCertificate();

  return (
    <PageWrapper
      title="Danh mục tiêu chuẩn"
      description="Quản lý loại tiêu chuẩn và tổ chức chứng nhận (Master Data)"
    >
      {standardsError ? (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {standardsError}
        </div>
      ) : null}

      {organizationsError ? (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {organizationsError}
        </div>
      ) : null}

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
            loading={standardsLoading}
          />
        </TabsContent>

        <TabsContent value="organizations">
          <OrganizationTab
            organizations={organizations}
            onAdd={handleAddOrg}
            onEdit={handleEditOrg}
            onDelete={handleDelete}
            loading={organizationsLoading}
            searchable
            searchPlaceholder="Tìm kiếm tổ chức..."
            onSearch={setOrganizationSearchQuery}
            filters={[
              {
                key: "status",
                label: "Trạng thái",
                options: ORGANIZATION_STATUS_OPTIONS,
              },
            ]}
            onFilterChange={(key, value) => {
              if (key === "status") {
                setOrganizationStatusFilter(value);
              }
            }}
          />
        </TabsContent>
      </Tabs>

      <StandardFormDialog
        open={standardFormOpen}
        onOpenChange={setStandardFormOpen}
        editItem={editStandard}
        organizations={organizations}
        onSubmit={handleSubmitStandard}
        loading={standardsPending}
      />

      <OrganizationFormDialog
        open={orgFormOpen}
        onOpenChange={setOrgFormOpen}
        editItem={editOrg}
        onSubmit={handleSubmitOrg}
        loading={organizationsPending}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={`Bạn có chắc chắn muốn xóa ${
          activeTab === "standards" ? "loại tiêu chuẩn" : "tổ chức"
        } này?`}
      />
    </PageWrapper>
  );
}
