"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    };

    loadSession();
  }, [router]);

  return <div className="p-6">Logging you in...</div>;
}
