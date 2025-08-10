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

import "./TiptapEditor.css";
import { GoogleSearchExtension } from "./GoogleSearchExtension.jsx";
import { TwitterPostExtension } from "./TwitterPostExtension.js";
import { MessageExtension } from "./MessageExtension.js";

const FontSize = TextStyle.extend({
    addAttributes() {
        return {
            fontSize: {
                default: null,
                parseHTML: (el) => el.style.fontSize || null,
                renderHTML: (attrs) => {
                    if (!attrs.fontSize) return {};
                    return { style: `font-size: ${attrs.fontSize}` };
                },
            },
        };
    },
});

function buildBaseSkinCSS() {
    return `
/* Base skin generated at export time */

/* Buttons */
.button-component-wrapper{display:inline-block;margin:5px;}
.button-component{color:#fff;padding:8px 16px;border:0;border-radius:4px;
  font-size:14px;cursor:pointer;text-decoration:none;}
.btn-primary{background:#007bff;}
.btn-secondary{background:#6c757d;}
.btn-success{background:#28a745;}

/* Center wrappers */
.google-search-wrapper,.twitter-post-wrapper,.message-wrapper{
  max-width:800px;margin:16px auto;
}

/* Google Search */
.google-search-component{border:1px solid #ddd;border-radius:8px;padding:16px;
  background:#fff;font-family:Arial,sans-serif;line-height:1.35;color:#0f1419;}
.google-search-bar{display:flex;align-items:center;border:1px solid #ccc;
  border-radius:24px;padding:8px 16px;margin-bottom:16px;}
.google-search-bar .icon{margin-right:8px;color:#888;}
.google-search-bar .query{flex:1;font-size:16px;line-height:1.2;text-align:left;}
.google-search-result{margin:16px 0 20px 0;}
.gs-title{color:#1a0dab;font-size:18px;line-height:1.25;}
.gs-url{color:#006621;font-size:13px;line-height:1.25;margin:2px 0 6px 0;}
.gs-description{color:#545454;font-size:14px;line-height:1.35;}

/* Twitter Post */
.twitter-post-component{border:1px solid #e1e8ed;border-radius:16px;padding:12px;
  background:#fff;max-width:550px;margin:0 auto;font-family:Arial,sans-serif;
  font-size:15px;line-height:1.35;color:#0f1419;}
.tp-header{display:flex;align-items:center;margin-bottom:8px;}
.tp-profile-img{width:48px;height:48px;border-radius:50%;margin-right:8px;}
.tp-username{font-weight:bold;margin-right:4px;}
.tp-handle{color:#536471;}
.tp-text{margin:10px 0 8px 0;}
.tp-timestamp{color:#536471;font-size:13px;margin-bottom:8px;}
.tp-stats{display:flex;align-items:center;justify-content:center;color:#536471;
  font-size:13px;}
.tp-stats>span{margin-right:24px;}
.tp-stats>span:last-child{margin-right:0;}

/* Message */
.message-component{border:1px solid #ddd;border-radius:8px;padding:16px;
  background:#fff;font-family:Arial,sans-serif;line-height:1.3;color:#0f1419;}
.msg-header{display:flex;align-items:center;margin-bottom:16px;}
.msg-profile-img{width:48px;height:48px;border-radius:50%;margin-right:8px;}
.msg-name{font-weight:bold;font-size:16px;}
.msg-bubble-container{display:flex;margin-bottom:12px;}
.msg-bubble-container.left{justify-content:flex-start;}
.msg-bubble-container.right{justify-content:flex-end;}
.msg-bubble{max-width:70%;}
.msg-bubble-content{padding:8px 12px;line-height:1.25;border-radius:18px;}
.msg-bubble-content.left{background:#f1f0f0;color:#000;
  border-radius:18px 18px 18px 5px;}
.msg-bubble-content.right{background:#007bff;color:#fff;
  border-radius:18px 18px 5px 18px;}

/* Resizable image wrapper (width comes from dynamic classes) */
.resizable-image-wrapper{line-height:0;margin:10px 0;}
`.trim();
}

