export type IoTDeviceGroupStatus = "active" | "inactive";

export type IoTDeviceGroupType = "Sensor" | "Actuator" | "Gateway" | "Controller";

export interface IoTDeviceGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  deviceTypes: IoTDeviceGroupType[];
  plannedDeviceCount: number;
  status: IoTDeviceGroupStatus;
  createdAt: string;
  updatedAt: string;
}

export type IoTDeviceGroupFormData = Omit<
  IoTDeviceGroup,
  "id" | "createdAt" | "updatedAt"
>;
