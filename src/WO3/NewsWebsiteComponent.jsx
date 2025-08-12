import React, { useRef, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { ResizableImage } from "./ResizableImage";

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
        "border-color": new Map(),
        "border-top-color": new Map(),
        "border-right-color": new Map(),
        "border-bottom-color": new Map(),
        "border-left-color": new Map(),
        "font-size": new Map(),
        "text-align": new Map(),
        width: new Map(),
    };

    const ensureRule = (prop, value) => {
        if (!value) return null;
        let key = value.trim();

        // Normalize colors
        if (
            prop === "color" ||
            prop === "background-color" ||
            prop.startsWith("border-")
        ) {
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

        if (buckets[prop] && !buckets[prop].has(key)) {
            let cls = "";
            if (prop === "color") cls = `c-${key.replace("#", "")}`;
            if (prop === "background-color") cls = `bg-${key.replace("#", "")}`;
            if (prop === "border-color") cls = `bc-${key.replace("#", "")}`;
            if (prop === "border-top-color") cls = `btc-${key.replace("#", "")}`;
            if (prop === "border-right-color") cls = `brc-${key.replace("#", "")}`;
            if (prop === "border-bottom-color") cls = `bbc-${key.replace("#", "")}`;
            if (prop === "border-left-color") cls = `blc-${key.replace("#", "")}`;
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
        if (buckets[prop]) {
            return buckets[prop].get(key);
        }
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
                    prop.startsWith("border-") ||
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
    buckets["border-color"].forEach(
        (cls, key) => (css += `.${cls}{border-color:${key} !important;border-style:solid !important;}\n`)
    );
    buckets["border-top-color"].forEach(
        (cls, key) => (css += `.${cls}{border-top-color:${key} !important;border-top-style:solid !important;}\n`)
    );
    buckets["border-right-color"].forEach(
        (cls, key) => (css += `.${cls}{border-right-color:${key} !important;border-right-style:solid !important;}\n`)
    );
    buckets["border-bottom-color"].forEach(
        (cls, key) => (css += `.${cls}{border-bottom-color:${key} !important;border-bottom-style:solid !important;}\n`)
    );
    buckets["border-left-color"].forEach(
        (cls, key) => (css += `.${cls}{border-left-color:${key} !important;border-left-style:solid !important;}\n`)
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

export const NewsWebsiteComponent = ({ node, updateAttributes }) => {
    const {
        siteName,
        siteLink,
        primaryColor,
        secondaryColor,
        styleVariant,
        headline,
        subheadline,
        content,
        headlineColor,
        textColor,
        mutedColor,
        borderColor,
        accentColor
    } = node.attrs;

    const siteNameRef = useRef(null);
    const headlineRef = useRef(null);
    const subheadlineRef = useRef(null);

    const contentEditor = useEditor({
        extensions: [
            StarterKit,
            Link,
            ResizableImage.configure({ inline: false }),
            TextStyle,
            FontSize,
            Color,
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph", "resizableImage"],
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            updateAttributes({ content: editor.getHTML() });
        }
    });

    useEffect(() => {
        if (siteNameRef.current) siteNameRef.current.innerText = siteName;
        if (headlineRef.current) headlineRef.current.innerText = headline;
        if (subheadlineRef.current) subheadlineRef.current.innerText = subheadline;
    }, []);

    const handleBlur = () => {
        updateAttributes({
            siteName: siteNameRef.current.innerText,
            headline: headlineRef.current.innerText,
            subheadline: subheadlineRef.current.innerText
        });
    };

    const handleLinkChange = () => {
        const url = prompt("Enter website link (leave empty for none):", siteLink || "");
        if (url !== null) updateAttributes({ siteLink: url });
    };

    const handleColorChange = (key, value) => {
        updateAttributes({ [key]: value });
    };

    const handleStyleChange = (e) => {
        updateAttributes({ styleVariant: parseInt(e.target.value, 10) });
    };

    const exportContent = () => {
        if (!contentEditor) return;

        const rawHTML = contentEditor.getHTML();
        const { html: cleanedHtml, css: dynamicCss } = extractDynamicStylesAndClasses(rawHTML);

        const exportData = {
            siteName,
            headline,
            subheadline,
            rawContent: rawHTML,
            cleanedContent: cleanedHtml,
            dynamicCSS: dynamicCss,
            colors: {
                primary: primaryColor || "#222",
                secondary: secondaryColor || "#fff",
                headline: headlineColor || "#000",
                text: textColor || "#2c3e50",
                muted: mutedColor || "#999",
                border: borderColor || "#ddd",
                accent: accentColor || "#4ecdc4"
            },
            styleVariant,
            exportedAt: new Date().toISOString()
        };

        // Download as JSON
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${siteName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_content.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        navigator.clipboard.writeText(cleanedHtml).then(() => {
            alert('Cleaned HTML copied to clipboard!');
        });
    };

    const colors = {
        primary: primaryColor || "#222",
        secondary: secondaryColor || "#fff",
        headline: headlineColor || "#000",
        text: textColor || "#2c3e50",
        muted: mutedColor || "#999",
        border: borderColor || "#ddd",
        accent: accentColor || "#4ecdc4"
    };

    const templateStyles = {
        1: {
            topBar: {
                backgroundColor: colors.primary,
                color: colors.secondary,
                borderBottom: `4px double ${colors.primary}`,
                fontFamily: '"Times New Roman", serif',
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontSize: "18px",
                padding: "12px 20px",
                fontWeight: "bold"
            },
            headline: {
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: "bold",
                fontSize: "42px",
                color: colors.headline,
                marginBottom: "8px"
            },
            subheadline: {
                fontFamily: "Georgia, serif",
                fontSize: "20px",
                color: colors.muted,
                fontStyle: "italic",
                borderLeft: `4px solid ${colors.border}`,
                paddingLeft: "16px",
                margin: "16px 0 24px 0"
            },
            content: {
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: "18px",
                lineHeight: "1.8",
                textAlign: "justify",
                columnGap: "30px",
                marginTop: "24px",
                color: colors.text
            }
        },
        2: {
            topBar: {
                backgroundColor: colors.primary,
                color: colors.secondary,
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontSize: "16px",
                padding: "16px 20px"
            },
            headline: {
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontWeight: "800",
                fontSize: "36px",
                textTransform: "uppercase",
                letterSpacing: "-1px",
                marginBottom: "12px",
                color: colors.headline
            },
            subheadline: {
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontSize: "18px",
                color: colors.muted,
                fontWeight: "300",
                backgroundColor: "#f8f9fa",
                padding: "12px 16px",
                borderLeft: `4px solid ${colors.accent}`,
                margin: "16px 0 24px 0",
                borderRadius: "0 8px 8px 0"
            },
            content: {
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontSize: "16px",
                lineHeight: "1.7",
                color: colors.text
            }
        },
        3: {
            topBar: {
                backgroundColor: colors.primary,
                color: colors.secondary,
                borderBottom: `3px solid ${colors.primary}`,
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: "700",
                fontSize: "22px",
                fontStyle: "italic",
                padding: "12px 20px"
            },
            headline: {
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: "700",
                fontSize: "48px",
                color: colors.headline,
                fontStyle: "italic",
                marginBottom: "16px",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
            },
            subheadline: {
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: "22px",
                color: colors.muted,
                fontWeight: "400",
                fontStyle: "italic",
                textAlign: "center",
                borderTop: `1px solid ${colors.border}`,
                borderBottom: `1px solid ${colors.border}`,
                padding: "16px 0",
                margin: "20px 0 28px 0"
            },
            content: {
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: "18px",
                lineHeight: "1.8",
                color: colors.text,
                textAlign: "justify",
                textIndent: "2em"
            }
        },
        4: {
            topBar: {
                border: "none",
                backgroundColor: "transparent",
                color: colors.primary,
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontWeight: "100",
                fontSize: "14px",
                textTransform: "lowercase",
                letterSpacing: "4px",
                padding: "20px",
                textAlign: "center",
                borderBottom: `1px solid ${colors.border}`
            },
            headline: {
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontWeight: "100",
                fontSize: "54px",
                color: colors.headline,
                textAlign: "center",
                margin: "40px 0 20px 0",
                letterSpacing: "-2px",
                lineHeight: "0.9"
            },
            subheadline: {
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontSize: "16px",
                color: colors.muted,
                fontWeight: "300",
                textAlign: "center",
                margin: "20px auto 40px auto",
                maxWidth: "600px",
                lineHeight: "1.4"
            },
            content: {
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontSize: "16px",
                lineHeight: "1.9",
                color: colors.text,
                maxWidth: "650px",
                margin: "0 auto",
                fontWeight: "300"
            }
        }
    };

    const colorOptions = [
        { key: "primaryColor", label: "Primary", value: colors.primary },
        { key: "secondaryColor", label: "Secondary", value: colors.secondary },
        { key: "headlineColor", label: "Headline", value: colors.headline },
        { key: "textColor", label: "Text", value: colors.text },
        { key: "mutedColor", label: "Muted", value: colors.muted },
        { key: "borderColor", label: "Border", value: colors.border },
        { key: "accentColor", label: "Accent", value: colors.accent }
    ];

    const renderColorPicker = ({ key, label, value }) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ fontWeight: "500", color: "#495057", minWidth: "60px" }}>
                {label}:
            </label>
            <div style={{ position: "relative" }}>
                <div
                    style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "4px",
                        background: value,
                        border: "1px solid #ced4da",
                        pointerEvents: "none"
                    }}
                />
                <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "24px",
                        height: "24px",
                        opacity: 0,
                        cursor: "pointer"
                    }}
                />
            </div>
        </div>
    );

    return (
        <NodeViewWrapper style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
            <div style={{ border: "1px solid #ddd", borderRadius: "8px", background: "white", maxWidth: "800px", width: "100%", overflow: "hidden" }}>
                {/* Top bar */}
                <div style={{ display: "flex", alignItems: "center", ...templateStyles[styleVariant].topBar }}>
                    {siteLink ? (
                        <a href={siteLink} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                            <span ref={siteNameRef} contentEditable suppressContentEditableWarning onBlur={handleBlur} style={{ outline: "none" }} />
                        </a>
                    ) : (
                        <span ref={siteNameRef} contentEditable suppressContentEditableWarning onBlur={handleBlur} style={{ outline: "none" }} />
                    )}
                    <button onClick={handleLinkChange} style={{ marginLeft: "8px", fontSize: "10px", cursor: "pointer", background: "rgba(255,255,255,0.2)", border: "1px solid currentColor", borderRadius: "4px", padding: "2px 6px", color: "inherit" }}>🔗</button>
                </div>

                {/* Content */}
                <div style={{ padding: styleVariant === 4 ? "20px 0" : "20px" }}>
                    <h1 ref={headlineRef} contentEditable suppressContentEditableWarning onBlur={handleBlur} style={templateStyles[styleVariant].headline} />
                    <h2 ref={subheadlineRef} contentEditable suppressContentEditableWarning onBlur={handleBlur} style={templateStyles[styleVariant].subheadline} />

                    {/* Rich text editor for article content */}
                    {contentEditor && (
                        <>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "#f1f3f5",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                padding: "4px 6px",
                                marginBottom: "8px"
                            }}>
                                <button onClick={() => contentEditor.chain().focus().toggleBold().run()} style={{ fontWeight: "bold" }}>B</button>
                                <button onClick={() => contentEditor.chain().focus().toggleItalic().run()} style={{ fontStyle: "italic" }}>I</button>
                                <button onClick={() => contentEditor.chain().focus().toggleUnderline().run()} style={{ textDecoration: "underline" }}>U</button>
                                <button onClick={() => contentEditor.chain().focus().setTextAlign("left").run()}>⬅</button>
                                <button onClick={() => contentEditor.chain().focus().setTextAlign("center").run()}>⬍</button>
                                <button onClick={() => contentEditor.chain().focus().setTextAlign("right").run()}>➡</button>
                                <button onClick={() => contentEditor.chain().focus().setTextAlign("justify").run()}>☰</button>
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            contentEditor.chain().focus().setMark("textStyle", { fontSize: e.target.value }).run();
                                        }
                                    }}
                                    defaultValue=""
                                >
                                    <option value="">Size</option>
                                    {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                                        <option key={size} value={`${size}px`}>{size}px</option>
                                    ))}
                                </select>
                                <input
                                    type="color"
                                    onChange={(e) => contentEditor.chain().focus().setColor(e.target.value).run()}
                                    title="Text color"
                                />
                                <button onClick={() => {
                                    const url = prompt("Image URL");
                                    if (url) {
                                        contentEditor.chain().focus().setImage({
                                            src: url,
                                            width: "50%"
                                        }).run();
                                    }
                                }}>🖼</button>
                                {/* ✅ NEW: Export button for content */}
                                <button
                                    onClick={exportContent}
                                    style={{
                                        background: "#28a745",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        padding: "4px 8px",
                                        cursor: "pointer",
                                        fontSize: "12px"
                                    }}
                                    title="Export content with cleaned CSS"
                                >
                                    📥 Export
                                </button>
                            </div>
                            <EditorContent editor={contentEditor} style={templateStyles[styleVariant].content} />
                        </>
                    )}
                </div>

                {/* Controls */}
                <div style={{ padding: "12px 16px", background: "#f8f9fa", borderTop: "1px solid #e9ecef", fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #dee2e6" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <label style={{ fontWeight: "500", color: "#495057" }}>Template:</label>
                            <select value={styleVariant} onChange={handleStyleChange} style={{ padding: "4px 8px", border: "1px solid #ced4da", borderRadius: "4px", background: "white", fontSize: "12px", cursor: "pointer" }}>
                                <option value={1}>Classic News</option>
                                <option value={2}>Modern Tech</option>
                                <option value={3}>Editorial</option>
                                <option value={4}>Minimalist</option>
                            </select>
                        </div>
                        <div style={{ fontSize: "11px", color: "#6c757d", fontStyle: "italic" }}>Click elements to edit • Use Export in toolbar for clean CSS</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px" }}>
                        {colorOptions.map(renderColorPicker)}
                    </div>
                </div>
            </div>
        </NodeViewWrapper>
    );
};
