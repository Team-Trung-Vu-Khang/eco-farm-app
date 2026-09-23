import { Button, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronRight,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sprout,
} from "lucide-react";
import {
  getLocationText,
  getPlantCode,
  getVarietyName,
  type PlantItem,
} from "../utils/plant-identification.utils";
// Tạm ẩn badge sức khỏe
// import { PlantHealthBadge } from "./PlantHealthBadge";

interface PlantResultListProps {
  plants: PlantItem[];
  totalElements: number;
  activeId?: number;
  onSelect: (id: number) => void;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const ListMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-2 p-10 text-center text-sm text-slate-400">
    {children}
  </div>
);

/** Cột trái: danh sách cây trồng theo kết quả tìm kiếm */
export function PlantResultList({
  plants,
  totalElements,
  activeId,
  onSelect,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  collapsed,
  onCollapsedChange,
}: PlantResultListProps) {
  return (
    <>
      {collapsed && (
        <button
          onClick={() => onCollapsedChange(false)}
          className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white text-primary shadow-xl hover:bg-slate-50"
          title="Mở danh sách cây trồng"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}

      <div
        className={cn(
          "sticky top-20 z-10 flex max-h-[calc(100vh-96px)] shrink-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300",
          collapsed ? "w-0 border-none p-0 opacity-0" : "w-72 xl:w-80",
        )}
      >
        <div className="flex min-w-60 items-center justify-between border-b bg-slate-50/50 p-4">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
            <Sprout size={14} className="text-primary" />
            Cây trồng ({totalElements})
          </h3>
          <button
            onClick={() => onCollapsedChange(true)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary"
            title="Thu gọn"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        <div className="min-w-60 flex-1 space-y-1.5 overflow-y-auto p-2">
          {isLoading ? (
            <ListMessage>
              <Loader2 className="h-4 w-4 animate-spin" /> Đang tải...
            </ListMessage>
          ) : isError ? (
            <ListMessage>
              <span className="text-red-500">
                Không tải được danh sách cây trồng
              </span>
            </ListMessage>
          ) : plants.length === 0 ? (
            <ListMessage>
              <Search className="h-8 w-8 text-slate-200" />
              <span className="font-bold">
                Không tìm thấy cây trồng phù hợp
              </span>
            </ListMessage>
          ) : (
            <>
              {plants.map((plant) => {
                const isActive = activeId === plant.id;
                return (
                  <button
                    key={plant.id}
                    type="button"
                    onClick={() => onSelect(plant.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors",
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:bg-slate-50",
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Sprout className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-slate-800">
                          {getPlantCode(plant)}
                        </span>
                        {/* Tạm ẩn badge sức khỏe
                        <PlantHealthBadge status={plant.healthStatus} />
                        */}
                      </div>
                      <p className="truncate text-[11px] text-slate-500">
                        {getVarietyName(plant)}
                      </p>
                      <p className="truncate text-[10px] text-slate-400">
                        {getLocationText(plant) || plant.productionZone?.name}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className={isActive ? "text-primary" : "text-slate-300"}
                    />
                  </button>
                );
              })}

              {hasNextPage && (
                <Button
                  variant="ghost"
                  className="w-full text-xs"
                  disabled={isFetchingNextPage}
                  onClick={onLoadMore}
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Tải thêm"
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
