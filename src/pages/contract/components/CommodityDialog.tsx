import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Card,
  CardContent,
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search, Package, CheckCircle2 } from "lucide-react";
import { commodityTypes } from "../data/constants";
import { allCommodities } from "../hooks/useContractForm";
import type { ContractFormData } from "../types";

interface CommodityDialogProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  popupSearch: string;
  setPopupSearch: (v: string) => void;
  popupType: string;
  setPopupType: (v: string) => void;
  tempSelectedCommodities: any[];
  onToggleSelection: (item: any) => void;
  onConfirm: () => void;
  pendingCommodityIds: string[];
  formData: ContractFormData;
}

export const CommodityDialog = ({
  isOpen,
  setIsOpen,
  popupSearch,
  setPopupSearch,
  popupType,
  setPopupType,
  tempSelectedCommodities,
  onToggleSelection,
  onConfirm,
  pendingCommodityIds,
  formData,
}: CommodityDialogProps) => {
  const getCommodityListBySearch = (type: string, search: string) => {
    const list =
      type === "all"
        ? allCommodities
        : allCommodities.filter((c) => c.type === type);
    return list.filter(
      (item) =>
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase()),
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Chọn hàng hóa từ danh mục</DialogTitle>
        </DialogHeader>

        <div className="p-4 border-b bg-slate-50 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã hoặc tên hàng hoá..."
              className="pl-10 h-10"
              value={popupSearch}
              onChange={(e) => setPopupSearch(e.target.value)}
            />
          </div>
          <Select value={popupType} onValueChange={setPopupType}>
            <SelectTrigger className="w-[200px] h-10">
              <SelectValue placeholder="Tất cả loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              {commodityTypes.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 content-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {getCommodityListBySearch(popupType, popupSearch).map((item) => {
              const isSelectedInTemp = tempSelectedCommodities.some(
                (c) => c.id === item.id,
              );
              const isAlreadyAdded =
                pendingCommodityIds.includes(item.id.toString()) ||
                formData.commodities.some(
                  (c) => c.commodityId === item.id.toString(),
                );

              return (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all border-2 relative select-none ${
                    isAlreadyAdded
                      ? "opacity-50 cursor-not-allowed bg-slate-50 border-transparent shadow-none"
                      : isSelectedInTemp
                        ? "border-primary bg-primary/5 shadow-sm scale-[0.98]"
                        : "hover:border-primary/50 border-gray-100 shadow-sm"
                  }`}
                  onClick={() => !isAlreadyAdded && onToggleSelection(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelectedInTemp
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <h5 className="font-bold text-sm truncate mb-1">
                          {item.name}
                        </h5>
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded uppercase font-bold text-slate-600">
                            {item.code}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[9px] px-1 h-4"
                          >
                            {
                              commodityTypes.find((t) => t.id === item.type)
                                ?.name
                            }
                          </Badge>
                        </div>
                        <div className="text-[10px] text-muted-foreground space-y-0.5">
                          {"category" in item && <div>• {item.category}</div>}
                          {"group" in item && <div>• {item.group}</div>}
                          {"brand" in item && <div>• {item.brand}</div>}
                        </div>
                      </div>
                    </div>
                    {isSelectedInTemp && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    {isAlreadyAdded && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-[9px] h-4">
                          Đã chọn
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <DialogFooter className="p-4 border-t bg-slate-50">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm font-medium">
              {tempSelectedCommodities.length > 0 && (
                <span className="text-primary">
                  Đã chọn {tempSelectedCommodities.length} hàng hoá
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="h-9">
                  Huỷ
                </Button>
              </DialogClose>
              <Button
                onClick={onConfirm}
                disabled={tempSelectedCommodities.length === 0}
                className="h-9 px-6"
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
