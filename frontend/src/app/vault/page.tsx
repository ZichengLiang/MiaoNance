"use client";
import React from "react";
import NoteCardWrapper from "./noteCardWrapper";
import VaultControl from "./vaultControl";
import { NotebookMetadata } from "@/types/notebook_metadata";

type SerialisedNotebook = {
  title: string;
  createdAt: string;
  updatedAt: string;
  uuid: string;
  user_id?: string;
  trading_pairs?: String[];
};

export default function Page() {
  const [notebooks, setNotebooks] = React.useState<NotebookMetadata[]>([]);

  function getLocalNotebooks() {
    try {
      // At this step, the Date fields are still string, we need to convert it back to Date
      const storageData = window.localStorage.getItem("localNotebooks") || "[]";
      const localNotebooksRaw: SerialisedNotebook[] = JSON.parse(storageData) as SerialisedNotebook[];

      // This function helps us to convert data to NotebookMetadata type
      function deserialiseNotebook(
        serialised: SerialisedNotebook
      ): NotebookMetadata {
        return {
          ...serialised,
          createdAt: new Date(serialised.createdAt),
          updatedAt: new Date(serialised.updatedAt),
        };
      }

      const localNotebooks: NotebookMetadata[] =
        localNotebooksRaw.map(deserialiseNotebook);
      return localNotebooks;
    } catch (error) {
      console.error('Failed to parse notebooks from localStorage:', error);
      // Clear corrupted data and return empty array
      window.localStorage.setItem("localNotebooks", "[]");
      return [];
    }
  }
  // On mount, this hook get the notebooks in local storage
  React.useEffect(() => {
    getLocalNotebooks() && setNotebooks(getLocalNotebooks());
    // Debug: console.log(`Read these notebooks from local storage: ${notebooks}`);
  }, []);

  // On notebooks change, this hook store notebooks in local storage
  React.useEffect(() => {
    try {
      window.localStorage.setItem("localNotebooks", JSON.stringify(notebooks));
    } catch (error) {
      console.error('Failed to save notebooks to localStorage:', error);
    }
  }, [notebooks]);

  return (
    <div className="relative">
      <VaultControl notebooks={notebooks} setNotebooks={setNotebooks} />
      <NoteCardWrapper notebooks={notebooks} setNotebooks={setNotebooks} />
    </div>
  );
}
