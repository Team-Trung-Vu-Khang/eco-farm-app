import type { ReactNode } from "react";

type PageWrapperProps = {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

const PageWrapper = ({
  title,
  description,
  actions,
  children,
}: PageWrapperProps) => {
  return (
    <div className="min-w-0 overflow-hidden">
      {(title || actions) && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && (
              <h1
                className="text-2xl font-display font-bold text-foreground"
                data-testid="page-title"
              >
                {title}
              </h1>
            )}
            {description && (
              <p
                className="mt-1 text-muted-foreground"
                data-testid="page-description"
              >
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
export default PageWrapper;
