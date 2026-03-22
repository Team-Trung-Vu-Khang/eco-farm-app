import {
  Card,
  CardContent,
  Label,
  RadioGroup,
  RadioGroupItem,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileSignature, FilePlus, FileStack } from "lucide-react";
import { contractTypes, currencies } from "../../data/constants";
import type { ContractFormData } from "../../types";

interface BasicInfoStepProps {
  formData: ContractFormData;
  updateField: (field: keyof ContractFormData, value: any) => void;
}

export const BasicInfoStep = ({
  formData,
  updateField,
}: BasicInfoStepProps) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-primary/10 p-3 rounded-lg">
        <FileSignature className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
        <p className="text-sm text-muted-foreground">
          Nhập thông tin cơ bản của hợp đồng
        </p>
      </div>
    </div>

    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl text-center">
            <Label
              htmlFor="contractType"
              className="mb-4 block text-base font-semibold"
            >
              Loại hợp đồng <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              className="grid grid-cols-2 gap-4"
              value={formData.isAppendix ? "appendix" : "new"}
              onValueChange={(v) => updateField("isAppendix", v === "appendix")}
            >
              <div
                className={`flex items-center gap-4 p-4 border rounded-xl transition-all cursor-pointer text-left ${
                  !formData.isAppendix
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-gray-200 hover:border-gray-300 bg-white shadow-sm"
                }`}
                onClick={() => updateField("isAppendix", false)}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    !formData.isAppendix
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <FilePlus className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <RadioGroupItem
                      value="new"
                      id="type-new"
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        !formData.isAppendix
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                    >
                      {!formData.isAppendix && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="font-bold text-sm text-gray-900">
                      Hợp đồng mới
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    Thiết lập các điều khoản gốc cho một thỏa thuận mới hoàn
                    toàn.
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-4 p-4 border rounded-xl transition-all cursor-pointer text-left ${
                  formData.isAppendix
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-gray-200 hover:border-gray-300 bg-white shadow-sm"
                }`}
                onClick={() => updateField("isAppendix", true)}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    formData.isAppendix
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <FileStack className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <RadioGroupItem
                      value="appendix"
                      id="type-appendix"
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        formData.isAppendix
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.isAppendix && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="font-bold text-sm text-gray-900">
                      Phụ lục hợp đồng
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    Bổ sung hoặc thay đổi điều khoản dựa trên một hợp đồng đã
                    có.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">
              Mã hợp đồng <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              placeholder="VD: HD001"
              value={formData.code}
              onChange={(e) => updateField("code", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signDate">
              Ngày ký kết <span className="text-red-500">*</span>
            </Label>
            <Input
              id="signDate"
              type="date"
              value={formData.signDate}
              onChange={(e) => updateField("signDate", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">
            Tên hợp đồng <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="VD: Hợp đồng mua bán phân bón"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nature">
            Tính chất hợp đồng <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.nature}
            onValueChange={(v) => updateField("nature", v)}
          >
            <SelectTrigger id="nature">
              <SelectValue placeholder="Chọn tính chất hợp đồng" />
            </SelectTrigger>
            <SelectContent>
              {contractTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="value">
              Giá trị hợp đồng <span className="text-red-500">*</span>
            </Label>
            <Input
              id="value"
              type="number"
              placeholder="Nhập giá trị hợp đồng"
              value={formData.value}
              onChange={(e) => updateField("value", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Đơn vị</Label>
            <Select
              value={formData.currency}
              onValueChange={(v) => updateField("currency", v)}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="VNĐ" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.id} value={curr.id}>
                    {curr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
