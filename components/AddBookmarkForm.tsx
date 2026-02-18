"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Loader from "./Loader";

export default function AddBookmarkForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const addBookmark = async () => {
    if (!title || !url) return;

    setLoading(true);
    await supabase.from("bookmarks").insert([{ title, url, user_id: userId }]);

    setTitle("");
    setUrl("");
    setLoading(false);
  };

  return (
    <div className="mb-6">
      <input
        className="border p-2 w-full mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button disabled={loading} onClick={addBookmark} className="bg-black text-white px-4 py-2">
        {loading ? "Adding..." : "Add Bookmark"}
      </button>
      {loading && <Loader />}
    </div>
  );
}
