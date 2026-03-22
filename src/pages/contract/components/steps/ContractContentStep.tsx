import {
  Card,
  CardContent,
  Label,
  Button,
  RadioGroup,
  RadioGroupItem,
  Input,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  Editor,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  FileText,
  FileSignature,
  Search,
  CheckCircle2,
  Upload,
  X,
} from "lucide-react";
import { contractTypes, mockContracts } from "../../data/constants";
import type { ContractFormData } from "../../types";

interface ContractContentStepProps {
  formData: ContractFormData;
  updateField: (field: keyof ContractFormData, value: any) => void;
  searchParentContract: string;
  setSearchParentContract: (v: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContractContentStep = ({
  formData,
  updateField,
  searchParentContract,
  setSearchParentContract,
  handleFileUpload,
}: ContractContentStepProps) => {
  const getSelectedParentContract = () => {
    return mockContracts.find(
      (c) => c.id.toString() === formData.parentContractId,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-3 rounded-lg">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Nội dung hợp đồng</h3>
          <p className="text-sm text-muted-foreground">
            Tải lên hoặc soạn thảo nội dung hợp đồng
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {formData.isAppendix && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileSignature className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Hợp đồng gốc</h4>
                    <p className="text-xs text-muted-foreground">
                      {formData.parentContractId
                        ? `Đã chọn: ${getSelectedParentContract()?.name} (${getSelectedParentContract()?.code})`
                        : "Vui lòng chọn hợp đồng gốc cho phụ lục này"}
                    </p>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      {formData.parentContractId ? "Thay đổi" : "Chọn hợp đồng"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Chọn hợp đồng chính</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Tìm theo mã hoặc tính chất hợp đồng..."
                          className="pl-10"
                          value={searchParentContract}
                          onChange={(e) =>
                            setSearchParentContract(e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                        {mockContracts
                          .filter((c) => {
                            const search = searchParentContract.toLowerCase();
                            const natureName =
                              contractTypes
                                .find((t) => t.id === c.type)
                                ?.name.toLowerCase() || "";
                            return (
                              c.code.toLowerCase().includes(search) ||
                              natureName.includes(search) ||
                              c.name.toLowerCase().includes(search)
                            );
                          })
                          .map((contract) => (
                            <div
                              key={contract.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-slate-50 relative ${
                                formData.parentContractId ===
                                contract.id.toString()
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => {
                                updateField(
                                  "parentContractId",
                                  contract.id.toString(),
                                );
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">
                                      {contract.code}
                                    </span>
                                    <h5 className="font-semibold text-sm">
                                      {contract.name}
                                    </h5>
                                  </div>
                                  <div className="text-xs text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1">
                                    <div>📅 Ngày ký: {contract.signDate}</div>
                                    <div>
                                      📋{" "}
                                      {
                                        contractTypes.find(
                                          (t) => t.id === contract.type,
                                        )?.name
                                      }
                                    </div>
                                  </div>
                                </div>
                                {formData.parentContractId ===
                                  contract.id.toString() && (
                                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                )}
                              </div>
                            </div>
                          ))}
                        {mockContracts.filter((c) => {
                          const search = searchParentContract.toLowerCase();
                          const natureName =
                            contractTypes
                              .find((t) => t.id === c.type)
                              ?.name.toLowerCase() || "";
                          return (
                            c.code.toLowerCase().includes(search) ||
                            natureName.includes(search) ||
                            c.name.toLowerCase().includes(search)
                          );
                        }).length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">
                              Không tìm thấy hợp đồng phù hợp
                            </p>
                          </div>
                        )}
                      </div>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button variant="outline">Huỷ</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button disabled={!formData.parentContractId}>
                            Xác nhận
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label className="block">
              Nội dung hợp đồng <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.contentType}
              onValueChange={(v: "file" | "editor") =>
                updateField("contentType", v)
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <RadioGroupItem value="file" id="content-file" />
                <Label htmlFor="content-file" className="flex-1 cursor-pointer">
                  <div className="font-medium">Tải lên file</div>
                  <div className="text-xs text-muted-foreground">
                    Tải lên file PDF, Word, hoặc hình ảnh
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <RadioGroupItem value="editor" id="content-editor" />
                <Label
                  htmlFor="content-editor"
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium">Nhập văn bản</div>
                  <div className="text-xs text-muted-foreground">
                    Nhập nội dung trực tiếp vào ô văn bản
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.contentType === "file" && (
            <div className="space-y-2">
              <Label htmlFor="contentFileControl">File hợp đồng</Label>
              <div className="mt-2">
                <label
                  htmlFor="contentFileControl"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click để tải lên</span>{" "}
                      hoặc kéo thả
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX, PNG, JPG (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    id="contentFileControl"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                  />
                </label>
                {formData.contentFile && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-slate-100 rounded border">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm flex-1 truncate">
                      {formData.contentFile.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateField("contentFile", null)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {formData.contentType === "editor" && (
            <div className="space-y-2">
              <Label htmlFor="contentText">Soạn thảo văn bản</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <Editor
                  contentEditableClassname="h-[500px]"
                  initialText={formData.contentText}
                  onChange={() => {}}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
