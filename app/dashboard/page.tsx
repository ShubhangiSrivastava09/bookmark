"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Bookmark } from "@/types/bookmark";
import Navbar from "@/components/Navbar";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import LogoutButton from "@/components/LogoutButton";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log("USER:", data, error);
      if (!data.user) {
        window.location.href = "/";
        return;
      }

      setUser(data.user);
      fetchBookmarks(data.user.id);
      subscribeRealtime(data.user.id);
    };

    getUser();
  }, []);

  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  const subscribeRealtime = (userId: string) => {
    supabase
      .channel("bookmarks-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks(userId),
      )
      .subscribe();
  };

  if (!user) return <div>Loading...</div>;
  return (
    <>
      <div className="p-6 flex justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <Navbar />
      <div className="max-w-xl mx-auto p-6">
        <AddBookmarkForm userId={user.id} />
        <BookmarkList bookmarks={bookmarks} refresh={() => fetchBookmarks(user.id)} />
      </div>
    </>
  );
}
