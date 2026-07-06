import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  FormDialog,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Briefcase, Building2, Plus } from "lucide-react";
import { useState } from "react";
import { BusinessLineForm } from "./components/BusinessLineForm";
import { OrganizationTypeForm } from "./components/OrganizationTypeForm";
import { BUSINESS_COLUMNS, ORGANIZATION_COLUMNS } from "./data/constants";
import { useBusinessLinesForm } from "./hooks/useBusinessLinesForm";
import { useOrganizationTypesForm } from "./hooks/useOrganizationTypesForm";
import type { CategoryType } from "./types";

const BUSINESS_STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
] as const;

const ORGANIZATION_STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
] as const;

const EnterpriseFormPage = () => {
  const [activeTab, setActiveTab] = useState<CategoryType>("organization");
  const organizationForm = useOrganizationTypesForm();
  const businessForm = useBusinessLinesForm();

  return (
    <AdminLayout
      isDev={true}
      title="Danh mục tổ chức"
      description="Quản lý loại hình tổ chức và lĩnh vực hoạt động"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as CategoryType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="organization" className="gap-2">
            <Building2 className="w-4 h-4" />
            Loại hình tổ chức
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Briefcase className="w-4 h-4" />
            Lĩnh vực hoạt động
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Loại hình tổ chức</h3>
              <p className="text-sm text-muted-foreground">
                Phân loại các loại hình tổ chức kinh tế trong nông nghiệp
              </p>
            </div>
            <Button
              onClick={organizationForm.handleAdd}
              data-testid="add-organization-type"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm loại hình
            </Button>
          </div>
          <DataTable
            columns={ORGANIZATION_COLUMNS}
            data={organizationForm.data}
            pageSize={organizationForm.pageSize}
            currentIndex={organizationForm.currentIndex}
            totalElements={organizationForm.response?.totalElements}
            totalPages={organizationForm.response?.totalPages}
            onEdit={organizationForm.handleEdit}
            onDelete={organizationForm.handleDelete}
            searchable
            searchPlaceholder="Tìm kiếm loại hình tổ chức..."
            onSearch={organizationForm.setSearchQuery}
            onPageSize={organizationForm.setPageSize}
            onIndexChange={organizationForm.setCurrentIndex}
            onFilterChange={organizationForm.handleFilterChange}
            filters={[
              {
                key: "status",
                label: "Trạng thái",
                options: [...ORGANIZATION_STATUS_OPTIONS],
              },
            ]}
            loading={organizationForm.loading}
          />
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Lĩnh vực hoạt động</h3>
              <p className="text-sm text-muted-foreground">
                Phân loại các lĩnh vực hoạt động kinh doanh trong nông nghiệp
              </p>
            </div>
            <Button
              onClick={businessForm.handleAdd}
              data-testid="add-business-field"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm lĩnh vực
            </Button>
          </div>
          <DataTable
            columns={BUSINESS_COLUMNS}
            data={businessForm.data}
            pageSize={businessForm.pageSize}
            currentIndex={businessForm.currentIndex}
            totalElements={businessForm.response?.totalElements}
            totalPages={businessForm.response?.totalPages}
            onEdit={businessForm.handleEdit}
            onDelete={businessForm.handleDelete}
            searchable
            searchPlaceholder="Tìm kiếm lĩnh vực hoạt động..."
            onSearch={businessForm.setSearchQuery}
            onPageSize={businessForm.setPageSize}
            onIndexChange={businessForm.setCurrentIndex}
            onFilterChange={businessForm.handleFilterChange}
            filters={[
              {
                key: "status",
                label: "Trạng thái",
                options: [...BUSINESS_STATUS_OPTIONS],
              },
            ]}
            loading={businessForm.loading}
          />
        </TabsContent>
      </Tabs>

      <FormDialog
        open={organizationForm.formOpen}
        onOpenChange={organizationForm.setFormOpen}
        title={
          organizationForm.editItem
            ? "Chỉnh sửa loại hình tổ chức"
            : "Thêm loại hình tổ chức"
        }
        onSubmit={organizationForm.handleSubmit}
        loading={organizationForm.formLoading}
      >
        <OrganizationTypeForm
          control={organizationForm.control}
          register={organizationForm.register}
          errors={organizationForm.errors}
        />
      </FormDialog>

      <FormDialog
        open={businessForm.formOpen}
        onOpenChange={businessForm.setFormOpen}
        title={
          businessForm.editItem
            ? "Chỉnh sửa lĩnh vực hoạt động"
            : "Thêm lĩnh vực hoạt động"
        }
        onSubmit={businessForm.handleSubmit}
        loading={businessForm.formLoading}
      >
        <BusinessLineForm
          register={businessForm.register}
          errors={businessForm.errors}
        />
      </FormDialog>

      <DeleteDialog
        open={organizationForm.deleteOpen}
        onOpenChange={organizationForm.setDeleteOpen}
        onConfirm={organizationForm.handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa loại hình tổ chức này?"
        loading={organizationForm.deleteLoading}
      />

      <DeleteDialog
        open={businessForm.deleteOpen}
        onOpenChange={businessForm.setDeleteOpen}
        onConfirm={businessForm.handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa lĩnh vực hoạt động này?"
        loading={businessForm.deleteLoading}
      />
    </AdminLayout>
  );
};

export default EnterpriseFormPage;
