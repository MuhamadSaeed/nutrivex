"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#0d0f11] border-b border-[#667077] fixed top-0 left-0 w-full z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#76ABAE] hover:opacity-80 transition">Nutrivex</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-gray-300 font-medium items-center">
          <Link href="/" className="hover:text-[#76ABAE] transition">Home</Link>
          <Link href="/exercises" className="hover:text-[#76ABAE] transition">Exercises</Link>
          <Link href="/nutrition" className="hover:text-[#76ABAE] transition">Nutrition</Link>
          <Link href="/blog" className="hover:text-[#76ABAE] transition">Blog</Link>
          <Link href="/assistant" className="hover:text-[#76ABAE] transition">Ai</Link>

          {/* if not loged in → show sign up */}
          {!user && (
            <Link href="/signup" className="bg-[#76ABAE] text-[#222831] px-4 py-2 rounded-full"> Sign Up</Link>
          )}

          {/* if logged in → show logout */}
          {user && (
            <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer">
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-300 hover:text-white transition focus:outline-none">
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0d0f11] border-t border-[#1f2428] px-6 pb-4 space-y-3 text-gray-300 font-medium">
          <Link href="/" className="block hover:text-[#76ABAE] transition">Home</Link>
          <Link href="/exercises" className="block hover:text-[#76ABAE] transition">Exercises</Link>
          <Link href="/nutrition" className="block hover:text-[#76ABAE] transition">Nutrition</Link>
          <Link href="/blog" className="block hover:text-[#76ABAE] transition">Blog</Link>
          <Link href="/assistant" className="block hover:text-[#76ABAE] transition">Ai</Link>

          {/* Sign Up button when not logged in */}
          {!user && (
            <Link href="/signup"
              className="block w-full text-center bg-[#76ABAE] text-[#222831] px-4 py-2 rounded-full"
            >
              Sign Up
            </Link>
          )}

          {/* Logout when logged in */}
          {user && (
            <button onClick={logout} className="w-full bg-red-500 text-white px-3 py-2 rounded cursor-pointer">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
