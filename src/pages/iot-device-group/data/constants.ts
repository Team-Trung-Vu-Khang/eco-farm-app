import type { IoTDeviceGroupFormValues } from "./iot-device-group-form.schema";
import type { IoTDeviceGroupType } from "../types";

export const IOT_DEVICE_TYPE_OPTIONS: IoTDeviceGroupType[] = [
  "Sensor",
  "Actuator",
  "Gateway",
  "Controller",
];

export const emptyIoTDeviceGroupFormData: IoTDeviceGroupFormValues = {
  code: "",
  name: "",
  description: "",
  status: "active",
};

