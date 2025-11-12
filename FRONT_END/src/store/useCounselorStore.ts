import { create } from "zustand";

interface CounselorState {
  counselorId: number | null;
  counselorAddress: `0x${string}` | null;
  fees: bigint | null;
  setCounselor: (id: number, counselorAddress: `0x${string}`, fees: bigint) => void;
}

const useCounselorStore = create<CounselorState>((set) => ({
  counselorId: null,
  counselorAddress: null,
  fees:null,
  setCounselor: (counselorId, counselorAddress,fees) => set({ counselorId, counselorAddress,fees }),
}));

export default useCounselorStore;
