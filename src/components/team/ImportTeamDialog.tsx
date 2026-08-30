import {
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import readXlsxFile from "read-excel-file";

interface ImportTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: any[]) => void;
}

interface TempTeam {
  id: string;
  code: string;
  name: string;
  department: string;
  leader: string;
  status: "active" | "inactive";
  description: string;
  isValid: boolean;
  errors?: string[];
}

export function ImportTeamDialog({
  open,
  onOpenChange,
  onImport,
}: ImportTeamDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importData, setImportData] = useState<TempTeam[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const columns: Column<TempTeam>[] = [
    {
      key: "code",
      label: "Mã đội",
      render: (value, item) => (
        <span className={item.errors?.includes("code") ? "text-red-500" : ""}>
          {value}
        </span>
      ),
    },
    {
      key: "name",
      label: "Tên đội nhóm",
      render: (value, item) => (
        <span className={item.errors?.includes("name") ? "text-red-500" : ""}>
          {value}
        </span>
      ),
    },
    { key: "department", label: "Phòng ban" },
    { key: "leader", label: "Trưởng nhóm" },
    {
      key: "isValid",
      label: "Hiệu lực",
      render: (value) => (
        <div className="flex items-center gap-1">
          {value ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <div className="flex items-center gap-1 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">Lỗi</span>
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
      const headers = rows[0] as string[];
      const dataRows = rows.slice(1);

      const parsedData: TempTeam[] = dataRows.map((row, index) => {
        const rowData: any = {};
        headers.forEach((header, i) => {
          const val = row[i];
          const headerClean = header?.toString().trim().toLowerCase();

          if (headerClean?.includes("mã đội")) rowData.code = val;
          else if (headerClean?.includes("tên đội nhóm")) rowData.name = val;
          else if (headerClean?.includes("phòng ban")) rowData.department = val;
          else if (headerClean?.includes("trưởng nhóm")) rowData.leader = val;
          else if (headerClean?.includes("mô tả")) rowData.description = val;
        });

        const errors: string[] = [];
        if (!rowData.code) errors.push("code");
        if (!rowData.name) errors.push("name");

        return {
          id: `temp-${index}`,
          code: rowData.code || "",
          name: rowData.name || "",
          department: rowData.department || "",
          leader: rowData.leader || "",
          status: "active",
          description: rowData.description || "",
          isValid: errors.length === 0,
          errors,
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
      description: "Hệ thống đang tải file mẫu cho bạn...",
    });

    window.open(
      "https://static.affina.com.vn/affina/4ed118fd-1daf-4c3a-bc0a-ac862ac28484.xlsx",
      "_blank",
    );
  };

  const handleImport = () => {
    const validItems = importData.filter((item) => item.isValid);
    if (validItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Chưa có thông tin hợp lệ",
        description: "Vui lòng kiểm tra lại các dòng bị lỗi.",
      });
      return;
    }

    onImport(validItems);
    onOpenChange(false);
    setImportData([]);
    toast({
      title: "Nhập dữ liệu thành công",
      description: `Đã thêm ${validItems.length} đội nhóm mới.`,
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

  const handleDismiss = () => {
    onOpenChange(false);
    setImportData([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Nhập đội nhóm từ Excel
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
                  onDragOver={handleDrag}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
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
                    Tải lên danh sách đội nhóm
                  </h3>
                  <p className="text-sm text-center text-gray-500 max-w-sm mb-8 leading-relaxed">
                    Kéo thả file .xlsx hoặc .xls vào đây để nhập danh sách đội
                    nhóm tự động
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
                <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between border rounded-xl shadow-sm mb-5">
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
