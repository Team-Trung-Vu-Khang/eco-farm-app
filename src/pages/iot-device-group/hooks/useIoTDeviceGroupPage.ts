import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useIoTDeviceStore from "../../../stores/useIoTDeviceStore";
import {
  emptyIoTDeviceGroupFormData,
  initialIoTDeviceGroups,
} from "../data/constants";
import type {
  IoTDeviceGroup,
  IoTDeviceGroupFormData,
} from "../types";

export function useIoTDeviceGroupPage() {
  const { toast } = useToast();
  const { devices } = useIoTDeviceStore();

  const [data, setData] = useState<IoTDeviceGroup[]>(initialIoTDeviceGroups);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<IoTDeviceGroup | null>(null);
  const [deleteItem, setDeleteItem] = useState<IoTDeviceGroup | null>(null);
  const [formData, setFormData] = useState<IoTDeviceGroupFormData>(
    emptyIoTDeviceGroupFormData,
  );

  const actualDeviceCountByGroup = useMemo(() => {
    const counts = new Map<number, number>();

    data.forEach((group) => {
      const count = devices.filter((device) =>
        group.deviceTypes.some(
          (type) => device.type.toLowerCase() === type.toLowerCase(),
        ),
      ).length;

      counts.set(group.id, count);
    });

    return counts;
  }, [data, devices]);

  const getActualDeviceCount = (groupId: number) =>
    actualDeviceCountByGroup.get(groupId) ?? 0;

  const stats = useMemo(() => {
    const totalGroups = data.length;
    const activeGroups = data.filter((group) => group.status === "active").length;
    const plannedDevices = data.reduce(
      (sum, group) => sum + group.plannedDeviceCount,
      0,
    );
    const actualDevices = Array.from(actualDeviceCountByGroup.values()).reduce(
      (sum, count) => sum + count,
      0,
    );
    const onlineDevices = devices.filter(
      (device) =>
        data.some((group) =>
          group.deviceTypes.some(
            (type) => device.type.toLowerCase() === type.toLowerCase(),
          ),
        ) && device.status === "online",
    ).length;
    const alertDevices = devices.filter(
      (device) =>
        data.some((group) =>
          group.deviceTypes.some(
            (type) => device.type.toLowerCase() === type.toLowerCase(),
          ),
        ) && (device.status === "low_battery" || device.status === "error"),
    ).length;

    return {
      totalGroups,
      activeGroups,
      plannedDevices,
      actualDevices,
      onlineDevices,
      alertDevices,
    };
  }, [actualDeviceCountByGroup, data, devices]);

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyIoTDeviceGroupFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: IoTDeviceGroup) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      deviceTypes: item.deviceTypes,
      plannedDeviceCount: item.plannedDeviceCount,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: IoTDeviceGroup) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const nextTimestamp = new Date().toISOString().split("T")[0];

    if (editItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editItem.id
            ? { ...item, ...formData, updatedAt: nextTimestamp }
            : item,
        ),
      );
      toast({
        title: "Thành công",
        description: "Đã cập nhật nhóm thiết bị IoT",
      });
    } else {
      const newItem: IoTDeviceGroup = {
        id: Date.now(),
        ...formData,
        createdAt: nextTimestamp,
        updatedAt: nextTimestamp,
      };

      setData((prev) => [newItem, ...prev]);
      toast({
        title: "Thành công",
        description: "Đã thêm nhóm thiết bị IoT mới",
      });
    }

    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa nhóm thiết bị IoT",
      });
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    data,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    deleteItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    getActualDeviceCount,
    stats,
  };
}
