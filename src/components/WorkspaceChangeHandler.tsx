import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  setSelectedWorkspaceId,
  useSelectedWorkspaceId,
} from "@/features/workspace";

const isFormRoute = (pathname: string) =>
  /\/(?:create|new|edit|update)(?:\/|$)/.test(pathname);

const getListRoute = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const formSegmentIndex = segments.findIndex((segment) =>
    ["create", "new", "edit", "update"].includes(segment),
  );

  if (formSegmentIndex <= 0) return "/";
  const previousSegment = segments[formSegmentIndex - 1];
  const endIndex = /^\d+$/.test(previousSegment) ? formSegmentIndex - 1 : formSegmentIndex;
  return `/${segments.slice(0, endIndex).join("/")}`;
};

/** Keeps current workspace data in sync and prevents accidental cross-workspace edits. */
export function WorkspaceChangeHandler() {
  const workspaceId = useSelectedWorkspaceId();
  const previousWorkspaceIdRef = useRef(workspaceId);
  const isRevertingRef = useRef(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

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

    void queryClient.invalidateQueries({ refetchType: "active" });
  }, [queryClient, setLocation, workspaceId]);

  return null;
}
