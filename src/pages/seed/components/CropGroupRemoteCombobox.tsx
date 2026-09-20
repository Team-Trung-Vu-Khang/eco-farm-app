import { useCatalog, useCatalogById } from "@/features/foundation";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { RemoteAutoCompleteSelect } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";

interface CropGroupRemoteComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Chọn nhóm cây trồng, lọc trên API theo từ khoá (debounce) thay vì tải sẵn
 * toàn bộ danh mục rồi lọc client-side.
 */
export function CropGroupRemoteCombobox({
  value,
  onChange,
}: CropGroupRemoteComboboxProps) {
  const [searchValue, setSearchValue] = useState("");
  const keyword = useDebounce(searchValue.trim(), 300);

  const { items: groups, isFetching } = useCatalog("crop-groups", {
    params: { keyword: keyword || undefined, status: "active", size: 20 },
  });

  const isValueListed = groups.some((group) => String(group.id) === value);

  // Nhóm đang chọn có thể nằm ngoài 20 kết quả hiện tại (vd. khi mở form sửa)
  // — nạp riêng theo id để hiển thị tên thay vì id.
  const { data: selected } = useCatalogById("crop-groups", Number(value), {
    enabled: Boolean(value) && !isValueListed,
  });

  const shown = isValueListed || !selected ? groups : [selected, ...groups];

  const options = shown.map((group) => ({
    value: String(group.id),
    label: group.name,
  }));

  return (
    <RemoteAutoCompleteSelect
      options={options}
      value={value}
      onChange={onChange}
      onSearch={setSearchValue}
      placeholder="Chọn nhóm cây"
      searchPlaceholder="Tìm nhóm cây trồng..."
      emptyText="Không tìm thấy nhóm cây trồng"
      loading={isFetching}
    />
  );
}
