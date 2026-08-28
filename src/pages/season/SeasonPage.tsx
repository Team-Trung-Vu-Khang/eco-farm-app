import PageWrapper from "@/components/PageWrapper";
import { useSeasons } from "@/features/master-data/hooks/useSeasons";
import type {
  MasterDataSeasonResponse,
  SeasonDomainCode,
} from "@/features/master-data/types/master-data.type";
import {
  Button,
  DataTable,
  DeleteDialog,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Fish, PawPrint, Plus, TreeDeciduous } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { seasonColumns } from "./data/columns";
import { useSeasonPage } from "./hooks/useSeasonPage";

const DEFAULT_PAGE_SIZE = 20;

function SeasonTabContent({
  domainCode,
  onEdit,
  onDelete,
}: {
  domainCode: SeasonDomainCode;
  onEdit: (season: MasterDataSeasonResponse) => void;
  onDelete: (season: MasterDataSeasonResponse) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState<string>("all");

  const { data, isLoading } = useSeasons({
    params: {
      domainCode,
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : (status as any),
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value);
      setCurrentIndex(1);
    }
  };

  const filters = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Ngừng hoạt động", value: "inactive" },
        { label: "Đã lưu trữ", value: "archived" },
      ],
    },
  ];

  return (
    <DataTable
      data={data?.content || []}
      selectable={false}
      columns={seasonColumns}
      onEdit={onEdit}
      onDelete={onDelete}
      searchPlaceholder="Tìm kiếm mã, tên chu kỳ..."
      searchable
      onSearch={handleSearch}
      pageSize={pageSize}
      currentIndex={currentIndex}
      totalPages={data?.totalPages ?? 0}
      totalElements={data?.totalElements ?? 0}
      onPageSize={(size) => {
        setPageSize(size);
        setCurrentIndex(1);
      }}
      onIndexChange={setCurrentIndex}
      filters={filters}
      onFilterChange={handleFilterChange}
      loading={isLoading}
    />
  );
}

export default function SeasonPage() {
  const {
    deleteOpen,
    handleAdd,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    setDeleteOpen,
  } = useSeasonPage();

  return (
    <PageWrapper
      title="Chu kỳ sinh trưởng"
      description="Quản lý riêng vụ mùa, vụ nuôi và vụ nuôi thủy sản"
      actions={
        <Button
          className="bg-green-600 shadow-sm transition-all hover:bg-green-700 hover:shadow-md active:scale-95"
          onClick={handleAdd}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm mới
        </Button>
      }
    >
      <div className="space-y-6">
        <Tabs defaultValue="CROP">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="CROP" className="gap-2">
              <TreeDeciduous className="h-4 w-4" />
              Vụ mùa
            </TabsTrigger>
            <TabsTrigger value="LIVESTOCK" className="gap-2">
              <PawPrint className="h-4 w-4" />
              Vụ nuôi
            </TabsTrigger>
            <TabsTrigger value="AQUACULTURE" className="gap-2">
              <Fish className="h-4 w-4" />
              Vụ thả nuôi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="CROP" className="mt-5">
            <SeasonTabContent
              domainCode="CROP"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="LIVESTOCK" className="mt-5">
            <SeasonTabContent
              domainCode="LIVESTOCK"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="AQUACULTURE" className="mt-5">
            <SeasonTabContent
              domainCode="AQUACULTURE"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </PageWrapper>
  );
}
