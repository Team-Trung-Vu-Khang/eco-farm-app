import type { IoTDevice } from "../types";

export const mockIoTDevices: IoTDevice[] = [
  {
    id: "iot-1",
    imei: "IMEI862345001",
    mac: "00:1B:44:11:3A:B7",
    name: "Gateway Trung Tâm - Vùng A",
    type: "Gateway",
    firmwareVersion: "v3.0.1",
    manufacturer: "GreenTech IoT",
    status: "online",
    batteryLevel: 98,
    rssi: -45,
    packetLoss: 0.01,
    uptime: "156d 10h",
    lastHeartbeat: new Date().toISOString(),
    lat: 11.554314,
    lng: 107.129109,
    partyId: "p1",
    farmId: "f1",
  },
  {
    id: "iot-2",
    imei: "IMEI862345002",
    mac: "00:1B:44:11:3A:B8",
    name: "Cảm biến Độ ẩm Đất S01",
    type: "Sensor",
    firmwareVersion: "v2.1.0",
    manufacturer: "GreenTech IoT",
    status: "online",
    batteryLevel: 82,
    rssi: -68,
    packetLoss: 0.15,
    uptime: "45d 2h",
    lastHeartbeat: new Date().toISOString(),
    lat: 11.555,
    lng: 107.130,
    partyId: "p1",
    farmId: "f1",
  },
  {
    id: "iot-3",
    imei: "IMEI862345003",
    mac: "00:1B:44:11:3A:B9",
    name: "Cảm biến Nhiệt độ S02",
    type: "Sensor",
    firmwareVersion: "v2.1.0",
    manufacturer: "GreenTech IoT",
    status: "low_battery",
    batteryLevel: 12,
    rssi: -75,
    packetLoss: 0.8,
    uptime: "45d 2h",
    lastHeartbeat: new Date().toISOString(),
    lat: 11.556,
    lng: 107.131,
    partyId: "p1",
    farmId: "f1",
  },
  {
    id: "iot-4",
    imei: "IMEI862345004",
    mac: "00:1B:44:11:3A:C0",
    name: "Van điều khiển tưới V01",
    type: "Actuator",
    firmwareVersion: "v1.5.0",
    manufacturer: "AgriFlow",
    status: "offline",
    batteryLevel: 0,
    rssi: -95,
    packetLoss: 100,
    uptime: "0d",
    lastHeartbeat: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    lat: 11.557,
    lng: 107.132,
    partyId: "p1",
    farmId: "f1",
  },
  {
    id: "iot-5",
    imei: "IMEI862345005",
    mac: "00:1B:44:11:3A:C1",
    name: "Trạm thời tiết W01",
    type: "Sensor",
    firmwareVersion: "v2.5.2",
    manufacturer: "WeatherStation Pro",
    status: "online",
    batteryLevel: 100, // Solar powered
    rssi: -55,
    packetLoss: 0.05,
    uptime: "210d 5h",
    lastHeartbeat: new Date().toISOString(),
    lat: 11.553,
    lng: 107.128,
    partyId: "p1",
    farmId: "f1",
  }
];

export const generateIoTTelemetry = (base: number, variance: number, points = 24) => {
  const data = [];
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    data.push({
      time: new Date(now.getTime() - i * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: +(base + (Math.random() - 0.5) * variance).toFixed(2),
    });
  }
  return data;
};
