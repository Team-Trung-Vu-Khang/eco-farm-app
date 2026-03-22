import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, FileSignature, ShoppingCart } from "lucide-react";
import { CommodityDialog } from "../CommodityDialog";
import { CommoditySpecForm } from "../CommoditySpecForm";
import { CommoditySummaryList } from "../CommoditySummaryList";
import { PendingCommodityList } from "../PendingCommodityList";
import type { ContractFormData } from "../../types";

interface CommodityStepProps {
  formData: ContractFormData;
  updateField: (field: keyof ContractFormData, value: any) => void;
  pendingCommodityIds: string[];
  setPendingCommodityIds: (v: string[] | ((prev: string[]) => string[])) => void;
  isCommodityDialogOpen: boolean;
  setIsCommodityDialogOpen: (v: boolean) => void;
  tempSelectedCommodities: any[];
  popupSearch: string;
  setPopupSearch: (v: string) => void;
  popupType: string;
  setPopupType: (v: string) => void;
  currentCommodity: any;
  setCurrentCommodity: (v: any) => void;
  onToggleCommoditySelection: (item: any) => void;
  onConfirmPopupSelection: () => void;
  onRemoveCommodity: (id: string) => void;
  onAddCommoditySpec: () => void;
  onCancelSpec: () => void;
}

export const CommodityStep = ({
  formData,
  pendingCommodityIds,
  setPendingCommodityIds,
  isCommodityDialogOpen,
  setIsCommodityDialogOpen,
  tempSelectedCommodities,
  popupSearch,
  setPopupSearch,
  popupType,
  setPopupType,
  currentCommodity,
  setCurrentCommodity,
  onToggleCommoditySelection,
  onConfirmPopupSelection,
  onRemoveCommodity,
  onAddCommoditySpec,
  onCancelSpec,
}: CommodityStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Thông tin hàng hóa</h3>
            <p className="text-sm text-muted-foreground">
              Thêm các hàng hóa vào hợp đồng
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            setIsCommodityDialogOpen(true);
            setPopupSearch("");
            setPopupType("all");
          }}
          className="h-10 px-4 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Chọn hàng hoá
        </Button>

        <CommodityDialog
          isOpen={isCommodityDialogOpen}
          setIsOpen={setIsCommodityDialogOpen}
          popupSearch={popupSearch}
          setPopupSearch={setPopupSearch}
          popupType={popupType}
          setPopupType={setPopupType}
          tempSelectedCommodities={tempSelectedCommodities}
          onToggleSelection={onToggleCommoditySelection}
          onConfirm={onConfirmPopupSelection}
          pendingCommodityIds={pendingCommodityIds}
          formData={formData}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending List */}
        <PendingCommodityList
          pendingCommodityIds={pendingCommodityIds}
          currentCommodityId={currentCommodity.commodityId}
          onSelect={(item) =>
            setCurrentCommodity({
              ...currentCommodity,
              commodityId: item.id.toString(),
              commodityType: item.type,
            })
          }
          onRemove={(id) =>
            setPendingCommodityIds((prev) => prev.filter((p) => p !== id))
          }
        />

        {/* Right: Spec Form & Table */}
        <div className="lg:col-span-8 space-y-8">
          <div className="min-h-[300px]">
            {currentCommodity.commodityId ? (
              <CommoditySpecForm
                currentCommodity={currentCommodity}
                setCurrentCommodity={setCurrentCommodity}
                onCancel={onCancelSpec}
                onSubmit={onAddCommoditySpec}
              />
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-3xl bg-slate-50/50 opacity-60 px-8 text-center border-slate-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                  <FileSignature className="w-10 h-10 text-slate-300" />
                </div>
                <h5 className="font-bold text-slate-600 text-lg mb-2">
                  Chưa chọn hàng hoá để định nghĩa
                </h5>
                <p className="text-sm text-slate-400 max-w-[320px] leading-relaxed">
                  Chọn một hàng hoá từ danh sách bên trái để thiết lập quy cách đóng gói hoặc số lượng cụ thể cho hợp đồng.
                </p>
              </div>
            )}
          </div>

          <CommoditySummaryList
            commodities={formData.commodities}
            onRemove={onRemoveCommodity}
          />
        </div>
      </div>
    </div>
  );
};
