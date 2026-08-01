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
    <div>
      {(title || actions) && (
        <div className="mb-6 flex items-start justify-between gap-4">
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
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
export default PageWrapper;
