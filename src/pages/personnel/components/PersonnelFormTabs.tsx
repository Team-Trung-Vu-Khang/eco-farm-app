import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AvatarCard } from "./AvatarCard";
import { BankInfoCard } from "./BankInfoCard";
import { ContactAddressCard } from "./ContactAddressCard";
import { JobPositionCard } from "./JobPositionCard";
import { PersonalInfoCard } from "./PersonalInfoCard";
import { StatusCard } from "./StatusCard";

interface PersonnelFormTabsProps {
  showStatus?: boolean;
}

export function PersonnelFormTabs({
  showStatus = false,
}: PersonnelFormTabsProps) {
  const [tab, setTab] = useState("info");
  const { trigger } = useFormContext();

  const handleTabChange = async (value: string) => {
    if (tab === "info" && value !== "info") {
      const isValid = await trigger([
        "fullName",
        "phone",
        "email",
        "province",
        "ward",
        "address",
        "personalTaxCode",
        "taxAddress",
        "departmentType",
        "department",
        "positionType",
        "position",
        "team",
        "status",
      ]);
      if (isValid) setTab(value);
    } else if (tab === "bank" && value !== "bank") {
      const isValid = await trigger([
        "bankName",
        "accountNumber",
        "accountHolder",
        "bankBranch",
      ]);
      if (isValid) setTab(value);
    } else {
      setTab(value);
    }
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="info">Thông tin chung</TabsTrigger>
        <TabsTrigger value="bank">Thông tin ngân hàng</TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <AvatarCard />
            {showStatus ? <StatusCard /> : null}
          </div>

          <div className="md:col-span-2 space-y-6">
            <PersonalInfoCard />
            <ContactAddressCard />
            <JobPositionCard />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="bank">
        <BankInfoCard />
      </TabsContent>
    </Tabs>
  );
}
