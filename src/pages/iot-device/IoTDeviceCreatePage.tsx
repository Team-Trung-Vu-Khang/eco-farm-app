import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  FileText,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import readXlsxFile from "read-excel-file";
import { useLocation, useParams } from "wouter";
import useIoTDeviceStore from "../../stores/useIoTDeviceStore";
import type { IoTDevice } from "./types";

export default function IoTDeviceCreatePage() {
  const { id } = useParams();
  const isEdit = !!id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");

  const { devices, addDevice, updateDevice, addDevices } = useIoTDeviceStore();

  const device = useMemo(() => {
    return isEdit ? devices.find((d) => d.id === id) : null;
  }, [isEdit, id, devices]);

  useEffect(() => {
    if (device) {
      setSelectedType(device.type.toLowerCase());
    } else {
      setSelectedType("sensor");
    }
  }, [device]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const deviceData = {
      name: formData.get("name") as string,
      type: selectedType,
      imei: formData.get("imei") as string,
      mac: formData.get("mac") as string,
      firmwareVersion: formData.get("firmware") as string,
      manufacturer: formData.get("manufacturer") as string,
    };

    if (isEdit && id) {
      updateDevice(id, deviceData);
    } else {
      const newDevice: IoTDevice = {
        id: Math.random().toString(36).substr(2, 9),
        ...deviceData,
        status: "online",
        batteryLevel: 100,
        rssi: -45,
        packetLoss: 0,
        uptime: "0d 0h 0m",
        lastHeartbeat: new Date().toISOString(),
        lat: 10.762622,
        lng: 106.660172,
        partyId: "p1",
        farmId: "f1",
        fieldId: "fi1",
        seasonalFieldId: "sf1",
      };
      addDevice(newDevice);
    }

    toast({
      title: isEdit ? "Cập nhật thành công" : "Đăng ký thành công",
      description: isEdit
        ? "Thông tin thiết bị đã được cập nhật."
        : "Thiết bị mới đã được thêm vào hệ thống.",
    });
    setLocation("/iot-device");
  };

  const handleDownloadSample = () => {
    toast({
      title: "Đang tải file mẫu",
      description: "File mẫu sẽ được tải xuống máy tính của bạn.",
    });

    window.open(
      "https://static.affina.com.vn/affina/71c6908f-a60a-4e68-afef-a7efa739b198.xlsx",
      "_blank",
    );
  };

  const handleFileUpload = async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { files: FileList | null } },
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const isValidFile = ["csv", "xlsx", "xls"].includes(fileExtension || "");

    if (!isValidFile) {
      setUploadError(
        "Định dạng file không hợp lệ. Vui lòng sử dụng .csv, .xlsx hoặc .xls",
      );
      toast({
        variant: "destructive",
        title: "Định dạng file không hợp lệ",
        description:
          "Vui lòng chỉ tải lên các file có định dạng .csv, .xlsx hoặc .xls",
      });
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);

    try {
      const rows = await readXlsxFile(file);
      const headers = rows[0] as string[];
      const dataRows = rows.slice(1);

      const parsedData = dataRows.map((row, index) => {
        const rowData: any = {};
        headers.forEach((header, i) => {
          const val = row[i];
          const headerClean = header?.toString().trim().toLowerCase();

          if (headerClean?.includes("tên thiết bị")) rowData.name = val;
          else if (headerClean?.includes("loại thiết bị")) {
            const typeVal = val?.toString().toLowerCase();
            if (typeVal?.includes("sensor") || typeVal?.includes("cảm biến"))
              rowData.type = "sensor";
            else if (
              typeVal?.includes("actuator") ||
              typeVal?.includes("điều khiển")
            )
              rowData.type = "actuator";
            else if (typeVal?.includes("gateway") || typeVal?.includes("cổng"))
              rowData.type = "gateway";
            else rowData.type = "sensor";
          } else if (
            headerClean?.includes("imei") ||
            headerClean?.includes("serial")
          )
            rowData.imei = val?.toString();
          else if (headerClean?.includes("mac")) rowData.mac = val?.toString();
          else if (headerClean?.includes("firmware"))
            rowData.firmwareVersion = val?.toString();
          else if (headerClean?.includes("nhà sản xuất"))
            rowData.manufacturer = val?.toString();
        });

        return {
          id: `temp-${index}`,
          name: rowData.name || `Thiết bị ${index + 1}`,
          type: rowData.type || "sensor",
          imei: rowData.imei || "",
          mac: rowData.mac || "",
          firmwareVersion: rowData.firmwareVersion || "",
          manufacturer: rowData.manufacturer || "",
          isValid: !!rowData.imei,
        };
      });

      setImportData(parsedData);
      toast({
        title: "Tải file thành công",
        description: `Đã đọc được ${parsedData.length} thiết bị từ file.`,
      });
    } catch (error) {
      console.error("Error parsing Excel:", error);
      setUploadError(
        "Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng dữ liệu.",
      );
      toast({
        variant: "destructive",
        title: "Lỗi đọc file",
        description:
          "Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng.",
      });
    } finally {
      setIsUploading(false);
    }
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload({
        target: { files },
      });
    }
  };

  const handleBulkSubmit = () => {
    const validItems = importData.filter((item) => item.isValid);
    if (validItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Không có dữ liệu hợp lệ",
        description: "Vui lòng kiểm tra lại file. Cần có ít nhất cột IMEI.",
      });
      return;
    }

    toast({
      title: "Đăng ký hàng loạt thành công",
      description: `${validItems.length} thiết bị đã được thêm vào hệ thống.`,
    });

    const newDevices: IoTDevice[] = validItems.map((item) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      status: "online",
      batteryLevel: 100,
      rssi: -50,
      packetLoss: 0,
      uptime: "0d 0h 0m",
      lastHeartbeat: new Date().toISOString(),
      lat: 10.762622,
      lng: 106.660172,
      partyId: "p1",
      farmId: "f1",
      fieldId: "fi1",
      seasonalFieldId: "sf1",
    }));

    addDevices(newDevices);
    setLocation("/iot-device");
  };

  return (
    <AdminLayout
      isDev={true}
      title={isEdit ? "Cập nhật thiết bị" : "Đăng ký thiết bị"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin thiết bị ${device?.name}`
          : "Thêm thiết bị IoT mới vào hệ thống quản lý"
      }
      actions={
        <Button variant="ghost" onClick={() => setLocation("/iot-device")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="flex-1" value="manual">
              Đăng ký thủ công
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="bulk">
              Đăng ký hàng loạt (CSV/Excel)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <Card className="border-none shadow-sm ring-1 ring-slate-200/50 rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  Thông tin thiết bị
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form
                  onSubmit={handleManualSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên thiết bị</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ví dụ: Cảm biến độ ẩm A1"
                      defaultValue={device?.name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Loại thiết bị</Label>
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sensor">
                          Cảm biến (Sensor)
                        </SelectItem>
                        <SelectItem value="actuator">
                          Bộ điều khiển (Actuator)
                        </SelectItem>
                        <SelectItem value="gateway">
                          Cổng kết nối (Gateway)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imei">IMEI / Serial Number</Label>
                    <Input
                      id="imei"
                      name="imei"
                      placeholder="Nhập mã định danh duy nhất"
                      defaultValue={device?.imei}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mac">Địa chỉ MAC</Label>
                    <Input
                      id="mac"
                      name="mac"
                      placeholder="XX:XX:XX:XX:XX:XX"
                      defaultValue={device?.mac}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firmware">Phiên bản Firmware</Label>
                    <Input
                      id="firmware"
                      name="firmware"
                      placeholder="Ví dụ: v1.0.0"
                      defaultValue={device?.firmwareVersion}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Nhà sản xuất</Label>
                    <Input
                      id="manufacturer"
                      name="manufacturer"
                      placeholder="Tên công ty sản xuất"
                      defaultValue={device?.manufacturer}
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <Separator className="mb-6 bg-slate-100" />
                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setLocation("/iot-device")}
                      >
                        Hủy bỏ
                      </Button>
                      <Button type="submit" className="px-8">
                        {isEdit ? "Cập nhật" : "Đăng ký ngay"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk">
            <Card className="border-none shadow-sm ring-1 ring-slate-200/50 rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 text-center py-10">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Tải lên danh sách thiết bị
                </CardTitle>
                <p className="text-sm text-slate-500 mt-2">
                  Hỗ trợ định dạng .csv, .xlsx. Tối đa 500 thiết bị mỗi lần.
                </p>
              </CardHeader>
              <CardContent className="p-10">
                {uploadError && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-bold">Lỗi tải file</p>
                      <p className="opacity-90">{uploadError}</p>
                    </div>
                  </div>
                )}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDrag}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300",
                    isDragging
                      ? "border-primary bg-primary/5 scale-[1.01]"
                      : uploadedFile
                        ? "border-emerald-200 bg-emerald-50/30"
                        : "border-slate-200 hover:border-primary/50 hover:bg-slate-50/50",
                  )}
                >
                  {!uploadedFile ? (
                    <div className="space-y-4">
                      <p className="text-slate-600">
                        Kéo thả file vào đây hoặc
                      </p>
                      <Label
                        htmlFor="file-upload"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 cursor-pointer transition-colors"
                      >
                        Chọn file từ máy tính
                      </Label>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".csv,.xlsx"
                        onChange={handleFileUpload}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-emerald-100 mb-6">
                        <FileText className="w-8 h-8 text-emerald-500" />
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-900">
                            {uploadedFile.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 ml-4"
                          onClick={() => {
                            setUploadedFile(null);
                            setImportData([]);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {importData.length > 0 && (
                        <div className="w-full mb-8 max-h-[300px] overflow-auto border border-slate-100 rounded-xl">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 sticky top-0">
                              <tr>
                                <th className="px-4 py-3 font-bold">IMEI</th>
                                <th className="px-4 py-3 font-bold">
                                  Tên thiết bị
                                </th>
                                <th className="px-4 py-3 font-bold">Loại</th>
                                <th className="px-4 py-3 font-bold text-center">
                                  Hợp lệ
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {importData.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="px-4 py-3 font-mono text-xs">
                                    {item.imei || "Thiếu IMEI"}
                                  </td>
                                  <td className="px-4 py-3">{item.name}</td>
                                  <td className="px-4 py-3 capitalize">
                                    {item.type}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {item.isValid ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                                    ) : (
                                      <span className="text-rose-500 text-xs font-bold">
                                        Lỗi
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-8">
                        <CheckCircle2 className="w-4 h-4" />
                        Sẵn sàng để đăng ký (
                        {importData.filter((i) => i.isValid).length} thiết bị
                        hợp lệ)
                      </div>
                      <Button
                        className="px-12 py-6 text-base"
                        onClick={handleBulkSubmit}
                        disabled={isUploading || !!uploadError}
                      >
                        {isUploading
                          ? "Đang xử lý..."
                          : "Bắt đầu đăng ký hàng loạt"}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-10 bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Hướng dẫn đăng ký hàng loạt
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                    <li>
                      Sử dụng file mẫu để đảm bảo dữ liệu chính xác.{" "}
                      <button
                        onClick={handleDownloadSample}
                        className="text-primary hover:underline font-medium"
                      >
                        Tải file mẫu tại đây
                      </button>
                      .
                    </li>
                    <li>Cột IMEI và Loại thiết bị là bắt buộc.</li>
                    <li>
                      Nếu thiết bị đã tồn tại, hệ thống sẽ tự động bỏ qua hoặc
                      cập nhật tùy cấu hình.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
