import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Cpu, DollarSign, ListTree, Plus } from "lucide-react";
import { useState } from "react";
import MaterialTechnologyLevelPage from "./MaterialTechnologyLevelPage";
import MaterialValueChainPage from "./MaterialValueChainPage";
import MaterialFinancialAspectPage from "./MaterialFinancialAspectPage";
import { MaterialGroupFormDialog } from "./components/MaterialGroupFormDialog";
import { useMaterialGroupPage } from "./hooks/useMaterialGroupPage";

type MaterialGroupTab = "technology_level" | "value_chain" | "financial_aspect";

const MaterialGroupPage = () => {
  const [activeTab, setActiveTab] =
    useState<MaterialGroupTab>("technology_level");

  const {
    formOpen,
    setFormOpen,
    editItem,
    handleAdd,
    handleEdit,
    handleSubmit,
  } = useMaterialGroupPage();

  const handleStaticEdit = (item: any) => {
    handleEdit({
      id: Math.floor(Math.random() * 1000000), // Fake ID for static item
      code: item.id || item.code || "",
      name: item.label || item.name || "",
      description: item.description || "",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any);
  };

  return (
    <PageWrapper
      title="Nhóm vật tư khác"
      description="Quản lý danh mục dụng cụ, máy móc, vật tư theo công nghệ, chuỗi giá trị và tài chính"
      actions={
        <Button onClick={handleAdd} data-testid="add-material-group">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm
        </Button>
      }
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as MaterialGroupTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger
            value="technology_level"
            className="flex items-center gap-2"
          >
            <Cpu className="w-4 h-4" />
            Mức độ công nghệ
          </TabsTrigger>
          <TabsTrigger value="value_chain" className="flex items-center gap-2">
            <ListTree className="w-4 h-4" />
            Chuỗi giá trị
          </TabsTrigger>
          <TabsTrigger
            value="financial_aspect"
            className="flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Khía cạnh tài chính
          </TabsTrigger>
        </TabsList>

        <TabsContent value="technology_level">
          <MaterialTechnologyLevelPage onEdit={handleStaticEdit} />
        </TabsContent>

        <TabsContent value="value_chain">
          <MaterialValueChainPage onEdit={handleStaticEdit} />
        </TabsContent>

        <TabsContent value="financial_aspect">
          <MaterialFinancialAspectPage onEdit={handleStaticEdit} />
        </TabsContent>
      </Tabs>

      <MaterialGroupFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        onSubmit={handleSubmit}
      />
    </PageWrapper>
  );
};

export default MaterialGroupPage;
