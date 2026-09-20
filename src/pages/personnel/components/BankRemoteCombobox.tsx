import { useMasterData } from "@/features/master-data";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { RemoteAutoCompleteSelect } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";

interface BankRemoteComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Chọn ngân hàng, lọc trên API theo từ khoá (debounce) thay vì tải sẵn
 * toàn bộ danh sách rồi lọc client-side.
 */
export function BankRemoteCombobox({
  value,
  onChange,
}: BankRemoteComboboxProps) {
  const [searchValue, setSearchValue] = useState("");
  const keyword = useDebounce(searchValue.trim(), 300);

  const { items: banks, isFetching } = useMasterData("banks", {
    params: { keyword: keyword || undefined, status: "active", size: 20 },
  });

  // Ngân hàng đã chọn có thể nằm ngoài 20 kết quả hiện tại (vd. khi mở form
  // sửa) — nạp riêng để hiển thị tên thay vì mã.
  const { items: selected } = useMasterData("banks", {
    params: { keyword: value || undefined, status: "active", size: 1 },
    enabled: Boolean(value),
  });

  const shown = banks.some((bank) => bank.code === value)
    ? banks
    : [...selected, ...banks];

  const options = shown.map((bank) => ({
    value: bank.code,
    label: bank.name,
  }));

  return (
    <RemoteAutoCompleteSelect
      options={options}
      value={value}
      onChange={onChange}
      onSearch={setSearchValue}
      placeholder="Chọn ngân hàng..."
      searchPlaceholder="Tìm tên ngân hàng..."
      emptyText="Không tìm thấy ngân hàng"
      loading={isFetching}
    />
  );
}
