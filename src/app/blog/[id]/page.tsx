import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post } from "@/types";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);
 
  if (!docSnap.exists()) {
    return (
      <div className="min-h-screen bg-[#222831] text-[#EEEEEE] flex items-center justify-center">
        <p className="text-xl">Post not found.</p>
      </div>
    );
  }

  const post = docSnap.data() as Post;
  return (
    <div className="min-h-screen bg-[#222831] text-[#EEEEEE] flex justify-center px-6 py-16 mt-12">
      <div className="max-w-3xl w-full bg-[#31363F] p-10 rounded-3xl shadow-lg ">
        <h1 className="text-4xl font-extrabold mb-8 text-[#76ABAE]">{post.title}</h1>
        <p className="text-md leading-relaxed whitespace-pre-wrap text-gray-200">
          {post.content}
        </p>
      </div>
    </div>
  );
}
