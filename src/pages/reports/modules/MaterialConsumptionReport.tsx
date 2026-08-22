import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  AutoCompleteSelect,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  FolderOpen,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Info,
  ShieldAlert,
  Wrench,
  Layers,
  Leaf,
  Search,
  Activity,
  Award,
  SlidersHorizontal,
} from "lucide-react";

interface TreeNode {
  id: string;
  name: string;
  type: "region" | "area" | "plot";
  children?: TreeNode[];
  standard?: "VietGAP" | "GlobalGAP" | "Organic";
  status?: "Active" | "Inactive";
  size?: number; // size in hectares
  consumption: {
    pesticide: {
      total: number;
      trend: number;
      isIncrease: boolean;
      groups: { name: string; amount: number }[];
    };
    fertilizer: {
      total: number;
      trend: number;
      isIncrease: boolean;
      groups: { name: string; amount: number }[];
    };
    equipment: {
      total: number;
      trend: number;
      isIncrease: boolean;
      groups: { name: string; amount: number }[];
    };
    other: {
      total: number;
      trend: number;
      isIncrease: boolean;
      groups: { name: string; amount: number }[];
    };
  };
}

interface MaterialConsumptionReportProps {
  domainType: "crops" | "livestock" | "aqua";
}

export const MaterialConsumptionReport: React.FC<
  MaterialConsumptionReportProps
