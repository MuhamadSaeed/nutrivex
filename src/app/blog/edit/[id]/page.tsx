"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      //get the data of doc
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setContent(data.content);
      } else {
        router.push("/blog");
      }
      setLoading(false);
    };

    fetchPost();
  }, [id, router]);

  const handleUpdate = async () => {
    if (!id) return;

    await updateDoc(doc(db, "posts", id), { title, content }); // we dont change the time , just title and content
    toast.success("Post updated");
    router.push("/blog");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#222831] text-[#EEEEEE]">Loading...</div>
    );

  return (
    <div className="min-h-screen bg-[#222831] text-[#EEEEEE] flex items-center justify-center px-4 py-12 mt-12">
      <div className="max-w-3xl w-full bg-[#31363F] rounded-3xl p-8 shadow-xl border border-[#76ABAE]/40">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-[#76ABAE]">Edit Post</h1>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-lg font-semibold">Title</label>
            <input
              type="text"
              placeholder="Enter post title..."
              className="w-full px-4 py-3 rounded-xl border border-[#76ABAE] bg-transparent text-[#EEEEEE]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-lg font-semibold">Content</label>
            <textarea
              placeholder="Edit post content..."
              className="w-full px-4 py-3 rounded-xl border border-[#76ABAE] bg-transparent text-[#EEEEEE] min-h-[220px] resize-y whitespace-pre-wrap"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button
            onClick={handleUpdate}
            className="w-full py-3 rounded-full cursor-pointer font-bold bg-[#76ABAE] text-[#222831] hover:bg-[#5c9b9e] transition transform shadow-lg"
          >
            Update Post
          </button>
        </div>
      </div>
    </div>
  );
}
