"use client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function HeaderLogout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (data?.message === "Logged out successfully") {
        toast.success("Logout successful!");

        // Small delay so toast can display briefly

        router.push("/");
        router.refresh(); // Force UI logout state update
      } else {
        toast.error("Logout failed! Try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong.");
    }
  };
  return (
    <div onClick={logout} onKeyDown={logout} role="button" tabIndex={0}>
      {children}
    </div>
  );
}
