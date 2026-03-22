import {
  FormDialog,
  Input,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Upload, X } from "lucide-react";
import { type Bank } from "../../../constants/banks";

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
        <div className="space-y-2">
          <Label htmlFor="id">ID *</Label>
          <Input
            id="id"
            value={formData.id}
            onChange={(e) => onFormUpdate({ id: e.target.value })}
            placeholder="VD: VCB, BIDV, ACB..."
            disabled={!!editItem}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Tên ngân hàng *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              onFormUpdate({ name: e.target.value })
            }
            placeholder="VD: Vietcombank, BIDV..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Tên đầy đủ *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) =>
              onFormUpdate({ fullName: e.target.value })
            }
            placeholder="VD: Ngân hàng TMCP Ngoại Thương Việt Nam"
          />
        </div>

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
