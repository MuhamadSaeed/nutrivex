"use client";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/context/AuthContext";
import toast from "react-hot-toast";

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddPost = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    // otherwise
    setSubmitting(true);
    try {
      // it craetes a new post with a uniqe id in "posts"
      await addDoc(collection(db, "posts"), {
        title,
        content,
        createdAt: serverTimestamp(), // the time get from the server not the divice of the admin
      });

      setTitle("");
      setContent("");
      toast.success("Post added");
    } catch {
       toast.error("Somthing went wrong")
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user || !isAdmin)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#222831] text-[#EEEEEE]">Loading...</div>
    );

  return (
    <div className="min-h-screen bg-[#222831] text-[#EEEEEE] flex items-center justify-center px-4 py-12 mt-12">
      <div className="max-w-3xl w-full bg-[#31363F] rounded-3xl p-8 shadow-xl">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-[#76ABAE]">Add New Blog Post</h1>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-lg font-semibold">Title</label>
            <input
              type="text"
              placeholder="Enter post title..."
              className="w-full px-4 py-3 rounded-xl border border-[#76ABAE]/60 bg-transparent text-[#EEEEEE]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-lg font-semibold">Content</label>
            <textarea
              placeholder="Write your content here..."
              className="w-full px-4 py-3 rounded-xl border border-[#76ABAE]/60 bg-transparent text-[#EEEEEE] min-h-[220px] resize-y whitespace-pre-wrap"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button
            onClick={handleAddPost}
            disabled={submitting}
            className="w-full py-3 cursor-pointer rounded-full font-bold bg-[#76ABAE] text-[#222831] hover:bg-[#5c9b9e] transition transform flex items-center justify-center"
          >
            {submitting ? ("Adding...") : ("Add Post")}
          </button>
        </div>
      </div>
    </div>
  );
}
