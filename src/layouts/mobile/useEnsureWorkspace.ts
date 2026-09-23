import { useEffect } from "react";
import {
  setSelectedWorkspaceId,
  useSelectedWorkspaceId,
  useWorkspaces,
} from "@/features/workspace";

/**
 * AdminLayout (shared-ui) tự chọn workspace qua WorkspaceProvider. Giao diện
 * mobile không render AdminLayout nên phải tự chọn workspace đầu tiên khi
 * người dùng chưa chọn — cùng key sessionStorage với shared-ui.
 */
export function useEnsureWorkspace() {
  const selectedWorkspaceId = useSelectedWorkspaceId();
  const workspacesQuery = useWorkspaces({ page: 0, size: 100 });
  const firstWorkspaceId = workspacesQuery.items[0]?.id;

  useEffect(() => {
    if (selectedWorkspaceId !== null) return;
    if (firstWorkspaceId === undefined) return;
    setSelectedWorkspaceId(firstWorkspaceId);
  }, [firstWorkspaceId, selectedWorkspaceId]);

  return {
    workspaces: workspacesQuery.items,
    selectedWorkspaceId,
    isLoading: workspacesQuery.loading,
  };
}
