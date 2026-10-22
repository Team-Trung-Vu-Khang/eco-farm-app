import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  consumeSuppressLeavePrompt,
  executeWorkspaceCacheTransition,
  setSelectedWorkspaceId,
  useSelectedWorkspaceId,
  workspaceKeys,
} from "@/features/workspace";
import {
  useWorkspace,
  WORKSPACE_DATA_UPDATED_EVENT,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

const isFormRoute = (pathname: string) =>
  /\/(?:create|new|edit|update)(?:\/|$)/.test(pathname);

const isIdSegment = (segment: string) =>
  /^\d+$/.test(segment) ||
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    segment,
  );

const getListRoute = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const formSegmentIndex = segments.findIndex((segment) =>
    ["create", "new", "edit", "update"].includes(segment),
  );

  if (formSegmentIndex <= 0) return "/";
  const previousSegment = segments[formSegmentIndex - 1];
  const endIndex = isIdSegment(previousSegment)
    ? formSegmentIndex - 1
    : formSegmentIndex;
  return `/${segments.slice(0, endIndex).join("/")}`;
};

/** Keeps current workspace data in sync and prevents accidental cross-workspace edits. */
export function WorkspaceChangeHandler() {
  const workspaceId = useSelectedWorkspaceId();
  const { refetchWorkspaces } = useWorkspace();
  const previousWorkspaceIdRef = useRef(workspaceId);
  const isRevertingRef = useRef(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Lắng nghe sự kiện cập nhật tên/dữ liệu workspace để invalidate cache TanStack Query và refetch
  useEffect(() => {
    const handleWorkspaceDataChanged = () => {
      void queryClient.invalidateQueries({
        queryKey: ["workspace", workspaceId],
      });
      void queryClient.invalidateQueries({
        queryKey: workspaceKeys.all,
      });
      void refetchWorkspaces();
    };

    window.addEventListener(
      WORKSPACE_DATA_UPDATED_EVENT,
      handleWorkspaceDataChanged,
    );
    return () => {
      window.removeEventListener(
        WORKSPACE_DATA_UPDATED_EVENT,
        handleWorkspaceDataChanged,
      );
    };
  }, [queryClient, workspaceId, refetchWorkspaces]);

  useEffect(() => {
    const previousWorkspaceId = previousWorkspaceIdRef.current;
    if (previousWorkspaceId === workspaceId) return;

    previousWorkspaceIdRef.current = workspaceId;

    if (isRevertingRef.current) {
      isRevertingRef.current = false;
      return;
    }

    const suppressPrompt = consumeSuppressLeavePrompt();
    const pathname = window.location.pathname;
    if (!suppressPrompt && isFormRoute(pathname)) {
      const shouldLeaveForm = window.confirm(
        "Bạn đã đổi workspace. Dữ liệu đang nhập/chỉnh sửa thuộc workspace trước và có thể chưa được lưu. Bạn có muốn rời màn hình này không?",
      );

      if (!shouldLeaveForm) {
        isRevertingRef.current = true;
        previousWorkspaceIdRef.current = workspaceId;
        setSelectedWorkspaceId(previousWorkspaceId);
        return;
      }

      setLocation(getListRoute(pathname));
    }

    void executeWorkspaceCacheTransition(queryClient, workspaceId);
  }, [queryClient, setLocation, workspaceId]);

  return null;
}
