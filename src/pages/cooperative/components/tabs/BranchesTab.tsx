import {
  Card,
  CardContent,
  Input,
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import type { Branch } from "../../types/types";

interface BranchesTabProps {
  branches: Branch[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function BranchesTab({
  branches,
  searchQuery,
  setSearchQuery,
}: BranchesTabProps) {
  const [, setLocation] = useLocation();

  const filteredBranches = branches?.filter(
    (b: Branch) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm chi nhánh..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid gap-4">
        {filteredBranches?.map((branch: Branch, i: number) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    className="font-bold text-lg cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setLocation(`/branch/${i}/edit`)}
                  >
                    {branch.name}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {branch.address}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-green-600 bg-green-50 shrink-0"
                >
                  Hoạt động
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                    Mã số thuế:
                  </span>
                  <div className="font-medium">{branch.taxCode || "-"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                    Điện thoại:
                  </span>
                  <div className="font-medium">{branch.phone || "-"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                    Email:
                  </span>
                  <div className="font-medium truncate" title={branch.email}>
                    {branch.email || "-"}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                    Ghi chú:
                  </span>
                  <div className="font-medium truncate" title={branch.note}>
                    {branch.note || "-"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
