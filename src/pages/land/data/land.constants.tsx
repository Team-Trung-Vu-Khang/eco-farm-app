import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Land } from "../../../stores/useLandStore";

import { Hash } from "lucide-react";

export interface LandFormData {
  code: string;
  name: string;
  imageUrl: string;
  description: string;
}

export const INVALID_IMAGE_PLACEHOLDER =
  "https://placehold.co/400x200?text=Invalid+Image";

export const createEmptyLandFormData = (): LandFormData => ({
  code: "",
  name: "",
  imageUrl: "",
  description: "",
});

export const createLandFormDataFromItem = (item: Land): LandFormData => ({
  code: item.code,
  name: item.name,
  imageUrl: item.imageUrl || "",
  description: item.description,
});

export const landColumns: Column<Land>[] = [
  {
    key: "code",
    label: "Mã",
    render: (value: unknown) => {
      return (
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit">
          <Hash className="w-3 h-3 opacity-60" />
          {value as string}
        </div>
      );
    },
  },
  {
    key: "imageUrl",
    label: "Hình ảnh",
    render: (value) => {
      return value ? (
        <img
          alt={"item"}
          src={value as string}
          className="h-10 w-10 rounded-md border object-cover"
        />
      ) : null;
    },
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
