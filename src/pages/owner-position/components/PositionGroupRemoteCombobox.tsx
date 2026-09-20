import { useMasterData, useMasterDataById } from "@/features/master-data";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { RemoteAutoCompleteSelect } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";

interface PositionGroupRemoteComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Chọn nhóm chức vụ, lọc trên API theo từ khoá (debounce) thay vì tải sẵn
 * toàn bộ danh sách rồi lọc client-side.
 */
export function PositionGroupRemoteCombobox({
  value,
  onChange,
}: PositionGroupRemoteComboboxProps) {
  const [searchValue, setSearchValue] = useState("");
  const keyword = useDebounce(searchValue.trim(), 300);

  const { items: groups, isFetching } = useMasterData("position-groups", {
    params: {
      keyword: keyword || undefined,
      status: "active",
      page: 0,
      size: 20,
    },
  });

  const isValueListed = groups.some((group) => String(group.id) === value);

  // Nhóm đang chọn có thể nằm ngoài 20 kết quả hiện tại (vd. khi mở form sửa)
  // — nạp riêng theo id để hiển thị tên thay vì id.
  const { data: selected } = useMasterDataById("position-groups", value, {
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
      placeholder="Chọn nhóm chức vụ"
      searchPlaceholder="Tìm nhóm chức vụ..."
      emptyText="Không tìm thấy nhóm chức vụ"
      loading={isFetching}
    />
  );
}
