import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useCultivationPlotPage } from "./hooks/useCultivationPlotPage";
import { TERMS, formatTerm } from "@/config/terminology";

const CultivationPlotPage = () => {
  const {
    cultivationPlots,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
  } = useCultivationPlotPage();

  return (
    <PageWrapper
      title={TERMS.plot}
      description={`Quản lý các thiết lập theo ${TERMS.area}`}
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thiết lập mới
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={cultivationPlots}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={formatTerm.deleteConfirm(TERMS.plot)}
      />
    </PageWrapper>
  );
};

export default CultivationPlotPage;
