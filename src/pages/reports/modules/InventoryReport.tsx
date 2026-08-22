import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Package,
  AlertOctagon,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { mockDomainData } from "../constants/mockDomainData";

interface InventoryReportProps {
  domainType: "crops" | "livestock" | "aqua";
}

export const InventoryReport: React.FC<InventoryReportProps> = ({ domainType }) => {
  const data = mockDomainData[domainType];

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  const columns = [
    {
      key: "name",
      label: "Tên Vật Tư",
      render: (val: any) => (
        <span className="font-bold text-slate-700 text-sm block max-w-md truncate text-left">
          {val as string}
        </span>
      ),
    },
    {
      key: "unit",
      label: "Đơn Vị",
      render: (val: any) => (
        <span className="text-slate-500 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100">
          {val as string}
        </span>
      ),
    },
    {
      key: "startQty",
      label: "Đầu Kỳ",
      render: (val: any) => (
        <span className="font-mono text-xs text-slate-600 font-semibold block text-right">
          {formatNumber(val as number)}
        </span>
      ),
    },
    {
      key: "inQty",
      label: "Nhập Kỳ",
      render: (val: any) => (
        <span className="font-mono text-xs text-emerald-600 font-bold block text-right">
          +{formatNumber(val as number)}
        </span>
      ),
    },
    {
      key: "outQty",
      label: "Xuất Kỳ",
      render: (val: any) => (
        <span className="font-mono text-xs text-rose-500 font-bold block text-right">
          -{formatNumber(val as number)}
        </span>
      ),
    },
    {
      key: "endQty",
      label: "Cuối Kỳ",
      render: (val: any) => {
        const qty = val as number;
        // Highlight low stock
        const isLow = qty <= 55;
        const color = isLow ? "text-rose-600 bg-rose-50 border-rose-100 px-2 py-0.5 rounded font-extrabold block text-right" : "text-slate-800 font-extrabold font-mono block text-right";
        return (
          <span className={color}>
            {formatNumber(qty)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total value */}
        <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
          <CardHeader className="pb-2 p-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng giá trị tồn kho ước tính
            </CardTitle>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-extrabold text-slate-800 font-display">
              {formatNumber(data.inventoryStats.totalValue)}đ
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Định giá dựa trên đơn giá nhập gần nhất
            </p>
          </CardContent>
        </Card>

        {/* Expiring materials */}
        <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
          <CardHeader className="pb-2 p-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Vật tư sắp hết hạn sử dụng
            </CardTitle>
            <div className="p-2 bg-rose-50 rounded-lg">
              <AlertOctagon className="w-5 h-5 text-rose-500 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-extrabold text-rose-600 font-display">
              {data.inventoryStats.expiringCount} mã
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Cần ưu tiên sử dụng trong vòng 30 ngày
            </p>
          </CardContent>
        </Card>

        {/* Low stock alerts */}
        <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
          <CardHeader className="pb-2 p-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Vật tư dưới mức tối thiểu
            </CardTitle>
            <div className="p-2 bg-amber-50 rounded-lg">
              <TrendingDown className="w-5 h-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-extrabold text-amber-600 font-display">
              {data.inventoryStats.lowStockCount} mã
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Khuyến nghị tạo đề xuất nhập kho sớm
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory table */}
      <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
        <CardHeader className="pb-3 border-b border-slate-50 p-4">
          <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
            <Package className="w-4.5 h-4.5 text-emerald-600" />
            <span>Báo cáo chi tiết Nhập - Xuất - Tồn kho vật tư</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 [&_th:nth-child(3)]:text-right [&_td:nth-child(3)]:text-right [&_th:nth-child(4)]:text-right [&_td:nth-child(4)]:text-right [&_th:nth-child(5)]:text-right [&_td:nth-child(5)]:text-right [&_th:nth-child(6)]:text-right [&_td:nth-child(6)]:text-right">
          <DataTable
            columns={columns}
            data={data.inventoryList}
            selectable={false}
            searchable={true}
            searchPlaceholder="Tìm kiếm mã vật tư..."
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
};
