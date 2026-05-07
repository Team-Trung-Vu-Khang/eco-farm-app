export type DeviceStatus = "online" | "offline" | "low_battery" | "error";

export interface IoTDevice {
  id: string;
  imei: string;
  mac: string;
  name: string;
  type: string;
  firmwareVersion: string;
  manufacturer: string;
  status: DeviceStatus;
  batteryLevel: number;
  rssi: number;
  packetLoss: number;
  uptime: string;
  lastHeartbeat: string;
  lat: number;
  lng: number;

  // Hierarchy context
  partyId: string;
  farmId: string;
  fieldId: string;
  seasonalFieldId: string;
}

export interface MetricData {
  timestamp: string;
  value: number;
}

export interface DeviceMetrics {
  moisture: MetricData[];
  temperature: MetricData[];
  humidity: MetricData[];
}
