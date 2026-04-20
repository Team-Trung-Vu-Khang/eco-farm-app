import React from "react";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, X } from "lucide-react";
import { EnterpriseOverviewCard } from "../../components/EnterpriseOverviewCard";
import { EnterpriseInfoTab } from "../../components/tabs/EnterpriseInfoTab";
import { EnterpriseBranchesTab } from "../../components/tabs/EnterpriseBranchesTab";
import { EnterpriseBankAccountsTab } from "../../components/tabs/EnterpriseBankAccountsTab";
import { EnterpriseDocumentsTab } from "../../components/tabs/EnterpriseDocumentsTab";

const Separator = ({ className }: { className?: string }) => (
  <div
    className={
      className
        ? `h-px w-full bg-slate-200 ${className}`
        : "h-px w-full bg-slate-200"
    }
  />
);

interface EnterpriseDetailPanelProps {
  enterprise: any;
  onClose: () => void;
  setLocation: (url: string) => void;
  branchSearchQuery: string;
  setBranchSearchQuery: (q: string) => void;
  bankSearchQuery: string;
  setBankSearchQuery: (q: string) => void;
}

export const EnterpriseDetailPanel: React.FC<EnterpriseDetailPanelProps> = ({
  enterprise,
  onClose,
  setLocation,
  branchSearchQuery,
  setBranchSearchQuery,
  bankSearchQuery,
  setBankSearchQuery,
}) => {
  return (
    <div className="w-[450px] border-l bg-white flex flex-col shadow-2xl relative z-30 animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10 gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Building2 size={18} className="text-primary" />
          <h3 className="font-bold text-slate-800 truncate text-sm uppercase tracking-wider">
            Hồ sơ đơn vị
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[10px] font-bold uppercase tracking-wider rounded-md border-primary/20 text-primary hover:bg-primary/5"
            onClick={() =>
              window.open(`/enterprise/${enterprise.id}`, "_blank")
            }
          >
            Hồ sơ đầy đủ
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-slate-100 h-8 w-8 transition-all"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto split-scrollbar p-4 space-y-6">
        <EnterpriseOverviewCard data={enterprise} setLocation={setLocation} />

        <Separator className="bg-slate-100" />

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent flex-row overflow-x-auto no-scrollbar">
            {["info", "branches", "bankAccounts", "documents"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                {tab === "info"
                  ? "Thông tin"
                  : tab === "branches"
                    ? `Chi nhánh (${enterprise.branches?.length || 0})`
                    : tab === "bankAccounts"
                      ? `Ngân hàng (${enterprise.bankAccounts?.length || 0})`
                      : `Tài liệu (${enterprise.documents?.length || 0})`}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="pt-6">
            <TabsContent value="info" className="m-0 space-y-6 outline-none">
              <EnterpriseInfoTab data={enterprise} />
            </TabsContent>
            <TabsContent
              value="branches"
              className="m-0 space-y-6 outline-none"
            >
              <EnterpriseBranchesTab
                data={enterprise}
                branchSearchQuery={branchSearchQuery}
                setBranchSearchQuery={setBranchSearchQuery}
                setLocation={setLocation}
              />
            </TabsContent>
            <TabsContent
              value="bankAccounts"
              className="m-0 space-y-6 outline-none"
            >
              <EnterpriseBankAccountsTab
                data={enterprise}
                bankSearchQuery={bankSearchQuery}
                setBankSearchQuery={setBankSearchQuery}
              />
            </TabsContent>
            <TabsContent value="documents" className="m-0 outline-none">
              <EnterpriseDocumentsTab data={enterprise} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
