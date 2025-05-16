'use client'
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="relative">
      <Header/>
      <div className="w-full p-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">This is a body</div>
      <Footer/>
    </div>
  );
}
