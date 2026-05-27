export type DeviceStatus = "online" | "offline" | "low_battery" | "error";

export interface DeviceConnectionConfig {
  protocol: 'MQTT' | 'HTTP' | 'CoAP' | 'LoRaWAN';
  endpoint: string;
  authType: 'token' | 'certificate';
  apiKey?: string;
  certificate?: string;
  samplingInterval: number; // seconds
  qos?: 0 | 1 | 2;
  storeAndForward: boolean;
}

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

  // Connection Configuration
  connectionConfig?: DeviceConnectionConfig;

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
