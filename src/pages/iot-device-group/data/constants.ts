import type {
  IoTDeviceGroup,
  IoTDeviceGroupFormData,
  IoTDeviceGroupType,
} from "../types";

export const IOT_DEVICE_TYPE_OPTIONS: IoTDeviceGroupType[] = [
  "Sensor",
  "Actuator",
  "Gateway",
];

export const initialIoTDeviceGroups: IoTDeviceGroup[] = [
  {
    id: 1,
    code: "ENV_SENSOR",
    name: "Nhóm cảm biến môi trường",
    description:
      "Tập hợp các cảm biến nhiệt độ, độ ẩm, ánh sáng và độ ẩm đất phục vụ theo dõi vi khí hậu.",
    deviceTypes: ["Sensor"],
    plannedDeviceCount: 12,
    status: "active",
    createdAt: "2024-03-12",
    updatedAt: "2026-05-24",
  },
  {
    id: 2,
    code: "IRRIGATION_CTRL",
    name: "Nhóm điều khiển tưới",
    description:
      "Quản lý van điện, relay bơm, bộ hẹn giờ và các thiết bị chấp hành cho tưới tự động.",
    deviceTypes: ["Actuator"],
    plannedDeviceCount: 6,
    status: "active",
    createdAt: "2024-03-18",
    updatedAt: "2026-05-27",
  },
  {
    id: 3,
    code: "EDGE_GATEWAY",
    name: "Nhóm gateway biên",
    description:
      "Định tuyến kết nối từ hiện trường lên hệ thống giám sát trung tâm qua MQTT hoặc LoRaWAN.",
    deviceTypes: ["Gateway"],
    plannedDeviceCount: 4,
    status: "active",
    createdAt: "2024-04-01",
    updatedAt: "2026-05-29",
  },
  {
    id: 4,
    code: "LAB_TEST",
    name: "Nhóm thử nghiệm",
    description:
      "Dành cho thiết bị demo, chạy thử firmware và kiểm tra cấu hình trong môi trường sandbox.",
    deviceTypes: ["Controller"],
    plannedDeviceCount: 2,
    status: "inactive",
    createdAt: "2024-04-20",
    updatedAt: "2026-04-15",
  },
];

export const emptyIoTDeviceGroupFormData: IoTDeviceGroupFormData = {
  code: "",
  name: "",
  description: "",
  deviceTypes: ["Sensor"],
  plannedDeviceCount: 1,
  status: "active",
};
