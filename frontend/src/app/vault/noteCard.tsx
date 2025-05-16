import React from "react";

export default function NoteCard() {
  return (
    <div className="border rounded-xl border-amber-400 hover:shadow-xs">
      <div className="p-6 content-center">Notebook Title</div>
      <div className="flex flex-row gap-6 p-2">
        <div>Created at: 2025-05-15</div>
        <div>ETH/BTC</div>
      </div>
    </div>
  );
}
