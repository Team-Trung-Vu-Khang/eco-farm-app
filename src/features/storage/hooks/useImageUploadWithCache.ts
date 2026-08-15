import { useRef } from "react";
import { uploadFileApi } from "../api/storage.api";
import { useSelectedWorkspaceId } from "@/features/workspace/hooks/useSelectedWorkspaceId";

/**
 * Hook for uploading an image file with local cache.
 *
 * The cache is keyed by a stable identifier derived from:
 *   - the objectURL (blob:...) for newly picked files
 *   - the remote URL itself (https://...) for already-uploaded images
 *
 * This means repeated calls to `uploadImage` with the same file / URL
 * will return the cached remote URL without hitting the API again.
 */
export function useImageUploadWithCache() {
  const workspaceId = useSelectedWorkspaceId();

  // Map: localKey → remote fileUrl
  const cache = useRef<Map<string, string>>(new Map());

  /**
   * Uploads `imageUrl` (which may be a blob URL or already a remote URL)
   * and returns the final remote fileUrl.
   *
   * @param imageUrl  The current imageUrl stored in formData (blob: or https:).
   * @param imageFile The File object if the user selected a new file. Optional.
   * @param folder    Storage folder (e.g. "pesticide", "fertilizer").
   * @returns         The remote fileUrl to store in the payload, or undefined.
   */
  async function uploadImage(
    imageUrl: string | undefined,
    imageFile: File | null | undefined,
    folder = "products",
  ): Promise<string | undefined> {
    if (!imageUrl) return undefined;

    // If it's already a remote URL (not blob:), return as-is
    if (!imageUrl.startsWith("blob:") && !imageUrl.startsWith("data:")) {
      return imageUrl;
    }

    // Cache hit — return previously uploaded URL
    if (cache.current.has(imageUrl)) {
      return cache.current.get(imageUrl);
    }

    // Need actual File object to upload
    if (!imageFile) {
      // Try to fetch the blob from the objectURL
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        imageFile = new File([blob], "image.jpg", { type: blob.type });
      } catch {
        console.warn("useImageUploadWithCache: could not fetch blob from", imageUrl);
        return undefined;
      }
    }

    // Upload
    const result = await uploadFileApi({ file: imageFile, folder, workspaceId });
    const remoteUrl = result.fileUrl;

    // Cache the result
    cache.current.set(imageUrl, remoteUrl);

    return remoteUrl;
  }

  /**
   * Clears the upload cache (e.g. after the form is reset).
   */
  function clearCache() {
    cache.current.clear();
  }

  return { uploadImage, clearCache };
}
