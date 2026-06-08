import { BankInfoStep } from "@/pages/cooperative/components/steps/BankInfoStep";
import { useEnterpriseFormContext } from "../../context/EnterpriseFormContext";

type BankInputMethod = "manual" | "excel" | "qr-image" | "qr-scan";

export function EnterpriseBankAccountsStep() {
  const {
    bankInputMethod,
    setBankInputMethod,
    hasCamera,
    newBankAccount,
    setNewBankAccount,
    addBankAccount,
    removeBankAccount,
    isDragging,
    handleDrag,
    handleExcelDrop,
    handleExcelUpload,
    handleQRImageDrop,
    handleQRImageUpload,
    handleLiveScan,
    bankSearchQuery,
    setBankSearchQuery,
    formData,
  } = useEnterpriseFormContext();

  return (
    <BankInfoStep
      bankAccounts={formData.bankAccounts}
      newBankAccount={newBankAccount}
      setNewBankAccount={setNewBankAccount}
      bankInputMethod={bankInputMethod as BankInputMethod}
      setBankInputMethod={(method) => setBankInputMethod(method)}
      hasCamera={hasCamera}
      bankSearchQuery={bankSearchQuery}
      setBankSearchQuery={setBankSearchQuery}
      isDragging={isDragging}
      handleDrag={handleDrag}
      handleExcelUpload={handleExcelUpload}
      handleExcelDrop={handleExcelDrop}
      handleQRImageUpload={handleQRImageUpload}
      handleQRImageDrop={handleQRImageDrop}
      handleLiveScan={handleLiveScan}
      addBankAccount={addBankAccount}
      removeBankAccount={removeBankAccount}
    />
  );
}
