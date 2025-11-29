"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Post } from "@/types";

export default function BlogPage() {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      // query => order it by the latest = latest appears first
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      // do the query and return all posts
      const snapshot = await getDocs(q);
      const data: Post[] = snapshot.docs.map((doc) => {
        const post = doc.data() as Post;
        // console.log({...post, id: doc.id});
        return { ...post, id: doc.id };
      });
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you wanna delete this post?")) return;
    await deleteDoc(doc(db, "posts", id));
    // filter the deleted post
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#222831] text-[#EEEEEE] px-4 py-12">
      <div className="max-w-4xl mx-auto bg-[#31363F] p-8 mt-12 rounded-3xl shadow-xl border border-[#76ABAE]/40">
        <h1 className="text-4xl font-extrabold text-center text-[#76ABAE] mb-10">Blog</h1>

        {isAdmin && (
          <div className="text-center mb-10">
            <Link href="/blog/add">
              <button className="bg-[#76ABAE] text-[#222831] cursor-pointer px-6 py-2 rounded-full hover:bg-[#5c9b9e] transition">
                 Add Post
              </button>
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id}
              className="p-6 bg-[#222831] rounded-2xl border border-[#76ABAE] hover:scale-[1.01] transition relative"
            >
              <Link href={`/blog/${post.id}`}>
                <h2 className="text-2xl font-semibold text-[#76ABAE] mb-3">{post.title}</h2>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {post.content.length > 200 ? post.content.slice(0, 200) + "..." : post.content}
                </p>
              </Link>

              {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-2">
                  <Link href={`/blog/edit/${post.id}`}>
                    <button className="bg-gray-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-gray-600">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
