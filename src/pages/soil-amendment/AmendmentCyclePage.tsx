import {
  AdminLayout,
  Button,
  CardContent,
  DataTable,
  DeleteDialog,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { LayoutGrid, List, Plus } from "lucide-react";
import type { AmendmentCycle } from "./types/amendment-cycle";
import { AmendmentCycleCardGrid } from "./components/AmendmentCycleCardGrid";
import { AmendmentCycleDetailDialog } from "./components/AmendmentCycleDetailDialog";
import { AmendmentCycleFormDialog } from "./components/AmendmentCycleFormDialog";
import { AmendmentCycleIntro } from "./components/AmendmentCycleIntro";
import { amendmentCycleColumns } from "./data/amendmentCycleColumns";
import { useAmendmentCyclePage } from "./hooks/useAmendmentCyclePage";

const AmendmentCyclePage = () => {
  const {
    activitySearch,
    addActivity,
    customActivityType,
    data,
    deleteOpen,
    detailItem,
    detailOpen,
    editItem,
    filteredActivities,
    formData,
    formOpen,
    handleAdd,
    handleAddCustomActivity,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    handleRemoveActivity,
    handleSave,
    handleViewDetail,
    isActivityListOpen,
    setActivitySearch,
    setCustomActivityType,
    setDeleteOpen,
    setDetailOpen,
    setFormData,
    setFormOpen,
    setIsActivityListOpen,
    setViewMode,
    viewMode,
  } = useAmendmentCyclePage();

  return (
    <AdminLayout
      isDev={true}
      title="Chu kỳ cải tạo đất"
      description="Quản lý các quy trình và thời gian phục hồi đất canh tác"
      actions={
        <div className="flex gap-2">
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            <Button
              variant={viewMode === "card" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("card")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo chu kỳ mới
          </Button>
        </div>
      }
    >
      <ScrollArea className="h-full">
        <div className="mx-auto max-w-7xl space-y-8 p-6">
          <AmendmentCycleIntro />

          {viewMode === "card" ? (
            <AmendmentCycleCardGrid
              cycles={data}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onViewDetail={handleViewDetail}
            />
          ) : (
            <CardContent className="p-0">
              <DataTable
                columns={[
                  ...amendmentCycleColumns,
                  {
                    key: "id",
                    label: "Hành động",
                    render: (_, item) => (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleViewDetail(item as AmendmentCycle)
                          }
                        >
                          Xem
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(item as AmendmentCycle)}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(item as AmendmentCycle)}
                        >
                          Xóa
                        </Button>
                      </div>
                    ),
                  },
                ]}
                data={data}
                searchPlaceholder="Tìm kiếm..."
              />
            </CardContent>
          )}
        </div>
      </ScrollArea>

      <AmendmentCycleFormDialog
        activitySearch={activitySearch}
        addActivity={addActivity}
        customActivityType={customActivityType}
        editItem={editItem}
        filteredActivities={filteredActivities}
        formData={formData}
        isActivityListOpen={isActivityListOpen}
        onAddCustomActivity={handleAddCustomActivity}
        onOpenChange={setFormOpen}
        onRemoveActivity={handleRemoveActivity}
        onSave={handleSave}
        open={formOpen}
        setActivitySearch={setActivitySearch}
        setCustomActivityType={setCustomActivityType}
        setFormData={setFormData}
        setIsActivityListOpen={setIsActivityListOpen}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />

      <AmendmentCycleDetailDialog
        item={detailItem}
        onOpenChange={setDetailOpen}
        open={detailOpen}
      />
    </AdminLayout>
  );
};

export default AmendmentCyclePage;
