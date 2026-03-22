import { ChevronLeft } from "lucide-react";
import {
  AdminLayout,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEnterpriseDetail } from "./hooks/useEnterpriseDetail";
import { EnterpriseOverviewCard } from "./components/EnterpriseOverviewCard";
import { EnterpriseInfoTab } from "./components/tabs/EnterpriseInfoTab";
import { EnterpriseBranchesTab } from "./components/tabs/EnterpriseBranchesTab";
import { EnterpriseBankAccountsTab } from "./components/tabs/EnterpriseBankAccountsTab";
import { EnterpriseDocumentsTab } from "./components/tabs/EnterpriseDocumentsTab";

export default function EnterpriseDetailPage() {
  const {
    data,
    setLocation,
    bankSearchQuery,
    setBankSearchQuery,
    branchSearchQuery,
    setBranchSearchQuery,
  } = useEnterpriseDetail();

  if (!data) {
    return (
      <AdminLayout title="Chi tiết đơn vị" description="Đang tải thông tin...">
        <div className="flex flex-col items-center justify-center p-12 gap-4">
          <div className="text-muted-foreground">
            Không tìm thấy thông tin doanh nghiệp
          </div>
          <Button variant="outline" onClick={() => setLocation("/enterprise")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={data.name}
      description={`Chi tiết thông tin ${
        data.type === "enterprise"
          ? "doanh nghiệp"
          : data.type === "cooperative"
            ? "hợp tác xã"
            : "nông hộ"
      }`}
      actions={
        <Button variant="outline" onClick={() => setLocation("/enterprise")}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <EnterpriseOverviewCard data={data} setLocation={setLocation} />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
              <TabsTrigger
                value="info"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Thông tin chung
              </TabsTrigger>
              <TabsTrigger
                value="branches"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Chi nhánh ({data.branches?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="bankAccounts"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Ngân hàng ({data.bankAccounts?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Tài liệu ({data.documents?.length || 0})
              </TabsTrigger>
            </TabsList>

            <div className="pt-6">
              <TabsContent value="info" className="m-0 space-y-6">
                <EnterpriseInfoTab data={data} />
              </TabsContent>

              <TabsContent value="branches" className="m-0 space-y-6">
                <EnterpriseBranchesTab
                  data={data}
                  branchSearchQuery={branchSearchQuery}
                  setBranchSearchQuery={setBranchSearchQuery}
                  setLocation={setLocation}
                />
              </TabsContent>

              <TabsContent value="bankAccounts" className="m-0 space-y-6">
                <EnterpriseBankAccountsTab
                  data={data}
                  bankSearchQuery={bankSearchQuery}
                  setBankSearchQuery={setBankSearchQuery}
                />
              </TabsContent>

              <TabsContent value="documents" className="m-0">
                <EnterpriseDocumentsTab data={data} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}
