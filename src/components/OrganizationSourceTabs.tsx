import { useState, type ReactNode } from "react";
import { useSystemOrganizations } from "@/features/organization";
import { getDefaultOrganizationImage } from "@/pages/enterprise/data/default-organization-images";
import {
  DataTable,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Database, UserRound } from "lucide-react";

interface OrganizationSourceTabsProps {
  type: "enterprise" | "farm" | "cooperative";
  personal: ReactNode;
  personalColumns: Column<any>[];
  searchPlaceholder: string;
  onTabChange?: (tab: "personal" | "system") => void;
}

export function OrganizationSourceTabs({
  type,
  personal,
  personalColumns,
  searchPlaceholder,
  onTabChange,
}: OrganizationSourceTabsProps) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const query = useSystemOrganizations({
    type,
    keyword: search.trim() || undefined,
    page: Math.max(currentIndex - 1, 0),
    size: pageSize,
  });

  const systemRows = query.items.map((organization) => {
    const contacts = organization.contacts ?? [];
    const primaryContact = contacts.find((item) => item.isPrimary) ?? contacts[0];
    return {
      ...organization,
      code: organization.code || `#${organization.id}`,
      image:
        organization.imageUrl ||
        getDefaultOrganizationImage(
          type === "enterprise"
            ? "enterprise"
            : type === "cooperative"
              ? "cooperative"
              : "farm",
        ),
      classification: organization.businessLines?.map((line) => line.code || line.name) ?? [],
      businessLineText: organization.businessLines?.map((line) => line.name).filter(Boolean).join(", ") || "-",
      primaryPhone: primaryContact?.phone || "-",
      primaryEmail: primaryContact?.email || "-",
      phone: primaryContact?.phone || "",
      email: primaryContact?.email || "",
      contacts,
    };
  });

  return (
    <Tabs
      defaultValue="personal"
      onValueChange={(value) => onTabChange?.(value as "personal" | "system")}
      className="space-y-4"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personal" className="gap-2">
          <UserRound className="h-4 w-4" /> Danh bạ cá nhân
        </TabsTrigger>
        <TabsTrigger value="system" className="gap-2">
          <Database className="h-4 w-4" /> Danh bạ hệ thống
        </TabsTrigger>
      </TabsList>
      <TabsContent value="personal">{personal}</TabsContent>
      <TabsContent value="system">
        <DataTable
          columns={personalColumns}
          data={systemRows}
          searchable
          searchPlaceholder={searchPlaceholder}
          loading={query.loading}
          currentIndex={currentIndex}
          pageSize={pageSize}
          totalPages={query.response?.totalPages}
          totalElements={query.response?.totalElements}
          onSearch={(value) => {
            setSearch(value);
            setCurrentIndex(1);
          }}
          onIndexChange={setCurrentIndex}
          onPageSize={(value) => {
            setPageSize(value);
            setCurrentIndex(1);
          }}
          selectable={false}
        />
      </TabsContent>
    </Tabs>
  );
}
