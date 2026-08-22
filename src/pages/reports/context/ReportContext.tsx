import React, { createContext, useContext, useState } from "react";

export type DateRange = {
  startDate: string;
  endDate: string;
  preset: string; // e.g. "7days", "30days", "thisMonth", "all"
};

const DEFAULT_RANGE: DateRange = {
  startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  preset: "30days",
};

interface ReportContextType {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_RANGE);

  return (
    <ReportContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </ReportContext.Provider>
  );
};

export function useReportContext() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReportContext must be used within a ReportProvider");
  }
  return context;
}
