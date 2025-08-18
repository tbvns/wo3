import React, { useRef, useEffect, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";

export const EmailComponent = ({ node, updateAttributes }) => {
    const {
        isCompose,
        subject,
        fromName,
        fromEmail,
        toEmail,
        timestamp,
        body,
        profileImageSrc,
    } = node.attrs;

    const subjectRef = useRef(null);
    const fromNameRef = useRef(null);
    const fromEmailRef = useRef(null);
    const toEmailRef = useRef(null);
    const timestampRef = useRef(null);
    const bodyRef = useRef(null);

    const [emailMode, setEmailMode] = useState(isCompose || false);

    useEffect(() => {
        if (subjectRef.current) subjectRef.current.innerText = subject;
        if (fromNameRef.current) fromNameRef.current.innerText = fromName;
        if (fromEmailRef.current) fromEmailRef.current.innerText = fromEmail;
        if (toEmailRef.current) toEmailRef.current.innerText = toEmail;
        if (timestampRef.current) timestampRef.current.innerText = timestamp;
        if (bodyRef.current) bodyRef.current.innerHTML = body;
    }, []);

    const updateAll = () => {
        updateAttributes({
            subject: subjectRef.current?.innerText || subject,
            fromName: fromNameRef.current?.innerText || fromName,
            fromEmail: fromEmailRef.current?.innerText || fromEmail,
            toEmail: toEmailRef.current?.innerText || toEmail,
            timestamp: timestampRef.current?.innerText || timestamp,
            body: bodyRef.current?.innerHTML || body,
            isCompose: emailMode,
        });
    };

    const handleImageSrcChange = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const src = prompt("Enter profile image URL:", profileImageSrc || "");
        if (src !== null) {
            updateAttributes({ profileImageSrc: src });
        }
    };

    const toggleMode = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const newMode = !emailMode;
        setEmailMode(newMode);
        updateAttributes({ isCompose: newMode });
    };

    const defaultImageSrc = "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico";

    if (emailMode) {
        // Compose Mode
        return (
            <NodeViewWrapper
                as="div"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "16px 0",
                }}
            >
                <div
                    style={{
                        maxWidth: "800px",
                        width: "100%",
                        background: "#fff",
                        fontFamily: "Arial, sans-serif",
                        color: "#202124",
                        padding: "12px",
                    }}
                    onBlur={updateAll}
                >
                    {/* Mode toggle button */}
                    <button
                        onClick={toggleMode}
                        style={{
                            marginBottom: "12px",
                            padding: "4px 8px",
                            background: "#1a73e8",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        Switch to Receive Mode
                    </button>

                    <div
                        style={{
                            border: "1px solid #dadce0",
                            borderRadius: "8px",
                            overflow: "hidden",
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                background: "#404040",
                                color: "#fff",
                                padding: "8px 12px",
                            }}
                        >
                            <div style={{ fontSize: "14px", fontWeight: "500" }}>
                                New Message
                            </div>
                            <div style={{ display: "flex", marginLeft: "auto" }}>
                                <span style={{ display: "inline-block", marginRight: "6px" }}>−</span>
                                <span style={{ display: "inline-block", marginRight: "6px" }}>□</span>
                                <span style={{ display: "inline-block" }}>×</span>
                            </div>
                        </div>

                        {/* To field */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                padding: "10px 12px",
                                borderBottom: "1px solid #f1f3f4",
                            }}
                        >
                            <div
                                style={{
                                    width: "72px",
                                    color: "#5f6368",
                                    fontSize: "13px",
                                    marginRight: "8px",
                                }}
                            >
                                To
                            </div>
                            <div style={{ flex: 1, minHeight: "18px" }}>
                                <span
                                    ref={toEmailRef}
                                    contentEditable
                                    suppressContentEditableWarning
                                    style={{
                                        outline: "none",
                                        display: "inline-block",
                                        minWidth: "100px",
                                        minHeight: "18px"
                                    }}
                                    data-placeholder={!toEmail ? "recipient@example.com" : ""}
                                />
                            </div>
                        </div>

                        {/* Subject field */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                padding: "10px 12px",
                                borderBottom: "1px solid #f1f3f4",
                            }}
                        >
                            <div
                                style={{
                                    width: "72px",
                                    color: "#5f6368",
                                    fontSize: "13px",
                                    marginRight: "8px",
                                }}
                            >
                                Subject
                            </div>
                            <div style={{ flex: 1, minHeight: "18px" }}>
                                <span
                                    ref={subjectRef}
                                    contentEditable
                                    suppressContentEditableWarning
                                    style={{
                                        outline: "none",
                                        display: "inline-block",
                                        minWidth: "100px",
                                        minHeight: "18px"
                                    }}
                                    data-placeholder={!subject ? "Email subject" : ""}
                                />
                            </div>
                        </div>

                        {/* Body */}
                        <div
                            ref={bodyRef}
                            contentEditable
                            suppressContentEditableWarning
                            style={{
                                minHeight: "120px",
                                padding: "12px",
                                outline: "none",
                            }}
                            data-placeholder={!body ? "Type your message here..." : ""}
                        />

                        {/* Actions */}
                        <div
                            style={{
                                display: "flex",
                                padding: "10px 12px 12px 12px",
                            }}
                        >
                            <div
                                style={{
                                    padding: "6px 12px",
                                    background: "#1a73e8",
                                    color: "#fff",
                                    borderRadius: "18px",
                                    border: "1px solid #1a73e8",
                                    display: "inline-block",
                                    marginRight: "8px",
                                }}
                            >
                                Send
                            </div>
                            <div
                                style={{
                                    padding: "6px 12px",
                                    border: "1px solid #dadce0",
                                    borderRadius: "18px",
                                    background: "#fff",
                                    display: "inline-block",
                                }}
                            >
                                Formatting
                            </div>
                        </div>
                    </div>
                </div>
            </NodeViewWrapper>
        );
    } else {
        // Receive Mode
        return (
            <NodeViewWrapper
                as="div"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "16px 0",
                }}
            >
                <div
                    style={{
                        maxWidth: "800px",
                        width: "100%",
                        background: "#fff",
                        fontFamily: "Arial, sans-serif",
                        color: "#202124",
                        padding: "0 16px 16px 16px",
                    }}
                    onBlur={updateAll}
                >
                    {/* Mode toggle button */}
                    <button
                        onClick={toggleMode}
                        style={{
                            marginBottom: "12px",
                            padding: "4px 8px",
                            background: "#1a73e8",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                    >
                        Switch to Compose Mode
                    </button>

                    {/* Header bar */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "14px 0 8px 0",
                            borderBottom: "1px solid #e0e3e7",
                        }}
                    >
                        <div style={{ fontSize: "20px", fontWeight: "500", flex: "1" }}>
                            <span
                                ref={subjectRef}
                                contentEditable
                                suppressContentEditableWarning
                                style={{
                                    outline: "none",
                                    display: "inline-block",
                                    minWidth: "200px",
                                    minHeight: "24px"
                                }}
                                data-placeholder={!subject ? "Email subject" : ""}
                            />
                        </div>
                        <div style={{ display: "flex", color: "#5f6368" }}>
                            <span style={{ display: "inline-block", marginRight: "8px" }}>↶</span>
                            <span style={{ display: "inline-block", marginRight: "8px" }}>⭐</span>
                            <span style={{ display: "inline-block" }}>...</span>
                        </div>
                    </div>

                    {/* Email content */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "40px 1fr auto",
                            alignItems: "center",
                            padding: "12px 0",
                        }}
                    >
                        <img
                            src={profileImageSrc || defaultImageSrc}
                            alt="Profile"
                            onClick={handleImageSrcChange}
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                objectFit: "cover",
                                marginRight: "12px",
                            }}
                        />
                        <div style={{ marginRight: "12px" }}>
                            <div style={{ fontWeight: "600" }}>
                                <span
                                    ref={fromNameRef}
                                    contentEditable
                                    suppressContentEditableWarning
                                    style={{
                                        outline: "none",
                                        display: "inline-block",
                                        minWidth: "80px",
                                        minHeight: "18px"
                                    }}
                                    data-placeholder={!fromName ? "Sender Name" : ""}
                                />
                                <span
                                    ref={fromEmailRef}
                                    contentEditable
                                    suppressContentEditableWarning
                                    style={{
                                        color: "#5f6368",
                                        marginLeft: "6px",
                                        outline: "none",
                                        display: "inline-block",
                                        minWidth: "120px",
                                        minHeight: "18px"
                                    }}
                                    data-placeholder={!fromEmail ? "<sender@example.com>" : ""}
                                />
                            </div>
                            <div style={{ color: "#5f6368", fontSize: "13px" }}>
                                to me
                            </div>
                        </div>
                        <div style={{ color: "#5f6368", fontSize: "12px" }}>
                            <span
                                ref={timestampRef}
                                contentEditable
                                suppressContentEditableWarning
                                style={{
                                    outline: "none",
                                    display: "inline-block",
                                    minWidth: "80px",
                                    minHeight: "16px"
                                }}
                                data-placeholder={!timestamp ? "Just now" : ""}
                            />
                        </div>
                    </div>

                    <div
                        ref={bodyRef}
                        contentEditable
                        suppressContentEditableWarning
                        style={{
                            paddingTop: "8px",
                            lineHeight: "1.6",
                            outline: "none",
                            minHeight: "40px",
                        }}
                        data-placeholder={!body ? "Email content..." : ""}
                    />
                </div>
            </NodeViewWrapper>
        );
    }
};
