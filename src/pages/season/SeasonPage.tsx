import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PawPrint, Plus, Trees } from "lucide-react";
import { useMemo, useState } from "react";
import { seasonColumns } from "./data/columns";
import { useSeasonPage } from "./hooks/useSeasonPage";
import type { Season } from "./types/types";

function resolveSeasonType(season: Season) {
  return season.seasonType ?? "plant";
}

function SeasonTableView({
  seasons,
  onEdit,
  onDelete,
}: {
  seasons: Season[];
  onEdit: (season: Season) => void;
  onDelete: (season: Season) => void;
}) {
  return (
    <DataTable
      data={seasons}
      selectable={false}
      columns={seasonColumns}
      onEdit={onEdit}
      onDelete={onDelete}
      searchPlaceholder="Tìm kiếm mã, tên mùa vụ..."
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
    seasons,
    setDeleteOpen,
  } = useSeasonPage();
  const [tab, setTab] = useState<"plant" | "animal">("plant");

  const plantSeasons = useMemo(
    () => seasons.filter((season) => resolveSeasonType(season) === "plant"),
    [seasons],
  );

  const animalSeasons = useMemo(
    () => seasons.filter((season) => resolveSeasonType(season) === "animal"),
    [seasons],
  );

  return (
    <PageWrapper
      title="Quản lý mùa vụ"
      description="Quản lý riêng vụ mùa và vụ nuôi trong cùng một không gian"
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
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as "plant" | "animal")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plant" className="gap-2">
              <Trees className="h-4 w-4" />
              Vụ mùa
            </TabsTrigger>
            <TabsTrigger value="animal" className="gap-2">
              <PawPrint className="h-4 w-4" />
              Vụ nuôi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plant" className="mt-5">
            <SeasonTableView
              seasons={plantSeasons}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="animal" className="mt-5">
            <SeasonTableView
              seasons={animalSeasons}
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
