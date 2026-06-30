import { useEffect, useState } from "react";

export const SELECTED_WORKSPACE_STORAGE_KEY = "admin_selected_workspace";

export const getSelectedWorkspaceIdFromStorage = (): number | string | null => {
  if (typeof window === "undefined") return null;

  const rawValue = sessionStorage.getItem(SELECTED_WORKSPACE_STORAGE_KEY);
  if (rawValue === null || rawValue === "") return null;

  const numericValue = Number(rawValue);
  return Number.isFinite(numericValue) ? numericValue : rawValue;
};

export function useSelectedWorkspaceId() {
  const [workspaceId, setWorkspaceId] = useState<number | string | null>(() =>
    getSelectedWorkspaceIdFromStorage(),
  );

  useEffect(() => {
    const syncWorkspaceId = () => {
      setWorkspaceId(getSelectedWorkspaceIdFromStorage());
    };

    syncWorkspaceId();
    window.addEventListener("storage", syncWorkspaceId);

    return () => {
      window.removeEventListener("storage", syncWorkspaceId);
    };
  }, []);

  return workspaceId;
}
