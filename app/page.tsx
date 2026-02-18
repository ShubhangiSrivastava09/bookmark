"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "/dashboard";
      }
    });
  }, []);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={loginWithGoogle}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}
