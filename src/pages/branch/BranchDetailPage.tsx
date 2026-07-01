import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft } from "lucide-react";
import { BankAccountCard } from "./components/BankAccountCard";
import { BasicInfoCard } from "./components/BasicInfoCard";
import { BranchDetailHeader } from "./components/BranchDetailHeader";
import { DeleteBranchDialog } from "./components/DeleteBranchDialog";
import { LocationMapCard } from "./components/LocationMapCard";
import { PersonnelCard } from "./components/PersonnelCard";
import { SidebarContactCard } from "./components/SidebarContactCard";
import { useBranchDetail } from "./hooks/useBranchDetail";

/**
 * Branch detail page component.
 * Displays comprehensive information about a specific branch.
 */
export default function BranchDetailPage() {
  const {
    branch,
    loading,
    error,
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete,
    handleBack,
    handleEdit,
  } = useBranchDetail();

  if (loading && !branch) {
    return (
      <AdminLayout isDev={true}>
        <div className="flex h-96 items-center justify-center rounded-3xl border bg-card">
          <p className="text-sm text-muted-foreground">
            Đang tải thông tin chi nhánh...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout isDev={true}>
        <div className="flex h-96 flex-col items-center justify-center rounded-3xl border bg-card text-center">
          <h2 className="text-2xl font-bold">Không thể tải chi nhánh</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-6" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  // Show not found state if branch doesn't exist
  if (!branch) {
    return (
      <AdminLayout isDev={true}>
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
    <AdminLayout isDev={true}>
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
        branchName={branch.name || ""}
      />
    </AdminLayout>
  );
}
