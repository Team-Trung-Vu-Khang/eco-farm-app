import type { IoTDevice } from "../types";

export const mockDevices: IoTDevice[] = [
  {
    id: "1",
    imei: "IMEI862345001",
    mac: "00:1B:44:11:3A:B7",
    name: "Cảm biến Độ ẩm A1",
    type: "Sensor",
    firmwareVersion: "v2.1.0",
    manufacturer: "GreenTech IoT",
    status: "online",
    batteryLevel: 85,
    rssi: -65,
    packetLoss: 0.2,
    uptime: "12d 4h 22m",
    lastHeartbeat: "2024-05-07T22:45:00Z",
    lat: 11.9416,
    lng: 108.4583,
    partyId: "p1",
    farmId: "f1",
    fieldId: "fi1",
    seasonalFieldId: "sf1",
  },
  {
    id: "2",
    imei: "IMEI862345002",
    mac: "00:1B:44:11:3A:B8",
    name: "Cảm biến Nhiệt độ A2",
    type: "Sensor",
    firmwareVersion: "v2.1.0",
    manufacturer: "GreenTech IoT",
    status: "online",
    batteryLevel: 92,
    rssi: -70,
    packetLoss: 0.5,
    uptime: "45d 2h 10m",
    lastHeartbeat: "2024-05-07T22:44:30Z",
    lat: 11.942,
    lng: 108.459,
    partyId: "p1",
    farmId: "f1",
    fieldId: "fi1",
    seasonalFieldId: "sf1",
  },
  {
    id: "3",
    imei: "IMEI862345003",
    mac: "00:1B:44:11:3A:B9",
    name: "Van điều khiển tưới V1",
    type: "Actuator",
    firmwareVersion: "v1.0.5",
    manufacturer: "AgriFlow",
    status: "low_battery",
    batteryLevel: 12,
    rssi: -82,
    packetLoss: 2.1,
    uptime: "8d 14h 55m",
    lastHeartbeat: "2024-05-07T22:40:00Z",
    lat: 11.941,
    lng: 108.457,
    partyId: "p1",
    farmId: "f1",
    fieldId: "fi1",
    seasonalFieldId: "sf1",
  },
];

export const generateTimeMetrics = (
  baseValue: number,
  variance: number,
  points: number,
) => {
  const data = [];
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 15 * 60000);
    data.push({
      timestamp: time.toISOString(),
      value: baseValue + (Math.random() - 0.5) * variance,
    });
  }
  return data;
};

export const mockDeviceMetrics = {
  moisture: generateTimeMetrics(45, 5, 24),
  temperature: generateTimeMetrics(24, 4, 24),
  humidity: generateTimeMetrics(70, 10, 24),
};