> = ({ domainType }) => {
  // Domain specific tree view structures
  const treeData: TreeNode[] = useMemo(() => {
    if (domainType === "crops") {
      return [
        {
          id: "cr-1",
          name: "Vùng Trồng Sầu Riêng A",
          type: "region",
          children: [
            {
              id: "ca-1",
              name: "Khu vực sầu riêng Ri6",
              type: "area",
              children: [
                {
                  id: "cp-1",
                  name: "Lô Ri6-01",
                  type: "plot",
                  standard: "VietGAP",
                  status: "Active",
                  size: 4.5,
                  consumption: {
                    pesticide: {
                      total: 1250,
                      trend: 15,
                      isIncrease: true,
                      groups: [
                        { name: "Thuốc phòng rầy", amount: 800 },
                        { name: "Thuốc trừ nấm", amount: 450 },
                      ],
                    },
                    fertilizer: {
                      total: 8400,
                      trend: 5,
                      isIncrease: false,
                      groups: [
                        { name: "NPK 16-16-8", amount: 5000 },
                        { name: "Lân vi sinh", amount: 3400 },
                      ],
                    },
                    equipment: {
                      total: 45,
                      trend: 10,
                      isIncrease: true,
                      groups: [
                        { name: "Máy phun thuốc", amount: 30 },
                        { name: "Máy cắt cỏ", amount: 15 },
                      ],
                    },
                    other: {
                      total: 85,
                      trend: 12,
                      isIncrease: true,
                      groups: [{ name: "Lưới bọc trái", amount: 85 }],
                    },
                  },
                },
                {
                  id: "cp-2",
                  name: "Lô Ri6-02",
                  type: "plot",
                  standard: "GlobalGAP",
                  status: "Active",
                  size: 3.2,
                  consumption: {
                    pesticide: {
                      total: 950,
                      trend: 8,
                      isIncrease: false,
                      groups: [
                        { name: "Thuốc phòng rầy", amount: 600 },
                        { name: "Thuốc trừ nấm", amount: 350 },
                      ],
                    },
                    fertilizer: {
                      total: 7200,
                      trend: 12,
                      isIncrease: false,
                      groups: [
                        { name: "NPK 16-16-8", amount: 4200 },
                        { name: "Lân vi sinh", amount: 3000 },
                      ],
                    },
                    equipment: {
                      total: 32,
                      trend: 5,
                      isIncrease: false,
                      groups: [
                        { name: "Máy phun thuốc", amount: 20 },
                        { name: "Máy cắt cỏ", amount: 12 },
                      ],
                    },
                    other: {
                      total: 60,
                      trend: 15,
                      isIncrease: false,
                      groups: [{ name: "Lưới bọc trái", amount: 60 }],
                    },
                  },
                },
              ],
              consumption: {
                pesticide: {
                  total: 2200,
                  trend: 11,
                  isIncrease: true,
                  groups: [
                    { name: "Thuốc phòng rầy", amount: 1400 },
                    { name: "Thuốc trừ nấm", amount: 800 },
                  ],
                },
                fertilizer: {
                  total: 15600,
                  trend: 8,
                  isIncrease: false,
                  groups: [
                    { name: "NPK 16-16-8", amount: 9200 },
                    { name: "Lân vi sinh", amount: 6400 },
                  ],
                },
                equipment: {
                  total: 77,
                  trend: 7,
                  isIncrease: true,
                  groups: [
                    { name: "Máy phun thuốc", amount: 50 },
                    { name: "Máy cắt cỏ", amount: 27 },
                  ],
                },
                other: {
                  total: 145,
                  trend: 14,
                  isIncrease: true,
                  groups: [{ name: "Lưới bọc trái", amount: 145 }],
                },
              },
            },
          ],
          consumption: {
            pesticide: {
              total: 2200,
              trend: 11,
              isIncrease: true,
              groups: [
                { name: "Thuốc phòng rầy", amount: 1400 },
                { name: "Thuốc trừ nấm", amount: 800 },
              ],
            },
            fertilizer: {
              total: 15600,
              trend: 8,
              isIncrease: false,
              groups: [
                { name: "NPK 16-16-8", amount: 9200 },
                { name: "Lân vi sinh", amount: 6400 },
              ],
            },
            equipment: {
              total: 77,
              trend: 7,
              isIncrease: true,
              groups: [
                { name: "Máy phun thuốc", amount: 50 },
                { name: "Máy cắt cỏ", amount: 27 },
              ],
            },
            other: {
              total: 145,
              trend: 14,
              isIncrease: true,
              groups: [{ name: "Lưới bọc trái", amount: 145 }],
            },
          },
        },
      ];
    } else if (domainType === "livestock") {
      return [
        {
          id: "lr-1",
          name: "Trại Chăn Nuôi Heo Thịt B",
          type: "region",
          children: [
            {
              id: "la-1",
              name: "Phân khu heo thịt F1",
              type: "area",
              children: [
                {
                  id: "lp-1",
                  name: "Chuồng H1-01",
                  type: "plot",
                  standard: "VietGAP",
                  status: "Active",
                  size: 2.5,
                  company: "ecofarm",
                  consumption: {
                    pesticide: {
                      total: 850,
                      trend: 20,
                      isIncrease: true,
                      groups: [
                        { name: "Vắc-xin phòng dịch", amount: 500 },
                        { name: "Vitamin bổ trợ", amount: 350 },
                      ],
                    },
                    fertilizer: {
                      total: 12500,
                      trend: 8,
                      isIncrease: true,
                      groups: [
                        { name: "Cám heo lớn Cargill", amount: 8500 },
                        { name: "Cám heo nhỏ", amount: 4000 },
                      ],
                    },
                    equipment: {
                      total: 90,
                      trend: 12,
                      isIncrease: true,
                      groups: [
                        { name: "Quạt làm mát", amount: 60 },
                        { name: "Hệ thống sưởi", amount: 30 },
                      ],
                    },
                    other: {
                      total: 120,
                      trend: 5,
                      isIncrease: false,
                      groups: [{ name: "Thuốc khử khuẩn", amount: 120 }],
                    },
                  },
                },
                {
                  id: "lp-2",
                  name: "Chuồng H1-02",
                  type: "plot",
                  standard: "Organic",
                  status: "Active",
                  size: 1.8,
                  company: "hoabinh",
                  consumption: {
                    pesticide: {
                      total: 720,
                      trend: 5,
                      isIncrease: false,
                      groups: [
                        { name: "Vắc-xin phòng dịch", amount: 450 },
                        { name: "Vitamin bổ trợ", amount: 270 },
                      ],
                    },
                    fertilizer: {
                      total: 11000,
                      trend: 4,
                      isIncrease: true,
                      groups: [
                        { name: "Cám heo lớn Cargill", amount: 7500 },
                        { name: "Cám heo nhỏ", amount: 3500 },
                      ],
                    },
                    equipment: {
                      total: 80,
                      trend: 2,
                      isIncrease: true,
                      groups: [
                        { name: "Quạt làm mát", amount: 55 },
                        { name: "Hệ thống sưởi", amount: 25 },
                      ],
                    },
                    other: {
                      total: 95,
                      trend: 10,
                      isIncrease: false,
                      groups: [{ name: "Thuốc khử khuẩn", amount: 95 }],
                    },
                  },
                },
              ],
              consumption: {
                pesticide: {
                  total: 1570,
                  trend: 12,
                  isIncrease: true,
                  groups: [
                    { name: "Vắc-xin phòng dịch", amount: 950 },
                    { name: "Vitamin bổ trợ", amount: 620 },
                  ],
                },
                fertilizer: {
                  total: 23500,
                  trend: 6,
                  isIncrease: true,
                  groups: [
                    { name: "Cám heo lớn Cargill", amount: 16000 },
                    { name: "Cám heo nhỏ", amount: 7500 },
                  ],
                },
                equipment: {
                  total: 170,
                  trend: 7,
                  isIncrease: true,
                  groups: [
                    { name: "Quạt làm mát", amount: 115 },
                    { name: "Hệ thống sưởi", amount: 55 },
                  ],
                },
                other: {
                  total: 215,
                  trend: 8,
                  isIncrease: false,
                  groups: [{ name: "Thuốc khử khuẩn", amount: 215 }],
                },
              },
            },
          ],
          consumption: {
            pesticide: {
              total: 1570,
              trend: 12,
              isIncrease: true,
              groups: [
                { name: "Vắc-xin phòng dịch", amount: 950 },
                { name: "Vitamin bổ trợ", amount: 620 },
              ],
            },
            fertilizer: {
              total: 23500,
              trend: 6,
              isIncrease: true,
              groups: [
                { name: "Cám heo lớn Cargill", amount: 16000 },
                { name: "Cám heo nhỏ", amount: 7500 },
              ],
            },
            equipment: {
              total: 170,
              trend: 7,
              isIncrease: true,
              groups: [
                { name: "Quạt làm mát", amount: 115 },
                { name: "Hệ thống sưởi", amount: 55 },
              ],
            },
            other: {
              total: 215,
              trend: 8,
              isIncrease: false,
              groups: [{ name: "Thuốc khử khuẩn", amount: 215 }],
            },
          },
        },
      ];
    } else {
      return [
        {
          id: "ar-1",
          name: "Khu Nuôi Tôm Công Nghệ Cao C",
          type: "region",
          children: [
            {
              id: "aa-1",
              name: "Phân trại ao tôm thẻ",
              type: "area",
              children: [
                {
                  id: "ap-1",
                  name: "Ao Tôm T3",
                  type: "plot",
                  standard: "GlobalGAP",
                  status: "Active",
                  size: 0.9,
                  company: "mekong",
                  consumption: {
                    pesticide: {
                      total: 540,
                      trend: 15,
                      isIncrease: false,
                      groups: [
                        { name: "Chế phẩm diệt khuẩn ao", amount: 300 },
                        { name: "Khoáng bột kích lột", amount: 240 },
                      ],
                    },
                    fertilizer: {
                      total: 9500,
                      trend: 14,
                      isIncrease: true,
                      groups: [
                        { name: "Thức ăn tôm UP", amount: 6500 },
                        { name: "Men tiêu hóa vi sinh", amount: 3000 },
                      ],
                    },
                    equipment: {
                      total: 120,
                      trend: 8,
                      isIncrease: true,
                      groups: [
                        { name: "Hệ thống quạt nước", amount: 80 },
                        { name: "Bơm sục khí", amount: 40 },
                      ],
                    },
                    other: {
                      total: 250,
                      trend: 5,
                      isIncrease: true,
                      groups: [{ name: "Lưới lọc nước ao", amount: 250 }],
                    },
                  },
                },
                {
                  id: "ap-2",
                  name: "Ao Tôm T4",
                  type: "plot",
                  standard: "Organic",
                  status: "Inactive",
                  size: 0.6,
                  company: "mekong",
                  consumption: {
                    pesticide: {
                      total: 480,
                      trend: 8,
                      isIncrease: false,
                      groups: [
                        { name: "Chế phẩm diệt khuẩn ao", amount: 280 },
                        { name: "Khoáng bột kích lột", amount: 200 },
                      ],
                    },
                    fertilizer: {
                      total: 8100,
                      trend: 10,
                      isIncrease: true,
                      groups: [
                        { name: "Thức ăn tôm UP", amount: 5600 },
                        { name: "Men tiêu hóa vi sinh", amount: 2500 },
                      ],
                    },
                    equipment: {
                      total: 105,
                      trend: 5,
                      isIncrease: true,
                      groups: [
                        { name: "Hệ thống quạt nước", amount: 70 },
                        { name: "Bơm sục khí", amount: 35 },
                      ],
                    },
                    other: {
                      total: 180,
                      trend: 12,
                      isIncrease: false,
                      groups: [{ name: "Lưới lọc nước ao", amount: 180 }],
                    },
                  },
                },
              ],
              consumption: {
                pesticide: {
                  total: 1020,
                  trend: 11,
                  isIncrease: false,
                  groups: [
                    { name: "Chế phẩm diệt khuẩn ao", amount: 580 },
                    { name: "Khoáng bột kích lột", amount: 440 },
                  ],
                },
                fertilizer: {
                  total: 17600,
                  trend: 12,
                  isIncrease: true,
                  groups: [
                    { name: "Thức ăn tôm UP", amount: 12100 },
                    { name: "Men tiêu hóa vi sinh", amount: 5500 },
                  ],
                },
                equipment: {
                  total: 225,
                  trend: 6,
                  isIncrease: true,
                  groups: [
                    { name: "Hệ thống quạt nước", amount: 150 },
                    { name: "Bơm sục khí", amount: 75 },
                  ],
                },
                other: {
                  total: 430,
                  trend: 4,
                  isIncrease: true,
                  groups: [{ name: "Lưới lọc nước ao", amount: 430 }],
                },
              },
            },
          ],
          consumption: {
            pesticide: {
              total: 1020,
              trend: 11,
              isIncrease: false,
              groups: [
                { name: "Chế phẩm diệt khuẩn ao", amount: 580 },
                { name: "Khoáng bột kích lột", amount: 440 },
              ],
            },
            fertilizer: {
              total: 17600,
              trend: 12,
              isIncrease: true,
              groups: [
                { name: "Thức ăn tôm UP", amount: 12100 },
                { name: "Men tiêu hóa vi sinh", amount: 5500 },
              ],
            },
            equipment: {
              total: 225,
              trend: 6,
              isIncrease: true,
              groups: [
                { name: "Hệ thống quạt nước", amount: 150 },
                { name: "Bơm sục khí", amount: 75 },
              ],
            },
            other: {
              total: 430,
              trend: 4,
              isIncrease: true,
              groups: [{ name: "Lưới lọc nước ao", amount: 430 }],
            },
          },
        },
      ];
    }
  }, [domainType]);

  const [selectedNode, setSelectedNode] = useState<TreeNode>(treeData[0]);

  // Reset selectedNode to treeData[0] when domainType or treeData changes
  useEffect(() => {
    if (treeData && treeData.length > 0) {
      setSelectedNode(treeData[0]);
      
      const defaultOpen: Record<string, boolean> = {};
      defaultOpen[treeData[0].id] = true;
      if (treeData[0].children?.[0]) {
        defaultOpen[treeData[0].children[0].id] = true;
      }
      setExpandedNodes(defaultOpen);
    }
  }, [domainType, treeData]);

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    () => {
      const defaultOpen: Record<string, boolean> = {};
      if (treeData[0]) {
        defaultOpen[treeData[0].id] = true;
        if (treeData[0].children?.[0]) {
          defaultOpen[treeData[0].children[0].id] = true;
        }
      }
      return defaultOpen;
    },
  );

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

    if (!hasActiveFilters) return treeData;

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

    return treeData.map(filterNode).filter((n): n is TreeNode => n !== null);
  }, [
    treeSearchQuery,
    selectedStandard,
    selectedStatus,
    selectedSize,
    selectedCompany,
    treeData,
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

          <FolderOpen
            className={`w-4 h-4 ${isSelected ? "text-emerald-700" : "text-slate-400"}`}
          />
          <span className="text-xs truncate">{node.name}</span>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  // Resolve detail cards labels depending on domain
  const getPesticideLabel = () => {
    if (domainType === "crops") return "Thuốc BVTV canh tác";
    if (domainType === "livestock") return "Vắc-xin & Thuốc thú y";
    return "Chế phẩm diệt khuẩn ao";
  };

  const getFertilizerLabel = () => {
    if (domainType === "crops") return "Phân bón chất lượng cao";
    return "Thức ăn dinh dưỡng hỗn hợp";
  };

  const getPesticideIcon = () => {
    return <ShieldAlert className="w-4 h-4 text-rose-500" />;
  };

  const getFertilizerIcon = () => {
    return <Leaf className="w-4 h-4 text-emerald-500" />;
  };

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
    // INVERSE COLORS: increase is bad (Red), decrease is good (Green)
    const isBad = data.isIncrease;
    const trendColor = isBad
      ? "text-rose-600 bg-rose-50"
      : "text-emerald-600 bg-emerald-50";

    return (
      <Card className="border border-slate-100 shadow-xs bg-white flex flex-col justify-between">
        <CardHeader className="pb-2 p-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </CardTitle>
          <div className="text-slate-400">{icon}</div>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-display font-extrabold text-slate-800 font-mono">
              {formatNumber(data.total)}{" "}
              <span className="text-sm text-slate-400 font-sans font-medium">
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

          <div className="space-y-2.5 border-t border-slate-50 pt-3">
            {data.groups.map((group, index) => {
              const percentage =
                data.total > 0
                  ? Math.round((group.amount / data.total) * 100)
                  : 0;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span className="truncate">{group.name}</span>
                    <span className="font-mono text-slate-650 shrink-0">
                      {formatNumber(group.amount)} {unit} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`${
                        percentage > 80 ? "bg-rose-500" : "bg-emerald-500"
                      } h-full rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
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

  const cons = selectedNode
    ? selectedNode.consumption
    : treeData[0].consumption;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-lg border border-amber-100 text-amber-700 text-xs font-semibold max-w-xs">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>
            Cảnh báo: Tăng lượng tiêu thụ (Đỏ), Giảm lượng tiêu thụ (Xanh tốt)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3 border border-slate-100 rounded-xl p-4 bg-white shadow-xs max-h-[500px] overflow-y-auto space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
            Hệ thống phân cấp vùng
          </div>

          <div className="flex gap-1.5 mt-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm vùng/khu/lô..."
                value={treeSearchQuery}
                onChange={(e) => setTreeSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold pl-8 pr-4 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 h-8"
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

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-md bg-white p-6 rounded-xl border border-slate-100 shadow-md">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                  <span>Bộ lọc nâng cao phân cấp vùng</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
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
                Không tìm thấy kết quả
              </div>
            ) : (
              filteredTreeData.map((node) => renderTreeNode(node))
            )}
          </div>
        </div>

        {/* Right Column: Cards */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Đang xem:
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md">
                {selectedNode ? selectedNode.name : treeData[0].name}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderDetailCard(
              getPesticideLabel(),
              getPesticideIcon(),
              cons.pesticide,
              "kg/lít",
            )}
            {renderDetailCard(
              getFertilizerLabel(),
              getFertilizerIcon(),
              cons.fertilizer,
              "kg/bao",
            )}
            {renderDetailCard(
              "Máy móc & thiết bị",
              <Wrench className="w-4 h-4 text-amber-500" />,
              cons.equipment,
              "ngày dùng",
            )}
            {renderDetailCard(
              "Vật tư đóng gói & phụ trợ",
              <Layers className="w-4 h-4 text-sky-500" />,
              cons.other,
              "đơn vị",
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
