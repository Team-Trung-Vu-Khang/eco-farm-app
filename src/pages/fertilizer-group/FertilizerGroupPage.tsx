import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Beaker, Box, Calendar, Leaf, Plus } from "lucide-react";
import { useState } from "react";
import FertilizerNutritionalContentPage from "./FertilizerNutritionalContentPage";
import FertilizerOriginPage from "./FertilizerOriginPage";
import FertilizerApplicationStagePage from "./FertilizerApplicationStagePage";
import FertilizerPhysicalFormPage from "./FertilizerPhysicalFormPage";
import { FertilizerGroupFormDialog } from "./components/FertilizerGroupFormDialog";
import { useFertilizerGroupPage } from "./hooks/useFertilizerGroupPage";

type FertilizerGroupTab =
  | "nutritional_content"
  | "origin"
  | "application_stage"
  | "physical_form";

const FertilizerGroupPage = () => {
  const [activeTab, setActiveTab] = useState<FertilizerGroupTab>(
    "nutritional_content",
  );

  const {
    formOpen,
    setFormOpen,
    editItem,
    handleAdd,
    handleEdit,
    handleSubmit,
  } = useFertilizerGroupPage();

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
      title="Danh mục phân bón"
      description="Quản lý phân loại phân bón theo thành phần, nguồn gốc, giai đoạn và hình thái"
      actions={
        <Button onClick={handleAdd} data-testid="add-fertilizer-group">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm
        </Button>
      }
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as FertilizerGroupTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger
            value="nutritional_content"
            className="flex items-center gap-2"
          >
            <Beaker className="w-4 h-4" />
            Thành phần dinh dưỡng
          </TabsTrigger>
          <TabsTrigger value="origin" className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Nguồn gốc
          </TabsTrigger>
          <TabsTrigger
            value="application_stage"
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Giai đoạn tác động
          </TabsTrigger>
          <TabsTrigger
            value="physical_form"
            className="flex items-center gap-2"
          >
            <Box className="w-4 h-4" />
            Hình thái vật lý
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nutritional_content">
          <FertilizerNutritionalContentPage onEdit={handleStaticEdit} />
        </TabsContent>

        <TabsContent value="origin">
          <FertilizerOriginPage onEdit={handleStaticEdit} />
        </TabsContent>

        <TabsContent value="application_stage">
          <FertilizerApplicationStagePage onEdit={handleStaticEdit} />
        </TabsContent>

        <TabsContent value="physical_form">
          <FertilizerPhysicalFormPage onEdit={handleStaticEdit} />
        </TabsContent>
      </Tabs>

      <FertilizerGroupFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        onSubmit={handleSubmit}
      />
    </PageWrapper>
  );
};

export default FertilizerGroupPage;
