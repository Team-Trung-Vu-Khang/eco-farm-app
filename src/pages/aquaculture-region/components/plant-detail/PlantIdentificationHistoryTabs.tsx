import {
  Activity,
  History,
} from "lucide-react";
import {
  Card,
  DataTable,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

type Props = {
  historyColumns: Array<{ key: string; label: string }>;
  historyData: Array<{
    id: number;
    date: string;
    action: string;
    details: string;
    executor: string;
  }>;
};

export const PlantIdentificationHistoryTabs = ({
  historyColumns,
  historyData,
}: Props) => {
  return (
    <Tabs defaultValue="history">
      <TabsList className="bg-slate-100 p-1 rounded-xl">
        <TabsTrigger value="history" className="rounded-lg px-4 flex gap-2">
          <History className="w-4 h-4" />
          Nhật ký canh tác
        </TabsTrigger>
        <TabsTrigger value="health" className="rounded-lg px-4 flex gap-2">
          <Activity className="w-4 h-4" />
          Theo dõi sức khỏe
        </TabsTrigger>
      </TabsList>
      <TabsContent value="history" className="m-0 mt-4">
        <DataTable columns={historyColumns} data={historyData} />
      </TabsContent>
      <Card className="mt-4 border-none shadow-sm rounded-2xl overflow-hidden">
        <TabsContent value="health" className="p-12 text-center text-slate-400">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-sm">Chưa có dữ liệu theo dõi sức khỏe chi tiết</p>
        </TabsContent>
      </Card>
    </Tabs>
  );
};