function toHexColor(input) {
    if (!input) return null;
    const s = `${input}`.trim().toLowerCase();
    if (s.startsWith("#")) {
        return s.length === 4
            ? `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`
            : s;
    }
    const m = s.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (!m) return null;
    const r = (+m[1]).toString(16).padStart(2, "0");
    const g = (+m[2]).toString(16).padStart(2, "0");
    const b = (+m[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
}

function num(val) {
    const n = parseFloat(val);
    return Number.isFinite(n) ? n : null;
}

function cleanParagraphs(doc) {
    const ps = Array.from(doc.querySelectorAll("p"));
    ps.forEach((p) => {
        const hasText = (p.textContent || "").trim().length > 0;
        const onlyBrs =
            !hasText &&
            Array.from(p.childNodes).every(
                (n) =>
                    (n.nodeType === 1 &&
                        n.nodeName.toLowerCase() === "br") ||
                    (n.nodeType === 3 && !n.textContent.trim())
            );
        if (onlyBrs) {
            p.remove();
            return;
        }
        if (!hasText) {
            const wrapsBlocks = Array.from(p.children).some((el) =>
                /^(div|img|ul|ol|table|blockquote|figure|iframe)$/.test(
                    el.tagName.toLowerCase()
                )
            );
            if (wrapsBlocks) {
                while (p.firstChild) {
                    p.parentNode.insertBefore(p.firstChild, p);
                }
                p.remove();
            }
        }
    });
}

function extractDynamicStylesAndClasses(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");

    cleanParagraphs(doc);

    const buckets = {
        color: new Map(),
        "background-color": new Map(),
        "font-size": new Map(),
        "text-align": new Map(),
        width: new Map(),
    };

    const ensureRule = (prop, value) => {
        if (!value) return null;
        let key = value.trim();
        if (prop === "color" || prop === "background-color") {
            const hex = toHexColor(value);
            if (!hex) return null;
            key = hex;
        }
        if (prop === "font-size") {
            const n = num(value);
            if (n == null) return null;
            key = `${Math.round(n)}px`;
        }
        if (prop === "width") {
            key = value.trim();
        }
        if (!buckets[prop].has(key)) {
            let cls = "";
            if (prop === "color") cls = `c-${key.replace("#", "")}`;
            if (prop === "background-color") cls = `bg-${key.replace("#", "")}`;
            if (prop === "font-size") cls = `fs-${key.replace("px", "")}`;
            if (prop === "text-align") cls = `ta-${key}`;
            if (prop === "width") {
                const isPct = key.includes("%");
                const n = num(key);
                if (n == null) return null;
                cls = `w-${isPct ? `${Math.round(n)}p` : `${Math.round(n)}`}`;
            }
            buckets[prop].set(key, cls);
            return cls;
        }
        return buckets[prop].get(key);
    };

    Array.from(doc.querySelectorAll("[style]")).forEach((el) => {
        const style = el.getAttribute("style") || "";
        const keep = [];
        style
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((decl) => {
                const i = decl.indexOf(":");
                if (i === -1) return;
                const prop = decl.slice(0, i).trim().toLowerCase();
                const val = decl.slice(i + 1).trim();
                if (
                    prop === "color" ||
                    prop === "background-color" ||
                    prop === "font-size" ||
                    prop === "text-align" ||
                    prop === "width"
                ) {
                    const cls = ensureRule(prop, val);
                    if (cls) el.classList.add(cls);
                } else {
                    keep.push(decl);
                }
            });
        if (keep.length) el.setAttribute("style", keep.join("; "));
        else el.removeAttribute("style");
    });

    let css = "";
    buckets.color.forEach((cls, key) => (css += `.${cls}{color:${key};}\n`));
    buckets["background-color"].forEach(
        (cls, key) => (css += `.${cls}{background-color:${key};}\n`)
    );
    buckets["font-size"].forEach(
        (cls, key) => (css += `.${cls}{font-size:${key};}\n`)
    );
    buckets["text-align"].forEach(
        (cls, key) => (css += `.${cls}{text-align:${key};}\n`)
    );
    buckets.width.forEach(
        (cls, key) => (css += `.${cls}{width:${key};}\n`)
    );

    return { html: doc.body.innerHTML, css };
}

function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function TiptapEditor() {
    const [showComponentModal, setShowComponentModal] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            ResizableImage.configure({ inline: false }),
            GapCursor,
            Placeholder.configure({ placeholder: "Start typing here..." }),
            Heading.configure({ levels: [1, 2, 3] }),
            TextStyle,
            Color,
            FontSize,
            TextAlign.configure({
                types: ["heading", "paragraph", "resizableImage"],
            }),
            GoogleSearchExtension,
            TwitterPostExtension,
            MessageExtension,
        ],
        editorProps: {
            attributes: {
                class: "tiptap-editor-content",
                style:
                    "outline:none;font-size:16px;line-height:1.6;padding:2rem;min-height:50vh;",
            },
        },
    });

    if (!editor) return null;

    const addImage = () => {
        const url = prompt("Enter image URL");
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const addHTML = () => {
        const html = prompt("Enter custom HTML");
        if (html) editor.commands.insertContent(html);
    };

    const insertComponent = (type) => {
        editor.chain().focus().insertContent({ type, attrs: {} }).run();
        setShowComponentModal(false);
    };

    const exportFiles = () => {
        const raw = editor.getHTML();
        const { html, css: dynamicCss } = extractDynamicStylesAndClasses(raw);
        const skin = `${buildBaseSkinCSS()}

${dynamicCss}`.trim();

        downloadFile("content.html", html, "text/html");
        downloadFile("skin.css", skin, "text/css");
    };

    const toolbarButtonStyle = {
        background: "#f0f0f0",
        border: "none",
        padding: "6px 10px",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                background: "#f5f5f5",
            }}
        >
            {/* Toolbar */}
            <div
                style={{
                    flexShrink: 0,
                    display: "flex",
                    gap: "5px",
                    flexWrap: "wrap",
                    background: "#f0f0f0",
                    padding: "5px",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #ddd",
                }}
            >
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
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

                    {/* Link */}
                    <button
                        onClick={() => {
                            const isActive = editor.isActive("link");
                            if (isActive) {
                                editor.chain().focus().unsetLink().run();
                                return;
                            }
                            const url = prompt("Enter link URL");
                            if (url)
                                editor.chain().focus().setLink({ href: url }).run();
                        }}
                        style={toolbarButtonStyle}
                    >
                        🔗 Link
                    </button>

                    {/* Image and raw HTML */}
                    <button onClick={addImage} style={toolbarButtonStyle}>
                        🖼 Image
                    </button>
                    <button onClick={addHTML} style={toolbarButtonStyle}>
                        💻 HTML
                    </button>

                    {/* Insert Component */}
                    <button
                        onClick={() => setShowComponentModal(true)}
                        style={toolbarButtonStyle}
                    >
                        + Insert Component
                    </button>

                    {/* Alignment */}
                    <button
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        style={toolbarButtonStyle}
                    >
                        ⬅
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().setTextAlign("center").run()
                        }
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
                        onClick={() =>
                            editor.chain().focus().setTextAlign("justify").run()
                        }
                        style={toolbarButtonStyle}
                    >
                        ☰
                    </button>

                    {/* Heading selector */}
                    <select
                        className="toolbar-select"
                        onChange={(e) => {
                            const level = parseInt(e.target.value, 10);
                            if (level === 0) {
                                editor.chain().focus().setParagraph().run();
                            } else {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level })
                                    .run();
                            }
                        }}
                    >
                        <option value="0">Paragraph</option>
                        <option value="1">H1</option>
                        <option value="2">H2</option>
                        <option value="3">H3</option>
                    </select>

                    {/* Font size */}
                    <input
                        type="number"
                        min="8"
                        max="72"
                        defaultValue="16"
                        onChange={(e) => {
                            const px = `${e.target.value}px`;
                            editor
                                .chain()
                                .focus()
                                .setMark("textStyle", { fontSize: px })
                                .run();
                        }}
                        style={{ ...toolbarButtonStyle, width: "60px" }}
                    />

                    {/* Text color */}
                    <input
                        type="color"
                        onChange={(e) => {
                            editor
                                .chain()
                                .focus()
                                .setColor(e.target.value)
                                .run();
                        }}
                        title="Text color"
                        style={{ ...toolbarButtonStyle, padding: "4px 6px", width: 40 }}
                    />
                    <button
                        onClick={() => editor.chain().focus().unsetColor().run()}
                        style={toolbarButtonStyle}
                    >
                        ✖ Color
                    </button>
                </div>

                {/* Export button on the right */}
                <button
                    onClick={exportFiles}
                    style={{
                        ...toolbarButtonStyle,
                        background: "#28a745",
                        color: "white",
                    }}
                >
                    📥 Export (content.html + skin.css)
                </button>
            </div>

            {/* Editor area */}
            <div
                style={{
                    flex: "1",
                    background: "#f5f5f5",
                    display: "flex",
                    justifyContent: "center",
                    padding: "20px",
                    paddingBottom: "40px",
                }}
            >
                <div
                    style={{
                        background: "white",
                        maxWidth: "800px",
                        minWidth: "300px",
                        width: "100%",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        borderRadius: "4px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Component modal */}
            {showComponentModal && (
                <ComponentInsertModal
                    onInsert={insertComponent}
                    onClose={() => setShowComponentModal(false)}
                />
            )}
        </div>
    );
}
