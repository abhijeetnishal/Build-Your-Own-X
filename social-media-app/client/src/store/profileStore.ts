import { create } from "zustand";

const useProfileStore = create((set) => ({
  profileDetails: {},
  setProfileDetails: (userDetails: Object) => set({ profileDetails: userDetails }),
}));

export default useProfileStore;