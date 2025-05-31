"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Undo,
  Redo,
} from "lucide-react";

export default function NoteArea() {
  const [cleared, setCleared] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "<p>Start writing your notes here...</p>",
    autofocus: "end",
    onUpdate: ({ editor }) => {
      if (!cleared) {
        const text = editor.getText();
        if (text.includes("Start writing your notes here")) {
          editor.commands.clearContent();
        }
        setCleared(true);
      }
    },
  });

  const buttonClass =
    "p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition disabled:opacity-50 focus:outline-none";

  const ToolbarButton = ({
    action,
    icon,
    disabled,
  }: {
    action: () => void;
    icon: React.ReactNode;
    disabled?: boolean;
  }) => (
    <button onClick={action} className={buttonClass} disabled={disabled}>
      {icon}
    </button>
  );

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl h-[80vh] p-4 bg-[#f5f5f5] dark:bg-[#111111] rounded-lg shadow-sm flex flex-col">

        {editor && (
          <div className="flex gap-2 flex-wrap mb-2 border-b border-gray-300 dark:border-[#222] pb-2">
            <ToolbarButton
              action={() => editor.chain().focus().toggleBold().run()}
              icon={<Bold size={16} />}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleItalic().run()}
              icon={<Italic size={16} />}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleUnderline().run()}
              icon={<UnderlineIcon size={16} />}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleBulletList().run()}
              icon={<List size={16} />}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleOrderedList().run()}
              icon={<ListOrdered size={16} />}
            />
            <ToolbarButton
              action={() => editor.chain().focus().undo().run()}
              icon={<Undo size={16} />}
              disabled={!editor.can().undo()}
            />
            <ToolbarButton
              action={() => editor.chain().focus().redo().run()}
              icon={<Redo size={16} />}
              disabled={!editor.can().redo()}
            />
          </div>
        )}

        <div
          className="rounded p-3 flex-1 overflow-auto bg-[#f1f1f1] text-black dark:bg-[#1a1a1a] dark:text-gray-100 dark:border dark:border-[#2a2a2a] focus:outline-none"
          onClick={() => editor?.commands.focus()}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
