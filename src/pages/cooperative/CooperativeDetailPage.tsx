import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, Pencil } from "lucide-react";
import { useLocation } from "wouter";
import { CooperativeDetailSidebar } from "./components/CooperativeDetailSidebar";
import { BankAccountsTab } from "./components/tabs/BankAccountsTab";
import { BranchesTab } from "./components/tabs/BranchesTab";
import { DocumentsTab } from "./components/tabs/DocumentsTab";
import { GeneralInfoTab } from "./components/tabs/GeneralInfoTab";
import { useCooperativeDetail } from "./hooks/useCooperativeDetail";

export default function CooperativeDetailPage() {
  const [, setLocation] = useLocation();
  const {
    data,
    loading,
    error,
    bankSearchQuery,
    setBankSearchQuery,
    branchSearchQuery,
    setBranchSearchQuery,
  } = useCooperativeDetail();

  if (loading) {
    return (
      <PageWrapper title="Chi tiết đơn vị" description="Đang tải thông tin...">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper
        title="Chi tiết đơn vị"
        description="Không thể tải thông tin hợp tác xã"
        actions={
          <Button variant="outline" onClick={() => setLocation("/cooperative")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        }
      >
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          {error}
        </div>
      </PageWrapper>
    );
  }

  if (!data) {
    return (
      <PageWrapper
        title="Chi tiết đơn vị"
        description="Không tìm thấy hợp tác xã"
        actions={
          <Button variant="outline" onClick={() => setLocation("/cooperative")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        }
      >
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          Không tìm thấy hợp tác xã
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={data.name}
      description="Chi tiết thông tin hợp tác xã"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setLocation(`/cooperative/${data.id}/edit`)}>
            <Pencil className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button variant="outline" onClick={() => setLocation("/cooperative")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overview & Contact - Sticky */}
        <div className="lg:col-span-1">
          <CooperativeDetailSidebar data={data} />
        </div>

        {/* Right Column: Details Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="info" className="w-full">
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
              <TabsContent value="info" className="m-0">
                <GeneralInfoTab data={data} />
              </TabsContent>

              <TabsContent value="branches" className="m-0">
                <BranchesTab
                  branches={data.branches || []}
                  searchQuery={branchSearchQuery}
                  setSearchQuery={setBranchSearchQuery}
                />
              </TabsContent>

              <TabsContent value="bankAccounts" className="m-0">
                <BankAccountsTab
                  bankAccounts={data.bankAccounts || []}
                  searchQuery={bankSearchQuery}
                  setSearchQuery={setBankSearchQuery}
                />
              </TabsContent>

              <TabsContent value="documents" className="m-0">
                <DocumentsTab documents={data.documents || []} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </PageWrapper>
  );
}
