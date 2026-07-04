import GenericPage from "../GenericPage";
import { useCatalog } from "../../features/foundation/hooks/useCatalog";
import { useCatalogMutations } from "../../features/foundation/hooks/useCatalogMutations";
import React, { useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  convertLexicalToHtml,
  type EditorState,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

const columns = [
  { key: "code", label: "Mã" },
  { key: "name", label: "Tên" },
  {
    key: "description",
    label: "Mô tả",
    render(value: unknown) {
      return (
        <div
          className="line-clamp-2"
          dangerouslySetInnerHTML={{ __html: value as string }}
        />
      );
    },
  },
];

const fieldConfig = {
  name: { required: true },
  code: { required: true },
};

const FarmingMethodPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const { items, response, loading } = useCatalog("farming-methods", {
    params: {
      keyword: debouncedSearch.trim() || undefined,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    }
  });
  const { createCatalog, updateCatalog, deleteCatalog } =
    useCatalogMutations("farming-methods");

  const data = React.useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      code: item.code || "",
      name: item.name || "",
      description: item.description || "",
      status: (item.status as "active" | "inactive") || "active",
      createdAt: item.createdAt ? item.createdAt.split("T")[0] : "",
    }));
  }, [items]);

  const handleSubmit = async (
    formData: {
      code?: string;
      name?: string;
      description?: string | EditorState;
    },
    id: number | null,
  ) => {
    let textDescription = formData?.description;

    if (typeof textDescription === "object") {
      textDescription = await convertLexicalToHtml(textDescription.toJSON());
    }

    const payload = {
      code: formData.code,
      name: formData.name,
      status: "active" as const,
      description: textDescription,
    };
    if (id) {
      await updateCatalog.mutateAsync({ id, data: payload });
    } else {
      await createCatalog.mutateAsync(payload);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteCatalog.mutateAsync(id);
  };

  return (
    <GenericPage
      title="Quản lý phương thức canh tác"
      description="Các phương thức canh tác áp dụng trong sản xuất"
      entityName="phương thức"
      fieldConfig={fieldConfig}
      withRichTextEditor
      columns={columns}
      initialData={data}
      isLoading={loading}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      searchable
      onSearch={handleSearch}
      pageSize={pageSize}
      currentIndex={currentIndex}
      totalElements={response?.totalElements}
      totalPages={response?.totalPages}
      onPageSize={setPageSize}
      onIndexChange={setCurrentIndex}
    />
  );
};
export default FarmingMethodPage;
