import type {
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export function FieldLabel({ children, className = "", ...props }: FieldLabelProps) {
  return (
    <label
      className={`text-sm font-medium text-foreground ${className}`.trim()}
      {...props}
    >
      {children}
    </label>
  );
}

interface FieldSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export function FieldSelect({ children, className = "", ...props }: FieldSelectProps) {
  return (
    <select
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${className}`.trim()}
      {...props}
    >
      {children}
    </select>
  );
}
