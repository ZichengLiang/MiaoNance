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
  const [storageRetrieved, setStorageRetrieved] = React.useState<boolean>(false);
  // This is the key for local storage
  const LOCAL_NOTEBOOKS:string = "localNotebooks"

  function getLocalNotebooks() {
    try {
      // At this step, the Date fields are still string, we need to convert it back to Date
      const storageData = localStorage.getItem(LOCAL_NOTEBOOKS) || "[]";
      console.log("Storage data:", storageData);
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

      const localNotebooks: NotebookMetadata[] = localNotebooksRaw.map(deserialiseNotebook);
      setNotebooks(localNotebooks);
      setStorageRetrieved(true);
      return localNotebooks;
    } catch (error) {
      console.error('Failed to parse notebooks from localStorage:', error);
      // Clear corrupted data and return empty array
      window.localStorage.setItem(LOCAL_NOTEBOOKS, "[]");
      return [];
    }
  }
  // On mount, this hook get the notebooks in local storage
  React.useEffect(() => {
    getLocalNotebooks()
    // Debug: console.log(`Read these notebooks from local storage: ${notebooks}`);
  }, []);

  // On notebooks change, this hook store notebooks in local storage
  // This can only be run after local storage retrieved, otherwise it overwrites local notebooks as empty array
  React.useEffect(() => {
    try {
      if (!storageRetrieved) {
        return
      }
      const notebooksJSONString = JSON.stringify(notebooks);
      localStorage.setItem("localNotebooks", notebooksJSONString);
      console.log(`storing runtime notebooks data ${notebooksJSONString}`)
    } catch (error) {
      console.error('Failed to save notebooks to localStorage:', error);
    }
  }, [storageRetrieved, notebooks]);

  return (
    <div className="relative">
      <VaultControl notebooks={notebooks} setNotebooks={setNotebooks} />
      <NoteCardWrapper notebooks={notebooks} setNotebooks={setNotebooks} />
    </div>
  );
}
