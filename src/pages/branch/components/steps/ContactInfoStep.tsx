import {
  Input,
  Label,
  Badge,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, Trash2, Users, Upload, Image as ImageIcon } from "lucide-react";
import type { BranchFormData, ContactInfo } from "../../hooks/useBranchForm";

interface ContactInfoStepProps {
  formData: BranchFormData;
  updateFormData: (updates: Partial<BranchFormData>) => void;
}

export function ContactInfoStep({
  formData,
  updateFormData,
}: ContactInfoStepProps) {
  const handleAddNewContactInfo = () => {
    const newContactInfo: ContactInfo = {
      id: Date.now().toString(),
      phone: "",
      email: "",
      isPrimary: formData.contactInfos.length === 0,
    };
    updateFormData({
      contactInfos: [...formData.contactInfos, newContactInfo],
    });
  };

  const handleRemoveContactInfo = (id: string) => {
    updateFormData({
      contactInfos: formData.contactInfos.filter((c) => c.id !== id),
    });
  };

  const handleUpdateContactInfo = (
    id: string,
    field: keyof ContactInfo,
    value: any,
  ) => {
    updateFormData({
      contactInfos: formData.contactInfos.map((c) =>
        c.id === id ? { ...c, [field]: value } : c,
      ),
    });
  };

  const handleSetPrimaryContactInfo = (id: string) => {
    updateFormData({
      contactInfos: formData.contactInfos.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      })),
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({
          imageUrl: reader.result as string,
          imageFile: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={formData.website}
          onChange={(e) => updateFormData({ website: e.target.value })}
          placeholder="VD: https://ecofarm.vn"
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg flex items-center justify-between">
          Danh sách thông tin liên hệ (Điện thoại & Email)
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{formData.contactInfos.length}</Badge>
            <Button onClick={handleAddNewContactInfo}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo thông tin liên hệ mới
            </Button>
          </div>
        </h4>

        {formData.contactInfos.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              Chưa có thông tin liên hệ nào
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.contactInfos.map((contactInfo, index) => (
              <div
                key={contactInfo.id}
                className="border rounded-lg p-4 bg-card shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      Thông tin liên hệ #{index + 1}
                    </h4>
                    {contactInfo.isPrimary && (
                      <Badge variant="default">Chính</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!contactInfo.isPrimary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleSetPrimaryContactInfo(contactInfo.id)
                        }
                        type="button"
                      >
                        Đặt làm chính
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContactInfo(contactInfo.id)}
                      type="button"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Số điện thoại</Label>
                    <Input
                      value={contactInfo.phone}
                      onChange={(e) =>
                        handleUpdateContactInfo(
                          contactInfo.id,
                          "phone",
                          e.target.value,
                        )
                      }
                      placeholder="VD: 02839999888"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) =>
                        handleUpdateContactInfo(
                          contactInfo.id,
                          "email",
                          e.target.value,
                        )
                      }
                      placeholder="VD: hcm@ecofarm.vn"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Hình ảnh đại diện</h3>
        </div>
        <div className="flex items-center gap-6">
          <div
            className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative cursor-pointer hover:border-primary transition-colors group"
            onClick={() => document.getElementById("avatar-upload")?.click()}
          >
            {formData.imageUrl ? (
              <>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              <div className="text-center p-2">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                <span className="text-xs text-gray-500">Upload</span>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="text-sm text-muted-foreground">
              <p>Tải lên hình ảnh đại diện (biển hiệu, văn phòng).</p>
              <p>Định dạng: JPG, PNG. Kích thước tối đa: 5MB.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("avatar-upload")?.click()}
              type="button"
            >
              <Upload className="w-4 h-4 mr-2" />
              Chọn hình ảnh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
