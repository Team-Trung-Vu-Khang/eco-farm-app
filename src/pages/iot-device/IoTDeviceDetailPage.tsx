import React from "react";
import { 
  ArrowLeft, 
  Settings, 
  Activity, 
  LineChart as ChartIcon, 
  Map as MapIcon, 
  History,
  Battery,
  Wifi,
  Zap,
  RefreshCw,
  Power
} from "lucide-react";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  useToast,
  cn
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation, useParams } from "wouter";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { mockDeviceMetrics } from "./data/mockData";
import { DeviceInteractiveMap } from "./components/map/DeviceInteractiveMap";
import useIoTDeviceStore from "../../stores/useIoTDeviceStore";

export default function IoTDeviceDetailPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { devices } = useIoTDeviceStore();
  
  const device = devices.find(d => d.id === id) || devices[0];

  const handleCommand = (command: string) => {
    toast({
      title: "Đang gửi lệnh",
      description: `Lệnh "${command}" đang được gửi tới thiết bị...`,
    });
    
    // Simulate feedback loop
    setTimeout(() => {
      toast({
        title: "Lệnh đã thực thi",
        description: `Thiết bị đã phản hồi thành công lệnh "${command}".`,
        className: "bg-emerald-50 border-emerald-100 text-emerald-900"
      });
    }, 2000);
  };

  return (
    <AdminLayout
      title={device.name}
      description={`Chi tiết thiết bị ${device.type} - ${device.imei}`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setLocation("/iot-device")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Cấu hình
          </Button>
          <Button variant="outline" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-100">
            <Power className="w-4 h-4 mr-2" />
            Ngắt kết nối
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Activity className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</p>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-slate-900">Online</h4>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                <Battery className={cn("w-6 h-6", device.batteryLevel < 20 ? "text-rose-500" : "text-orange-500")} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dung lượng Pin</p>
                <h4 className="text-lg font-bold text-slate-900">{device.batteryLevel}%</h4>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Wifi className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tín hiệu RSSI</p>
                <h4 className="text-lg font-bold text-slate-900">{device.rssi} dBm</h4>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thời gian hoạt động</p>
                <h4 className="text-lg font-bold text-slate-900">{device.uptime}</h4>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="operational" className="w-full">
          <TabsList className="bg-slate-100/50 p-1 rounded-xl mb-6">
            <TabsTrigger value="operational" className="rounded-lg gap-2">
              <Activity className="w-4 h-4" />
              Góc nhìn Kỹ thuật
            </TabsTrigger>
            <TabsTrigger value="tactical" className="rounded-lg gap-2">
              <ChartIcon className="w-4 h-4" />
              Góc nhìn Nông học
            </TabsTrigger>
            <TabsTrigger value="map" className="rounded-lg gap-2">
              <MapIcon className="w-4 h-4" />
              Bản đồ không gian
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg gap-2">
              <History className="w-4 h-4" />
              Lịch sử sự kiện
            </TabsTrigger>
          </TabsList>

          <TabsContent value="operational">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    Sức khỏe kết nối (Gần đây)
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-primary">
                      <RefreshCw className="w-3.5 h-3.5 mr-1" /> Làm mới
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockDeviceMetrics.humidity}>
                      <defs>
                        <linearGradient id="colorRssi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="timestamp" 
                        hide 
                      />
                      <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${v}%`} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRssi)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold">Điều khiển thiết bị</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-between" variant="outline" onClick={() => handleCommand("Kích hoạt thủ công")}>
                      Kích hoạt thủ công
                      <Zap className="w-4 h-4 text-orange-500" />
                    </Button>
                    <Button className="w-full justify-between" variant="outline" onClick={() => handleCommand("Hiệu chuẩn cảm biến")}>
                      Hiệu chuẩn cảm biến
                      <RefreshCw className="w-4 h-4 text-emerald-500" />
                    </Button>
                    <Button className="w-full justify-between" variant="outline" onClick={() => handleCommand("Cập nhật Firmware")}>
                      Cập nhật Firmware
                      <Settings className="w-4 h-4 text-blue-500" />
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-slate-900 text-white">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-slate-300">Thông tin phần cứng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Model</span>
                      <span className="text-xs font-bold font-mono">{device.manufacturer}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Firmware</span>
                      <span className="text-xs font-bold font-mono text-emerald-400">{device.firmwareVersion}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">MAC</span>
                      <span className="text-xs font-bold font-mono">{device.mac}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tactical">
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Biểu đồ Độ ẩm Đất (%)</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockDeviceMetrics.moisture}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(str) => new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        stroke="#94a3b8"
                        fontSize={10}
                      />
                      <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="map">
            <Card className="border-none shadow-sm ring-1 ring-slate-200/50 overflow-hidden">
              <CardContent className="p-0 h-[600px] relative">
                <DeviceInteractiveMap 
                  devices={[device]} 
                  center={[device.lat, device.lng]}
                  zoom={16}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card className="border-none shadow-sm ring-1 ring-slate-200/50">
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {[
                    { time: "10:45 AM", type: "Command", desc: "Lệnh Kích hoạt thủ công đã thực thi", status: "success" },
                    { time: "09:30 AM", type: "Alert", desc: "Cảnh báo pin yếu (15%)", status: "warning" },
                    { time: "Hôm qua", type: "Update", desc: "Đã cập nhật lên Firmware v2.1.0", status: "info" },
                    { time: "02/05/2024", type: "Heartbeat", desc: "Mất kết nối Heartbeat trong 5 phút", status: "error" },
                  ].map((event, idx) => (
                    <div key={idx} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                      <div className="pt-1">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          event.status === "success" ? "bg-emerald-500" :
                          event.status === "warning" ? "bg-orange-500" :
                          event.status === "error" ? "bg-rose-500" : "bg-blue-500"
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{event.type}</span>
                          <span className="text-[10px] font-medium text-slate-400">{event.time}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-700">{event.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
