import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  getIconComponent,
  type AdminMenuSection,
  type MenuItem,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface ProfileSidebarFeaturesProps {
  sections: AdminMenuSection[];
}

export function ProfileSidebarFeatures({
  sections,
}: ProfileSidebarFeaturesProps) {
  const [, setLocation] = useLocation();

  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {sections.map((section, sectionIdx) => {
        if ("note" in section || !section.items || section.items.length === 0) {
          return null;
        }

        return (
          <div key={section.title || sectionIdx} className="space-y-2">
            <h3 className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              {section.title}
            </h3>

            <section className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden divide-y divide-slate-100 shadow-xs">
              {section.items.map((item) => (
                <SidebarFeatureRow
                  key={item.id}
                  item={item}
                  onNavigate={(href) => setLocation(href)}
                />
              ))}
            </section>
          </div>
        );
      })}
    </div>
  );
}

interface SidebarFeatureRowProps {
  item: MenuItem;
  onNavigate: (href: string) => void;
}

function SidebarFeatureRow({ item, onNavigate }: SidebarFeatureRowProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = getIconComponent(item.icon);
  const hasChildren = Boolean(item.children && item.children.length > 0);

  if (hasChildren) {
    return (
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-slate-50/80 active:bg-slate-100/60 focus:outline-none"
        >
          <div className="flex items-center gap-3.5 min-w-0 pr-2">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-700 transition-transform active:scale-95">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-slate-900">
                {item.label}
              </p>
              <p className="text-xs text-slate-500 truncate mt-0.5 font-normal">
                {item.children!.length} mục chức năng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 transition-transform" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 transition-transform" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="bg-slate-50/70 border-t border-slate-100 divide-y divide-slate-100/80">
            {item.children!.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => {
                  if (child.href) {
                    onNavigate(child.href);
                  }
                }}
                className="w-full flex items-center justify-between pl-14 pr-4 py-3 text-left transition-colors hover:bg-slate-100/80 active:bg-slate-200/50"
              >
                <span className="text-sm font-medium text-slate-700 truncate">
                  {child.label}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (item.href) {
          onNavigate(item.href);
        }
      }}
      className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-slate-50/80 active:bg-slate-100/60 focus:outline-none"
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-slate-100 text-slate-700 transition-transform active:scale-95">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate text-slate-900">
            {item.label}
          </p>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
    </button>
  );
}
