import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  userid: string;
  name: string; 
  password: any;
  emailVerified:boolean;
  admin?:boolean;
  verified:boolean;
  lastseen:  Timestamp ;
  lastbookingid:string;
  logintimes: string;
  createdAt:  Timestamp ;
  totalpayment:number;
  bookings:number;
  email: string;
  role: 'customer' | 'vendor';
}

type RoleState = {
  role: 'customer' | 'vendor' | null;
  user: User | null;
  setUser: (user: User | null) => void;
  getUser: () => User | null;
  setRole: (role: 'customer' | 'vendor' | null) => void;
};

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      role: null,
      user: null,
      setUser: (user) => set({ user }),
      getUser: () => get().user,
      setRole: (role) => set({ role }),
    }),
    {
      name: 'frulo-user', // key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
