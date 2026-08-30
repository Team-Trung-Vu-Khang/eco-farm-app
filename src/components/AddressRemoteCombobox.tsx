import { RemoteAutoCompleteSelect } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useGeoProvinces, useGeoWards } from "@/features/master-data";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useMemo, useState } from "react";

type AddressRemoteComboboxType = "province" | "ward";

interface AddressRemoteComboboxProps {
  type: AddressRemoteComboboxType;
  value: string;
  onChange: (value: string) => void;
  provinceCode?: string;
  disabled?: boolean;
  placeholder: string;
  searchPlaceholder: string;
  emptyText?: string;
}

const getLabel = (item: {
  fullName?: string | null;
  name?: string | null;
  code: string;
}) =>
  item.fullName || item.name || item.code;

export function AddressRemoteCombobox({
  type,
  value,
  onChange,
  provinceCode,
  disabled = false,
  placeholder,
  searchPlaceholder,
  emptyText = "Không tìm thấy kết quả",
}: AddressRemoteComboboxProps) {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue.trim(), 300);

  const provincesQuery = useGeoProvinces({
    params: {
      keyword: debouncedSearch || undefined,
      status: "active",
      page: 0,
      size: 20,
    },
    enabled: type === "province",
  });

  const wardsQuery = useGeoWards({
    params: {
      provinceCode: provinceCode || "",
      keyword: debouncedSearch || undefined,
      status: "active",
      page: 0,
      size: 20,
    },
    enabled: type === "ward" && Boolean(provinceCode),
  });

  const selectedProvinceQuery = useGeoProvinces({
    params: {
      keyword: value || undefined,
      status: "active",
      page: 0,
      size: 1,
    },
    enabled: type === "province" && Boolean(value),
  });

  const selectedWardQuery = useGeoWards({
    params: {
      provinceCode: provinceCode || "",
      keyword: value || undefined,
      status: "active",
      page: 0,
      size: 1,
    },
    enabled: type === "ward" && Boolean(provinceCode) && Boolean(value),
  });

  const options = type === "province" ? provincesQuery.items : wardsQuery.items;
  const loading =
    type === "province" ? provincesQuery.isFetching : wardsQuery.isFetching;
  const selectedOptions =
    type === "province" ? selectedProvinceQuery.items : selectedWardQuery.items;

  const selectOptions = useMemo(() => {
    const mappedOptions = options.map((item) => ({
      value: item.code,
      label: getLabel(item),
      keywords: [item.code, item.name, item.fullName].filter(
        (keyword): keyword is string => Boolean(keyword),
      ),
    }));

    if (!value || mappedOptions.some((option) => option.value === value)) {
      return mappedOptions;
    }

    const selectedItem = selectedOptions.find((item) => item.code === value);

    return [
      {
        value,
        label: selectedItem ? getLabel(selectedItem) : value,
        keywords: selectedItem
          ? [selectedItem.code, selectedItem.name, selectedItem.fullName].filter(
              (keyword): keyword is string => Boolean(keyword),
            )
          : [value],
      },
      ...mappedOptions,
    ];
  }, [options, selectedOptions, value]);

  const isDisabled = disabled || (type === "ward" && !provinceCode);

  return (
    <RemoteAutoCompleteSelect
      options={selectOptions}
      value={value}
      onChange={onChange}
      onSearch={setSearchValue}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyText={emptyText}
      disabled={isDisabled}
      loading={loading}
    />
  );
}
