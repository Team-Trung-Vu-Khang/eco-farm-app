import GenericPage from "@/pages/GenericPage";
import { useState, useMemo } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useProductionMethods } from "@/features/foundation/hooks/useProductionMethods";
import { useProductionMethodMutations } from "@/features/foundation/hooks/useProductionMethodMutations";
import { CodeBadge } from "@/components/CodeBadge";
import {
  convertLexicalToHtml,
  type EditorState,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

const columns = [
  {
    key: "code",
    label: "Mã",
    render: (value: unknown) => <CodeBadge value={value} />,
  },
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
  code: { required: false },
};

interface Props {
  domainCode: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  title: string;
  description: string;
}

export const ProductionMethodTabContent = ({
  domainCode,
  title,
  description,
}: Props) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const { items, response, loading } = useProductionMethods({
    domainCode,
    keyword: debouncedSearch.trim() || undefined,
    page: Math.max(currentIndex - 1, 0),
    size: pageSize,
  });

  const { createMutation, updateMutation, deleteMutation } =
    useProductionMethodMutations();
  const formDialogLoading =
    createMutation.isPending || updateMutation.isPending;

  const data = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      code: item.code || undefined,
      name: item.name || "",
      description: item.description || "",
      status: (item.status as "active" | "inactive") || "active",
      createdAt: item.metadataJson?.createdAt
        ? String(item.metadataJson.createdAt).split("T")[0]
        : "",
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

    const payload: any = {
      domainCode,
      name: formData.name,
      status: "active" as const,
      description: textDescription,
    };
    if (formData.code) {
      payload.code = formData.code;
    }
    if (id) {
      await updateMutation.mutateAsync({ id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <GenericPage
      title={title}
      description={description}
      entityName="phương pháp"
      fieldConfig={fieldConfig}
      withRichTextEditor
      columns={columns}
      initialData={data}
      isLoading={loading}
      formDialogLoading={formDialogLoading}
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
