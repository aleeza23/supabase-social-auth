import { AuthButton } from "@/components/auth-button";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Navbar />
      </div>
    </main>
  );
}
