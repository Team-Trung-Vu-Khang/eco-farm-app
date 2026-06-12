import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Search, X } from "lucide-react";
import { IOT_DEVICE_TYPE_OPTIONS } from "../data/constants";
import type { IoTDeviceGroupType } from "../types";

interface IoTDeviceTypeSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTypes: IoTDeviceGroupType[];
  onSelect: (types: IoTDeviceGroupType[]) => void;
}

const typeDescriptions: Record<IoTDeviceGroupType, string> = {
  Sensor: "Thiết bị đo lường, giám sát môi trường và hiện trạng.",
  Actuator: "Thiết bị chấp hành, điều khiển hệ thống ngoài hiện trường.",
  Gateway: "Thiết bị chuyển tiếp dữ liệu và kết nối về trung tâm.",
  Controller: "Thiết bị điều phối và điều khiển logic trung tâm.",
};

export function IoTDeviceTypeSelectorDialog({
  open,
  onOpenChange,
  selectedTypes,
  onSelect,
}: IoTDeviceTypeSelectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedTypes, setTempSelectedTypes] =
    useState<IoTDeviceGroupType[]>(selectedTypes);

  const filteredTypes = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return IOT_DEVICE_TYPE_OPTIONS;

    return IOT_DEVICE_TYPE_OPTIONS.filter((type) => {
      const searchableText = `${type} ${typeDescriptions[type]}`.toLowerCase();
      return searchableText.includes(query);
    });
  }, [searchTerm]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setTempSelectedTypes(selectedTypes);
          setSearchTerm("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="flex h-[90vh] max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-4 w-4" />
            </div>
            Chọn loại thiết bị hỗ trợ
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Tìm và chọn một hoặc nhiều loại thiết bị mà nhóm này hỗ trợ triển khai.
          </p>
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo loại thiết bị, chức năng hoặc mô tả..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{filteredTypes.length} kết quả</span>
            {tempSelectedTypes.length > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary">
                <Check className="h-3 w-3" />
                Đã chọn {tempSelectedTypes.length} loại
              </span>
            )}
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="grid gap-3 p-6 sm:grid-cols-2">
            {filteredTypes.map((type) => {
              const isSelected = tempSelectedTypes.includes(type);

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setTempSelectedTypes((previous) =>
                      previous.includes(type)
                        ? previous.filter((item) => item !== type)
                        : [...previous, type],
                    )
                  }
                  className={cn(
                    "group flex items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md",
                    isSelected
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-slate-200",
                  )}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
                    <div
                      className={cn(
                        "flex h-full w-full items-center justify-center rounded-xl text-xs font-black uppercase",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {type.slice(0, 2)}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {type}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {typeDescriptions[type]}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700"
                      >
                        {type === "Sensor"
                          ? "Đo lường"
                          : type === "Actuator"
                            ? "Điều khiển"
                            : type === "Gateway"
                              ? "Kết nối"
                              : "Điều phối"}
                      </Badge>
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredTypes.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <X className="mb-2 h-5 w-5 text-slate-400" />
                Không tìm thấy loại thiết bị phù hợp
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 border-t bg-white px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              onSelect(tempSelectedTypes);
              onOpenChange(false);
            }}
            disabled={tempSelectedTypes.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
