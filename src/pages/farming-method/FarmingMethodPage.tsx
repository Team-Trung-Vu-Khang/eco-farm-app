import GenericPage from "../GenericPage";
import { useCatalog } from "../../features/foundation/hooks/useCatalog";
import { useCatalogMutations } from "../../features/foundation/hooks/useCatalogMutations";
import React from "react";
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
  const { items, loading } = useCatalog("farming-methods");
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
    />
  );
};
export default FarmingMethodPage;
