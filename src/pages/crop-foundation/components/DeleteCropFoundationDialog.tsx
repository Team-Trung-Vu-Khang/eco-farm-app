import { DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface DeleteCropFoundationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function DeleteCropFoundationDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteCropFoundationDialogProps) {
  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isPending={isPending}
    />
  );
}
