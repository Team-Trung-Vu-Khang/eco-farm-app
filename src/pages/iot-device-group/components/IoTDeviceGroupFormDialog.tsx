import { useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers3, Plus, Settings2 } from "lucide-react";
import { IoTDeviceTypeSelectorDialog } from "./IoTDeviceTypeSelectorDialog";
import type { IoTDeviceGroupFormData } from "../types";

interface IoTDeviceGroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: IoTDeviceGroupFormData;
  setFormData: (data: IoTDeviceGroupFormData) => void;
  onSubmit: () => void;
}

export function IoTDeviceGroupFormDialog({
  open,
  onOpenChange,
  isEdit,
  formData,
  setFormData,
  onSubmit,
}: IoTDeviceGroupFormDialogProps) {
  const [isTypeSelectorOpen, setIsTypeSelectorOpen] = useState(false);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setIsTypeSelectorOpen(false);
          }
          onOpenChange(nextOpen);
        }}
      >
        <DialogContent className="flex h-[90vh] max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
          <DialogHeader className="shrink-0 border-b bg-slate-50 px-6 py-5">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layers3 className="h-4 w-4" />
              </div>
              {isEdit ? "Chỉnh sửa nhóm IoT" : "Thêm nhóm IoT mới"}
            </DialogTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Cập nhật thông tin nhóm, loại thiết bị hỗ trợ và số lượng triển khai dự kiến.
            </p>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto bg-white px-6 py-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="code">Mã nhóm</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(event) =>
                        setFormData({ ...formData, code: event.target.value })
                      }
                      placeholder="VD: ENV_SENSOR"
                      className="h-11 rounded-xl bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên nhóm</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(event) =>
                        setFormData({ ...formData, name: event.target.value })
                      }
                      placeholder="VD: Nhóm cảm biến môi trường"
                      className="h-11 rounded-xl bg-slate-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        description: event.target.value,
                      })
                    }
                    placeholder="Mô tả phạm vi quản lý, vùng triển khai hoặc chức năng của nhóm..."
                    rows={4}
                    className="rounded-xl bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="plannedDeviceCount">
                      Số thiết bị dự kiến
                    </Label>
                    <Input
                      id="plannedDeviceCount"
                      type="number"
                      min={1}
                      value={formData.plannedDeviceCount}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          plannedDeviceCount: Number(event.target.value) || 1,
                        })
                      }
                      placeholder="VD: 12"
                      className="h-11 rounded-xl bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "active" | "inactive") =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger
                        id="status"
                        className="h-11 rounded-xl bg-slate-50"
                      >
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Đang hoạt động</SelectItem>
                        <SelectItem value="inactive">Tạm dừng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 lg:col-span-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <Label className="text-sm font-semibold text-slate-700">
                        Loại thiết bị hỗ trợ
                      </Label>
                      <p className="mt-1 text-xs text-slate-500">
                        Chọn một hoặc nhiều loại thiết bị cho nhóm này.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0 rounded-xl"
                      onClick={() => setIsTypeSelectorOpen(true)}
                    >
                      <Settings2 className="mr-2 h-4 w-4" />
                      Chọn loại
                    </Button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {formData.deviceTypes.length > 0 ? (
                      formData.deviceTypes.map((type) => (
                        <div
                          key={type}
                          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3"
                        >
                          <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-md bg-emerald-600 text-white">
                            <Plus className="h-3 w-3 rotate-45" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-slate-900">
                              {type}
                            </div>
                            <div className="text-xs text-slate-500">
                              {type === "Sensor"
                                ? "Đo lường và giám sát"
                                : type === "Actuator"
                                  ? "Điều khiển thiết bị"
                                  : type === "Gateway"
                                    ? "Kết nối và chuyển tiếp"
                                    : "Điều phối trung tâm"}
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="rounded-full bg-white text-emerald-700"
                          >
                            Đã chọn
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                        Chưa chọn loại thiết bị nào.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t bg-white px-6 py-4">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={onSubmit} className="bg-primary hover:bg-primary/90">
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <IoTDeviceTypeSelectorDialog
        open={isTypeSelectorOpen}
        onOpenChange={setIsTypeSelectorOpen}
        selectedTypes={formData.deviceTypes}
        onSelect={(types) => setFormData({ ...formData, deviceTypes: types })}
      />
    </>
  );
}
