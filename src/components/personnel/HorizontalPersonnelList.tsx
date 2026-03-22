import { Badge, cn, Input } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Search,
  Star,
  User,
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { type Personnel } from "../../stores/usePersonnelStore";

interface HorizontalPersonnelListProps {
  personnel: Personnel[];
  title?: string;
  onSelect?: (personnel: Personnel) => void;
  selectedIds?: number[];
  className?: string;
  showSearch?: boolean;
  showLabel?: boolean;
}

export const HorizontalPersonnelList: React.FC<
  HorizontalPersonnelListProps
> = ({
  showLabel,
  showSearch,
  onSelect,
  personnel,
  className,
  selectedIds = [],
  title = "Nhân sự quản lý",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredPersonnel = useMemo(() => {
    if (!searchQuery.trim()) return personnel;
    const query = searchQuery.toLowerCase();
    return personnel.filter(
      (p) =>
        p.fullName.toLowerCase().includes(query) ||
        p.position.toLowerCase().includes(query) ||
        p.department.toLowerCase().includes(query) ||
        p.team.toLowerCase().includes(query),
    );
  }, [personnel, searchQuery]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350; // Approximated card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {showLabel ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">{title}</span>
            <Badge variant="secondary" className="ml-2 font-mono">
              {filteredPersonnel.length}
            </Badge>
          </div>
        ) : (
          <></>
        )}

        {showSearch ? (
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 z-30 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              placeholder="Tìm kiếm nhân sự..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 bg-white border-slate-200 focus:border-primary transition-all rounded-md"
            />
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="relative group">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="cursor-pointer justify-center items-center w-10 h-10 rounded-full absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border-slate-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
        >
          {filteredPersonnel.length > 0 ? (
            filteredPersonnel.map((person) => (
              <div
                key={person.id}
                onClick={() => onSelect?.(person)}
                className={cn(
                  "flex-none w-87.5 p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                  selectedIds.includes(person.id)
                    ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20"
                    : "bg-white border-slate-100 hover:border-primary/30 hover:shadow-md",
                )}
              >
                <div className="absolute top-0 right-0 rounded-bl-md bg-amber-400 px-2 py-1 text-sm font-semibold text-white flex gap-1 items-center">
                  <Star className="w-4 h-4 fill-white" /> <span>Quản lý</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden text-2xl border border-primary/20 shrink-0">
                    {person.avatar ? (
                      <img
                        src={person.avatar}
                        alt={person.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      person.fullName.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="font-bold text-lg text-slate-900 leading-tight truncate">
                      {person.fullName}
                    </div>
                    <div className="text-primary font-bold text-sm tracking-wide truncate">
                      {person.position}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {person.department} • {person.team}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-3">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {person.phone || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {person.email || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-10 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <User className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm text-slate-500 italic">
                Không tìm thấy nhân sự phù hợp
              </p>
            </div>
          )}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className="cursor-pointer justify-center items-center absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border-slate-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </div>
  );
};
