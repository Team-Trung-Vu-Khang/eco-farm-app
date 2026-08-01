import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
  FormDialog,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, X } from "lucide-react";
import { useDialogBugWorkaround } from "../../shared/hooks/useDialogBugWorkaround";

import { CropVarietySelectorDialog } from "./components/CropVarietySelectorDialog";
import { columns } from "./data/columns";
import { useFarmingMethodCropPage } from "./hooks/useFarmingMethodCropPage";

export default function FarmingMethodCropPage() {
  const {
    data,
    loading,
    isPending,
    farmingMethods,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    linkDialogOpen,
    setLinkDialogOpen,
    linkDraft,
    editingItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    openAddLinkDialog,
    openEditLinkDialog,
    handleConfirmLink,
    handleSubmit,
    handleConfirmDelete,
  } = useFarmingMethodCropPage();

  useDialogBugWorkaround([formOpen, deleteOpen, linkDialogOpen]);

  return (
    <PageWrapper
      title="Phương thức canh tác theo cây trồng"
      description="Bảng liên kết giữa phương thức canh tác với danh sách cây trồng và giống áp dụng, kèm mô tả ngắn cho từng phương thức."
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm phương thức
        </Button>
      }
    >
      <DataTable
        data={data}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm phương thức, cây trồng hoặc giống..."
        selectable={false}
        searchable
        onSearch={handleSearch}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements}
        totalPages={response?.totalPages}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        loading={loading}
      />

      <FormDialog
        size="xl"
        open={formOpen}
        loading={isPending}
        onSubmit={handleSubmit}
        onOpenChange={(open) => {
          if (!open && linkDialogOpen) return;
          setFormOpen(open);
        }}
        title={editingItem ? "Cập nhật phương thức" : "Thêm phương thức mới"}
      >
        <div className="space-y-5">
          {/* Row 1: Mã phương thức */}
          <div className="space-y-1.5">
            <Label htmlFor="code" className="text-sm font-medium">
              Mã phương thức canh tác
            </Label>
            <Input
              id="code"
              placeholder={
                editingItem ? formData.code : "Tự động sinh nếu để trống"
              }
              value={formData.code || ""}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  code: e.target.value,
                }))
              }
              disabled={!!editingItem}
              clearable={!editingItem}
              className="bg-slate-50"
            />
          </div>

          {/* Row 2: Phương thức canh tác */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Phương thức canh tác
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={formData.farmingMethodId}
              onValueChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  farmingMethodId: value,
                }))
              }
            >
              <SelectTrigger className="bg-slate-50">
                <SelectValue placeholder="Chọn phương thức canh tác" />
              </SelectTrigger>
              <SelectContent>
                {farmingMethods.map((method) => (
                  <SelectItem key={method.id} value={String(method.id)}>
                    <span className="font-medium">{method.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({method.code})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 3: Mô tả */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">
              Mô tả chi tiết
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  description: e.target.value,
                }))
              }
              placeholder="Nhập mô tả chi tiết về phương thức canh tác..."
              rows={3}
              className="resize-none bg-slate-50"
            />
          </div>

          {/* Row 4: Trạng thái */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Trạng thái áp dụng</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") =>
                setFormData((current) => ({ ...current, status: value }))
              }
            >
              <SelectTrigger className="bg-slate-50">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Đang áp dụng</SelectItem>
                <SelectItem value="inactive">Ngưng áp dụng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Cấu hình nhóm cây & giống */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Cấu hình Cây trồng - Giống áp dụng
                </Label>
                <p className="text-xs text-slate-500">
                  Thêm các nhóm cây trồng và giống tương ứng cho phương thức này
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openAddLinkDialog}
                className="h-8"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Thêm liên kết
              </Button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50">
              {formData.relatedCrops.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-4 border-b border-slate-100 p-4 transition-colors last:border-0 hover:bg-white"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    {item.cropId > 0 ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {item.crop}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            {item.cropGroup}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {item.varieties}
                        </p>
                      </>
                    ) : (
                      <div className="py-1 text-sm italic text-slate-400">
                        Chưa chọn cây trồng & giống
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditLinkDialog(index)}
                      className="h-8 px-3 text-primary hover:text-primary/90"
                    >
                      {item.cropId > 0 ? "Thay đổi" : "Chọn ngay"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData((current) => ({
                          ...current,
                          relatedCrops: current.relatedCrops.filter(
                            (_, i) => i !== index,
                          ),
                        }));
                      }}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {formData.relatedCrops.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-500">
                  Chưa có cây trồng nào được liên kết
                </div>
              )}
            </div>
          </div>
        </div>
      </FormDialog>

      <div onClick={(e) => e.stopPropagation()}>
        <CropVarietySelectorDialog
          open={linkDialogOpen}
          initialValue={linkDraft}
          onConfirm={handleConfirmLink}
          onOpenChange={setLinkDialogOpen}
        />
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa phương thức"
        description="Bạn có chắc chắn muốn xóa phương thức canh tác này không? Thao tác này không thể hoàn tác."
        loading={isPending}
      />
    </PageWrapper>
  );
}
