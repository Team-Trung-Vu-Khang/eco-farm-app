import {
  AdminLayout,
  Button,
  StepperForm,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { CommodityStep } from "./components/steps/CommodityStep";
import { ConfirmationStep } from "./components/steps/ConfirmationStep";
import { ContractContentStep } from "./components/steps/ContractContentStep";
import { PartiesStep } from "./components/steps/PartiesStep";
import { useContractForm } from "./hooks/useContractForm";

const ContractEditPage = () => {
  const [, params] = useRoute("/contract/:id/edit");
  const [, setLocation] = useLocation();

  const {
    formData,
    setFormData,
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
  } = useContractForm();

  // Load existing contract data
  useEffect(() => {
    if (params?.id) {
      // Mock data - in real app, fetch from API
      setFormData({
        code: "HD001",
        name: "Hợp đồng mua bán phân bón NPK",
        nature: "purchase",
        value: "150000000",
        currency: "VND",
        signDate: "2024-01-10",
        isAppendix: false,
        parentContractId: "",
        contentType: "file",
        contentFile: null,
        contentText: "",
        commodities: [
          {
            id: "1",
            commodityType: "fertilizer",
            commodityId: "7", // PB001
            commodityName: "Phân NPK 16-16-8",
            commodityCode: "PB001",
            specType: "detailed",
            packagingSpec: "",
            quantity: "100",
            unit: "bag",
          },
        ],
        partyAId: "1",
        partyBId: "2",
      });
    }
  }, [params?.id, setFormData]);

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
    console.log("Updated Contract Data:", formData);
    setLocation(`/contract/${params?.id}`);
  };

  return (
    <AdminLayout
      title="Chỉnh sửa hợp đồng"
      description="Cập nhật thông tin hợp đồng"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setLocation(`/contract/${params?.id}`)}
          className="h-10 px-4 hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại chi tiết
        </Button>
      </div>

      <div className="max-w-4xl mx-auto pb-12">
        <StepperForm
          steps={steps}
          onComplete={handleComplete}
          onCancel={() => setLocation(`/contract/${params?.id}`)}
        />
      </div>
    </AdminLayout>
  );
};

export default ContractEditPage;
