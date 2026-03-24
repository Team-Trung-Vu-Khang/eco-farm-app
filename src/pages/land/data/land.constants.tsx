import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Land } from "../../../stores/useLandStore";

export interface LandFormData {
  code: string;
  name: string;
  image: string;
  description: string;
}

export const INVALID_IMAGE_PLACEHOLDER =
  "https://placehold.co/400x200?text=Invalid+Image";

export const createEmptyLandFormData = (): LandFormData => ({
  code: "",
  name: "",
  image: "",
  description: "",
});

export const createLandFormDataFromItem = (item: Land): LandFormData => ({
  code: item.code,
  name: item.name,
  image: item.image || "",
  description: item.description,
});

export const landColumns: Column<Land>[] = [
  { key: "code", label: "Mã" },
  {
    key: "image",
    label: "Hình ảnh",
    render: (value) =>
      value ? (
        <img
          src={value as string}
          alt="item"
          className="h-10 w-10 rounded-md border object-cover"
        />
      ) : null,
  },
  { key: "name", label: "Tên loại đất" },
  { key: "description", label: "Mô tả" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value === "active" ? "Hoạt động" : "Không hoạt động"}
      </Badge>
    ),
  },
  { key: "createdAt", label: "Ngày tạo" },
];
