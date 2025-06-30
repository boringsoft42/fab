"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
type UserRole =
  | "YOUTH"
  | "ADOLESCENTS"
  | "COMPANIES"
  | "MUNICIPAL_GOVERNMENTS"
  | "TRAINING_CENTERS"
  | "NGOS_AND_FOUNDATIONS";
import { RoleSelectionScreen } from "@/components/auth/role-selection/role-selection-screen";
import { useMockAuth } from "@/context/mock-auth-context";

export default function SelectRolePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { updateUserRole } = useMockAuth();

  const handleRoleSelect = async (role: UserRole) => {
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update user role in mock auth
      updateUserRole(role);

      // Redirect to appropriate dashboard
      router.replace("/dashboard");
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoleSelectionScreen
      onRoleSelect={handleRoleSelect}
      isLoading={isLoading}
    />
  );
}
