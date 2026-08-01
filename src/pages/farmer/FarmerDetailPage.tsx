import PageWrapper from "@/components/PageWrapper";
import type { OrganizationRecord } from "@/features/organization";
import { useOrganizationById } from "@/features/organization";
import { useSelectedWorkspaceId } from "@/features/workspace";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import type { Enterprise } from "../enterprise/data/constants";
import { FarmerOverviewCard } from "./components/FarmerOverviewCard";
import { FarmerBankTab } from "./components/tabs/FarmerBankTab";
import { FarmerContactTab } from "./components/tabs/FarmerContactTab";
import { FarmerDocumentTab } from "./components/tabs/FarmerDocumentTab";
import { FarmerInfoTab } from "./components/tabs/FarmerInfoTab";

const mapOrganizationToFarmer = (
  organization: OrganizationRecord,
): Enterprise => {
  const primaryContact =
    organization.contacts?.find((contact) => contact.isPrimary) ??
    organization.contacts?.[0] ??
    null;

  return {
    id: Number(organization.id),
    code: organization.code || "",
    name: organization.name || "",
    image: organization.imageUrl || "",
    type:
      organization.type === "enterprise" ||
      organization.type === "cooperative" ||
      organization.type === "farm"
        ? organization.type
        : "farm",
    classification:
      organization.businessLines
        ?.map((line) => line.code || line.name)
        .filter((item): item is string => Boolean(item)) ?? [],
    taxCode: organization.taxCode || "",
    address: organization.address || "",
    phone: primaryContact?.phone || "",
    email: primaryContact?.email || "",
    status: organization.status === "inactive" ? "inactive" : "active",
    createdAt: organization.createdAt || "",
    brandName: organization.brandName || "",
    representative: organization.representative || "",
    foundedDate: organization.foundedDate || "",
    website: organization.website || "",
    province: organization.province || "",
    district: organization.district || "",
    ward: organization.ward || "",
    latitude: organization.latitude,
    longitude: organization.longitude,
    taxAddress: organization.taxAddress || "",
    taxAuthority: organization.taxAuthority || "",
    issueDate: organization.issueDate || "",
    description: organization.description || "",
    contacts:
      organization.contacts?.map((contact) => ({
        name: contact.name || contact.fullName || "",
        phone: contact.phone || "",
        email: contact.email || "",
      })) ?? [],
    branches:
      organization.branches?.map((branch) => ({
        name: branch.name || "",
        taxCode: branch.taxCode || "",
        phone: branch.contacts?.[0]?.phone || "",
        taxAddress: branch.taxAddress || "",
        email: branch.contacts?.[0]?.email || "",
        address: branch.address || "",
        note: branch.metadataJson?.note ? String(branch.metadataJson.note) : "",
      })) ?? [],
    bankAccounts:
      organization.bankAccounts?.map((account) => ({
        bankName: account.bank?.shortName || "",
        accountHolder: account.accountHolder || "",
        accountNumber: account.accountNumber || "",
        branch: account.branch || "",
        note: account.note || "",
        bin: account.bank?.bin || "",
        logo: account.bank?.logoUrl || "",
      })) ?? [],
    documents:
      organization.documents?.map((doc) => ({
        name: doc.name || "",
        type: doc.mimeType || doc.documentType || "",
        size: doc.sizeBytes
          ? `${(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB`
          : "",
        url: doc.fileUrl || "",
        fileName: doc.fileName || "",
        fileUrl: doc.fileUrl || "",
        mimeType: doc.mimeType || "",
        sizeBytes: doc.sizeBytes,
        date: doc.createdAt || doc.updatedAt || "",
      })) ?? [],
  };
};

export default function FarmerDetailPage() {
  const [, params] = useRoute("/farmer/:id");
  const [, setLocation] = useLocation();
  const workspaceId = useSelectedWorkspaceId();
  const farmerId = params?.id ? Number(params.id) : null;
  const isValidId = farmerId !== null && Number.isFinite(farmerId);

  const organizationQuery = useOrganizationById(
    farmerId ?? "missing",
    workspaceId ?? "missing",
    {
      enabled: workspaceId !== null && isValidId,
    },
  );

  const data = useMemo(
    () =>
      organizationQuery.item
        ? mapOrganizationToFarmer(organizationQuery.item)
        : null,
    [organizationQuery.item],
  );

  if (organizationQuery.loading && !data) {
    return (
      <PageWrapper title="Chi tiết nông hộ" description="Đang tải thông tin...">
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
          <div className="text-muted-foreground">
            Đang tải thông tin nông hộ...
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (organizationQuery.error) {
    return (
      <PageWrapper title="Chi tiết nông hộ" description="Đang tải thông tin...">
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="text-destructive font-medium">
            Không thể tải thông tin nông hộ
          </div>
          <div className="text-sm text-muted-foreground">
            {organizationQuery.error}
          </div>
          <Button variant="outline" onClick={() => setLocation("/farmer")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </PageWrapper>
    );
  }

  if (!data) {
    return (
      <PageWrapper title="Chi tiết nông hộ" description="Đang tải thông tin...">
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="text-muted-foreground">Không tìm thấy nông hộ</div>
          <Button variant="outline" onClick={() => setLocation("/farmer")}>
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
      description={`Chi tiết thông tin nông hộ`}
      actions={
        <Button variant="outline" onClick={() => setLocation("/farmer")}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
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
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6 overflow-auto">
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
    </PageWrapper>
  );
}
