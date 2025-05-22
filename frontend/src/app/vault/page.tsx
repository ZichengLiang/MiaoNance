"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from "react";
import NoteCardWrapper from "./noteCardWrapper";
import VaultControl from "./vaultControl";
import { NotebookMetadata } from "@/types/notebook_metadata";

export default function Page() {
  const [notebooks, setNotebooks] = React.useState<NotebookMetadata[]>([]);
  return (
    <div className="relative">
      <VaultControl notebooks={notebooks} setNotebooks={setNotebooks} />
      <NoteCardWrapper notebooks={notebooks} setNotebooks={setNotebooks} />
    </div>
  );
}
