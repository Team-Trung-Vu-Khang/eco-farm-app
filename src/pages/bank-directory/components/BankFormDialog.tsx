import { FormDialog, Input, Label } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Upload, X } from "lucide-react";
import type { Bank } from "../types/types";

interface BankFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: Bank | null;
  formData: Bank;
  onFormUpdate: (data: Partial<Bank>) => void;
  logoPreview: string;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
  onSubmit: () => void;
}

export default function BankFormDialog({
  open,
  onOpenChange,
  editItem,
  formData,
  onFormUpdate,
  logoPreview,
  onLogoUpload,
  onRemoveLogo,
  onSubmit,
}: BankFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa ngân hàng" : "Thêm ngân hàng mới"}
      onSubmit={onSubmit}
    >
      <div className="space-y-4">
        {/* ID */}
        <div className="space-y-2">
          <Label htmlFor="id">ID / Mã ngân hàng *</Label>
          <Input
            id="id"
            clearable={false}
            value={formData.id}
            onChange={(e) => onFormUpdate({ id: e.target.value })}
            placeholder="VD: VCB, BIDV, ACB..."
            disabled={!!editItem}
          />
        </div>

        {/* Short name */}
        <div className="space-y-2">
          <Label htmlFor="name">Tên ngắn *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFormUpdate({ name: e.target.value })}
            placeholder="VD: Vietcombank, BIDV..."
          />
        </div>

        {/* Full name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Tên đầy đủ (Bank's Name) *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => onFormUpdate({ fullName: e.target.value })}
            placeholder="VD: Ngân hàng Citibank, N.A. - Chi nhánh Hà Nội"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ ngân hàng (Bank's Address)</Label>
          <Input
            id="address"
            value={formData.address ?? ""}
            onChange={(e) => onFormUpdate({ address: e.target.value })}
            placeholder="VD: 198 Trần Quang Khải, Hoàn Kiếm, Hà Nội"
          />
        </div>

        {/* SWIFT Code & BIC Code — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="swiftCode">SWIFT Code</Label>
            <Input
              id="swiftCode"
              value={formData.swiftCode ?? ""}
              onChange={(e) =>
                onFormUpdate({
                  swiftCode: e.target.value.toUpperCase(),
                  bicCode: e.target.value.toUpperCase(),
                })
              }
              placeholder="VD: BFTVVNVX"
              maxLength={11}
              className="font-mono tracking-widest uppercase"
            />
            <p className="text-xs text-muted-foreground">8 hoặc 11 ký tự</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bicCode">BIC Code</Label>
            <Input
              id="bicCode"
              value={formData.bicCode ?? ""}
              onChange={(e) =>
                onFormUpdate({ bicCode: e.target.value.toUpperCase() })
              }
              placeholder="VD: BFTVVNVX"
              maxLength={11}
              className="font-mono tracking-widest uppercase"
            />
            <p className="text-xs text-muted-foreground">Thường giống SWIFT</p>
          </div>
        </div>

        {/* Routing/ABA */}
        <div className="space-y-2">
          <Label htmlFor="routingCode">Mã Routing/ABA</Label>
          <Input
            id="routingCode"
            value={formData.routingCode ?? ""}
            onChange={(e) => onFormUpdate({ routingCode: e.target.value })}
            placeholder="VD: 021000021 (chủ yếu ngân hàng Mỹ)"
            maxLength={9}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            9 chữ số — áp dụng với ngân hàng Mỹ (ABA routing number)
          </p>
        </div>

        {/* BIN */}
        <div className="space-y-2">
          <Label htmlFor="bin">BIN</Label>
          <Input
            id="bin"
            value={formData.bin ?? ""}
            onChange={(e) => onFormUpdate({ bin: e.target.value })}
            placeholder="VD: 970436"
            maxLength={9}
            className="font-mono"
          />
        </div>

        {/* Logo */}
        <div className="space-y-2">
          <Label>Logo ngân hàng</Label>
          {logoPreview ? (
            <div className="relative">
              <div className="p-4 border-2 border-dashed rounded-lg bg-muted/50 flex items-center justify-center">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-16 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/100x48?text=Logo";
                  }}
                />
              </div>
              <button
                type="button"
                onClick={onRemoveLogo}
                className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="logo-upload"
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
            >
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm font-medium text-muted-foreground">
                Click để tải logo lên
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                PNG, JPG, SVG (tối đa 2MB)
              </span>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={onLogoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </FormDialog>
  );
}
