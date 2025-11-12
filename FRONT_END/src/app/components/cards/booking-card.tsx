"use client"

import Image from "next/image"

interface BookingCardProps {
  name: string
  date: string
  days?: string 
  status?: number // 0: pending, 1: confirmed, 2: cancelled, 3: completed
  avatarUrl?: string
  onClick?: () => void
  onCancel?: () => void
}

export default function BookingCard({
  name,
  date,
  days,
  status,
  avatarUrl,
  onClick,
  onCancel,
}: BookingCardProps) {
  const canCancel = status === 0 || status === 1 // Assuming 0: pending, 1: confirmed

  return (
    <div className="bg-white p-5 flex items-center justify-between cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Left section: Avatar + Info */}
      <div onClick={onClick} className="flex items-center gap-4 flex-1">
        <div className="w-16 h-16 rounded-full border-3 border-[#FCD34D] bg-[#D1D5DB] flex-shrink-0 overflow-hidden">
          {avatarUrl && (
            <Image
              src={avatarUrl || "/placeholder.svg"}
              alt={name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="[font-family:'Poppins',Helvetica] font-semibold text-[#071133] text-base tracking-[0]">
            {name}
          </h3>
          <p className="[font-family:'Poppins',Helvetica] font-normal text-[#9CA3AF] text-sm tracking-[0]">
            booked for: {date}
          </p>
          {days && (
            <p className="[font-family:'Poppins',Helvetica] text-xs text-blue-600 font-medium mt-1">
              {days}
            </p>
          )}
        </div>
      </div>

      {/* Right section: Status + Cancel Button */}
      <div className="text-right flex-shrink-0 flex flex-col items-end">
        <p className="[font-family:'Poppins',Helvetica] font-semibold text-[#071133] text-2xl tracking-[0]">
          {status === 0
            ? "Pending"
            : status === 1
            ? "Confirmed"
            : status === 2
            ? "Cancelled"
            : "Completed"}
        </p>

        {onCancel && canCancel && (
          <button
            onClick={(e) => {
              e.stopPropagation() // Prevent card onClick from firing
              onCancel()
            }}
            className="mt-2 px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
