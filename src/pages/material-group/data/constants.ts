import type {
  MaterialGroup,
  MaterialGroupFormData,
} from "../types/types";
import type { MaterialGroupFormValues } from "./material-group-form.schema";

export const initialMaterialGroups: MaterialGroup[] = [
  {
    id: 1,
    code: "HAND_TOOL",
    name: "Công cụ cầm tay",
    description: "Cuốc, xẻng, liềm, kéo tỉa cành, dao cắt",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "IRRIGATION",
    name: "Hệ thống tưới",
    description: "Ống tưới, vòi phun, máy bơm nước, hệ thống tưới nhỏ giọt",
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "PROTECTIVE",
    name: "Bảo hộ lao động",
    description: "Găng tay, khẩu trang, quần áo bảo hộ, giày ủng",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    code: "PACKAGING",
    name: "Bao bì đóng gói",
    description: "Bao PP, thùng carton, lưới, túi nilon, rổ nhựa",
    status: "active",
    createdAt: "2024-01-13",
  },
  {
    id: 5,
    code: "GREENHOUSE",
    name: "Vật tư nhà kính",
    description: "Màng phủ, lưới che nắng, khung nhà kính, hệ thống thông gió",
    status: "active",
    createdAt: "2024-01-14",
  },
  {
    id: 6,
    code: "SUPPORT",
    name: "Vật tư hỗ trợ",
    description: "Dây buộc, cọc tre, giàn leo, lưới chống côn trùng",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 7,
    code: "MEASUREMENT",
    name: "Thiết bị đo lường",
    description: "Máy đo pH, nhiệt kế, ẩm kế, máy đo độ ẩm đất",
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: 8,
    code: "OTHER",
    name: "Vật tư khác",
    description: "Các vật tư nông nghiệp khác chưa được phân loại",
    status: "active",
    createdAt: "2024-01-17",
  },
];

export const emptyMaterialGroupFormData: MaterialGroupFormValues = {
  code: "",
  name: "",
  description: "",
  status: "active",
};
