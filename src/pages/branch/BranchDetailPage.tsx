import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft } from "lucide-react";
import { useBranchDetail } from "./hooks/useBranchDetail";
import { BranchDetailHeader } from "./components/BranchDetailHeader";
import { BasicInfoCard } from "./components/BasicInfoCard";
import { LocationMapCard } from "./components/LocationMapCard";
import { PersonnelCard } from "./components/PersonnelCard";
import { SidebarContactCard } from "./components/SidebarContactCard";
import { BankAccountCard } from "./components/BankAccountCard";
import { DeleteBranchDialog } from "./components/DeleteBranchDialog";

/**
 * Branch detail page component.
 * Displays comprehensive information about a specific branch.
 */
export default function BranchDetailPage() {
  const {
    branch,
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete,
    handleBack,
    handleEdit,
  } = useBranchDetail();

  // Show not found state if branch doesn't exist
  if (!branch) {
    return (
      <AdminLayout isRice>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-4">
            Không tìm thấy thông tin chi nhánh
          </h2>
          <Button onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout isRice>
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        <BranchDetailHeader
          branch={branch}
          onBack={handleBack}
          onEdit={handleEdit}
          onDelete={() => setShowDeleteDialog(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <BasicInfoCard branch={branch} />
            <LocationMapCard branch={branch} />
            <PersonnelCard contacts={branch.contacts} />
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <SidebarContactCard branch={branch} />
            <BankAccountCard bankAccounts={branch.bankAccounts} />
          </div>
        </div>
      </div>

      <DeleteBranchDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        branchName={branch.name}
      />
    </AdminLayout>
  );
}
