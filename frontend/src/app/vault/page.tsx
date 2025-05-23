'use client'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";
import NoteCardWrapper from "./noteCardWrapper";

export default function Page() {
  return (
    <div className="relative">
      <Header/>
      <NoteCardWrapper></NoteCardWrapper>
      <Footer/>
    </div>
  );
}
