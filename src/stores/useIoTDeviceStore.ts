import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { IoTDevice } from "../pages/iot-device/types";
import { mockDevices } from "../pages/iot-device/data/mockData";

interface IoTDeviceState {
  // State
  devices: IoTDevice[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setDevices: (devices: IoTDevice[]) => void;
  addDevice: (device: IoTDevice) => void;
  addDevices: (devices: IoTDevice[]) => void;
  updateDevice: (id: string, device: Partial<IoTDevice>) => void;
  deleteDevice: (id: string) => void;
  getDeviceById: (id: string) => IoTDevice | undefined;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const useIoTDeviceStore = create<IoTDeviceState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        devices: mockDevices,
        isLoading: false,
        error: null,

        // Actions
        setDevices: (devices) =>
          set({ devices }, false, "setDevices"),

        addDevice: (device) =>
          set(
            (state) => ({
              devices: [device, ...state.devices],
            }),
            false,
            "addDevice",
          ),

        addDevices: (newDevices) =>
          set(
            (state) => ({
              devices: [...newDevices, ...state.devices],
            }),
            false,
            "addDevices",
          ),

        updateDevice: (id, deviceData) =>
          set(
            (state) => ({
              devices: state.devices.map((device) =>
                device.id === id
                  ? { ...device, ...deviceData }
                  : device,
              ),
            }),
            false,
            "updateDevice",
          ),

        deleteDevice: (id) =>
          set(
            (state) => ({
              devices: state.devices.filter(
                (device) => device.id !== id,
              ),
            }),
            false,
            "deleteDevice",
          ),

        getDeviceById: (id) => {
          return get().devices.find((device) => device.id === id);
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),

        reset: () =>
          set(
            {
              devices: mockDevices,
              isLoading: false,
              error: null,
            },
            false,
            "reset",
          ),
      }),
      {
        name: "iot-device-storage",
        partialize: (state) => ({ devices: state.devices }),
      },
    ),
    {
      name: "IoTDeviceStore",
    },
  ),
);

export default useIoTDeviceStore;
