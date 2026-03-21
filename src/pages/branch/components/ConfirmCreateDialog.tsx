import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface ConfirmCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  formData: {
    enterpriseId: string;
    name: string;
    code: string;
    address: string;
    ward: string;
    district: string;
    province: string;
  };
}

export function ConfirmCreateDialog({
  open,
  onOpenChange,
  onConfirm,
  formData,
}: ConfirmCreateDialogProps) {
  const getEnterpriseName = (id: string) => {
    switch (id) {
      case "1": return "Công ty CP Nông nghiệp Xanh EcoFarm";
      case "2": return "HTX Rau sạch Thanh Hà";
      case "3": return "Nông hộ Nguyễn Văn A";
      default: return "";
    }
  };

  const getFullLocation = () => {
    return [
      formData.address,
      formData.ward === "p1" ? "Phường 1" : formData.ward === "p2" ? "Phường 2" : formData.ward === "kimma" ? "Kim Mã" : "",
      formData.district === "q1" ? "Quận 1" : formData.district === "q3" ? "Quận 3" : formData.district === "badinh" ? "Ba Đình" : "",
      formData.province === "hcm" ? "TP. Hồ Chí Minh" : formData.province === "hn" ? "Hà Nội" : formData.province === "dn" ? "Đà Nẵng" : "",
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Xác nhận tạo chi nhánh</DialogTitle>
          <DialogDescription>
            Vui lòng kiểm tra lại thông tin trước khi tạo mới.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-muted-foreground">Đơn vị:</span>
            <span className="col-span-2">{getEnterpriseName(formData.enterpriseId)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-muted-foreground">Tên chi nhánh:</span>
            <span className="col-span-2">{formData.name}</span>
          </div>
          {formData.code && (
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-muted-foreground">Mã:</span>
              <span className="col-span-2">{formData.code}</span>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-muted-foreground">Địa chỉ:</span>
            <span className="col-span-2">{getFullLocation()}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onConfirm}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
