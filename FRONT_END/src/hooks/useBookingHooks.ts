import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { BaseError } from "viem";
import { toast } from "react-toastify";
import bookingABI from "../abi/booking.json";

export type Session = {
  id: number;
  counselor: string;
  user: string;
  startTime: number;
  duration: number;
  fee: string;
  status: number;
};

export type RawSession = {
  id: string | number;
  counselor: string;
  user: string;
  startTime: string | number;
  duration: string | number;
  fee: string | number;
  status: string | number;
};

// ----- Read a specific session -----
export function useReadSession(sessionId?: bigint) {
  const { address, isConnected } = useAccount();
  const contractAddress = process.env
    .NEXT_PUBLIC_BOOKING_CONTRACT_ADDRESS as `0x${string}`;

  const {
    data: sessionData,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: bookingABI,
    functionName: "getSessionDetails",
    args: sessionId !== undefined ? [sessionId] : undefined,
    query: { enabled: !!sessionId && isConnected },
  });

  let session: Session | null = null;

  if (sessionData) {
    const s: RawSession = sessionData as RawSession;
    session = {
      id: Number(s.id),
      counselor: s.counselor,
      user: s.user,
      startTime: Number(s.startTime),
      duration: Number(s.duration),
      fee: s.fee.toString(),
      status: Number(s.status),
    };
  }

  return { session, isLoading, isError, refetch };
}

// ----- Read my booked sessions -----
export function useReadMyBookedSessions() {
  const { address, isConnected } = useAccount();
  const contractAddress = process.env
    .NEXT_PUBLIC_BOOKING_CONTRACT_ADDRESS as `0x${string}`;

  const {
    data: sessionsData,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: bookingABI,
    functionName: "getMyBookedSessions",
    query: { enabled: isConnected },
  });

  const sessionsArray: RawSession[] = Array.isArray(sessionsData)
    ? sessionsData
    : sessionsData
    ? Object.values(sessionsData)
    : [];

  const sessions: Session[] = sessionsArray.map((s: RawSession) => ({
    id: Number(s.id),
    counselor: s.counselor,
    user: s.user,
    startTime: Number(s.startTime),
    duration: Number(s.duration),
    fee: s.fee.toString(),
    status: Number(s.status),
  }));

  return { sessions, isLoading, isError, refetch };
}

// ----- Booking Actions -----
export function useBookingActions() {
  const { address, isConnected } = useAccount();
  const contractAddress = process.env
    .NEXT_PUBLIC_BOOKING_CONTRACT_ADDRESS as `0x${string}`;

  const { data: hash, writeContractAsync, isPending, error: writeError } =
    useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  // ----- Book Session -----
  const bookSession = async (
    counselor: `0x${string}`,
    startTime: bigint,
    duration: bigint,
    fee: bigint
  ) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first!");
      throw new Error("Wallet not connected");
    }

    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: bookingABI,
        functionName: "bookSession",
        args: [counselor, startTime, duration, fee],
        value: fee, // payable value
      });
      console.log(address)
      console.log("tx}}}}}}}}}}}}}}}}}}}}",tx);
      toast.info("⏳ Transaction sent... waiting for confirmation");
      const txhash = await hash
      console.log("TxHash_)_+++++++++:::", txhash)
      return tx;
    } catch (err) {
      console.error("🔴 [BookSession] Failed:", err);
      toast.error("Booking failed. See console for details.");
      throw err;
    }
  };

  // ----- Cancel Session by User -----
  const cancelSessionByUser = async (sessionId: bigint) => {
    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: bookingABI,
        functionName: "cancelSessionByUser",
        args: [sessionId],
      });
      toast.info("⏳ Cancel transaction sent...");
      return tx;
    } catch (err) {
      console.error("🔴 [CancelSessionByUser] Failed:", err);
      toast.error("Cancel failed.");
      throw err;
    }
  };

  // ----- Cancel Session by Counselor -----
  const cancelSessionByCounselor = async (sessionId: bigint) => {
    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: bookingABI,
        functionName: "cancelSessionByCounselor",
        args: [sessionId],
      });
      toast.info("⏳ Cancel transaction sent...");
      return tx;
    } catch (err) {
      console.error("🔴 [CancelSessionByCounselor] Failed:", err);
      toast.error("Cancel failed.");
      throw err;
    }
  };

  // ----- Complete Session -----
  const completeSession = async (sessionId: bigint) => {
    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: bookingABI,
        functionName: "completeSession",
        args: [sessionId],
      });
      toast.info("⏳ Complete transaction sent...");
      return tx;
    } catch (err) {
      console.error("🔴 [CompleteSession] Failed:", err);
      toast.error("Complete session failed.");
      throw err;
    }
  };

  // ----- Mark No Show and Refund -----
  const markNoShowAndRefund = async (sessionId: bigint, userNoShow: boolean) => {
    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: bookingABI,
        functionName: "markNoShowAndRefund",
        args: [sessionId, userNoShow],
      });
      toast.info("⏳ No-show transaction sent...");
      return tx;
    } catch (err) {
      console.error("🔴 [MarkNoShowAndRefund] Failed:", err);
      toast.error("Mark no-show failed.");
      throw err;
    }
  };

  return {
    bookSession,
    cancelSessionByUser,
    cancelSessionByCounselor,
    completeSession,
    markNoShowAndRefund,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: writeError,
  };
}
