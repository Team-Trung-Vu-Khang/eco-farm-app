import {
  AutoCompleteSelect,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Info,
  Layers,
  Leaf,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { mockTreeViewData, type TreeNode } from "../constants/mockReportData";

export function MaterialConsumptionBlock() {
  // Select the first region by default
  const [selectedNode, setSelectedNode] = useState<TreeNode>(
    mockTreeViewData[0],
  );
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "r-1": true,
    "a-1": true,
  });

  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedStandard, setSelectedStandard] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");

  // Draft states for the Dialog
  const [draftCompany, setDraftCompany] = useState<string>("all");
  const [draftStandard, setDraftStandard] = useState<string>("all");
  const [draftStatus, setDraftStatus] = useState<string>("all");
  const [draftSize, setDraftSize] = useState<string>("all");

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [treeSearchQuery, setTreeSearchQuery] = useState("");

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectNode = (node: TreeNode) => {
    setSelectedNode(node);
  };

  const handleOpenDialog = () => {
    setDraftCompany(selectedCompany);
    setDraftStandard(selectedStandard);
    setDraftStatus(selectedStatus);
    setDraftSize(selectedSize);
    setDialogOpen(true);
  };

  const handleApplyFilters = () => {
    setSelectedCompany(draftCompany);
    setSelectedStandard(draftStandard);
    setSelectedStatus(draftStatus);
    setSelectedSize(draftSize);
    setDialogOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCompany("all");
    setSelectedStandard("all");
    setSelectedStatus("all");
    setSelectedSize("all");
    setDialogOpen(false);
  };

  // Check if a node matches metadata filters
  const matchesMetadata = (node: TreeNode): boolean => {
    if (node.type === "plot") {
      const matchesStandard =
        selectedStandard === "all" || node.standard === selectedStandard;

      const matchesStatus =
        selectedStatus === "all" || node.status === selectedStatus;

      const matchesCompany =
        selectedCompany === "all" || node.company === selectedCompany;

      let matchesSize = true;
      if (selectedSize !== "all") {
        const s = node.size || 0;
        if (selectedSize === "small") matchesSize = s < 1;
        else if (selectedSize === "medium") matchesSize = s >= 1 && s <= 5;
        else if (selectedSize === "large") matchesSize = s > 5;
      }

      return matchesStandard && matchesStatus && matchesSize && matchesCompany;
    }
    if (node.children) {
      return node.children.some(matchesMetadata);
    }
    return false;
  };

  // Filter tree data recursively based on query and metadata filters
  const filteredTreeData = useMemo(() => {
    const hasActiveFilters =
      treeSearchQuery !== "" ||
      selectedStandard !== "all" ||
      selectedStatus !== "all" ||
      selectedSize !== "all" ||
      selectedCompany !== "all";

    if (!hasActiveFilters) return mockTreeViewData;

    const filterNode = (node: TreeNode): TreeNode | null => {
      if (!matchesMetadata(node)) return null;

      const matchesSearch =
        !treeSearchQuery ||
        node.name.toLowerCase().includes(treeSearchQuery.toLowerCase());

      if (node.children) {
        if (matchesSearch) {
          const filteredChildren = node.children
            .map((c) => {
              if (!matchesMetadata(c)) return null;
              return c;
            })
            .filter((n): n is TreeNode => n !== null);
          return { ...node, children: filteredChildren };
        } else {
          const filteredChildren = node.children
            .map(filterNode)
            .filter((n): n is TreeNode => n !== null);
          if (filteredChildren.length > 0) {
            return { ...node, children: filteredChildren };
          }
        }
      }

      if (node.type === "plot" && matchesSearch) {
        return node;
      }

      return null;
    };

    return mockTreeViewData
      .map(filterNode)
      .filter((n): n is TreeNode => n !== null);
  }, [
    treeSearchQuery,
    selectedStandard,
    selectedStatus,
    selectedSize,
    selectedCompany,
  ]);

  // Reset selectedNode if it is filtered out
  useEffect(() => {
    if (filteredTreeData.length === 0) return;

    const containsNode = (nodes: TreeNode[], targetId: string): boolean => {
      for (const n of nodes) {
        if (n.id === targetId) return true;
        if (n.children && containsNode(n.children, targetId)) return true;
      }
      return false;
    };

    if (!containsNode(filteredTreeData, selectedNode.id)) {
      const findFirstNode = (nodes: TreeNode[]): TreeNode | null => {
        if (nodes.length === 0) return null;
        return nodes[0];
      };
      const firstNode = findFirstNode(filteredTreeData);
      if (firstNode) {
        setSelectedNode(firstNode);
      }
    }
  }, [filteredTreeData, selectedNode.id]);

  // Helper to render tree nodes recursively
  const renderTreeNode = (node: TreeNode, depth = 0) => {
    // Auto-expand nodes if search query is active so matches are visible
    const isExpanded = treeSearchQuery ? true : !!expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode.id === node.id;

    return (
      <div key={node.id} className="space-y-1">
        <div
          onClick={() => handleSelectNode(node)}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          className={`flex items-center gap-2 py-2.5 pr-2 rounded-lg cursor-pointer transition-all ${
            isSelected
              ? "bg-emerald-50 font-semibold text-emerald-700 border-l-4 border-emerald-600 shadow-xs"
              : "hover:bg-slate-50 text-slate-700 font-medium"
          }`}
        >
          {/* Toggle Expand Icon */}
          {hasChildren ? (
            <button
              onClick={(e) => toggleExpand(node.id, e)}
              className="p-0.5 hover:bg-slate-200/50 rounded-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-4.5" />
          )}

          {/* Folder/File Icon */}
          {node.type === "region" ? (
            <Layers
              className={`w-4 h-4 ${isSelected ? "text-emerald-700" : "text-slate-400"}`}
            />
          ) : node.type === "area" ? (
            <FolderOpen
              className={`w-4 h-4 ${isSelected ? "text-emerald-700" : "text-slate-400"}`}
            />
          ) : (
            <Leaf
              className={`w-4 h-4 ${isSelected ? "text-emerald-700" : "text-slate-400"}`}
            />
          )}

          <span className="text-xs truncate">{node.name}</span>
        </div>

        {/* Render children nodes if expanded */}
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Format with COMMA separator as per requirement: 1,200,000
  const formatNumber = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  // Detailed 3-tier mapping: Sub-category -> Array of specific items with ratios
  const subCategoryItemsMap: Record<
    string,
    {
      name: string;
      unit: string;
      ratio: number;
      trend: number;
      isIncrease: boolean;
    }[]
  > = {
    "Thuốc trừ sâu sinh học": [
      {
        name: "Nấm xanh Metarhizium",
        unit: "kg",
        ratio: 0.45,
        trend: 8,
        isIncrease: true,
      },
      {
        name: "Vi khuẩn Bacillus thuringiensis",
        unit: "kg",
        ratio: 0.55,
        trend: 5,
        isIncrease: false,
      },
    ],
    "Thuốc diệt nấm bệnh": [
      {
        name: "Nấm đối kháng Trichoderma",
        unit: "kg",
        ratio: 0.6,
        trend: 10,
        isIncrease: true,
      },
      {
        name: "Chế phẩm Đồng Bordeaux",
        unit: "kg",
        ratio: 0.4,
        trend: 3,
        isIncrease: true,
      },
    ],
    "Thuốc trừ cỏ sinh học": [
      {
        name: "Axit acetic nồng độ cao",
        unit: "kg",
        ratio: 1.0,
        trend: 12,
        isIncrease: true,
      },
    ],
    "Phân bón hữu cơ vi sinh": [
      {
        name: "Phân trùn quế cao cấp",
        unit: "kg",
        ratio: 0.57,
        trend: 15,
        isIncrease: true,
      },
      {
        name: "Phân chuồng hoai mục tinh chế",
        unit: "kg",
        ratio: 0.43,
        trend: 2,
        isIncrease: false,
      },
    ],
    "Phân NPK cao cấp": [
      {
        name: "NPK 16-16-8 Đầu Trâu",
        unit: "kg",
        ratio: 0.62,
        trend: 5,
        isIncrease: true,
      },
      {
        name: "NPK 15-15-15 nhập khẩu",
        unit: "kg",
        ratio: 0.38,
        trend: 8,
        isIncrease: false,
      },
    ],
    "Phân Lân & Kali": [
      {
        name: "Lân nung chảy Văn Điển",
        unit: "kg",
        ratio: 0.64,
        trend: 2,
        isIncrease: true,
      },
      {
        name: "Kali clorua đỏ",
        unit: "kg",
        ratio: 0.36,
        trend: 4,
        isIncrease: true,
      },
    ],
    "Máy cày & Máy phay đất": [
      {
        name: "Máy cày Kubota L5018",
        unit: "ngày",
        ratio: 0.53,
        trend: 10,
        isIncrease: true,
      },
      {
        name: "Máy phay đất Yanmar",
        unit: "ngày",
        ratio: 0.47,
        trend: 5,
        isIncrease: true,
      },
    ],
    "Hệ thống tưới tự động": [
      {
        name: "Hệ thống tưới nhỏ giọt Israel",
        unit: "ngày",
        ratio: 0.58,
        trend: 2,
        isIncrease: true,
      },
      {
        name: "Hệ thống tưới phun sương",
        unit: "ngày",
        ratio: 0.42,
        trend: 1,
        isIncrease: true,
      },
    ],
    "Máy phun thuốc tự hành": [
      {
        name: "Máy phun Drone DJI T40",
        unit: "ngày",
        ratio: 1.0,
        trend: 15,
        isIncrease: true,
      },
    ],
    "Màng phủ nông nghiệp": [
      {
        name: "Màng phủ PE đen khổ 1.2m",
        unit: "cuộn",
        ratio: 1.0,
        trend: 3,
        isIncrease: false,
      },
    ],
    "Lưới chắn côn trùng": [
      {
        name: "Lưới chắn 50 mesh trắng",
        unit: "tấm",
        ratio: 1.0,
        trend: 8,
        isIncrease: true,
      },
    ],
    "Dây cột giàn leo": [
      {
        name: "Dây se nông nghiệp tự phân hủy",
        unit: "cuộn",
        ratio: 1.0,
        trend: 5,
        isIncrease: true,
      },
    ],
  };

  // Helper to render consumption card with nested itemized DataTable
  const renderDetailCard = (
    title: string,
    icon: React.ReactNode,
    data: {
      total: number;
      trend: number;
      isIncrease: boolean;
      groups: { name: string; amount: number }[];
    },
    unit: string,
  ) => {
    const isBad = data.isIncrease;
    const trendColor = isBad
      ? "text-rose-600 bg-rose-50"
      : "text-emerald-600 bg-emerald-50";

    return (
      <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
        {/* Category Header */}
        <CardHeader className="pb-3 border-b border-slate-50 p-5 flex flex-row items-center justify-between space-y-0 bg-slate-50/30 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
              {icon}
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {title}
              </CardTitle>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Tổng tiêu thụ thực tế
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-display font-extrabold text-slate-800 font-mono">
              {formatNumber(data.total)}{" "}
              <span className="text-xs text-slate-400 font-sans font-medium">
                {unit}
              </span>
            </span>
            <span
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold ${trendColor}`}
            >
              {data.isIncrease ? (
                <TrendingUp className="w-3 h-3 shrink-0" />
              ) : (
                <TrendingDown className="w-3 h-3 shrink-0" />
              )}
              <span>{Math.abs(data.trend)}%</span>
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-6">
          {/* Loop over sub-categories */}
          {data.groups.map((group, groupIdx) => {
            const items = subCategoryItemsMap[group.name] || [];

            return (
              <div key={groupIdx} className="space-y-2">
                {/* Sub-category Header */}
                <div className="flex items-center justify-between bg-slate-50/80 px-3 py-2 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-slate-700">
                    {group.name}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Tổng: {formatNumber(group.amount)} {unit}
                  </span>
                </div>

                {/* Itemized Table */}
                <div className="overflow-x-auto border border-slate-100 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold">
                        <th className="p-2.5 font-semibold text-slate-500">
                          Tên vật tư
                        </th>
                        <th className="p-2.5 font-semibold text-slate-500 w-20 text-center">
                          Đơn vị
                        </th>
                        <th className="p-2.5 font-semibold text-slate-500 w-28 text-right">
                          Số lượng
                        </th>
                        <th className="p-2.5 font-semibold text-slate-500 w-28 text-center">
                          Biến động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                      {items.map((item, itemIdx) => {
                        const itemAmount = Math.max(
                          1,
                          Math.round(group.amount * item.ratio),
                        );
                        const itemTrendColor = item.isIncrease
                          ? "text-rose-600 bg-rose-50/50"
                          : "text-emerald-600 bg-emerald-50/50";

                        return (
                          <tr
                            key={itemIdx}
                            className="hover:bg-slate-50/30 transition-colors"
                          >
                            <td className="p-2.5 text-slate-700 font-bold">
                              {item.name}
                            </td>
                            <td className="p-2.5 text-slate-400 text-center uppercase font-bold text-[10px]">
                              {item.unit}
                            </td>
                            <td className="p-2.5 text-slate-800 text-right font-bold font-mono">
                              {formatNumber(itemAmount)}
                            </td>
                            <td className="p-2.5 text-center">
                              <span
                                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${itemTrendColor}`}
                              >
                                {item.isIncrease ? (
                                  <TrendingUp className="w-2.5 h-2.5" />
                                ) : (
                                  <TrendingDown className="w-2.5 h-2.5" />
                                )}
                                <span>{item.trend}%</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  const companyOptions = [
    { label: "Tất cả đơn vị", value: "all" },
    { label: "Công ty Cổ phần Nông nghiệp EcoFarm", value: "ecofarm" },
    { label: "Hợp tác xã Dịch vụ Nông nghiệp Hòa Bình", value: "hoabinh" },
    { label: "Công ty TNHH MTV Thủy sản Mekong", value: "mekong" },
  ];

  const standardOptions = [
    { label: "Tất cả tiêu chuẩn", value: "all" },
    { label: "VietGAP", value: "VietGAP" },
    { label: "GlobalGAP", value: "GlobalGAP" },
    { label: "Hữu cơ (Organic)", value: "Organic" },
  ];

  const statusOptions = [
    { label: "Tất cả trạng thái", value: "all" },
    { label: "Đang hoạt động", value: "Active" },
    { label: "Nghỉ vụ / Đất cải tạo", value: "Inactive" },
  ];

  const sizeOptions = [
    { label: "Tất cả quy mô", value: "all" },
    { label: "Quy mô nhỏ (< 1 ha)", value: "small" },
    { label: "Quy mô trung bình (1 - 5 ha)", value: "medium" },
    { label: "Quy mô lớn (> 5 ha)", value: "large" },
  ];

  const cons = selectedNode.consumption;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Tiêu đề & Thông báo màu nghịch đảo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
        {/* <div>
          <h3 className="text-base font-bold text-slate-700 uppercase tracking-wide">
            Giám sát lượng vật tư tiêu thụ
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Chọn nút vùng trên cây thư mục bên trái để xem thống kê tiêu thụ vật tư tương ứng.
          </p>
        </div> */}

        {/* Tooltip hoặc cảnh báo màu sắc */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-lg border border-amber-100 text-amber-700 text-xs font-semibold max-w-xs">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>
            Màu cảnh báo vật tư: Tăng lượng tiêu thụ (Đỏ), Giảm (Xanh tốt)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Cột trái: Tree View (Responsive: Full width on mobile, 3 cols on desktop) */}
        <div className="col-span-12 lg:col-span-3 border border-slate-100 rounded-xl p-4 bg-white shadow-xs max-h-[500px] overflow-y-auto space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
            Hệ thống phân cấp vùng
          </div>

          {/* Search and Advanced Filter Trigger */}
          <div className="flex gap-1.5 mt-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm vùng/khu vực/lô..."
                value={treeSearchQuery}
                onChange={(e) => setTreeSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold pl-8 pr-4 py-1.5 border border-slate-205 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 h-8"
              />
            </div>
            <button
              onClick={handleOpenDialog}
              className={`p-1.5 rounded-lg border transition-all hover:bg-slate-50 cursor-pointer h-8 w-8 flex items-center justify-center shrink-0 ${
                selectedStandard !== "all" ||
                selectedStatus !== "all" ||
                selectedSize !== "all" ||
                selectedCompany !== "all"
                  ? "border-emerald-250 bg-emerald-55 text-emerald-600 font-bold"
                  : "border-slate-205 text-slate-500"
              }`}
              title="Bộ lọc nâng cao"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Advanced Filter Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-md bg-white p-6 rounded-xl border border-slate-100 shadow-md">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                  <span>Bộ lọc nâng cao phân cấp vùng</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Company Filter */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-600 block">
                    Đơn vị / Công ty quản lý
                  </Label>
                  <AutoCompleteSelect
                    options={companyOptions}
                    value={draftCompany}
                    onChange={(value) => setDraftCompany(value)}
                    placeholder="Chọn đơn vị quản lý"
                  />
                </div>

                {/* Standard Filter */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-600 block">
                    Tiêu chuẩn canh tác
                  </Label>
                  <AutoCompleteSelect
                    options={standardOptions}
                    value={draftStandard}
                    onChange={(value) => setDraftStandard(value)}
                    placeholder="Chọn tiêu chuẩn"
                  />
                </div>

                {/* Status Filter */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-600 block">
                    Trạng thái canh tác
                  </Label>
                  <AutoCompleteSelect
                    options={statusOptions}
                    value={draftStatus}
                    onChange={(value) => setDraftStatus(value)}
                    placeholder="Chọn trạng thái"
                  />
                </div>

                {/* Size Filter */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-600 block">
                    Quy mô diện tích
                  </Label>
                  <AutoCompleteSelect
                    options={sizeOptions}
                    value={draftSize}
                    onChange={(value) => setDraftSize(value)}
                    placeholder="Chọn quy mô"
                  />
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between border-t border-slate-100 pt-3 gap-2">
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-50 border-rose-200 h-9 transition-colors cursor-pointer"
                >
                  Xóa bộ lọc
                </Button>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setDialogOpen(false)}
                    variant="ghost"
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 h-9 cursor-pointer"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleApplyFilters}
                    className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4 cursor-pointer"
                  >
                    Áp dụng lọc
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="space-y-1">
            {filteredTreeData.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-4">
                Chưa có thông tin
              </div>
            ) : (
              filteredTreeData.map((node) => renderTreeNode(node))
            )}
          </div>
        </div>

        {/* Cột phải: Chi tiết tiêu thụ (Responsive: Full width on mobile, 9 cols on desktop) */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Đang xem:
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md">
                {selectedNode.name}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">
              Loại:{" "}
              {selectedNode.type === "region"
                ? "Vùng trồng"
                : selectedNode.type === "area"
                  ? "Khu vực"
                  : "Lô trồng"}
            </span>
          </div>

          <div className="space-y-6">
            {renderDetailCard(
              "Thuốc BVTV canh tác",
              <ShieldAlert className="w-5 h-5 text-rose-500" />,
              cons.pesticide,
              "kg",
            )}
            {renderDetailCard(
              "Phân bón chất lượng cao",
              <Leaf className="w-5 h-5 text-emerald-500" />,
              cons.fertilizer,
              "kg",
            )}
            {renderDetailCard(
              "Máy móc & thiết bị",
              <Wrench className="w-5 h-5 text-amber-500" />,
              cons.equipment,
              "ngày",
            )}
            {renderDetailCard(
              "Vật tư canh tác khác",
              <Layers className="w-5 h-5 text-sky-500" />,
              cons.other,
              "cuộn/tấm",
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
