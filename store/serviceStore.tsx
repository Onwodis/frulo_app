import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Service = {
  id: string;
  name: string; 
  price: number;
};

type ServiceState = {
  services: Service[];
  addService: (service: Service) => void;
  setServices: (newservices: Service[]) => void;
  getServices: () => Service[];
};

export const serviceStore = create<ServiceState>()(
  persist(
    (set, get) => ({
      services: [],
      addService: (service) =>
        set((state) => ({
          services: [...state.services, service],
        })),
      setServices: (newservices) =>
        set((state) => ({
          services:newservices,
        })),
      getServices: () => get().services,
    }),
    {
      name: 'frulo-services', // key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
