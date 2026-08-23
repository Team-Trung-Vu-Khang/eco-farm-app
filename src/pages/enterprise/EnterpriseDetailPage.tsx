import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, Pencil } from "lucide-react";
import { EnterpriseOverviewCard } from "./components/EnterpriseOverviewCard";
import { EnterpriseBankAccountsTab } from "./components/tabs/EnterpriseBankAccountsTab";
import { EnterpriseBranchesTab } from "./components/tabs/EnterpriseBranchesTab";
import { EnterpriseContactsTab } from "./components/tabs/EnterpriseContactsTab";
import { EnterpriseDocumentsTab } from "./components/tabs/EnterpriseDocumentsTab";
import { EnterpriseInfoTab } from "./components/tabs/EnterpriseInfoTab";
import { useEnterpriseDetail } from "./hooks/useEnterpriseDetail";

export default function EnterpriseDetailPage() {
  const {
    data,
    loading,
    error,
    setLocation,
    bankSearchQuery,
    setBankSearchQuery,
    branchSearchQuery,
    setBranchSearchQuery,
  } = useEnterpriseDetail();

  if (loading && !data) {
    return (
      <PageWrapper title="Chi tiết đơn vị" description="Đang tải thông tin...">
        <div className="flex flex-col items-center justify-center gap-4 p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
          <div className="text-muted-foreground">
            Đang tải thông tin doanh nghiệp...
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Chi tiết đơn vị" description="Đang tải thông tin...">
        <div className="flex flex-col items-center justify-center gap-4 p-12">
          <div className="font-medium text-destructive">
            Không thể tải thông tin doanh nghiệp
          </div>
          <div className="text-sm text-muted-foreground">{error}</div>
          <Button variant="outline" onClick={() => setLocation("/enterprise")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
      </PageWrapper>
    );
  }

  if (!data) {
    return (
      <PageWrapper title="Chi tiết đơn vị" description="Đang tải thông tin...">
        <div className="flex flex-col items-center justify-center gap-4 p-12">
          <div className="text-muted-foreground">
            Không tìm thấy thông tin doanh nghiệp
          </div>
          <Button variant="outline" onClick={() => setLocation("/enterprise")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={data.name}
      description={`Chi tiết thông tin ${
        data.type === "enterprise"
          ? "doanh nghiệp"
          : data.type === "cooperative"
            ? "hợp tác xã"
            : "nông hộ"
      }`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setLocation(`/enterprise/${data.id}/edit`)}>
            <Pencil className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button variant="outline" onClick={() => setLocation("/enterprise")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <EnterpriseOverviewCard data={data} setLocation={setLocation} />
        </div>

        <div className="lg:col-span-2 w-full overflow-auto">
          <Tabs defaultValue="info" className="w-full overflow-auto">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6 overflow-auto">
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
                value="contacts"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Liên hệ ({data.contacts?.length || 0})
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

              <TabsContent value="contacts" className="m-0 space-y-6">
                <EnterpriseContactsTab data={data} />
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
    </PageWrapper>
  );
}
