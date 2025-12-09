// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import type { User } from "@/types/user.types";

// interface UserState {
//   currentUser: User | null;
//   setCurrentUser: (user: User) => void;
//   clearCurrentUser: () => void;
// }

// export const useUserStore = create<UserState>()(
//   persist(
//     (set) => ({
//       currentUser: null,
//       setCurrentUser: (user: User) => set({ currentUser: user }),
//       clearCurrentUser: () => set({ currentUser: null }),
//     }),
//     {
//       name: "user-storage", // nom de la clé dans localStorage
//     }
//   )
// );