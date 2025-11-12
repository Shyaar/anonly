"use client";
import { useEffect, useState } from "react";
import { BottomNavigation } from "../components/bottom-navigation";
import CounselorCard from "../components/cards/counselor-card";
import { Header } from "../components/header";
import UiButton from "../components/ui/modals/uiButton";
import { useRouter } from "next/navigation";
import CounselorBookingModal from "../components/ui/modals/bookingModal";
import { ArrowLeft } from "lucide-react";
import { useReadAllCounselors } from "@/hooks/useCounselorHooks";
import LoadingModal from "../components/ui/modals/LoadingModal";
import { toast } from "react-toastify";
import generateAvatarFromAddress from "@/genUserData/genUserAvatar";
import useCounselorStore from "@/store/useCounselorStore";
import { parseEther } from "viem";

export default function FindCounselorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { counselors, isLoading, isError } = useReadAllCounselors();
  const setCounselor = useCounselorStore((state) => state.setCounselor);

  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      setShowModal(true);
      setModalMessage("Almost ready");
    } else if (counselors) {
      console.log("these are counselors >>>", counselors)
      setShowModal(false);
      toast.success("Support is a click away");
      // Optionally navigate to the room page or update UI
    } else if (isError) {
      setShowModal(false);
      toast.error("Failed to fetch counselors");
    }
  }, [isLoading, counselors, isError]);

  const handleViewDetails = (counselorId: number, address: `0x${string}`,fees: bigint) => {
    setCounselor(counselorId, address, fees);
    router.push(`/counselor-description/${counselorId}`);
  };

  function handleBack() {
    router.back();
  }

  function handleRoute() {
    router.push("/register-counselor");
  }

  return (
    <>
      <Header title="Find a counselor" />
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 pb-24">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex w-full justify-between my-2">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => handleBack()}
              >
                <ArrowLeft size={24} color="#071133" />
              </button>
              <UiButton
                text="Become a counselor"
                onClick={() => handleRoute()}
              />
            </div>
          </div>
        </div>

        {/* Counselor List */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {counselors.map((counselor) => {
              const avatarUrl = generateAvatarFromAddress(counselor.counselorAddress);
              return (
                <CounselorCard
                  key={counselor.id}
                  name={counselor.name}
                  rating={4}
                  description={"counselor"}
                  fee={"0.000001Eth"}
                  onViewDetails={() => handleViewDetails(counselor.id, counselor.counselorAddress,parseEther("0.000001"))}
                  avatarUrl={avatarUrl}
                />
              );
            })}
          </div>
        </div>

        <BottomNavigation />
        <LoadingModal show={showModal} message={modalMessage} />
      </div>
    </>
  );
}
