import { useSyncExternalStore } from "react";

export const SELECTED_WORKSPACE_STORAGE_KEY = "admin_selected_workspace";
const WORKSPACE_CHANGE_EVENT = "eco-farm:workspace-change";

let isStorageObserverInstalled = false;

const notifyWorkspaceChange = () => {
  window.dispatchEvent(new Event(WORKSPACE_CHANGE_EVENT));
};

/**
 * The shared layout stores the selected workspace in sessionStorage. Native
 * `storage` events are only sent to other tabs, so observe same-tab writes too.
 */
const installStorageObserver = () => {
  if (typeof window === "undefined" || isStorageObserverInstalled) return;

  isStorageObserverInstalled = true;
  const originalSetItem = Storage.prototype.setItem;

  Storage.prototype.setItem = function setItem(key: string, value: string) {
    originalSetItem.call(this, key, value);

    if (this === window.sessionStorage && key === SELECTED_WORKSPACE_STORAGE_KEY) {
      notifyWorkspaceChange();
    }
  };
};

export const getSelectedWorkspaceIdFromStorage = (): number | string | null => {
  if (typeof window === "undefined") return null;

  const rawValue = sessionStorage.getItem(SELECTED_WORKSPACE_STORAGE_KEY);
  if (rawValue === null || rawValue === "") return null;

  const numericValue = Number(rawValue);
  return Number.isFinite(numericValue) ? numericValue : rawValue;
};

export const setSelectedWorkspaceId = (workspaceId: number | string | null) => {
  if (typeof window === "undefined") return;

  if (workspaceId === null || workspaceId === "") {
    sessionStorage.removeItem(SELECTED_WORKSPACE_STORAGE_KEY);
    notifyWorkspaceChange();
    return;
  }

  sessionStorage.setItem(SELECTED_WORKSPACE_STORAGE_KEY, String(workspaceId));
};

const subscribe = (onStoreChange: () => void) => {
  installStorageObserver();
  window.addEventListener(WORKSPACE_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(WORKSPACE_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

export function useSelectedWorkspaceId() {
  return useSyncExternalStore(
    subscribe,
    getSelectedWorkspaceIdFromStorage,
    () => null,
  );
}
