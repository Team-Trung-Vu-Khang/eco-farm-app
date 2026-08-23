import { useProductionSubjects, useProductionSubjectVariants } from "@/features/foundation";
import { AnimalGrowthCycleSteps } from "@/pages/animal-husbandry-zone/animal-growth-cycle/components/AnimalGrowthCycleSteps";
import type { z } from "zod";

interface Props {
  schema: z.ZodType<any, any, any>;
  onComplete: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/** Thủy sản dùng chung toàn bộ flow của vật nuôi; chỉ thay domain và nhãn. */
export function AquacultureGrowthCycleSteps(props: Props) {
  const { items: subjects } = useProductionSubjects({ params: { domainCode: "AQUACULTURE", size: 100 } });
  const { items: varieties } = useProductionSubjectVariants({ params: { domainCode: "AQUACULTURE", size: 100 } });

  return (
    <AnimalGrowthCycleSteps
      {...props}
      crops={subjects}
      varieties={varieties}
      domainCode="AQUACULTURE"
      subjectLabel="Loài nuôi"
      varietyLabel="Giống / dòng"
      groupLabel="Nhóm loài nuôi"
      cycleLabel="Vụ thủy sản"
    />
  );
}
