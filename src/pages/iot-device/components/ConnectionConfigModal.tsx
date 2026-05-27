import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Label,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Separator,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Settings,
  Network,
  Shield,
  Clock,
  Database,
  Eye,
  EyeOff,
  X,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import type { IoTDevice, DeviceConnectionConfig } from "../types";
import { toast } from "sonner";

interface ConnectionConfigModalProps {
  device: IoTDevice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: DeviceConnectionConfig) => void;
}

export function ConnectionConfigModal({
  device,
  open,
  onOpenChange,
  onSave,
}: ConnectionConfigModalProps) {
  const [showSecret, setShowSecret] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [config, setConfig] = useState<DeviceConnectionConfig>({
    protocol: "MQTT",
    endpoint: "",
    authType: "token",
    apiKey: "",
    certificate: "",
    samplingInterval: 60,
    qos: 1,
    storeAndForward: false,
    ...device.connectionConfig,
  });

  // Reset config when device changes or modal opens
  useEffect(() => {
    if (open) {
      setShowSecret(false);
      setIsTesting(false);
      setTestStatus("idle");
      setConfig({
        protocol: "MQTT",
        endpoint: "",
        authType: "token",
        apiKey: "",
        certificate: "",
        samplingInterval: 60,
        qos: 1,
        storeAndForward: false,
        ...device.connectionConfig,
      });
    }
  }, [open, device.connectionConfig]);

  const handleTestConnection = async () => {
    if (!config.endpoint) {
      toast.error("Vui lòng nhập Endpoint/Broker URL trước khi kiểm tra");
      return;
    }

    setIsTesting(true);
    setTestStatus("idle");

    // Simulate connection check
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3;
      if (success) {
        setTestStatus("success");
        toast.success(`Kết nối tới ${config.protocol} thành công!`);
      } else {
        setTestStatus("error");
        toast.error(
          "Không thể kết nối tới thiết bị. Vui lòng kiểm tra lại cấu hình.",
        );
      }
    } catch (error) {
      setTestStatus("error");
      toast.error("Lỗi hệ thống khi kiểm tra kết nối");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Settings className="w-5 h-5 text-primary" />
            Cấu hình kết nối IoT
          </DialogTitle>
          <p className="text-sm text-slate-500">
            Thiết lập các thông số truyền nhận dữ liệu cho thiết bị{" "}
            {device.name}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Giao thức & Endpoint */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Network className="w-4 h-4 text-blue-500" />
              Giao thức & Địa chỉ
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="protocol">Giao thức kết nối</Label>
                <Select
                  value={config.protocol}
                  onValueChange={(value: any) =>
                    setConfig({ ...config, protocol: value })
                  }
                >
                  <SelectTrigger id="protocol">
                    <SelectValue placeholder="Chọn giao thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MQTT">MQTT</SelectItem>
                    <SelectItem value="HTTP">HTTP/REST</SelectItem>
                    <SelectItem value="CoAP">CoAP</SelectItem>
                    <SelectItem value="LoRaWAN">LoRaWAN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endpoint">Endpoint / Broker URL</Label>
                <Input
                  id="endpoint"
                  placeholder="mqtt://broker.example.com:1883"
                  value={config.endpoint}
                  onChange={(e) =>
                    setConfig({ ...config, endpoint: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Xác thực */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Shield className="w-4 h-4 text-emerald-500" />
              Thông tin xác thực (Security)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="authType">Loại xác thực</Label>
                <Select
                  value={config.authType}
                  onValueChange={(value: any) =>
                    setConfig({ ...config, authType: value })
                  }
                >
                  <SelectTrigger id="authType">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="token">API Key / Token</SelectItem>
                    <SelectItem value="certificate">
                      Digital Certificate (X.509)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {config.authType === "token" ? (
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key / Token</Label>
                  <div className="relative group">
                    <Input
                      id="apiKey"
                      type={showSecret ? "text" : "password"}
                      placeholder="Nhập Token truy cập"
                      className="pr-16"
                      value={config.apiKey}
                      onChange={(e) =>
                        setConfig({ ...config, apiKey: e.target.value })
                      }
                    />
                    <div
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 flex items-center gap-1",
                        config.apiKey ? "right-8" : "right-2",
                      )}
                    >
                      <button
                        type="button"
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        onClick={() => setShowSecret(!showSecret)}
                      >
                        {showSecret ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="certificate">Chuỗi chứng chỉ (X.509)</Label>
                  <div className="relative group">
                    <Input
                      id="certificate"
                      type={showSecret ? "text" : "password"}
                      placeholder="-----BEGIN CERTIFICATE-----"
                      className="pr-16"
                      value={config.certificate}
                      onChange={(e) =>
                        setConfig({ ...config, certificate: e.target.value })
                      }
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        onClick={() => setShowSecret(!showSecret)}
                      >
                        {showSecret ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      {config.certificate && (
                        <button
                          type="button"
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          onClick={() =>
                            setConfig({ ...config, certificate: "" })
                          }
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Hiệu năng & QoS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Clock className="w-4 h-4 text-orange-500" />
              Chu kỳ & Chất lượng dịch vụ
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="samplingInterval">
                  Nhịp đập / Chu kỳ gửi tin (giây)
                </Label>
                <Input
                  id="samplingInterval"
                  type="number"
                  min={1}
                  value={config.samplingInterval}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      samplingInterval: parseInt(e.target.value) || 60,
                    })
                  }
                />
              </div>
              {config.protocol === "MQTT" && (
                <div className="space-y-2">
                  <Label htmlFor="qos">Quality of Service (QoS)</Label>
                  <Select
                    value={config.qos?.toString()}
                    onValueChange={(value) =>
                      setConfig({ ...config, qos: parseInt(value) as any })
                    }
                  >
                    <SelectTrigger id="qos">
                      <SelectValue placeholder="Chọn mức QoS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 - At most once</SelectItem>
                      <SelectItem value="1">1 - At least once</SelectItem>
                      <SelectItem value="2">2 - Exactly once</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Lưu trữ & Chuyển tiếp */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Lưu trữ và Chuyển tiếp (Store-and-forward)
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Cho phép thiết bị tự lưu dữ liệu khi mất kết nối và gửi lại
                  khi có mạng.
                </p>
              </div>
            </div>
            <Switch
              checked={config.storeAndForward}
              onCheckedChange={(checked) =>
                setConfig({ ...config, storeAndForward: checked })
              }
            />
          </div>

          {/* Nút bấm kiểm tra kết nối */}
          <div className="flex flex-col gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-primary">
                Kiểm tra trạng thái kết nối
              </div>
              {testStatus === "success" && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  KẾT NỐI TỐT
                </div>
              )}
              {testStatus === "error" && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full border border-rose-100">
                  <XCircle className="w-3.5 h-3.5" />
                  LỖI KẾT NỐI
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full bg-white hover:bg-slate-50 border-primary/20 text-primary hover:text-primary",
                isTesting && "opacity-70 pointer-events-none",
              )}
              onClick={handleTestConnection}
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang kiểm tra...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Kiểm tra kết nối ngay
                </>
              )}
            </Button>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="px-8 bg-primary hover:bg-primary/90"
            >
              Lưu cấu hình
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
