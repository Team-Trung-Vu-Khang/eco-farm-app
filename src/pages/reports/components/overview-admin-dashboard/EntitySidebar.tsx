import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search, Building2, Globe, Loader2 } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { adminWorkspaceApi } from "@/features/workspace";
import type { WorkspaceRecord } from "@/features/workspace/types/workspace.type";

export type CorporateEntity = WorkspaceRecord;

interface EntitySidebarProps {
  selectedEntity?: WorkspaceRecord | null;
  onSelectEntity?: (entity: WorkspaceRecord | null) => void;
  selectedWorkspace?: WorkspaceRecord | null;
  onSelectWorkspace?: (workspace: WorkspaceRecord | null) => void;
}

export const EntitySidebar: React.FC<EntitySidebarProps> = ({
  selectedEntity,
  onSelectEntity,
  selectedWorkspace,
  onSelectWorkspace,
}) => {
  const currentSelected =
    selectedWorkspace !== undefined
      ? selectedWorkspace
      : (selectedEntity ?? null);

  const handleSelect = (ws: WorkspaceRecord | null) => {
    if (onSelectWorkspace) onSelectWorkspace(ws);
    if (onSelectEntity) onSelectEntity(ws);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [workspaces, setWorkspaces] = useState<WorkspaceRecord[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch workspaces whenever debouncedSearch or page changes
  useEffect(() => {
    let isMounted = true;
    const isFirstPage = page === 0;

    if (isFirstPage) {
      setLoadingInitial(true);
    } else {
      setLoadingMore(true);
    }

    adminWorkspaceApi
      .list({
        keyword: debouncedSearch.trim() || undefined,
        page,
        size: 10,
      })
      .then((res) => {
        if (!isMounted) return;
        const newItems = res.content || [];
        setWorkspaces((prev) =>
          isFirstPage ? newItems : [...prev, ...newItems],
        );
        setHasMore(!res.last && res.page < res.totalPages - 1);
      })
      .catch((err) => {
        console.error("Failed to fetch workspaces:", err);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingInitial(false);
        setLoadingMore(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, page]);

  // Reset page to 0 when search query changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  // Infinite Scroll Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loadingInitial && !loadingMore) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, loadingInitial, loadingMore],
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "50px",
      threshold: 0.1,
    });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver]);

  return (
    <Card className="border border-slate-100 shadow-xs bg-white rounded-xl h-fit flex flex-col justify-between p-4 space-y-4 md:sticky md:top-6 z-20">
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
          Danh sách Đơn vị
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm Workspace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 h-9"
          />
        </div>

        {/* Reset / All Workspaces button */}
        <button
          type="button"
          onClick={() => handleSelect(null)}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-xs font-bold transition-all cursor-pointer ${
            currentSelected === null
              ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs"
              : "text-slate-650 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Tất cả Đơn vị</span>
        </button>

        {/* Workspace List Container */}
        <div className="space-y-1.5 max-h-[380px] md:max-h-[calc(100vh-240px)] overflow-y-auto pr-1 scrollbar-thin">
          {loadingInitial ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400 space-y-2">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              <span className="text-xs">Đang tải danh sách...</span>
            </div>
          ) : (
            <>
              {workspaces.map((ws) => {
                const isSelected = currentSelected?.id === ws.id;
                return (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => handleSelect(ws)}
                    className={`w-full flex flex-col p-2.5 rounded-lg text-left transition-all border border-transparent cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-xs"
                        : "hover:bg-slate-50 text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 font-bold text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Building2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? "text-indigo-600" : "text-slate-400"
                          }`}
                        />
                        <span className="truncate">{ws.name}</span>
                      </div>
                      {ws.status && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                            ws.status === "active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {ws.status}
                        </span>
                      )}
                    </div>
                    {ws.code && (
                      <p className="text-[10px] text-slate-400 font-mono font-medium mt-1">
                        Mã: {ws.code} {ws.province ? `• ${ws.province}` : ""}
                      </p>
                    )}
                  </button>
                );
              })}

              {workspaces.length === 0 && (
                <p className="text-center text-[11px] text-slate-400 py-6">
                  Không tìm thấy Đơn vị nào
                </p>
              )}

              {/* Sentinel div for infinite scroll loading */}
              <div
                ref={sentinelRef}
                className="h-4 w-full flex items-center justify-center"
              >
                {loadingMore && (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
