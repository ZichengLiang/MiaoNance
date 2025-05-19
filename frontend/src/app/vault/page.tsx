"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";
import NoteCardWrapper from "./noteCardWrapper";
import VaultControl from "./vaultControl";
import { Notebook } from "@/types/notebook";

export default function Page() {
  const [notebooks, setNotebooks] = React.useState<Notebook[]>([]);
  return (
    <div className="relative">
      <Header />
      <VaultControl notebooks={notebooks} setNotebooks={setNotebooks}/>
      <NoteCardWrapper notebooks={notebooks}/>
      <Footer />
    </div>
  );
}
