import { X } from "lucide-react";
import { useState, type KeyboardEvent, type ReactNode } from "react";
import { Badge, Input, Label } from "@Team-Trung-Vu-Khang/eco-shared-ui";

/**
 * A container with a header and a space for content, used in wizard steps.
 */
export function WizardCard({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 border-b border-slate-100 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

/**
 * A small metric card used to display key stats at the top of a stage or summary.
 */
export function StageMetric({
  label,
  tone,
  value,
}: {
  label: string;
  tone: string;
  value: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <p className="text-xs uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-2 font-semibold truncate" title={value}>
        {value}
      </p>
    </div>
  );
}

/**
 * A field display for the summary step.
 */
export function SummaryField({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="space-y-1 rounded-2xl border border-slate-200 bg-white p-4 h-full">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="text-sm text-slate-700">
        {typeof value === "string" && value.includes("<") ? (
          <div dangerouslySetInnerHTML={{ __html: value }} className="rich-text-content" />
        ) : (
          value
        )}
      </div>
    </div>
  );
}

/**
 * An input field for hashtags/tags.
 */
export function TagInput({
  label,
  onChange,
  placeholder,
  values = [],
}: {
  label: string;
  onChange: (next: string[]) => void;
  placeholder: string;
  values: string[];
}) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const normalized = draft.trim();
    if (!normalized) return;
    const finalValue = normalized.startsWith("#")
      ? normalized.toLowerCase()
      : `#${normalized.toLowerCase()}`;

    if (!values.includes(finalValue)) {
      onChange([...values, finalValue]);
    }

    setDraft("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {values.length > 0 ? (
            values.map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="rounded-full gap-2"
              >
                {item}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(values.filter((v) => v !== item));
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              Nhập hashtag và nhấn Enter để thêm.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={draft}
            placeholder={placeholder}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold whitespace-nowrap"
            onClick={addTag}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}
