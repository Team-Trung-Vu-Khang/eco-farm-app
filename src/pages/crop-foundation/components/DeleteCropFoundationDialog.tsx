import { DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface DeleteCropFoundationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteCropFoundationDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteCropFoundationDialogProps) {
  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
    />
  );
}
