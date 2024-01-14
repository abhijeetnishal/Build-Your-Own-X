import { create } from "zustand";

const useAuthStore = create((set) => ({
  authToken: "",

  setAuthToken: (token: string) => set({ authToken: token }),
}));

export default useAuthStore;
