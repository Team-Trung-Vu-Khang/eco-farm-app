import { BankInfoStep } from "@/pages/cooperative/components/steps/BankInfoStep";
import type { BankAccount } from "../../types";

type BankInputMethod = "manual" | "excel" | "qr-image" | "qr-scan";

interface FarmerBankStepProps {
  bankAccounts: BankAccount[];
  newBankAccount: BankAccount;
  setNewBankAccount: (acc: BankAccount) => void;
  bankInputMethod: string;
  setBankInputMethod: (val: BankInputMethod) => void;
  hasCamera: boolean;
  bankSearchQuery: string;
  setBankSearchQuery: (val: string) => void;
  isDragging: Record<string, boolean>;
  handleDrag: (id: string, e: React.DragEvent) => void;
  processExcelFile: (file: File) => void;
  processQRImage: (file: File) => void;
  handleLiveScan: (result: Array<{ rawValue: string }> | null) => void;
  addBankAccount: () => void;
  removeBankAccount: (index: number) => void;
}

export const FarmerBankStep = ({
  bankAccounts,
  newBankAccount,
  setNewBankAccount,
  bankInputMethod,
  setBankInputMethod,
  hasCamera,
  bankSearchQuery,
  setBankSearchQuery,
  isDragging,
  handleDrag,
  processExcelFile,
  processQRImage,
  handleLiveScan,
  addBankAccount,
  removeBankAccount,
}: FarmerBankStepProps) => {
  return (
    <BankInfoStep
      bankAccounts={bankAccounts}
      newBankAccount={newBankAccount}
      setNewBankAccount={setNewBankAccount}
      bankInputMethod={bankInputMethod as BankInputMethod}
      setBankInputMethod={setBankInputMethod}
      hasCamera={hasCamera}
      bankSearchQuery={bankSearchQuery}
      setBankSearchQuery={setBankSearchQuery}
      isDragging={isDragging}
      handleDrag={handleDrag}
      handleExcelUpload={(e) => {
        const file = e.target.files?.[0];
        if (file) processExcelFile(file);
      }}
      handleExcelDrop={(e) => {
        handleDrag("excel", e);
        const file = e.dataTransfer.files?.[0];
        if (file) processExcelFile(file);
      }}
      handleQRImageUpload={(e) => {
        const file = e.target.files?.[0];
        if (file) processQRImage(file);
      }}
      handleQRImageDrop={(e) => {
        handleDrag("qr-image", e);
        const file = e.dataTransfer.files?.[0];
        if (file) processQRImage(file);
      }}
      handleLiveScan={handleLiveScan}
      addBankAccount={addBankAccount}
      removeBankAccount={removeBankAccount}
    />
  );
};
