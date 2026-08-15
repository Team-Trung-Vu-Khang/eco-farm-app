import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2 } from "lucide-react";
import { getMaterialGroupLabel } from "../data/constants";
import type { MaterialFormData } from "../types/types";

interface MaterialConfirmStepProps {
  formData: MaterialFormData;
}

export default function MaterialConfirmStep({
  formData,
}: MaterialConfirmStepProps) {
  const hashtagsArr = formData.hashtags || [];

  return (
    <div className="mx-auto max-w-3xl animate-in fade-in zoom-in duration-300">
      <div className="mb-8 rounded-2xl border border-green-100 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-green-900">
          Xác nhận thông tin vật tư khác
        </h3>
        <p className="mt-2 text-green-700">
          Vui lòng kiểm tra kỹ thông tin trước khi hoàn tất
        </p>
      </div>

      <div className="space-y-6">
        {/* Card: Info & Classifications */}
        <Card>
          <CardContent className="p-6">
            <h4 className="mb-4 border-b pb-2 font-semibold text-slate-800">
              Thông tin & Phân loại vật tư
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <span className="text-muted-foreground">Mã vật tư:</span>{" "}
                <span className="font-semibold text-slate-900">{formData.code}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tên vật tư:</span>{" "}
                <span className="font-semibold text-slate-900">{formData.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Mức độ công nghệ:</span>{" "}
                <span className="font-semibold text-slate-900">
                  {getMaterialGroupLabel(formData.technologyLevelId) || "Chưa chọn"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Giai đoạn áp dụng:</span>{" "}
                <span className="font-semibold text-slate-900">
                  {getMaterialGroupLabel(formData.valueChainId) || "Chưa chọn"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="mb-1 block text-muted-foreground">Mô tả:</span>
                <span className="block rounded border border-slate-100 bg-slate-50 p-2 font-medium">
                  {formData.description || "Không có mô tả"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Hashtags:</span>{" "}
                <div className="mt-1 inline-flex flex-wrap gap-1">
                  {hashtagsArr.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {hashtagsArr.length === 0 && <span className="text-slate-400">Không có hashtags</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Origin & Supply Info */}
        <Card>
          <CardContent className="p-6">
            <h4 className="mb-4 border-b pb-2 font-semibold text-slate-800">
              Xuất xứ & Đơn vị phân phối
            </h4>
            <div className="space-y-4 text-sm">
              {formData.manufacturerOrigin && (
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Nhà sản xuất / Xuất xứ:</span>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="bg-slate-50">{formData.manufacturerOrigin}</Badge>
                  </div>
                </div>
              )}

              {formData.importerRegistrant && (
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Nhà nhập khẩu / Đăng ký:</span>
                  <div className="flex flex-wrap gap-1">
                    {formData.importerRegistrant.split(", ").filter(Boolean).map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-slate-50">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {formData.distributor && (
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Nhà phân phối:</span>
                  <div className="flex flex-wrap gap-1">
                    {formData.distributor.split(", ").filter(Boolean).map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-slate-50">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {formData.packagingSpecs && formData.packagingSpecs.length > 0 && (
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Quy cách đóng gói:</span>
                  <div className="flex flex-wrap gap-1">
                    {formData.packagingSpecs.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {(!formData.manufacturerOrigin &&
                !formData.importerRegistrant &&
                !formData.distributor &&
                !formData.packagingSpecs?.length) && (
                <div className="text-center py-6 text-xs text-muted-foreground border border-dashed rounded-lg bg-slate-50">
                  Không cấu hình thông tin xuất xứ & phân phối
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
