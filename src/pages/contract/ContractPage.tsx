import { AdminLayout, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ContractStats } from "./components/ContractStats";
import { ContractTable } from "./components/ContractTable";
import { useContract } from "./hooks/useContract";

const ContractPage = () => {
  const {
    contracts,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedContract,
    handleView,
    handleEdit,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCreate,
  } = useContract();

  return (
    <AdminLayout
      title="Quản lý hợp đồng"
      description="Quản lý hợp đồng theo đơn vị sở hữu"
    >
      <div className="space-y-6">
        <ContractStats contracts={contracts} />

        <ContractTable
          contracts={contracts}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onCreate={handleCreate}
        />
      </div>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Xóa hợp đồng"
        description={
          selectedContract
            ? `Bạn có chắc chắn muốn xóa hợp đồng "${selectedContract.name}" (${selectedContract.code})? Hành động này không thể hoàn tác.`
            : ""
        }
      />
    </AdminLayout>
  );
};

export default ContractPage;
