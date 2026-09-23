import type { RemoteMultiSelectOption } from "@/components/RemoteMultiSelect";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useState } from "react";

/** Ô tìm kiếm của dropdown tìm từ xa: trả về từ khóa đã debounce để gọi API */
export function useRemoteSearch(delay = 300) {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, delay);
  return { keyword: debounced.trim() || undefined, setSearch };
}

/**
 * Multi-select tìm từ xa: giữ nhãn các mục đã chọn khi kết quả tìm kiếm
 * mới không còn chứa chúng (không thì chip đã chọn chỉ hiện id).
 */
export function usePinnedOptions(fetched: RemoteMultiSelectOption[]) {
  const [pinned, setPinned] = useState<RemoteMultiSelectOption[]>([]);
  const fetchedValues = new Set(fetched.map((option) => option.value));
  const options = [
    ...pinned.filter((option) => !fetchedValues.has(option.value)),
    ...fetched,
  ];

  const pin = (values: string[]) =>
    setPinned(
      values.map(
        (value) =>
          options.find((option) => option.value === value) ?? {
            value,
            label: value,
          },
      ),
    );

  return { options, pin };
}
