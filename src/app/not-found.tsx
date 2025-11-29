import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#222831] text-[#EEEEEE] px-6">
      
      <h1 className="text-6xl font-bold text-[#76ABAE] mb-4">404</h1>

      <h2 className="text-2xl font-semibold mb-3">Oops, Page not found</h2>

      <p className="text-gray-400 text-center max-w-md mb-8">The page you are looking for doesnt exist</p>

      <Link href="/"
        className="px-6 py-3 bg-[#76ABAE] text-[#222831] font-semibold rounded-xl hover:scale-105 transition shadow-lg"
      >
        Go Back Home
      </Link>

    </div>
  );
}
