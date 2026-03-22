import {
  Card,
  CardContent,
  Button,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileSignature, X, CheckCircle2 } from "lucide-react";
import { packagingSpecs, units } from "../data/constants";
import { allCommodities } from "../hooks/useContractForm";

interface CommoditySpecFormProps {
  currentCommodity: any;
  setCurrentCommodity: (v: any) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export const CommoditySpecForm = ({
  currentCommodity,
  setCurrentCommodity,
  onCancel,
  onSubmit,
}: CommoditySpecFormProps) => {
  const baseItem = allCommodities.find(
    (c) => c.id.toString() === currentCommodity.commodityId,
  );

  return (
    <Card className="border-primary/30 shadow-md">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <FileSignature className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold">Định nghĩa quy cách</h4>
              <p className="text-xs text-muted-foreground">{baseItem?.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <Label className="block text-sm font-semibold">
            Hình thức định nghĩa <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            className="grid grid-cols-2 gap-4"
            value={currentCommodity.specType}
            onValueChange={(v: "general" | "detailed") =>
              setCurrentCommodity({ ...currentCommodity, specType: v })
            }
          >
            <div className="flex items-center space-x-2 p-4 border rounded-xl hover:border-primary/50 transition-all cursor-pointer bg-white relative">
              <RadioGroupItem
                value="general"
                id="general"
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  currentCommodity.specType === "general"
                    ? "border-primary"
                    : "border-gray-300"
                }`}
              >
                {currentCommodity.specType === "general" && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <Label htmlFor="general" className="flex-1 cursor-pointer">
                <div className="font-bold text-sm">Tổng quát</div>
                <div className="text-[11px] text-muted-foreground">
                  Chỉ chọn theo quy cách đóng gói mẫu
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-xl hover:border-primary/50 transition-all cursor-pointer bg-white relative">
              <RadioGroupItem
                value="detailed"
                id="detailed"
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  currentCommodity.specType === "detailed"
                    ? "border-primary"
                    : "border-gray-300"
                }`}
              >
                {currentCommodity.specType === "detailed" && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <Label htmlFor="detailed" className="flex-1 cursor-pointer">
                <div className="font-bold text-sm">Chi tiết</div>
                <div className="text-[11px] text-muted-foreground">
                  Nhập số lượng và đơn vị đo lường cụ thể
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          {currentCommodity.specType === "general" ? (
            <div className="space-y-2">
              <Label htmlFor="packagingSpecSelect">
                Chọn quy cách đóng gói <span className="text-red-500">*</span>
              </Label>
              <Select
                value={currentCommodity.packagingSpec}
                onValueChange={(v) =>
                  setCurrentCommodity({ ...currentCommodity, packagingSpec: v })
                }
              >
                <SelectTrigger
                  id="packagingSpecSelect"
                  className="bg-white h-10 border-slate-200"
                >
                  <SelectValue placeholder="Chọn quy cách..." />
                </SelectTrigger>
                <SelectContent>
                  {packagingSpecs.map((spec) => (
                    <SelectItem key={spec.id} value={spec.id}>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemQuantity">
                  Số lượng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="itemQuantity"
                  type="number"
                  placeholder="Nhập số lượng..."
                  className="bg-white h-10 border-slate-200"
                  value={currentCommodity.quantity}
                  onChange={(e) =>
                    setCurrentCommodity({
                      ...currentCommodity,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemUnit">
                  Đơn vị <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={currentCommodity.unit}
                  onValueChange={(v) =>
                    setCurrentCommodity({ ...currentCommodity, unit: v })
                  }
                >
                  <SelectTrigger
                    id="itemUnit"
                    className="bg-white h-10 border-slate-200"
                  >
                    <SelectValue placeholder="Chọn đơn vị..." />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="ghost" onClick={onCancel} className="h-9 px-4">
            Bỏ qua
          </Button>
          <Button
            className="h-9 px-8 shadow-sm flex items-center gap-2"
            disabled={
              currentCommodity.specType === "general"
                ? !currentCommodity.packagingSpec
                : !currentCommodity.quantity || !currentCommodity.unit
            }
            onClick={onSubmit}
          >
            <CheckCircle2 className="w-4 h-4" />
            Xác nhận định nghĩa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
