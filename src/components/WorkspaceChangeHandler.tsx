import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  setSelectedWorkspaceId,
  useSelectedWorkspaceId,
} from "@/features/workspace";
import { useWorkspace } from "@Team-Trung-Vu-Khang/eco-shared-ui";

const isFormRoute = (pathname: string) =>
  /\/(?:create|new|edit|update)(?:\/|$)/.test(pathname);

const getListRoute = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const formSegmentIndex = segments.findIndex((segment) =>
    ["create", "new", "edit", "update"].includes(segment),
  );

  if (formSegmentIndex <= 0) return "/";
  const previousSegment = segments[formSegmentIndex - 1];
  const endIndex = /^\d+$/.test(previousSegment)
    ? formSegmentIndex - 1
    : formSegmentIndex;
  return `/${segments.slice(0, endIndex).join("/")}`;
};

/** Keeps current workspace data in sync and prevents accidental cross-workspace edits. */
export function WorkspaceChangeHandler() {
  const workspaceId = useSelectedWorkspaceId();
  const { currentWorkspaceId, setCurrentWorkspaceId } = useWorkspace();
  const previousWorkspaceIdRef = useRef(workspaceId);
  const isRevertingRef = useRef(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // 1. Đồng bộ từ eco-farm-app sang WorkspaceContext của eco-shared-ui (để Header Layout cập nhật)
  useEffect(() => {
    if (
      workspaceId !== null &&
      workspaceId !== undefined &&
      String(currentWorkspaceId) !== String(workspaceId)
    ) {
      setCurrentWorkspaceId(String(workspaceId));
    }
  }, [workspaceId, currentWorkspaceId, setCurrentWorkspaceId]);

  // 2. Đồng bộ ngược từ eco-shared-ui (vd: chọn workspace từ AdminHeader trên desktop) về eco-farm-app
  useEffect(() => {
    if (
      currentWorkspaceId !== null &&
      currentWorkspaceId !== undefined &&
      String(workspaceId) !== String(currentWorkspaceId)
    ) {
      setSelectedWorkspaceId(currentWorkspaceId);
    }
  }, [currentWorkspaceId, workspaceId]);

  useEffect(() => {
    const previousWorkspaceId = previousWorkspaceIdRef.current;
    if (previousWorkspaceId === workspaceId) return;

    previousWorkspaceIdRef.current = workspaceId;

    if (isRevertingRef.current) {
      isRevertingRef.current = false;
      return;
    }

    const pathname = window.location.pathname;
    if (isFormRoute(pathname)) {
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

    void queryClient.invalidateQueries({
      predicate: (query) => {
        const [scope, subScope] = query.queryKey;
        // Không invalidate danh sách chọn workspace (list/infinite) khi chỉ chuyển đổi workspace hiện tại
        if (scope === "workspaces" && subScope !== "detail") {
          return false;
        }
        return true;
      },
      refetchType: "active",
    });
  }, [queryClient, setLocation, workspaceId]);

  return null;
}
