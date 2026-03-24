import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { PersonnelFormData, PersonnelStatus } from "../types";
import { AvatarCard } from "./AvatarCard";
import { BankInfoCard } from "./BankInfoCard";
import { ContactAddressCard } from "./ContactAddressCard";
import { JobPositionCard } from "./JobPositionCard";
import { PersonalInfoCard } from "./PersonalInfoCard";
import { StatusCard } from "./StatusCard";

interface PersonnelFormTabsProps {
  formData: PersonnelFormData;
  onChange: <K extends keyof PersonnelFormData>(
    field: K,
    value: PersonnelFormData[K],
  ) => void;
  showStatus?: boolean;
}

export function PersonnelFormTabs({
  formData,
  onChange,
  showStatus = false,
}: PersonnelFormTabsProps) {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="info">Thông tin chung</TabsTrigger>
        <TabsTrigger value="bank">Thông tin ngân hàng</TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <AvatarCard
              avatar={formData.avatar}
              onChange={(url) => onChange("avatar", url)}
            />
            {showStatus ? (
              <StatusCard
                status={formData.status}
                onChange={(value) => onChange("status", value as PersonnelStatus)}
              />
            ) : null}
          </div>

          <div className="md:col-span-2 space-y-6">
            <PersonalInfoCard formData={formData} onChange={onChange} />
            <ContactAddressCard formData={formData} onChange={onChange} />
            <JobPositionCard formData={formData} onChange={onChange} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="bank">
        <BankInfoCard formData={formData} onChange={onChange} />
      </TabsContent>
    </Tabs>
  );
}
