"use client";

import React, { useState } from "react";
import UiButton from "./uiButton";
import { useBookingActions } from "@/hooks/useBookingHooks";
import { parseEther } from "viem";
import LoadingModal from "./LoadingModal";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

interface CounselorBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  counselorName: string;
  counselorAddress: `0x${string}`;
  fee: string; // in ETH, e.g. "0.01"
}

const CounselorBookingModal: React.FC<CounselorBookingModalProps> = ({
  isOpen,
  onClose,
  counselorName,
  counselorAddress,
  fee,
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const {address}=useAccount()

  const { bookSession, isPending, isConfirming, isConfirmed, error } =
    useBookingActions();

  const handleBooking = async () => {
    console.log("UUUSerAAAAcoutn::::::::::", address);

    if (!date || !time || !duration) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      // Combine date and time to get a timestamp in seconds
      const startTime = Math.floor(
        new Date(`${date}T${time}`).getTime() / 1000
      );
      const durationMinutes = Number(duration);

      if (isNaN(startTime) || isNaN(durationMinutes)) {
        toast.error("Invalid date or duration.");
        return;
      }

      // Clean the fee string to ensure it's a valid decimal number
      const cleanedFee = fee.replace(/[^0-9.]/g, "");

      // Call bookSession with fee converted to Wei
      await bookSession(
        counselorAddress,
        BigInt(startTime),
        BigInt(durationMinutes * 60), // convert minutes to seconds
        BigInt(parseEther(cleanedFee))
      );

      toast.success("Session booked successfully!");
      onClose(); // close modal on success
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Failed to book session. See console for details.");
    }
  };

  const shouldShowModal = isOpen || isPending || isConfirming;
  const modalMessage = isPending
    ? "Almost ready..."
    : isConfirming
    ? "Confirming your booking..."
    : "";

  if (!shouldShowModal) return null;

  return (
    <>
      {shouldShowModal && <LoadingModal show={true} message={modalMessage} />}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 shadow-lg max-w-sm w-full rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-[#071133]">
            Book a session with {counselorName}
          </h2>

          <div className="mb-4 space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <UiButton text="Cancel" onClick={onClose} />
            <UiButton text="Book" onClick={handleBooking} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CounselorBookingModal;
