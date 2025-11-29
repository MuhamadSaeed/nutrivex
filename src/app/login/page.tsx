"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import { useAuth } from "@/lib/context/AuthContext";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for login 
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // redirect if already logged in
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/");
    } catch {
      setError("Email or password is incorrect.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#EEEEEE] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-3xl border border-[#76ABAE] backdrop-blur-md">
        <h1 className="text-3xl font-extrabold mb-4 text-center">
          Login to <span className="text-[#76ABAE]">Nutrivex</span>
        </h1>

        <p className="text-sm text-gray-300 mb-6 text-center"> Access your personalized health and fitness content.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {error && (
            <div className="text-sm text-red-400 bg-[#311111] p-3 rounded-lg">{error}</div>
          )}

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`px-4 py-3 rounded-xl border bg-transparent text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE] ${
                errors.email ? "border-red-400" : "border-[#76ABAE]"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={`px-4 py-3 rounded-xl border bg-transparent text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE] ${
                errors.password ? "border-red-400" : "border-[#76ABAE]"
              }`}
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 px-6 py-3 cursor-pointer rounded-full font-bold bg-[#76ABAE] text-[#222831] hover:scale-105 transition w-full shadow-lg disabled:opacity-60 flex items-center justify-center"
          >
            {isSubmitting ? (
              <Typewriter
                words={["Logging in..."]}
                loop={Infinity}
                cursor
                cursorStyle="_"
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={800}
              />
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-300 mt-4">
          Dont have an account?<span> </span>
          <Link
            href="/signup"
            className="text-[#76ABAE] font-semibold hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
