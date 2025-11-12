"use client";

import { useParams, useRouter } from "next/navigation";
import { Header } from "../../components/header";
import { BottomNavigation } from "../../components/bottom-navigation";
import { Star, ThumbsUp, MessageCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import UiButton from "../../components/ui/modals/uiButton";
import { useState, useEffect } from "react";
import CounselorBookingModal from "../../components/ui/modals/bookingModal";
import LoadingModal from "../../components/ui/modals/LoadingModal";
import { useBookingActions } from "../../../hooks/useBookingHooks";
import { useReadCounselor, useIsACounselor } from "@/hooks/useCounselorHooks";
import { useAccount } from "wagmi";
import generateAvatarFromAddress from "@/genUserData/genUserAvatar";
import useCounselorStore from "@/store/useCounselorStore";
import { toast } from "react-toastify";

export default function CounselorDetailsPage() {
  const router = useRouter();
  function handleBack() {
    router.back();
  }
  const {address}=useAccount();

  const { counselorId, counselorAddress, fees } = useCounselorStore();

  console.log("counselor+++++++++", counselorAddress, counselorId, fees);

  const { isCounselor, isLoading: isCounselorLoadingStatus } =useIsACounselor();

  console.log("isCouncelor _______", isCounselor);

  const {
    counselor,
    isLoading: isCounselorLoading,
    isError: isCounselorError,
  } = useReadCounselor(counselorAddress as `0x${string}`);


  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingModalMessage, setLoadingModalMessage] = useState("");

  useEffect(() => {
    if (isCounselorLoadingStatus||isCounselorLoading) {
      setShowLoadingModal(true);
      setLoadingModalMessage("Loading, please Wait...");
    } else if (counselor) {
      setShowLoadingModal(false);;
    } else if (isCounselorError) {
      setShowLoadingModal(false);
      toast.error("Failed to fetch Counselor")
      // You might want to show an error message here
    }
  }, [isCounselorLoadingStatus, isCounselorLoading, counselor, isCounselorError]);

  if (isCounselorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading counselor...</p>
      </div>
    );
  }

  if (isCounselorError || !counselor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Counselor not found.</p>
      </div>
    );
  }

  const avatarUrl = generateAvatarFromAddress(counselor.counselorAddress);

  const specializations = ["PSYCHIATRIST", "THERAPIST", "COUNSELOR"];
  const specialization = specializations[counselor.specialization];

  const reviews = [
    {
      id: 1,
      author: "Nicolas Jensen",
      rating: 5,
      text: "Really helpful!",
      time: "about 1 hour ago",
    },
    {
      id: 2,
      author: "Mary Okoro",
      rating: 4,
      text: "Very patient.",
      time: "2 days ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 pb-24">
      <Header showSearch={false} showMenu={false} />
      <div className="mx-24">
        <div className="">
          <div className="flex w-full justify-start my-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => handleBack()}
            >
              <div className="flex">
                <ArrowLeft size={24} color="#071133" />
                <p>Back</p>
              </div>
            </button>
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <div className="flex gap-4 mb-4">
              <img
                src={avatarUrl}
                alt={counselor.name}
                width={120}
                height={120}
                className="rounded-xl"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    11 Reviews
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {counselor.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                  {specialization}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Fee/hour
                  </span>
                  <span className="font-semibold text-foreground">0.000001 Eth</span>
                </div>
              </div>
            </div>
            {!isCounselor && (
              <UiButton
                text="Book a session"
                type="button"
                onClick={() => setShowBookingModal(true)}
              />
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Reviews</h3>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Image
                      src="/reviewer-avatar.jpg"
                      alt={review.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h5 className="font-semibold text-foreground">
                        {review.author}
                      </h5>
                      <div className="flex gap-1 mt-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {review.text}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{review.time}</span>
                    <button className="flex items-center gap-1 hover:text-foreground">
                      <ThumbsUp className="h-3 w-3" />
                      Like
                    </button>
                    <button className="flex items-center gap-1 hover:text-foreground">
                      <MessageCircle className="h-3 w-3" />
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
      <CounselorBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        counselorName={counselor.name}
        counselorAddress={counselor.counselorAddress as `0x${string}`}
        fee={"0.000001 Eth"}
      />
      <LoadingModal show={showLoadingModal} message={loadingModalMessage} />
    </div>
  );
}
