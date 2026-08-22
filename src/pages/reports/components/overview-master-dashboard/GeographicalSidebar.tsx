import React, { useState, useMemo } from "react";
import { Search, Layers, FolderOpen, Leaf, ChevronRight, ChevronDown } from "lucide-react";
import { mockTreeViewData, type TreeNode } from "../../constants/mockReportData";

interface GeographicalSidebarProps {
  selectedLocation: TreeNode | null;
  onSelectLocation: (node: TreeNode | null) => void;
}

export const GeographicalSidebar: React.FC<GeographicalSidebarProps> = ({
  selectedLocation,
  onSelectLocation,
}) => {
  const [treeSearchQuery, setTreeSearchQuery] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "r-1": true,
    "a-1": true,
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectNode = (node: TreeNode) => {
    if (selectedLocation?.id === node.id) {
      onSelectLocation(null); // Click again to deselect and view all
    } else {
      onSelectLocation(node);
    }
  };

  // Filter tree data recursively based on query
  const filteredTreeData = useMemo(() => {
    if (!treeSearchQuery) return mockTreeViewData;

    const filterNode = (node: TreeNode): TreeNode | null => {
      const matchesSearch = node.name.toLowerCase().includes(treeSearchQuery.toLowerCase());

      if (node.children) {
        const filteredChildren = node.children
          .map(filterNode)
          .filter((n): n is TreeNode => n !== null);
        
        if (filteredChildren.length > 0 || matchesSearch) {
          return { ...node, children: filteredChildren };
        }
      }

      if (matchesSearch) {
        return node;
      }

      return null;
    };

    return mockTreeViewData
      .map(filterNode)
      .filter((n): n is TreeNode => n !== null);
  }, [treeSearchQuery]);

  // Helper to render tree nodes recursively
  const renderTreeNode = (node: TreeNode, depth = 0) => {
    const isExpanded = treeSearchQuery ? true : !!expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedLocation?.id === node.id;

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

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-100 rounded-xl p-4 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
          Hệ thống vùng trồng
        </h3>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          Chọn địa điểm để xem báo cáo chi tiết
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm địa điểm..."
          value={treeSearchQuery}
          onChange={(e) => setTreeSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-all font-medium"
        />
      </div>

      {/* Tree view content */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-1.5 pr-1">
        {/* Reset / All Regions Node */}
        <div
          onClick={() => onSelectLocation(null)}
          className={`flex items-center gap-2 py-2.5 px-3 rounded-lg cursor-pointer transition-all ${
            selectedLocation === null
              ? "bg-emerald-50 font-semibold text-emerald-700 border-l-4 border-emerald-600 shadow-xs"
              : "hover:bg-slate-50 text-slate-750 font-medium"
          }`}
        >
          <Layers className={`w-4 h-4 ${selectedLocation === null ? "text-emerald-700" : "text-slate-400"}`} />
          <span className="text-xs">Tất cả vùng trồng</span>
        </div>

        <div className="border-t border-slate-50 my-2 pt-2 space-y-1">
          {filteredTreeData.length > 0 ? (
            filteredTreeData.map((node) => renderTreeNode(node))
          ) : (
            <p className="text-xs text-slate-400 text-center py-4">Không tìm thấy địa điểm</p>
          )}
        </div>
      </div>
    </div>
  );
};
