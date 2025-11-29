"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import { useAuth } from "@/lib/context/AuthContext";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for validation 
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { user } = useAuth();

  // general error message (firebase errors)
  const [error, setError] = useState<string | null>(null);

  // redirect if already logged in
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  // react form hook setup with zod resolver
  const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    try {
      // isSubmitting provided by RHF will be true during this async call
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // set display name
      await updateProfile(userCredential.user, { displayName: data.name });

      // redirect after signup
      router.push("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // show a good message for "email-already-in-use"
      const msg = err?.code ? mapFirebaseErrorCodeToMessage(err.code) : err?.message || "Signup failed.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#EEEEEE] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-3xl border border-[#76ABAE] backdrop-blur-md">
        <h1 className="text-3xl font-extrabold mb-4 text-center">
          Create Account <span className="text-[#76ABAE]">Nutrivex</span>
        </h1>

        <p className="text-sm text-gray-300 mb-6 text-center">Join now to access personalized health and fitness content.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {error && (
            <div className="text-sm text-red-400 bg-[#311111] p-3 rounded-lg">{error}</div>
          )}

          {/* Name */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold">Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              {...register("name")}
              className={`px-4 py-3 rounded-xl border bg-transparent text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE] ${
                errors.name ? "border-red-400" : "border-[#76ABAE]"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
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
              placeholder="Create a password"
              {...register("password")}
              className={`px-4 py-3 rounded-xl border bg-transparent text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE] ${
                errors.password ? "border-red-400" : "border-[#76ABAE]"
              }`}
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 px-6 py-3 rounded-full font-bold bg-[#76ABAE] text-[#222831] hover:scale-105 transition w-full shadow-lg disabled:opacity-60 flex items-center justify-center"
          >
            {isSubmitting ? (
              <Typewriter
                words={["Creating account..."]}
                loop={Infinity}
                cursor
                cursorStyle="."
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={700}
              />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-300 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#76ABAE] font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

function mapFirebaseErrorCodeToMessage(code: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already in use.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/weak-password":
      return "Password is too weak (min 6 characters).";
    default:
      return "Signup failed. Please try again.";
  }
}
