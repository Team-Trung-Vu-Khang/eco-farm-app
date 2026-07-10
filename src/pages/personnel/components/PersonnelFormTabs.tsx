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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <div className="md:col-span-1 space-y-6">
        <AvatarCard />
        {showStatus ? <StatusCard /> : null}
      </div>

      <div className="md:col-span-2 space-y-6">
        <PersonalInfoCard />
        <ContactAddressCard />
        <JobPositionCard />
        <BankInfoCard />
      </div>
    </div>
  );
}
