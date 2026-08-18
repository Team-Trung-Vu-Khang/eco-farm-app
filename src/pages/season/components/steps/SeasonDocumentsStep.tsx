import { SeasonDocumentsCard } from "../SeasonDocumentsCard";

interface SeasonDocumentsStepProps {
  onSubmit: () => void;
  submitLabel: string;
}

export function SeasonDocumentsStep({
  onSubmit,
  submitLabel,
}: SeasonDocumentsStepProps) {
  return (
    <SeasonDocumentsCard
      documents={[]}
      onDocumentsChange={() => {}}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
    />
  );
}
