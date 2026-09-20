import { useFarmDepartments } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { RemoteAutoCompleteSelect } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";

interface DepartmentRemoteComboboxProps {
  /** Giá trị dạng `${id}_${source}` */
  value: string;
  onChange: (value: string) => void;
}

/**
 * Chọn phòng ban, lọc trên API theo từ khoá (debounce) thay vì tải sẵn
 * toàn bộ danh sách rồi lọc client-side.
 */
export function DepartmentRemoteCombobox({
  value,
  onChange,
}: DepartmentRemoteComboboxProps) {
  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  const [searchValue, setSearchValue] = useState("");
  const keyword = useDebounce(searchValue.trim(), 300);

  const { items: departments, isFetching } = useFarmDepartments({
    workspaceId: parsedWorkspaceId,
    params: {
      keyword: keyword || undefined,
      onlyOwner: true,
      size: 20,
    },
  });

  // Chỉ so id: giá trị đã lưu có thể thiếu hậu tố source.
  const selectedId = value.split("_")[0];
  const isValueListed = departments.some((d) => String(d.id) === selectedId);

  // Phòng ban đang chọn có thể nằm ngoài 20 kết quả hiện tại (vd. khi mở form
  // sửa) — nạp riêng để hiển thị tên thay vì để trống.
  const { items: fallback } = useFarmDepartments({
    workspaceId: parsedWorkspaceId,
    params: { onlyOwner: true, size: 100 },
    enabled: Boolean(selectedId) && !isValueListed,
  });

  const shown = isValueListed
    ? departments
    : [
        ...fallback.filter((d) => String(d.id) === selectedId),
        ...departments,
      ];

  const options = shown.map((d) => ({
    value: `${d.id}_${d.source}`,
    label: d.name,
  }));

  // Giá trị đã lưu có thể là "22" trong khi option là "22_OWNER" — quy về
  // đúng option để không hiển thị trống.
  const matchedValue =
    options.find((option) => option.value.split("_")[0] === selectedId)
      ?.value ?? value;

  return (
    <RemoteAutoCompleteSelect
      options={options}
      value={matchedValue}
      onChange={onChange}
      onSearch={setSearchValue}
      placeholder="Chọn phòng ban"
      searchPlaceholder="Tìm phòng ban..."
      emptyText="Không tìm thấy phòng ban"
      loading={isFetching}
    />
  );
}
