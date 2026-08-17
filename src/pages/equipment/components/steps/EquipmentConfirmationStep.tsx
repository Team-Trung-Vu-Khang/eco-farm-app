import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  Wrench,
  Cpu,
  FileText,
  Building2,
  Package,
} from "lucide-react";
import {
  suppliers as presetSuppliers,
  technologyLevelOptions,
  financialManagementOptions,
  valueChainOptions,
} from "../../data/constants";
import type { EquipmentFormData } from "../../types";

interface EquipmentConfirmationStepProps {
  formData: EquipmentFormData;
}

export const EquipmentConfirmationStep = ({
  formData,
}: EquipmentConfirmationStepProps) => {
  const valueChainGroupArr = formData.valueChainGroup || [];
  const machineTypeArr = formData.machineType || [];
  const packagingSpecsArr = formData.packagingSpecs || [];
  const supplierDetailsArr = formData.supplierDetails || [];

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-300 space-y-6">
      {/* Header alert */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-green-900">
          Xác nhận thông tin thiết bị
        </h3>
        <p className="text-green-700 mt-2">
          Vui lòng kiểm tra kỹ tất cả các khía cạnh thông số kỹ thuật trước khi
          lưu dữ liệu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Identification & Classification */}
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h4 className="font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" />
              Bước 1 - Định danh & Nhãn hiệu
            </h4>
            <div className="space-y-2.5 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs">
                  Mã sản phẩm / SKU:
                </span>
                <span className="font-semibold text-slate-900">
                  {formData.sku || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">
                  Tên máy móc / thiết bị:
                </span>
                <span className="font-semibold text-slate-900">
                  {formData.machineName || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">
                  Model / Kiểu máy:
                </span>
                <span className="font-medium text-slate-700">
                  {formData.model || "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Hãng sản xuất:
                  </span>
                  <span className="font-medium text-slate-700">
                    {formData.manufacturer || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Nước sản xuất:
                  </span>
                  <span className="font-medium text-slate-700">
                    {formData.countryOfOrigin || "N/A"}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">
                  Năm sản xuất:
                </span>
                <span className="font-medium text-slate-700">
                  {formData.manufactureYear || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">
                  Hashtags:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(formData.hashtags || []).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] bg-slate-50"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {(!formData.hashtags || formData.hashtags.length === 0) && (
                    <span className="text-slate-400">Không có hashtags</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">
                  Mô tả / Ghi chú:
                </span>
                <span className="font-medium text-slate-700 block whitespace-pre-wrap">
                  {formData.description || "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Technical Specs */}
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h4 className="font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              Bước 2 - Thông số kỹ thuật
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Nhóm công nghệ:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {technologyLevelOptions.find(
                      (o) => o.id === formData.technologyLevelGroup,
                    )?.label || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Nhóm tài sản:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {financialManagementOptions.find(
                      (o) => o.id === formData.assetManagementGroup,
                    )?.label || "N/A"}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-1">
                  Nhóm chuỗi quy trình:
                </span>
                <div className="flex flex-wrap gap-1">
                  {valueChainGroupArr.map((id) => {
                    const label = valueChainOptions.find(
                      (o) => o.id === id,
                    )?.label;
                    return (
                      <Badge key={id} variant="outline" className="text-[11px]">
                        {label || id}
                      </Badge>
                    );
                  })}
                  {valueChainGroupArr.length === 0 && (
                    <span className="text-slate-400">Chưa chọn khâu</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-1">
                  Loại máy / Công dụng:
                </span>
                <div className="flex flex-wrap gap-1">
                  {machineTypeArr.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[11px] bg-slate-100"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {machineTypeArr.length === 0 && (
                    <span className="text-slate-400">Chưa nhập loại</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Công suất:
                  </span>
                  <span className="font-medium text-slate-700">
                    {formData.powerCapacity || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Dung tích / Khả năng:
                  </span>
                  <span className="font-medium text-slate-700">
                    {formData.workingCapacity || "N/A"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Nhiên liệu:
                  </span>
                  <span className="font-medium text-slate-700">
                    {formData.fuelEnergyType || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Trọng lượng:
                  </span>
                  <span className="font-medium text-slate-700">
                    {formData.weight || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Kích thước:
                  </span>
                  <span className="font-medium text-slate-700 truncate block">
                    {formData.dimensions || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Operations & Maintenance */}
        <Card className="shadow-sm md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h4 className="font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Bước 3 - Vận hành & HDSD kỹ thuật
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Định mức tiêu hao nhiên liệu:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formData.fuelConsumptionRate || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Lịch bảo dưỡng định kỳ:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formData.maintenanceSchedule || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Phụ tùng chính kèm theo:
                  </span>
                  <span className="font-medium text-slate-700 whitespace-pre-line bg-slate-50 p-2 border block rounded text-xs">
                    {formData.mainAccessories || "Không gán phụ tùng"}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-1">
                  Tài liệu kỹ thuật kèm theo:
                </span>
                {formData.technicalDocType === "file" ? (
                  <div className="p-4 bg-slate-50 border rounded-lg flex items-center gap-2 text-xs">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <div className="font-semibold text-slate-800">
                        Tệp tài liệu kỹ thuật / Hướng dẫn sử dụng
                      </div>
                      <div className="text-muted-foreground">
                        Đã đính kèm tệp cấu hình thiết bị
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-3 rounded-lg border text-xs max-h-36 overflow-y-auto font-mono whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {formData.technicalDocContent ||
                      "Chưa nhập nội dung hướng dẫn sử dụng"}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Supplier Specs & Warehousing */}
        <Card className="shadow-sm md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h4 className="font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Bước 4 - Xuất xứ & Đơn vị phân phối & Lô kho
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">
                    Nhà sản xuất / Quốc gia:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {formData.manufacturerOrigin ? (
                      <Badge
                        variant="outline"
                        className="text-xs bg-slate-50"
                      >
                        {formData.manufacturerOrigin.name}
                      </Badge>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">
                    Đơn vị nhập khẩu / Đăng ký:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {formData.importerRegistrant ? (
                      <Badge
                        variant="outline"
                        className="text-xs bg-slate-50"
                      >
                        {formData.importerRegistrant.name}
                      </Badge>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">
                    Nhà phân phối chính thức:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {formData.distributor ? (
                      <Badge
                        variant="outline"
                        className="text-xs bg-slate-50"
                      >
                        {formData.distributor.name}
                      </Badge>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground block text-xs">
                      Giá tham khảo:
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formData.referencePrice || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">
                      Quy cách bao bì:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {packagingSpecsArr.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {s}
                        </Badge>
                      ))}
                      {packagingSpecsArr.length === 0 && (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Warehousing details */}
              {/* <div className="space-y-2">
                <span className="text-muted-foreground block text-xs font-semibold">Tồn kho lô nhập ban đầu:</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {supplierDetailsArr.map((item, idx) => {
                    const sup = presetSuppliers.find((s) => s.id === item.supplierId);
                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 rounded bg-slate-50 text-xs border border-slate-100"
                      >
                        <span className="font-medium text-slate-700">{sup?.name || item.supplierId}</span>
                        <span className="text-slate-600">
                          {item.quantity} {item.unit} (BH: {item.warranty})
                        </span>
                      </div>
                    );
                  })}
                  {supplierDetailsArr.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground bg-slate-50 rounded border border-dashed text-xs">
                      Không nhập kho trực tiếp
                    </div>
                  )}
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
