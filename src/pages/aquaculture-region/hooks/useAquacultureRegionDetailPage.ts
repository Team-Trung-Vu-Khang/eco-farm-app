import { useParams } from "wouter";
import { getAquacultureDetailDraft } from "../data/detail-dummy";

export const useAquacultureRegionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id, 10) : 0;
  const draft = getAquacultureDetailDraft(numericId);

  return {
    area: draft.area,
    title: draft.area.name,
    description: `Mã: ${draft.area.id} • Tạo: ${draft.area.createdAt}`,
  };
};

