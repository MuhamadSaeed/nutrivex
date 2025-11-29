"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// swiper library
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
// handler for email
import { sendEmailHandler } from "../lib/email";
// firebase 
import { getLatestBlogsFirebase, Blog } from "../lib/firebase";
import { Exercise } from "../types";
// toast
import toast from "react-hot-toast";

export default function HomePage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    // fetch the exercises
    fetch("https://ex-swart-psi.vercel.app/api/v1/exercises?limit=10&offset=20")
      .then((res) => {
        if (!res.ok) {
          toast.error("Error while getting the exercises", { duration: 2000 })
          throw new Error("Fetch failed");
        }
        return res.json();
      })
      .then((data) => setExercises(data.data))
      .catch(() => console.error("Error while getting the exercises"));

    // fetch blogs
    getLatestBlogsFirebase()
      .then((blogs) => {
        setBlogs(blogs);  
      })
      .catch(() => {
        toast.error("Error while getting the blogs", { duration: 2000 });
      });
    }, []);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget as HTMLFormElement;

    sendEmailHandler(e)
      .then(() => {
        toast.success("Message sent", {duration: 2000,});
        form.reset(); 
      })
      .catch(() => {
        toast.error("Something went wrong. Please try again", {duration: 2000,});
      });
  };


  return (
    <div className="min-h-screen text-[#EEEEEE] bg-black">
      {/* ===== hero section ===== */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
          Welcome to <span className="text-[#76ABAE]">Nutrivex</span>
        </h1>
        <p className="sm:text-lg md:text-xl lg:text-2xl max-w-2xl mb-8 text-[#EEEEEE]">
          Transform your body, nourish your mind, achieve your health goals with expert guidance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/assistant" className="px-6 sm:px-8 py-2 sm:py-3 rounded-full cursor-pointer bg-[#76ABAE] text-[#222831] hover:scale-105 transition ">
            need help?
          </Link>
          <Link href="/blog" className="px-6 sm:px-8 py-2 sm:py-3 rounded-full cursor-pointer border-2 border-[#76ABAE] text-[#76ABAE] hover:bg-[#EEEEEE] hover:text-[#222831] transition">
            see our blog
          </Link>
        </div>
      </section>

      {/* ===== services section ===== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#76ABAE]"> Our Services</h2>
        <div className="max-w-6xl mx-auto space-y-8">
          {[
            { title: "AI Diet Assistant", desc: "Personalized diet plans using AI for faster results.", link: "/assistant" },
            { title: "Exercises Guide", desc: "Best exercises for your body type and fitness goals.", link: "/exercises" },
            { title: "Nutrition Facts", desc: "Detailed nutrition info for thousands of foods.", link: "/nutrition" }
          ].map((service) => (
            <Link key={service.title} href={service.link} className="group flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl bg-[#31363F] hover:bg-[#3b4048] transition">
              <div className="text-[#76ABAE] text-4xl md:text-5xl font-bold ">{service.title[0]}</div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-[#76ABAE] transition">{service.title}</h3>
                <p className="text-gray-300">{service.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== exs section ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center text-[#76ABAE]">Some of Our Exercises</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            400: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          navigation={true}
          modules={[Navigation, Autoplay]}
          className="max-w-6xl mx-auto"
        >
          {exercises?.map((ex) => (
            <SwiperSlide key={ex.exerciseId}>
              <Link href={`/exercises/${ex.exerciseId}`}>
                <div className="rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transform transition cursor-pointer h-full bg-[#31363F]">
                  {ex.gifUrl && (
                    <Image
                      src={ex.gifUrl}
                      alt={ex.name}
                      width={500}
                      height={500}
                      className="w-full h-36 sm:h-40 md:h-44 object-cover rounded-xl mb-4"
                    />
                  )}

                <h3 className="text-base sm:text-lg md:text-lg font-semibold mb-2 text-center text-[#EEEEEE]">
                    {ex.name.length > 18 ? ex.name.slice(0, 17) + "..." : ex.name}
                </h3>
                  <p className="text-xs sm:text-sm md:text-sm text-center text-[#76ABAE]">Target: {ex.targetMuscles}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ===== blog section ===== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#181a1d]">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#76ABAE]">Our Blog</h2>
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.id}`}>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 cursor-pointer group transition-transform hover:translate-y-1">
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#222831] mb-2 group-hover:text-[#76ABAE] transition-colors">
                    {blog.title.length > 60 ? blog.title.slice(0, 57) + "..." : blog.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base mb-3">
                    {blog.content.length > 400 ? blog.content.slice(0, 400) + "..." : blog.content}
                  </p>
                  <span className="text-[#76ABAE] font-semibold text-sm md:text-base hover:underline">Read More ?</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== contact us ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 ">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#76ABAE]">Contact Us</h2>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto text-lg sm:text-xl">
          Have questions or suggestions? We d love to hear from you. Fill out the form below and we will get back to you as soon as possible.
        </p>
        <form 
          onSubmit={sendEmail} 
          className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl border border-[#76ABAE] flex flex-col gap-6 backdrop-blur-md"
        >
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 text-sm sm:text-base font-semibold text-[#EEEEEE]">Your Name</label>
            <input type="text" name="user_name" id="name" placeholder="Enter your name" required
              className="px-4 py-3 rounded-xl border border-[#76ABAE] bg-transparent text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-2 text-sm sm:text-base font-semibold text-[#EEEEEE]">Your Email</label>
            <input type="email" name="user_email" id="email" placeholder="Enter your email" required
              className="px-4 py-3 rounded-xl border border-[#76ABAE] bg-transparent text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="message" className="mb-2 text-sm sm:text-base font-semibold text-[#EEEEEE]">Message</label>
            <textarea name="message" id="message" placeholder="Write your message..." required rows={6}
              className="px-4 py-3 rounded-xl border border-[#76ABAE] bg-transparent text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE] resize-none"
            ></textarea>
          </div>

          <button 
            type="submit"
            className="px-8 py-3 rounded-full font-bold bg-[#76ABAE] text-[#222831] hover:scale-105 hover:bg-[#5c9b9e] cursor-pointer transition transform w-max mx-auto shadow-lg"
          >
            Send Message
          </button>
        </form>
      </section>
        <footer className="bg-[#111] text-gray-400 py-6 mt-12 text-center">
        <p className="text-sm"> &copy; {new Date().getFullYear()} Nutrivex — All Rights Reserved</p>
        <p className="text-xs mt-2">Built by Mohamed Saeed</p>
      </footer>
    </div>
  );
}
