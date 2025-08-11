import React, { useRef, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";

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
    const contentRef = useRef(null);

    useEffect(() => {
        if (siteNameRef.current) siteNameRef.current.innerText = siteName;
        if (headlineRef.current) headlineRef.current.innerText = headline;
        if (subheadlineRef.current) subheadlineRef.current.innerText = subheadline;
        if (contentRef.current) contentRef.current.innerText = content;
    }, []);

    const handleBlur = () => {
        updateAttributes({
            siteName: siteNameRef.current.innerText,
            headline: headlineRef.current.innerText,
            subheadline: subheadlineRef.current.innerText,
            content: contentRef.current.innerText
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
                    <div ref={contentRef} contentEditable suppressContentEditableWarning onBlur={handleBlur} style={templateStyles[styleVariant].content} />
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
                        <div style={{ fontSize: "11px", color: "#6c757d", fontStyle: "italic" }}>Click elements to edit</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px" }}>
                        {colorOptions.map(renderColorPicker)}
                    </div>
                </div>
            </div>
        </NodeViewWrapper>
    );
};
