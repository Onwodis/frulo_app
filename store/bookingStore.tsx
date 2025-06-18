import { create } from 'zustand';

type Booking = {
  date: Date;
  service: string;
  id: string;
  time: string;
  cust_id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
};

type Store = {
  bookings: Booking[];
  getBookings: (custId: string) => Booking[];
  addBooking: (booking: Booking) => void;
  removeBooking: (id: string) => void;
  updateStatus: (index: number, status: 'approved' | 'rejected') => void;
};

export const useBookingStore = create<Store>((set, get) => ({
  bookings: [],

  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),

  getBookings: (custId) => {
    const state = get();
    return state.bookings.filter((b) => b.cust_id === custId);
  },

  removeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),

  updateStatus: (index, status) =>
    set((state) => {
      const updated = [...state.bookings];
      if (updated[index]) {
        updated[index].status = status;
      }
      return { bookings: updated };
    }),
}));
