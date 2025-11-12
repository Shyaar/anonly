"use client";

import { useEffect, useState } from "react";
import { Header } from "../components/header";
import { BottomNavigation } from "../components/bottom-navigation";
import UiButton from "../components/ui/modals/uiButton";
import { Counselor } from "../types";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useRegisterCounselor } from "@/hooks/useCounselorHooks";

export default function CounselorRegistrationPage() {
  const router = useRouter();
  const {
    registerCounselor,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: writeError,
  } = useRegisterCounselor();

  function handleBack() {
    router.back();
  }
  const [formData, setFormData] = useState<Counselor>({
    name: "",
    description: "",
    specialization: "",
    licenseNumber: "",
    fee: "",
  });

  const specializations = ["PSYCHIATRIST", "THERAPIST", "COUNSELOR"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const specializationIndex = specializations.indexOf(
      formData.specialization
    );
    try {
      await registerCounselor(
        formData.name,
        specializationIndex,
        formData.licenseNumber
      );
    } catch (err) {
      console.error("Registration submission failed:", err);
      toast.error("Failed to submit registration.");
    }
  }

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Counselor registered successfully!");
      router.push("/counselor-profile");
    }
  }, [isConfirmed, router]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      toast.error(`Transaction failed: ${writeError.message}`);
    }
  }, [writeError]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 pb-24">
      <Header title="Register as a Counselor" />

      <div className="flex w-full justify-end my-2">
        <button
          className="p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => handleBack()}
        >
          <div className="flex text-sm items-center gap-2">
            <ArrowLeft size={14} color="#071133" />
            <p>Back</p>
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6">
        {/* Profile Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-[#071133] mb-4">
            Counselor Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full mt-2 bg-gray-50 rounded-lg px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Specialization
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="w-full mt-2 bg-gray-50 rounded-lg px-4 py-3 outline-none"
              >
                <option value="" disabled>
                  Select a specialization
                </option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                License Number
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                placeholder="Enter your license number"
                className="w-full mt-2 bg-gray-50 rounded-lg px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Fee per Hour (in Eth)
              </label>
              <input
                type="text"
                name="fee"
                value={formData.fee}
                onChange={handleChange}
                required
                placeholder="e.g. 2.0 Eth"
                className="w-full mt-2 bg-gray-50 rounded-lg px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Write a short bio about your counseling approach and experience."
                className="w-full mt-2 bg-gray-50 rounded-lg px-4 py-3 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <UiButton
            text={isConfirming ? "Confirming..." : isPending ? "Registering..." : "Register"}
            type="submit"
            disabled={isPending || isConfirming}
          />
        </div>
      </form>

      <BottomNavigation />
    </div>
  );
}
