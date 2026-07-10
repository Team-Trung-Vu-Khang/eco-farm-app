import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  DataTable,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Download,
} from "lucide-react";
import readXlsxFile from "read-excel-file";
import { useSelectedWorkspaceId } from "@/features/workspace";
import {
  useMasterData,
  useFarmDepartmentOptions,
  useFarmPositionOptions,
  useFarmTeams,
} from "@/features/master-data";
import { personnelFormSchema } from "@/pages/personnel/data/personnel-form.schema";

interface ImportPersonnelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: any[]) => void;
}

interface TempPersonnel {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  position: string;
  department: string;
  team: string;
  province: string;
  address: string;
  ward: string;
  taxCode: string;
  taxAddress: string;
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  accountHolder: string;
  status: "active";
  isValid: boolean;
  errors?: string[];
  errorMessages?: string[];
  payload?: any;
}

export function ImportPersonnelDialog({
  open,
  onOpenChange,
  onImport,
}: ImportPersonnelDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importData, setImportData] = useState<TempPersonnel[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  const { items: banks } = useMasterData("banks", {
    params: { status: "active", size: 100 },
  });
  const { items: masterDepartments } = useMasterData("departments", {
    params: { status: "active", size: 100 },
  });
  const { items: masterPositions } = useMasterData("positions", {
    params: { status: "active", size: 100 },
  });
  const { items: farmDepartments } = useFarmDepartmentOptions({
    workspaceId: parsedWorkspaceId,
    params: { size: 100 },
  });
  const { items: farmPositions } = useFarmPositionOptions({
    workspaceId: parsedWorkspaceId,
    params: { size: 100 },
  });
  const { items: farmTeams } = useFarmTeams({
    workspaceId: parsedWorkspaceId,
    params: { size: 100 },
  });

  const columns: Column<TempPersonnel>[] = [
    {
      key: "fullName",
      label: "Họ và tên",
      render: (value: any, item) => (
        <div className="flex flex-col">
          <span
            className={item.errors?.includes("fullName") ? "text-red-500" : ""}
          >
            {value}
          </span>
        </div>
      ),
    },
    { key: "phone", label: "Điện thoại" },
    { key: "email", label: "Email" },
    { key: "position", label: "Chức vụ" },
    { key: "department", label: "Phòng ban" },
    { key: "team", label: "Đội nhóm" },
    { key: "province", label: "Tỉnh/Thành" },
    { key: "address", label: "Địa chỉ chi tiết" },
    { key: "ward", label: "Phường/Xã" },
    { key: "taxCode", label: "Mã số thuế" },
    { key: "taxAddress", label: "Địa chỉ thuế" },
    { key: "bankName", label: "Ngân hàng" },
    { key: "bankBranch", label: "Chi nhánh ngân hàng" },
    { key: "accountNumber", label: "Số tài khoản" },
    { key: "accountHolder", label: "Chủ tài khoản" },
    {
      key: "isValid",
      label: "Trạng thái",
      render: (value: any, item) => (
        <div className="flex flex-col gap-1 min-w-[150px]">
          {value ? (
            <div className="flex items-center gap-1 text-green-500">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs">Hợp lệ</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1 text-red-500">
              <div className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-semibold">Lỗi dữ liệu:</span>
              </div>
              <ul className="text-[11px] list-disc pl-4 leading-tight">
                {item.errorMessages?.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      const rows = await readXlsxFile(file);
      // Assuming headers are in the first row
      // Expected: Họ và tên, Điện thoại, Email, Chức vụ, Phòng ban, Đội nhóm
      const headers = rows[0] as string[];
      const dataRows = rows.slice(1);

      const parsedData: TempPersonnel[] = dataRows.map((row, index) => {
        const rowData: any = {};
        headers.forEach((header, i) => {
          const val = row[i];
          const headerClean = header?.toString().trim().toLowerCase();

          if (headerClean?.includes("họ và tên")) rowData.fullName = val;
          else if (headerClean?.includes("điện thoại"))
            rowData.phone = val?.toString();
          else if (headerClean?.includes("email")) rowData.email = val;
          else if (headerClean?.includes("chức vụ")) rowData.position = val;
          else if (headerClean?.includes("phòng ban")) rowData.department = val;
          else if (
            headerClean?.includes("đội nhóm") ||
            headerClean?.includes("đội / nhóm")
          )
            rowData.team = val;
          else if (
            headerClean?.includes("tỉnh") ||
            headerClean?.includes("thành phố")
          )
            rowData.province = val;
          else if (
            headerClean?.includes("phường") ||
            headerClean?.includes("xã")
          )
            rowData.ward = val;
          else if (
            headerClean?.includes("địa chỉ chi tiết") ||
            headerClean === "địa chỉ"
          )
            rowData.address = val;
          else if (
            headerClean?.includes("mã số thuế") ||
            headerClean?.includes("mst")
          )
            rowData.taxCode = val;
          else if (headerClean?.includes("địa chỉ thuế"))
            rowData.taxAddress = val;
          else if (headerClean?.includes("ngân hàng")) rowData.bankName = val;
          else if (headerClean?.includes("chi nhánh ngân hàng"))
            rowData.bankBranch = val;
          else if (headerClean?.includes("số tài khoản"))
            rowData.accountNumber = val?.toString();
          else if (headerClean?.includes("chủ tài khoản"))
            rowData.accountHolder = val;
        });

        let departmentId = "";
        let departmentType: any = undefined;
        if (rowData.department) {
          const nameLower = rowData.department.toLowerCase();
          const fDept = farmDepartments.find(
            (d) => d.name.toLowerCase() === nameLower,
          );
          if (fDept) {
            departmentId = fDept.id.toString();
            departmentType = "OWNER";
          } else {
            const mDept = masterDepartments.find(
              (d) => d.name.toLowerCase() === nameLower,
            );
            if (mDept) {
              departmentId = mDept.id.toString();
              departmentType = "MASTER";
            }
          }
        }

        let positionId = "";
        let positionType: any = undefined;
        if (rowData.position) {
          const nameLower = rowData.position.toLowerCase();
          const fPos = farmPositions.find(
            (p) => p.name.toLowerCase() === nameLower,
          );
          if (fPos) {
            positionId = fPos.id.toString();
            positionType = "OWNER";
          } else {
            const mPos = masterPositions.find(
              (p) => p.name.toLowerCase() === nameLower,
            );
            if (mPos) {
              positionId = mPos.id.toString();
              positionType = "MASTER";
            }
          }
        }

        let teamId = "";
        if (rowData.team) {
          const nameLower = rowData.team.toLowerCase();
          const fTeam = farmTeams.find(
            (t) => t.name.toLowerCase() === nameLower,
          );
          if (fTeam) {
            teamId = fTeam.id.toString();
          }
        }

        let selectedBankCode = "";
        const selectedBank = banks.find(
          (b) =>
            b.code?.toLowerCase() === rowData.bankName?.toLowerCase() ||
            (b.shortName as string)?.toLowerCase() ===
              rowData.bankName?.toLowerCase() ||
            b.name?.toLowerCase() === rowData.bankName?.toLowerCase(),
        );
        if (selectedBank) {
          selectedBankCode = selectedBank.code;
        } else if (rowData.bankName) {
          selectedBankCode = rowData.bankName;
        }

        const payloadForValidation = {
          fullName: rowData.fullName || "",
          phone: rowData.phone || "",
          email: rowData.email || "",
          province: rowData.province || "",
          ward: rowData.ward || "",
          address: rowData.address || "",
          personalTaxCode: rowData.taxCode || "",
          taxAddress: rowData.taxAddress || "",
          departmentType,
          department: departmentId,
          positionType,
          position: positionId,
          teamIds: teamId ? [teamId] : [],
          status: "active" as const,
          bankName: selectedBankCode,
          bankBranch: rowData.bankBranch || "",
          accountNumber: rowData.accountNumber?.toString() || "",
          accountHolder: rowData.accountHolder || "",
        };

        const validation = personnelFormSchema.safeParse(payloadForValidation);
        let errors: string[] = [];
        let errorMessages: string[] = [];
        if (!validation.success) {
          errors = validation.error.issues.map((e) => String(e.path[0] || ""));
          errorMessages = validation.error.issues.map((e) => e.message);
        }

        let bankAccountPayload: any[] = [];
        if (
          selectedBankCode ||
          rowData.accountNumber ||
          rowData.accountHolder ||
          rowData.bankBranch
        ) {
          bankAccountPayload = [
            {
              bankCode: selectedBank?.code || rowData.bankName,
              bankName: selectedBank?.name || rowData.bankName,
              bin:
                (selectedBank?.attributes as any)?.bin ||
                selectedBank?.code ||
                rowData.bankName,
              logoUrl: (selectedBank as any)?.logoUrl,
              accountNumber: rowData.accountNumber?.toString(),
              accountHolder: rowData.accountHolder,
              branch: rowData.bankBranch,
            },
          ];
        }

        const apiPayload = {
          fullName: rowData.fullName || "",
          phone: rowData.phone || "",
          email: rowData.email || undefined,
          province: rowData.province || undefined,
          ward: rowData.ward || undefined,
          address: rowData.address || undefined,
          personalTaxCode: rowData.taxCode || undefined,
          taxAddress: rowData.taxAddress || undefined,
          departmentType,
          departmentId: departmentId ? Number(departmentId) : undefined,
          positionType,
          positionId: positionId ? Number(positionId) : undefined,
          teamIds: teamId ? [Number(teamId)] : undefined,
          status: "active",
          bankAccounts: bankAccountPayload,
        };

        return {
          id: `temp-${index}`,
          fullName: rowData.fullName || "",
          phone: rowData.phone || "",
          email: rowData.email || "",
          position: rowData.position || "",
          department: rowData.department || "",
          team: rowData.team || "",
          province: rowData.province || "",
          ward: rowData.ward || "",
          address: rowData.address || "",
          taxCode: rowData.taxCode || "",
          taxAddress: rowData.taxAddress || "",
          bankName: rowData.bankName || "",
          bankBranch: rowData.bankBranch || "",
          accountNumber: rowData.accountNumber?.toString() || "",
          accountHolder: rowData.accountHolder || "",
          status: "active" as const,
          isValid: errors.length === 0,
          errors,
          errorMessages,
          payload: apiPayload,
        };
      });

      setImportData(parsedData);
      toast({
        title: "Tải file thành công",
        description: `Đã đọc được ${parsedData.length} dòng dữ liệu.`,
      });
    } catch (error) {
      console.error("Error parsing Excel:", error);
      toast({
        variant: "destructive",
        title: "Lỗi đọc file",
        description:
          "Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng.",
      });
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownloadSample = () => {
    toast({
      title: "Đang chuẩn bị file mẫu",
      description: "Hệ thống đang tạo file mẫu cho bạn...",
    });

    window.open(
      "https://static.affina.com.vn/affina/c97f21a9-bde5-4cc9-9c67-a0f8d01fffe4.xlsx",
      "_blank",
    );
  };

  const handleImport = () => {
    const validItems = importData.filter((item) => item.isValid);
    if (validItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Không có dữ liệu hợp lệ",
        description: "Vui lòng kiểm tra lại các dòng bị lỗi.",
      });
      return;
    }

    onImport(validItems);
    onOpenChange(false);
    setImportData([]);
    toast({
      title: "Nhập dữ liệu thành công",
      description: `Đã thêm ${validItems.length} nhân sự mới.`,
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setIsDragging(false);
    }
  };

  const handleDropFileExcel = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange({
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setImportData([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDismiss = () => {
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Nhập nhân sự từ Excel
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-6">
            {/* Sample File Section */}
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <Download
                      className="w-3.5 h-3.5 text-white"
                      strokeWidth={3}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-blue-900">Mẫu file Excel</h4>
                  <p className="text-sm text-blue-700 opacity-80">
                    Tải xuống file mẫu để nhập liệu chính xác
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleDownloadSample}
                className="bg-white hover:bg-blue-50 text-gray-700 border-gray-200 shadow-sm rounded-lg"
              >
                <Download className="w-4 h-4 mr-2 text-gray-500" />
                Tải mẫu
              </Button>
            </div>

            {/* Upload Area */}
            {importData.length === 0 && !isParsing && (
              <div className="flex-1 min-h-[300px] flex items-center justify-center">
                <div
                  onDrop={handleDropFileExcel}
                  onDragOver={(e) => handleDrag(e)}
                  onDragEnter={(e) => handleDrag(e)}
                  onDragLeave={(e) => handleDrag(e)}
                  className={`flex-1 max-w-[95%] min-h-[95%] flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-12 px-6 transition-all duration-200 ${
                    isDragging
                      ? "border-primary bg-primary/5 scale-[1.01]"
                      : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                    <Upload
                      className="w-10 h-10 text-gray-400"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                    Tải lên danh sách nhân sự
                  </h3>
                  <p className="text-sm text-center text-gray-500 max-w-sm mb-8 leading-relaxed">
                    Kéo thả file .xlsx hoặc .xls vào đây để nhập danh sách nhân
                    sự tự động
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-none shadow-none font-medium"
                  >
                    Chọn file
                  </Button>
                </div>
              </div>
            )}

            {isParsing && (
              <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30">
                <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
                <p className="text-gray-500 font-medium">
                  Đang xử lý dữ liệu...
                </p>
              </div>
            )}

            {importData.length > 0 && !isParsing && (
              <div className="flex-1 overflow-hidden">
                <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between border rounded-xl shadow-smm mb-5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm">
                      Dữ liệu đã trích xuất ({importData.length} dòng)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary text-xs h-8"
                    onClick={() => {
                      setImportData([]);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    Tải file khác
                  </Button>
                </div>
                <DataTable
                  columns={columns}
                  data={importData}
                  searchPlaceholder="Tìm trong dữ liệu đã nhập..."
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleDismiss}>
            Hủy
          </Button>
          <Button
            onClick={handleImport}
            disabled={importData.filter((i) => i.isValid).length === 0}
          >
            Xác nhận nhập ({importData.filter((i) => i.isValid).length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
