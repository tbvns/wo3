import React, { useRef, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";

const BubbleTail = ({ side }) => {
    const color = side === "left" ? "#f1f0f0" : "#007bff";
    const tailStyle = {
        position: "absolute",
        bottom: 0,
        width: "15px",
        height: "15px",
        ...(side === "left"
            ? { left: "-2px", transform: "scaleX(-1)" }
            : { right: "-2px" }),
    };

    return (
        <div style={tailStyle}>
            <svg
                viewBox="0 0 15 15"
                style={{ width: "100%", height: "100%", display: "block" }}
            >
                {/* This path creates a subtle, curved tail */}
                <path d="M0 15 L0 0 Q10 10, 15 15 Z" fill={color} />
            </svg>
        </div>
    );
};

export const MessageComponent = ({ node, updateAttributes }) => {
    const { name, profileImageSrc, messages } = node.attrs;

    const nameRef = useRef(null);
    const messageRefs = useRef([]);

    useEffect(() => {
        if (nameRef.current) nameRef.current.innerText = name;
        messages.forEach((msg, i) => {
            if (
                messageRefs.current[i] &&
                messageRefs.current[i].innerText !== msg.text
            ) {
                messageRefs.current[i].innerText = msg.text;
            }
        });
    }, []);

    const handleNameBlur = () => {
        updateAttributes({ name: nameRef.current.innerText });
    };

    const handleMessageBlur = (index) => {
        const updatedMessages = [...messages];
        updatedMessages[index] = {
            ...updatedMessages[index],
            text: messageRefs.current[index].innerText,
        };
        updateAttributes({ messages: updatedMessages });
    };

    const addMessage = (side) => {
        updateAttributes({
            messages: [
                ...messages,
                {
                    side,
                    text: "New message...",
                },
            ],
        });
    };

    const handleImageSrcChange = () => {
        const src = prompt("Enter profile image URL:", profileImageSrc || "");
        if (src !== null) {
            updateAttributes({ profileImageSrc: src });
        }
    };

    return (
        <NodeViewWrapper
            as="div"
            style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                background: "white",
                maxWidth: "600px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "16px",
                }}
            >
                <img
                    src={
                        profileImageSrc ||
                        "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                    }
                    alt="Profile"
                    onClick={handleImageSrcChange}
                    style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        cursor: "pointer",
                        marginRight: "8px",
                    }}
                />
                <div
                    ref={nameRef}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={handleNameBlur}
                    style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        outline: "none",
                    }}
                />
            </div>

            {/* Messages */}
            <div>
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            justifyContent:
                                msg.side === "left" ? "flex-start" : "flex-end",
                            marginBottom: "12px",
                        }}
                    >
                        <div style={{ position: "relative", maxWidth: "70%" }}>
                            <div
                                ref={(el) => (messageRefs.current[i] = el)}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={() => handleMessageBlur(i)}
                                style={{
                                    background: msg.side === "left" ? "#f1f0f0" : "#007bff",
                                    color: msg.side === "left" ? "#000" : "#fff",
                                    padding: "8px 12px",
                                    borderRadius:
                                        msg.side === "left"
                                            ? "18px 18px 18px 5px"
                                            : "18px 18px 5px 18px",
                                    outline: "none",
                                    wordWrap: "break-word",
                                }}
                            />
                            <BubbleTail side={msg.side} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Add message buttons */}
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <button
                    onClick={() => addMessage("left")}
                    style={{
                        background: "#f8f9fa",
                        border: "1px solid #dadce0",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                >
                    ➕ Add Left Message
                </button>
                <button
                    onClick={() => addMessage("right")}
                    style={{
                        background: "#f8f9fa",
                        border: "1px solid #dadce0",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                >
                    ➕ Add Right Message
                </button>
            </div>
        </NodeViewWrapper>
    );
};