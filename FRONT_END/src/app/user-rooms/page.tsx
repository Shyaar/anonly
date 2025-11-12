"use client";

import { Header } from "../components/header";
import { BottomNavigation } from "../components/bottom-navigation";
import RoomCard from "../components/cards/room-card";
import { useReadMyRooms, useJoinRoom } from "../../hooks/usePlatformHook";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useRoomStore from "@/store/useRoomStore";
import LoadingModal from "../components/ui/modals/LoadingModal";

export default function UserRoomsPage() {
  const router = useRouter();
  const { setRoom } = useRoomStore();

  // 🔹 Custom hooks
  const { rooms, isLoading, isError } = useReadMyRooms();
  const {
    joinRoom,
    isPending,
    isConfirming,
    isConfirmed,
    error: joinError,
  } = useJoinRoom();

  // 🔹 Handle join room action
  async function handleJoinRoom(
    roomTopic: string,
    roomMembers: number,
    roomId: number
  ) {
    try {
      await joinRoom(roomId);
      setRoom(roomTopic, roomMembers);
      router.push("/chat-page");
      toast.success(`Now entering ${roomTopic}`);
    } catch (error) {
      console.error("Error joining room:", error);
      toast.error("Failed to join room.");
    }
  }

  // 🔹 Handle toast notifications for transaction states
  if (joinError) toast.error("Failed to join room.");
  if (isConfirmed) toast.success("Successfully joined room!");

  // 🔹 Determine modal visibility and message dynamically
  const shouldShowModal = isPending || isConfirming || isLoading;
  const modalMessage = isPending
    ? "Almost ready"
    : isConfirming
    ? "Your journey to connection begins now"
    : isLoading
    ? "Getting your rooms"
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 pb-24">
      <Header title="My rooms" />

      <div className="px-4 py-6">
        {/* Room List */}
        {rooms?.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 mt-8">
            You have not joined any rooms.
          </p>
        )}

        <div className="space-y-3">
          {rooms?.map((room) => (
            <RoomCard
              key={room.id}
              title={room.topic}
              members={room.memberCount}
              onClick={() =>
                handleJoinRoom(room.topic, room.memberCount, room.id)
              }
            />
          ))}
        </div>
      </div>

      <BottomNavigation />

      {/* 🔹 Inline Conditional Modal Rendering */}
      {shouldShowModal && (
        <LoadingModal show={true} message={modalMessage} />
      )}
    </div>
  );
}
