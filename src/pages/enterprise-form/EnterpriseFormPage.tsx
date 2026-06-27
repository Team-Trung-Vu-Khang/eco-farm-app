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
import { EnterpriseTypeForm } from "./components/EnterpriseTypeForm";
import { ENTERPRISE_COLUMNS } from "./data/constants";
import { useEnterpriseForm } from "./hooks/useEnterpriseForm";
import type { CategoryType } from "./types";

const EnterpriseFormPage = () => {
  const {
    activeTab,
    setActiveTab,
    organizationData,
    businessData,
    businessLoading,
    setBusinessSearchQuery,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    register,
    errors,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    getDialogTitles,
  } = useEnterpriseForm();

  const titles = getDialogTitles();

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
            <Button onClick={handleAdd} data-testid="add-organization-type">
              <Plus className="w-4 h-4 mr-2" />
              Thêm loại hình
            </Button>
          </div>
          <DataTable
            columns={ENTERPRISE_COLUMNS}
            data={organizationData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Tìm kiếm loại hình tổ chức..."
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
            <Button onClick={handleAdd} data-testid="add-business-field">
              <Plus className="w-4 h-4 mr-2" />
              Thêm lĩnh vực
            </Button>
          </div>
          <DataTable
            columns={ENTERPRISE_COLUMNS}
            data={businessData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchable
            searchPlaceholder="Tìm kiếm lĩnh vực hoạt động..."
            onSearch={setBusinessSearchQuery}
            loading={businessLoading}
          />
        </TabsContent>
      </Tabs>

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? titles.edit : titles.add}
        onSubmit={handleSubmit}
      >
        <EnterpriseTypeForm
          register={register}
          errors={errors}
        />
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={titles.deleteConfirm}
      />
    </AdminLayout>
  );
};

export default EnterpriseFormPage;
