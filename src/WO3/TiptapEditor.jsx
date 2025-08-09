import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import { ResizableImage } from "./ResizableImage";
import GapCursor from "@tiptap/extension-gapcursor";
import ComponentInsertModal from "./ComponentInsertModal";
import { createButtonExtension } from "./ButtonExtension";

import "./TiptapEditor.css"

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

export default function TiptapEditor() {
    const [showComponentModal, setShowComponentModal] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            ResizableImage.configure({
                inline: false,
            }),
            GapCursor,
            Placeholder.configure({
                placeholder: "Start typing here...",
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }),
            TextStyle,
            Color,
            FontSize,
            TextAlign.configure({
                types: ["heading", "paragraph", "resizableImage", "buttonComponent"],
            }),
            createButtonExtension("button1", "Button 1", "#007bff"),
            createButtonExtension("button2", "Button 2", "#6c757d"),
            createButtonExtension("button3", "Button 3", "#28a745"),
        ],
        editorProps: {
            attributes: {
                style: 'height: 100%; min-height: 100%; padding: 1rem; outline: none; font-size: 16px; line-height: 1.5; box-sizing: border-box;'
            }
        }
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

    const insertComponent = (componentType) => {
        if (!editor) return;

        editor.chain().focus().insertContent({
            type: componentType,
            attrs: {}
        }).run();

        setShowComponentModal(false);
    };

    const toolbarButtonStyle = {
        background: "#f0f0f0",
        border: "none",
        padding: "6px 10px",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px"
    };

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "white" }}>
            {/* Toolbar */}
            <div style={{
                flexShrink: 0,
                display: "flex",
                gap: "5px",
                flexWrap: "wrap",
                background: "#f0f0f0",
                padding: "5px"
            }}>
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    style={toolbarButtonStyle}
                >
                    B
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    style={toolbarButtonStyle}
                >
                    I
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    style={toolbarButtonStyle}
                >
                    S
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    style={toolbarButtonStyle}
                >
                    • List
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    style={toolbarButtonStyle}
                >
                    1. List
                </button>
                <button
                    onClick={() => {
                        const url = prompt("Enter link URL");
                        if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                    style={toolbarButtonStyle}
                >
                    🔗 Link
                </button>
                <button onClick={addImage} style={toolbarButtonStyle}>
                    🖼 Image
                </button>
                <button onClick={addHTML} style={toolbarButtonStyle}>
                    💻 HTML
                </button>

                {/* Insert Component Button */}
                <button
                    onClick={() => setShowComponentModal(true)}
                    style={toolbarButtonStyle}
                >
                    + Insert Component
                </button>

                {/* Alignment buttons */}
                <button
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    style={toolbarButtonStyle}
                >
                    ⬅
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    style={toolbarButtonStyle}
                >
                    ⬍
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    style={toolbarButtonStyle}
                >
                    ➡
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                    style={toolbarButtonStyle}
                >
                    ☰
                </button>

                {/* Heading selector */}
                <select
                    onChange={(e) => {
                        const level = parseInt(e.target.value);
                        if (level === 0) {
                            editor.chain().focus().setParagraph().run();
                        } else {
                            editor.chain().focus().toggleHeading({ level }).run();
                        }
                    }}
                    style={toolbarButtonStyle}
                >
                    <option value="0">Paragraph</option>
                    <option value="1">H1</option>
                    <option value="2">H2</option>
                    <option value="3">H3</option>
                </select>

                {/* Font size input */}
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
                    style={{ ...toolbarButtonStyle, width: "60px" }}
                />
            </div>

            {/* Editor content fills remaining space */}
            <div style={{
                flexGrow: 1,
                overflow: "auto",
                background: "white",
                height: "calc(100vh - 50px)" // Adjust based on toolbar height
            }}>
                <EditorContent
                    editor={editor}
                    style={{ height: "100%" }}
                />
            </div>

            {/* Component Insert Modal */}
            {showComponentModal && (
                <ComponentInsertModal
                    onInsert={insertComponent}
                    onClose={() => setShowComponentModal(false)}
                />
            )}
        </div>
    );
}