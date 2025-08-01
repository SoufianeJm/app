'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    
    if (token && user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [user, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
