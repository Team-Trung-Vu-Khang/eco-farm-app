import {
  AdminLayout,
  Button,
  StepperForm,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { CommodityStep } from "./components/steps/CommodityStep";
import { ConfirmationStep } from "./components/steps/ConfirmationStep";
import { ContractContentStep } from "./components/steps/ContractContentStep";
import { PartiesStep } from "./components/steps/PartiesStep";
import { useContractForm } from "./hooks/useContractForm";

const ContractCreatePage = () => {
  const {
    formData,
    updateField,
    handleFileUpload,
    searchParentContract,
    setSearchParentContract,
    searchPartyA,
    setSearchPartyA,
    searchPartyB,
    setSearchPartyB,
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
    handleToggleCommoditySelection,
    handleConfirmPopupSelection,
    handleRemoveCommodity,
    addCommoditySpec,
    handleCancelSpec,
    setLocation,
  } = useContractForm();

  const steps = [
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Mã, tên, loại hợp đồng",
      content: <BasicInfoStep formData={formData} updateField={updateField} />,
    },
    {
      id: "content",
      title: "Loại và nội dung",
      description: "Hợp đồng mới/phụ lục",
      content: (
        <ContractContentStep
          formData={formData}
          updateField={updateField}
          searchParentContract={searchParentContract}
          setSearchParentContract={setSearchParentContract}
          handleFileUpload={handleFileUpload}
        />
      ),
    },
    {
      id: "commodity",
      title: "Hàng hóa",
      description: "Danh sách hàng hóa",
      content: (
        <CommodityStep
          formData={formData}
          updateField={updateField}
          pendingCommodityIds={pendingCommodityIds}
          setPendingCommodityIds={setPendingCommodityIds}
          isCommodityDialogOpen={isCommodityDialogOpen}
          setIsCommodityDialogOpen={setIsCommodityDialogOpen}
          tempSelectedCommodities={tempSelectedCommodities}
          popupSearch={popupSearch}
          setPopupSearch={setPopupSearch}
          popupType={popupType}
          setPopupType={setPopupType}
          currentCommodity={currentCommodity}
          setCurrentCommodity={setCurrentCommodity}
          onToggleCommoditySelection={handleToggleCommoditySelection}
          onConfirmPopupSelection={handleConfirmPopupSelection}
          onRemoveCommodity={handleRemoveCommodity}
          onAddCommoditySpec={addCommoditySpec}
          onCancelSpec={handleCancelSpec}
        />
      ),
    },
    {
      id: "parties",
      title: "Các bên",
      description: "Bên A và Bên B",
      content: (
        <PartiesStep
          formData={formData}
          updateField={updateField}
          searchPartyA={searchPartyA}
          setSearchPartyA={setSearchPartyA}
          searchPartyB={searchPartyB}
          setSearchPartyB={setSearchPartyB}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: <ConfirmationStep formData={formData} />,
    },
  ];

  const handleComplete = () => {
    console.log("Contract Data:", formData);
    setLocation("/contract");
  };

  return (
    <AdminLayout
      title="Tạo hợp đồng mới"
      description="Tạo hợp đồng mua bán, dịch vụ, thuê, hợp tác"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/contract")}
          className="h-10 px-4 hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="max-w-4xl mx-auto pb-12">
        <StepperForm
          steps={steps}
          onComplete={handleComplete}
          onCancel={() => setLocation("/contract")}
        />
      </div>
    </AdminLayout>
  );
};

export default ContractCreatePage;
