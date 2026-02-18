"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Loader from "@/components/Loader";
import { Bookmark } from "@/types/bookmark";

export default function BookmarkList({
  bookmarks,
  refresh,
}: {
  bookmarks: Bookmark[];
  refresh: () => void;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const deleteBookmark = async (id: string) => {
    setLoadingId(id);
    await supabase.from("bookmarks").delete().eq("id", id);
    setLoadingId(null);
    refresh();
  };

  const startEdit = (b: Bookmark) => {
    setEditingId(b.id);
    setTitle(b.title);
    setUrl(b.url);
  };

  const updateBookmark = async (id: string) => {
    setLoadingId(id);
    await supabase.from("bookmarks").update({ title, url }).eq("id", id);
    setLoadingId(null);
    setEditingId(null);
    refresh();
  };

  return (
    <ul>
      {bookmarks.map((b) => (
        <li key={b.id} className="border p-3 mb-2">
          {editingId === b.id ? (
            <div className="flex gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border px-2"
              />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border px-2"
              />
              <button
                onClick={() => updateBookmark(b.id)}
                className="bg-green-500 text-white px-2"
                disabled={loadingId === b.id}
              >
                {loadingId === b.id ? "Saving..." : "Save"}{" "}
              </button>{" "}
            </div>
          ) : (
            <div className="flex justify-between items-center">
              {" "}
              <a href={b.url} target="_blank" className="text-blue-600">
                {b.title}{" "}
              </a>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(b)}
                  className="text-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-red-600"
                  disabled={loadingId === b.id}
                >
                  {loadingId === b.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}

          {loadingId === b.id && <Loader />}
        </li>
      ))}
    </ul>
  );
}
