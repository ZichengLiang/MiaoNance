"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Undo,
  Redo,
  Maximize2,
  Minimize2,
  Highlighter,
} from "lucide-react";

export default function NoteArea() {
  const [fullscreen, setFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({
        placeholder: "Start writing your notes here...",
      }),
      BulletList,
      OrderedList,
      ListItem,
      Image.configure({ allowBase64: true }),
    ],
    content: {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
    },
    autofocus: "end",
  });

  useEffect(() => {
    if (!editor) return;

    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf("image") === 0) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result;
              if (typeof base64 === "string") {
                editor.chain().focus().setImage({ src: base64 }).run();
              }
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };

    const dom = editor.view.dom;
    dom.addEventListener("paste", handlePaste);
    return () => dom.removeEventListener("paste", handlePaste);
  }, [editor]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreen) {
        setFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [fullscreen]);

  const buttonClass =
    "p-2 rounded transition disabled:opacity-50 focus:outline-none";

  const ToolbarButton = ({
    action,
    icon,
    disabled,
    isActive = false,
  }: {
    action: () => void;
    icon: React.ReactNode;
    disabled?: boolean;
    isActive?: boolean;
  }) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        action();
      }}
      className={`${buttonClass} ${
        isActive
          ? "bg-yellow-200 dark:bg-yellow-400/20"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      disabled={disabled}
    >
      {icon}
    </button>
  );

  return (
    <div
      className={`w-full ${
        fullscreen
          ? "fixed inset-0 z-50 bg-black px-4 py-8 h-screen"
          : "min-h-[500px]"
      }`}
    >
      <div className="w-full h-full bg-white dark:bg-[#121212] rounded-lg shadow-sm flex flex-col gap-4 overflow-hidden">
        {/* Toolbar */}
        {editor && (
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 px-4 pt-4 pb-2 flex-wrap">
            <ToolbarButton
              action={() => editor.chain().focus().toggleBold().run()}
              icon={<Bold size={16} />}
              isActive={editor.isActive("bold")}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleItalic().run()}
              icon={<Italic size={16} />}
              isActive={editor.isActive("italic")}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleUnderline().run()}
              icon={<UnderlineIcon size={16} />}
              isActive={editor.isActive("underline")}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleHighlight().run()}
              icon={<Highlighter size={16} />}
              isActive={editor.isActive("highlight")}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleBulletList().run()}
              icon={<List size={16} />}
              isActive={editor.isActive("bulletList")}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleOrderedList().run()}
              icon={<ListOrdered size={16} />}
              isActive={editor.isActive("orderedList")}
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
            <ToolbarButton
              action={() => setFullscreen(!fullscreen)}
              icon={
                fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />
              }
            />
          </div>
        )}

        {/* Bubble Menu */}
        {editor && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow rounded flex gap-1 p-1 z-50"
          >
            <ToolbarButton
              action={() => editor.chain().focus().toggleBold().run()}
              icon={<Bold size={16} />}
              isActive={editor.isActive("bold")}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleItalic().run()}
              icon={<Italic size={16} />}
              isActive={editor.isActive("italic")}
            />
            <ToolbarButton
              action={() => editor.chain().focus().toggleHighlight().run()}
              icon={<Highlighter size={16} />}
              isActive={editor.isActive("highlight")}
            />
          </BubbleMenu>
        )}

        {/* Editor Content */}
        <div
          className={`px-4 pb-4 overflow-x-hidden focus:outline-none text-base leading-relaxed dark:text-white ${
            fullscreen
              ? "flex-1 overflow-y-auto h-full"
              : "h-[500px] overflow-y-auto"
          }`}
          onClick={() => editor?.commands.focus()}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
