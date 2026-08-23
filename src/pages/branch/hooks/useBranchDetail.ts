import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import {
  useBranchById,
  useDeleteBranch,
  type BranchRecord,
} from "@/features/branch";
import { useSelectedWorkspaceId } from "@/features/workspace";

export type BranchDetailView = Omit<
  BranchRecord,
  "bankAccounts" | "contacts"
> & {
  enterpriseName: string;
  phone: string;
  email: string;
  bankAccounts: Array<{
    id: string;
    bankName: string;
    isPrimary?: boolean;
    accountNumber: string;
    accountHolder: string;
    branch: string;
  }>;
  contacts: Array<{
    id: string;
    name: string;
    isPrimary?: boolean;
    position: string;
    phone: string;
    email: string;
  }>;
};

export function useBranchDetail() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const workspaceId = useSelectedWorkspaceId();

  const [, params] = useRoute("/branch/:id/detail");
  const branchId = params?.id ? parseInt(params.id) : undefined;

  const branchQuery = useBranchById(
    branchId ?? "missing",
    workspaceId ?? "missing",
    {
      enabled: workspaceId !== null && branchId !== undefined,
    },
  );

  const deleteBranchMutation = useDeleteBranch({
    onSuccess: () => {
      toast({
        title: "Đã xóa chi nhánh",
        description: "Chi nhánh đã được xóa thành công.",
      });
      setShowDeleteDialog(false);
      setLocation("/branch");
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const branch = useMemo<BranchDetailView | undefined>(() => {
    if (!branchQuery.item) return undefined;

    const primaryContact =
      branchQuery.item.contacts?.find((contact) => contact.isPrimary) ??
      branchQuery.item.contacts?.[0] ??
      null;

    return {
      ...branchQuery.item,
      enterpriseName: branchQuery.item.organization?.name ?? "-",
      phone: primaryContact?.phone ?? "-",
      email: primaryContact?.email ?? "-",
      contacts:
        branchQuery.item.contacts?.map((contact) => ({
          id: String(contact.id),
          name: contact.name || contact.fullName || "",
          isPrimary: contact.isPrimary,
          position: contact.position || "",
          phone: contact.phone || "",
          email: contact.email || "",
        })) ?? [],
      bankAccounts:
        branchQuery.item.bankAccounts?.map((bankAccount) => ({
          id: String(bankAccount.id),
          bankName: bankAccount.bank?.name || "",
          isPrimary: bankAccount.isPrimary,
          accountNumber: bankAccount.accountNumber || "",
          accountHolder: bankAccount.accountHolder || "",
          branch: bankAccount.branch || "",
        })) ?? [],
    };
  }, [branchQuery.item]);

  const handleDelete = async () => {
    if (branchId !== undefined) {
      await deleteBranchMutation.deleteBranch({ id: branchId });
    }
  };

  return {
    branch,
    branchId,
    loading: branchQuery.loading,
    error: branchQuery.error,
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete,
    handleBack: () => setLocation("/branch"),
    handleEdit: () => setLocation(`/branch/${branchId}/edit`),
  };
}
