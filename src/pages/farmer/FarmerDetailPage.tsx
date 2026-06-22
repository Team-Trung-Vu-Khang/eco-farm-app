import {
  AdminLayout,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import useEnterpriseStore from "../../stores/useEnterpriseStore";
import { FarmerOverviewCard } from "./components/FarmerOverviewCard";
import { FarmerBankTab } from "./components/tabs/FarmerBankTab";
import { FarmerContactTab } from "./components/tabs/FarmerContactTab";
import { FarmerDocumentTab } from "./components/tabs/FarmerDocumentTab";
import { FarmerInfoTab } from "./components/tabs/FarmerInfoTab";

export default function FarmerDetailPage() {
  const [, params] = useRoute("/farmer/:id");
  const [, setLocation] = useLocation();

  const getEnterpriseById = useEnterpriseStore(
    (state) => state.getEnterpriseById,
  );
  const enterpriseId = params?.id ? parseInt(params.id) : 0;
  const data = getEnterpriseById(enterpriseId);

  if (!data) {
    return (
      <AdminLayout
        isRice
        title="Chi tiết nông hộ"
        description="Đang tải thông tin..."
      >
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="text-muted-foreground">Không tìm thấy nông hộ</div>
          <Button variant="outline" onClick={() => setLocation("/farmer")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isRice
      title={data.name}
      description={`Chi tiết thông tin nông hộ`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/farmer")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button onClick={() => setLocation(`/farmer/${data.id}/edit`)}>
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overview & Contact */}
        <div className="lg:col-span-1 space-y-6">
          <FarmerOverviewCard data={data} />
        </div>

        {/* Right Column: Details Tabs */}
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
              <TabsTrigger
                value="contacts"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3"
              >
                Người liên hệ ({data.contacts?.length || 0})
              </TabsTrigger>
            </TabsList>

            <div className="pt-6">
              <TabsContent value="info" className="m-0">
                <FarmerInfoTab data={data} />
              </TabsContent>

              <TabsContent value="bankAccounts" className="m-0">
                <FarmerBankTab bankAccounts={data.bankAccounts} />
              </TabsContent>

              <TabsContent value="documents" className="m-0">
                <FarmerDocumentTab documents={data.documents} />
              </TabsContent>

              <TabsContent value="contacts" className="m-0">
                <FarmerContactTab contacts={data.contacts} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}
