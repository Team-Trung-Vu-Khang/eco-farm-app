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
} from "@tankhang1/eco-shared-ui";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Download,
} from "lucide-react";
import readXlsxFile from "read-excel-file";
import type { Plant } from "@/pages/region-chart/constants";
import usePlantStore from "@/stores/usePlantStore";
import { useLocation } from "wouter";

interface ImportPlantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TempPlant extends Partial<Plant> {
  id: string; // Temporary ID for table
  isValid: boolean;
  errors?: string[];
}

export function ImportPlantDialog({
  open,
  onOpenChange,
}: ImportPlantDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importData, setImportData] = useState<TempPlant[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const { setImportedPlants } = usePlantStore();
  const [, setLocation] = useLocation();

  const columns: Column<TempPlant>[] = [
    {
      key: "height",
      label: "Chiều cao (m)",
      render: (value, item) => (
        <span
          className={
            item.errors?.includes("height") ? "text-red-500 font-medium" : ""
          }
        >
          {value || "-"}
        </span>
      ),
    },
    {
      key: "ageValue",
      label: "Độ tuổi",
      render: (value, item) => (
        <span
          className={
            item.errors?.includes("ageValue") ? "text-red-500 font-medium" : ""
          }
        >
          {value || "-"}
        </span>
      ),
    },
    {
      key: "ageUnit",
      label: "Đơn vị tuổi",
      render: (value) => (
        <span>
          {value === "days" ? "Ngày" : value === "months" ? "Tháng" : "Năm"}
        </span>
      ),
    },
    {
      key: "plantedDate",
      label: "Ngày trồng",
      render: (value, item) => (
        <span
          className={
            item.errors?.includes("plantedDate")
              ? "text-red-500 font-medium"
              : ""
          }
        >
          {value || "-"}
        </span>
      ),
    },
    { key: "note", label: "Ghi chú" },
    {
      key: "isValid",
      label: "Trạng thái",
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
      // Assuming headers are in the first row
      const headers = rows[0] as string[];
      const dataRows = rows.slice(1);

      const parsedData: TempPlant[] = dataRows.map((row, index) => {
        const rowData: any = {};

        headers.forEach((header, i) => {
          const val = row[i];

          const headerClean = header?.toString().trim().toLowerCase();

          if (
            headerClean?.includes("chiều cao") ||
            headerClean?.includes("cao")
          ) {
            rowData.height = val?.toString();
          } else if (
            headerClean?.includes("độ tuổi") ||
            headerClean?.includes("tuổi")
          ) {
            rowData.ageValue = val?.toString();
          } else if (
            headerClean?.includes("đơn vị") ||
            headerClean?.includes("đvt")
          ) {
            // Normalize unit
            const unit = val?.toString().trim().toLowerCase();
            if (unit === "ngày" || unit === "days" || unit === "day")
              rowData.ageUnit = "days";
            else if (unit === "tháng" || unit === "months" || unit === "month")
              rowData.ageUnit = "months";
            else rowData.ageUnit = "years"; // Default to years
          } else if (headerClean?.includes("ngày trồng")) {
            // handle date
            if (val instanceof Date) {
              rowData.plantedDate = val.toISOString().split("T")[0];
            } else if (typeof val === "string") {
              // Try to parse string date DD/MM/YYYY or similar if needed, basic fallback here
              try {
                const d = new Date(val);
                if (!isNaN(d.getTime())) {
                  rowData.plantedDate = d.toISOString().split("T")[0];
                } else {
                  rowData.plantedDate = val; // let user see invalid date
                }
              } catch (e) {
                rowData.plantedDate = val;
              }
            } else if (typeof val === "number") {
              // Excel dates are numbers (days since 1900)
              const date = new Date((val - (25567 + 2)) * 86400 * 1000);
              rowData.plantedDate = date.toISOString().split("T")[0];
            }
          } else if (headerClean?.includes("ghi chú")) {
            rowData.note = val?.toString();
          }
        });

        // Validation
        const errors: string[] = [];
        // Optionally validate missing required fields if requested. For now, height/age might be optional,
        // but let's check basic sanity
        if (rowData.height && isNaN(Number(rowData.height))) {
          errors.push("height");
        }
        if (rowData.ageValue && isNaN(Number(rowData.ageValue))) {
          errors.push("ageValue");
        }

        return {
          id: `temp-${index}`,
          height: rowData.height || "",
          ageValue: rowData.ageValue || "",
          ageUnit: rowData.ageUnit || "years",
          plantedDate:
            rowData.plantedDate || new Date().toISOString().split("T")[0],
          note: rowData.note || "",
          isValid: errors.length === 0,
          errors,
        };
      });

      setImportData(parsedData);
      toast({
        title: "Tải file thành công",
        description: `Đã đọc được ${parsedData.length} dòng dữ liệu cây trồng.`,
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
      "https://static.affina.com.vn/affina/92d3b727-9048-4a39-abc1-94aaf52db7a3.xlsx",
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

    // Pass valid items to store
    // Remove temporary id, isValid, errors properties
    const plantsToImport = validItems.map(
      ({ id, isValid, errors, ...rest }) => rest,
    );

    setImportedPlants(plantsToImport);
    onOpenChange(false);
    setImportData([]);

    toast({
      title: "Chuyển dữ liệu thành công",
      description: `Đang chuyển đến trang tạo mới với ${validItems.length} cây.`,
    });

    // Redirect to create page
    setLocation("/plant-identification/create");
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
            Nhập danh sách cây trồng từ Excel
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-6">
            {/* Sample File Section */}
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                    <Download
                      className="w-3.5 h-3.5 text-white"
                      strokeWidth={3}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-bold text-green-900">Mẫu file Excel</h4>
                  <p className="text-sm text-green-700 opacity-80">
                    Tải xuống file mẫu (Gồm: Chiều cao, Độ tuổi, Đơn vị tuổi,
                    Ngày trồng, Ghi chú)
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleDownloadSample}
                className="bg-white hover:bg-green-50 text-gray-700 border-gray-200 shadow-sm rounded-lg"
              >
                <Download className="w-4 h-4 mr-2 text-gray-500" />
                Tải mẫu
              </Button>
            </div>

            {/* Upload Area */}
            {importData.length === 0 && !isParsing && (
              <div className="flex-1 min-h-75 flex items-center justify-center">
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
                    Tải lên danh sách cây trồng
                  </h3>
                  <p className="text-sm text-center text-gray-500 max-w-sm mb-8 leading-relaxed">
                    Kéo thả file .xlsx hoặc .xls vào đây để trích xuất dữ liệu
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
              <div className="flex-1 min-h-75 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30">
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
            Chuyển đến tạo mới ({importData.filter((i) => i.isValid).length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
