import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import { ResizableImage } from "./ResizableImage"; // Import our new component
import GapCursor from "@tiptap/extension-gapcursor";

// Custom FontSize extension
const FontSize = TextStyle.extend({
    addAttributes() {
        return {
            fontSize: {
                default: null,
                parseHTML: (element) => element.style.fontSize || null,
                renderHTML: (attributes) => {
                    if (!attributes.fontSize) return {};
                    return { style: `font-size: ${attributes.fontSize}` };
                },
            },
        };
    },
});

// Custom TextAlign that keeps pasted alignment
const CustomTextAlign = TextAlign.extend({
    addAttributes() {
        return {
            textAlign: {
                default: "left",
                parseHTML: (element) => element.style.textAlign || "left",
                renderHTML: (attributes) => {
                    if (!attributes.textAlign) return {};
                    return { style: `text-align: ${attributes.textAlign}` };
                },
            },
        };
    },
});

function EditorApp() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            ResizableImage.configure({
                inline: false,
            }),
            GapCursor, // Important for selecting block nodes
            Placeholder.configure({
                placeholder: "Start typing here...",
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }),
            TextStyle,
            Color,
            FontSize,
            // Configure TextAlign to work on our image wrapper
            TextAlign.configure({
                types: ["heading", "paragraph", "resizableImage"],
            }),
        ],
    });
    if (!editor) return null;

    const addImage = () => {
        const url = prompt("Enter image URL");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addHTML = () => {
        const html = prompt("Enter custom HTML");
        if (html) {
            editor.commands.insertContent(html);
        }
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Toolbar */}
            <div className="toolbar" style={{ flexShrink: 0 }}>
                <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
                <button onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    • List
                </button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    1. List
                </button>
                <button
                    onClick={() => {
                        const url = prompt("Enter link URL");
                        if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                >
                    🔗 Link
                </button>
                <button onClick={addImage}>🖼 Image</button>
                <button onClick={addHTML}>💻 HTML</button>

                {/* Alignment buttons */}
                <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                    ⬅
                </button>
                <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                    ⬍
                </button>
                <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                    ➡
                </button>
                <button onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
                    ☰
                </button>

                {/* Heading buttons */}
                <select
                    onChange={(e) => {
                        const level = parseInt(e.target.value);
                        if (level === 0) {
                            editor.chain().focus().setParagraph().run();
                        } else {
                            editor.chain().focus().toggleHeading({ level }).run();
                        }
                    }}
                >
                    <option value="0">Paragraph</option>
                    <option value="1">H1</option>
                    <option value="2">H2</option>
                    <option value="3">H3</option>
                </select>

                {/* Custom font size input */}
                <input
                    type="number"
                    min="8"
                    max="72"
                    defaultValue="16"
                    onChange={(e) => {
                        editor
                            .chain()
                            .focus()
                            .setMark("textStyle", { fontSize: `${e.target.value}px` })
                            .run();
                    }}
                    style={{ width: "60px" }}
                />
            </div>

            {/* Editor content fills remaining space */}
            <div style={{ flexGrow: 1, overflow: "auto" }}>
                <EditorContent editor={editor} className="tiptap" />
            </div>
        </div>
    );
}

export default function TiptapEditor() {
    const iframeRef = useRef(null);
    const [iframeReady, setIframeReady] = useState(false);

    useEffect(() => {
        if (iframeRef.current && iframeRef.current.contentDocument) {
            const doc = iframeRef.current.contentDocument;
            doc.open();
            doc.write(`
        <html>
          <head>
            <style>
              html, body { margin: 0; padding: 0; height: 100%; }
              .tiptap {
                flex-grow: 1;
                min-height: 100%;
                padding: 1rem;
                outline: none;
                font-size: 16px;
                line-height: 1.5;
                box-sizing: border-box;
              }
              .toolbar {
                display: flex;
                gap: 5px;
                flex-wrap: wrap;
                background: #f0f0f0;
                padding: 5px;
              }
              .toolbar button, .toolbar select, .toolbar input {
                background: #f0f0f0;
                border: none;
                padding: 6px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
              }
              .toolbar button:hover, .toolbar select:hover {
                background: #ddd;
              }
            </style>
          </head>
          <body>
            <div id="editor-root" style="height: 100%; display: flex; flex-direction: column;"></div>
          </body>
        </html>
      `);
            doc.close();
            setIframeReady(true);
        }
    }, []);

    useEffect(() => {
        if (iframeReady && iframeRef.current) {
            const mountNode = iframeRef.current.contentDocument.getElementById("editor-root");
            const root = createRoot(mountNode);
            root.render(<EditorApp />);
        }
    }, [iframeReady]);

    return (
        <iframe
            ref={iframeRef}
            style={{
                width: "100%",
                minWidth: "900px",
                height: "500px",
                border: "none",
                background: "white",
                borderRadius: "10px",
            }}
        />
    );
}