import { DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface DeleteCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteCropDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteCropDialogProps) {
  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
    />
  );
}
