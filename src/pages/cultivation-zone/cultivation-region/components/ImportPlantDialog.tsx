import type { Plant } from "@/pages/region-chart/constants";
import {
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import * as XLSX from "xlsx";
import { useSeeds } from "@/features/farm";
import {
  PLANT_HEALTH_STATUS_LABELS,
  type PlantHealthStatus,
  type VarietyOption,
} from "./types";

interface ImportPlantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (plants: Partial<Plant>[]) => void;
  /** Giống cây (Foundation) của vùng canh tác chọn ở bước 1 */
  productionVarietyOptions?: VarietyOption[];
}

interface TempPlant extends Partial<Plant> {
  id: string; // Temporary ID for table
  isValid: boolean;
  errors?: string[];
}

/** Tiêu đề cột của file mẫu — phải khớp với phần nhận diện cột khi đọc file */
export const SAMPLE_HEADERS = [
  "Chiều cao (m)",
  "Độ tuổi",
  "Đơn vị tuổi",
  "Ngày trồng",
  "Vĩ độ",
  "Kinh độ",
  "Hiện trạng sức khỏe",
  "Ghi chú",
];

/**
 * Chuẩn hoá cột "Hiện trạng sức khỏe" trong Excel.
 * Nhận cả nhãn tiếng Việt lẫn mã enum của API; giá trị lạ trả undefined
 * (coi như chưa đánh giá) thay vì làm hỏng cả dòng.
 */
const parseHealthStatus = (raw?: string): PlantHealthStatus | undefined => {
  const value = raw?.trim().toLowerCase();
  if (!value) return undefined;

  const byLabel: Record<string, PlantHealthStatus> = {
    "khỏe mạnh": "HEALTHY",
    "khoẻ mạnh": "HEALTHY",
    bệnh: "PEST",
    "mắc bệnh": "PEST",
    "thu hoạch": "HARVESTED",
    "đã thu hoạch": "HARVESTED",
    "đang điều trị": "TREATING",
    "đã chết": "DEAD",
  };

  const byCode = value.toUpperCase();
  if (byCode in PLANT_HEALTH_STATUS_LABELS) {
    return byCode as PlantHealthStatus;
  }

  return byLabel[value];
};

export function ImportPlantDialog({
  open,
  onOpenChange,
  onImport,
  productionVarietyOptions = [],
}: ImportPlantDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importData, setImportData] = useState<TempPlant[]>([]);
  // Giống cây áp cho toàn bộ cây trong file. Chưa chọn thì mặc định lấy giống
  // đầu tiên của vùng; hạt giống cascade theo giống đang chọn (tùy chọn).
  const [selectedProductionVariantId, setSelectedProductionVariantId] =
    useState("");
  const [selectedSubjectVariantId, setSelectedSubjectVariantId] = useState("");
  const productionVariantId =
    selectedProductionVariantId || productionVarietyOptions[0]?.id || "";

  const productionVariantNumber = productionVariantId
    ? Number(productionVariantId)
    : undefined;
  const { items: seedOptions, loading: seedsLoading } = useSeeds({
    params: productionVariantNumber
      ? {
          foundationSubjectVariantId: productionVariantNumber,
          status: "active",
          size: 100,
        }
      : undefined,
    enabled: !!productionVariantNumber,
    staleTime: 15_000,
  });
  const subjectVariantId = selectedSubjectVariantId || "";
  const [isParsing, setIsParsing] = useState(false);

  const columns: Column<TempPlant>[] = [
    {
      key: "height",
      label: "Chiều cao (m)",
      render: (value: any, item) => (
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
      render: (value: any, item) => (
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
      render: (value: any, item) => (
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
    {
      key: "coordinate",
      label: "Tọa độ",
      render: (_, item) => (
        <span
          className={
            item.errors?.includes("coordinate")
              ? "text-red-500 font-medium font-mono text-xs block truncate max-w-28"
              : "font-mono text-xs block truncate max-w-28"
          }
        >
          {item.coordinate?.lat && item.coordinate?.lng
            ? `${item.coordinate.lat}, ${item.coordinate.lng}`
            : "Thiếu"}
        </span>
      ),
    },
    {
      key: "healthStatus",
      label: "Hiện trạng",
      render: (value: unknown) =>
        value ? (
          <span className="text-xs font-medium text-slate-700">
            {PLANT_HEALTH_STATUS_LABELS[value as string] ?? String(value)}
          </span>
        ) : (
          <span className="text-xs italic text-slate-400">Chưa đánh giá</span>
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
            // "Đơn vị tuổi" phải xét trước "Độ tuổi": cả hai đều chứa "tuổi",
            // để sau sẽ bị nhánh độ tuổi nuốt mất.
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
          } else if (
            headerClean?.includes("độ tuổi") ||
            headerClean?.includes("tuổi")
          ) {
            rowData.ageValue = val?.toString();
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
          } else if (
            headerClean?.includes("sức khỏe") ||
            headerClean?.includes("sức khoẻ") ||
            headerClean?.includes("hiện trạng")
          ) {
            rowData.healthStatus = parseHealthStatus(val?.toString());
          } else if (headerClean?.includes("ghi chú")) {
            rowData.note = val?.toString();
          } else if (headerClean?.includes("vĩ độ") || headerClean === "lat") {
            rowData.lat = parseFloat(val?.toString());
          } else if (
            headerClean?.includes("kinh độ") ||
            headerClean === "lng"
          ) {
            rowData.lng = parseFloat(val?.toString());
          }
        });

        // Validation
        const errors: string[] = [];
        if (rowData.height && isNaN(Number(rowData.height))) {
          errors.push("height");
        }
        if (rowData.ageValue && isNaN(Number(rowData.ageValue))) {
          errors.push("ageValue");
        }
        if (
          isNaN(rowData.lat) ||
          isNaN(rowData.lng) ||
          !rowData.lat ||
          !rowData.lng
        ) {
          errors.push("coordinate");
        }

        return {
          id: `temp-${index}`,
          height: rowData.height || "",
          ageValue: rowData.ageValue || "",
          ageUnit: rowData.ageUnit || "years",
          plantedDate:
            rowData.plantedDate || new Date().toISOString().split("T")[0],
          note: rowData.note || "",
          healthStatus: rowData.healthStatus || undefined,
          coordinate: {
            lat: rowData.lat || 0,
            lng: rowData.lng || 0,
          },
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

  /**
   * Sinh file mẫu ngay tại trình duyệt thay vì tải từ link tĩnh, để các cột
   * luôn khớp với phần đọc file bên dưới (thêm cột nào thì mẫu có cột đó).
   */
  const handleDownloadSample = () => {
    const today = new Date().toISOString().split("T")[0];

    const rows = [
      SAMPLE_HEADERS,
      [
        "2.5",
        "18",
        "months",
        today,
        "11.5460",
        "106.8938",
        "Khỏe mạnh",
        "Cây đầu dòng",
      ],
      ["1.8", "2", "years", today, "11.5472", "106.8951", "Bệnh", ""],
      [
        "3.1",
        "400",
        "days",
        today,
        "11.5485",
        "106.8964",
        "",
        "Chưa đánh giá sức khỏe",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet["!cols"] = SAMPLE_HEADERS.map((header) => ({
      wch: Math.max(header.length + 4, 14),
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách cây trồng");
    XLSX.writeFile(workbook, "mau-danh-sach-cay-trong.xlsx");

    toast({
      title: "Đã tải file mẫu",
      description: "Điền dữ liệu theo đúng tiêu đề cột rồi tải lên lại.",
    });
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

    // Pass valid items exactly as required
    // Remove temporary id, isValid, errors properties
    const presetVariety = productionVarietyOptions.find(
      (o) => o.id === productionVariantId,
    );
    const presetSeed = seedOptions.find(
      (s) => String(s.id) === subjectVariantId,
    );
    const plantsToImport = validItems.map(
      ({ id, isValid, errors, ...rest }) => ({
        ...rest,
        productionVariantId: productionVariantId || undefined,
        productionVariantName: productionVariantId ? presetVariety?.name : "",
        subjectVariantId: subjectVariantId || undefined,
        subjectVariantName: subjectVariantId ? presetSeed?.name : "",
      }),
    );

    onImport(plantsToImport);
    onOpenChange(false);
    setImportData([]);

    toast({
      title: "Chuyển dữ liệu thành công",
      description: `Đã đưa ${validItems.length} cây vào danh sách thêm mới.`,
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
                    Ngày trồng, Vĩ độ, Kinh độ, Hiện trạng sức khỏe, Ghi chú)
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

            {/* Giống cây + Hạt giống áp cho toàn bộ cây trong file */}
            {productionVarietyOptions.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">
                    Giống cây áp dụng cho toàn bộ cây{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={productionVariantId}
                    onValueChange={(val) => {
                      setSelectedProductionVariantId(val);
                      setSelectedSubjectVariantId(""); // đổi giống → reset hạt
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giống cây" />
                    </SelectTrigger>
                    <SelectContent>
                      {productionVarietyOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                          {option.code ? ` (${option.code})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">
                    Hạt giống áp dụng cho toàn bộ cây{" "}
                    <span className="text-slate-400 font-normal">
                      (tùy chọn)
                    </span>
                  </Label>
                  <Select
                    value={subjectVariantId}
                    onValueChange={setSelectedSubjectVariantId}
                    disabled={!productionVariantNumber || seedOptions.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !productionVariantNumber
                            ? "Chọn giống cây trước"
                            : seedsLoading
                              ? "Đang tải hạt giống..."
                              : seedOptions.length === 0
                                ? "Giống này chưa có hạt giống"
                                : "Chọn hạt giống"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {seedOptions.map((seed) => (
                        <SelectItem
                          key={seed.id}
                          value={String(seed.id)}
                        >
                          {seed.name || seed.code || `Hạt giống #${seed.id}`}
                          {seed.code && seed.name ? ` (${seed.code})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

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
            Nhập vào danh sách ({importData.filter((i) => i.isValid).length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
