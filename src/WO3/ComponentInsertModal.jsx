import React from "react";
import ComponentDisplay from "./ComponentDisplay";

export default function ComponentInsertModal({ onInsert, onClose }) {
    const components = [
        {
            id: "googleSearch",
            name: "Google Search",
            preview: (
                <div style={{ fontFamily: "Arial, sans-serif", background: "white", padding: "8px", borderRadius: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "24px", padding: "4px 8px", marginBottom: "8px" }}>
                        🔍 <span style={{ marginLeft: "8px", color: "#555" }}>Search something...</span>
                    </div>
                    <div>
                        <div style={{ color: "#1a0dab", fontSize: "14px" }}>Example Result</div>
                        <div style={{ color: "#006621", fontSize: "12px" }}>https://example.com</div>
                        <div style={{ color: "#545454", fontSize: "12px" }}>This is an example search result description.</div>
                    </div>
                </div>
            )
        },
        {
            id: "twitterPost",
            name: "Twitter Post",
            preview: (
                <div style={{
                    border: "1px solid #e1e8ed",
                    borderRadius: "16px",
                    padding: "12px",
                    background: "white",
                    maxWidth: "300px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "13px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                        <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "#ccc",
                            marginRight: "8px"
                        }} />
                        <div>
                            <strong>John Doe</strong> <span style={{ color: "#657786" }}>@johndoe</span>
                        </div>
                    </div>
                    <div>This is a sample tweet.</div>
                    <div style={{ color: "#657786", fontSize: "12px", marginTop: "4px" }}>
                        12:34 PM · Aug 9, 2025
                    </div>
                    <div style={{ display: "flex", gap: "8px", color: "#657786", fontSize: "12px", marginTop: "4px" }}>
                        <span>2 Replies</span>
                        <span>5 Retweets</span>
                        <span>10 Likes</span>
                    </div>
                </div>
            )
        },
        {
            id: "message",
            name: "Message",
            preview: (
                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "16px",
                        background: "white",
                        maxWidth: "300px",
                        fontFamily: "Arial, sans-serif",
                        fontSize: "14px",
                        lineHeight: "1.4",
                        color: "#0f1419",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                        <img
                            src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                            alt="Profile"
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginRight: "8px",
                            }}
                        />
                        <div style={{ fontWeight: "bold", fontSize: "14px" }}>John Doe</div>
                    </div>
                    <div>
                        {/* Left Message */}
                        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "12px" }}>
                            <div style={{ position: "relative", maxWidth: "70%" }}>
                                <div style={{ background: "#f1f0f0", color: "#000", padding: "8px 12px", borderRadius: "18px 18px 18px 5px" }}>
                                    Hello!
                                </div>
                                <div style={{ position: "absolute", bottom: 0, left: "-2px", width: "15px", height: "15px", transform: "scaleX(-1)" }}>
                                    <svg viewBox="0 0 15 15" style={{ width: "100%", height: "100%" }}>
                                        <path d="M0 15 L0 0 Q10 10, 15 15 Z" fill="#f1f0f0" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {/* Right Message */}
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div style={{ position: "relative", maxWidth: "70%" }}>
                                <div style={{ background: "#007bff", color: "#fff", padding: "8px 12px", borderRadius: "18px 18px 5px 18px" }}>
                                    Hi there!
                                </div>
                                <div style={{ position: "absolute", bottom: 0, right: "-2px", width: "15px", height: "15px" }}>
                                    <svg viewBox="0 0 15 15" style={{ width: "100%", height: "100%" }}>
                                        <path d="M0 15 L0 0 Q10 10, 15 15 Z" fill="#007bff" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: "snapchat",
            name: "Group Chat",
            preview: (
                <div style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "16px",
                    background: "white",
                    maxWidth: "300px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "13px"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                        paddingBottom: "8px",
                        borderBottom: "1px solid #eee"
                    }}>
                        <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "#ccc",
                            marginRight: "8px"
                        }} />
                        <div>
                            <strong>Group Chat</strong>
                            <div style={{ fontSize: "11px", color: "#666" }}>3 members</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", marginBottom: "8px" }}>
                        <div style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: "#ccc"
                        }} />
                        <div style={{ position: "relative" }}>
                            <div style={{
                                background: "#FF6B6B",
                                color: "#000",
                                padding: "6px 10px",
                                borderRadius: "12px 12px 12px 3px",
                                fontSize: "12px"
                            }}>
                                <div style={{ fontSize: "9px", fontWeight: "600", marginBottom: "1px", opacity: 0.8 }}>
                                    Alice
                                </div>
                                <div>Hey everyone! 👋</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
                        <div style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: "#ccc"
                        }} />
                        <div style={{ position: "relative" }}>
                            <div style={{
                                background: "#4ECDC4",
                                color: "#000",
                                padding: "6px 10px",
                                borderRadius: "12px 12px 12px 3px",
                                fontSize: "12px"
                            }}>
                                <div style={{ fontSize: "9px", fontWeight: "600", marginBottom: "1px", opacity: 0.8 }}>
                                    Bob
                                </div>
                                <div>What's up?</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "newsWebsite",
            name: "News Website",
            preview: (
                <div style={{
                    width: "100%",
                    background: "white",
                    fontFamily: "Arial, sans-serif",
                    color: "#0f1419",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    overflow: "visible",
                    maxWidth: "280px"
                }}>
                    <div style={{
                        background: "#222",
                        color: "#fff",
                        padding: "8px 12px",
                        fontWeight: "bold",
                        fontSize: "14px"
                    }}>
                        My News Site
                    </div>
                    <div style={{ padding: "10px" }}>
                        <h1 style={{
                            fontSize: "16px",
                            margin: "0 0 6px 0"
                        }}>Breaking News Headline</h1>
                        <h2 style={{
                            fontSize: "12px",
                            margin: "0 0 8px 0",
                            color: "#555"
                        }}>Subheadline goes here</h2>
                        <p style={{
                            fontSize: "11px",
                            lineHeight: "1.4"
                        }}>This is a short preview of the news article content...</p>
                    </div>
                </div>
            )
        },
        {
            id: "email",
            name: "Email",
            preview: (
                <div
                    style={{
                        border: "1px solid #e0e3e7",
                        borderRadius: "8px",
                        padding: "8px",
                        background: "white",
                        maxWidth: "300px",
                        fontFamily: "Arial, sans-serif",
                        fontSize: "13px",
                        color: "#202124",
                    }}
                >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        Re: Project Update
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            style={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                background: "#ccc",
                            }}
                        />
                        <div style={{ color: "#5f6368" }}>Jane Smith • Aug 16, 2025</div>
                    </div>
                    <div style={{ marginTop: 8, color: "#3c4043" }}>
                        Hi there, sharing the latest updates...
                    </div>
                </div>
            ),
        },
        {
            id: "instagramPost",
            name: "Instagram Post",
            preview: (
                <div style={{
                    border: "1px solid #dbdbdb",
                    borderRadius: "8px",
                    padding: "12px",
                    background: "white",
                    maxWidth: "300px",
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    fontSize: "14px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                        <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "#ccc",
                            marginRight: "8px"
                        }} />
                        <div>
                            <strong>johndoe</strong>
                            <div style={{ fontSize: "12px", color: "#8e8e8e" }}>Location</div>
                        </div>
                    </div>
                    <div style={{
                        width: "100%",
                        height: "200px",
                        background: "#f5f5f5",
                        borderRadius: "4px",
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8e8e8e"
                    }}>
                        📷
                    </div>
                    <div style={{ fontSize: "12px" }}>
                        <strong>42 likes</strong><br />
                        <strong>johndoe</strong> Beautiful sunset! 🌅<br />
                        <span style={{ color: "#8e8e8e" }}>View all 5 comments</span>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "320px",
                height: "100vh",
                background: "linear-gradient(135deg, #F40439 0%, #F86182 100%)",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "1rem",
                boxShadow: "-4px 0 15px rgba(244, 4, 57, 0.3)",
                zIndex: 1000,
                overflowX: "visible",
                overflowY: "scroll",
                boxSizing: "border-box",
                borderTopLeftRadius: "12px",
                borderBottomLeftRadius: "12px",
            }}
        >
            <h2 style={{
                margin: "0 0 1rem 0",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "1.2rem"
            }}>
                Select a Component
            </h2>

            <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                width: "100%",
                overflow: "visible", // allow hover growth
                flex: 1
            }}>
                {components.map((component) => (
                    <li key={component.id} style={{ marginBottom: "1rem", width: "100%" }}>
                        <ComponentDisplay
                            preview={component.preview}
                            name={component.name}
                            onClick={() => onInsert(component.id)}
                        />
                    </li>
                ))}
            </ul>

            <button
                onClick={onClose}
                style={{
                    marginTop: "auto",
                    background: "white",
                    color: "#F40439",
                    width: "100%",
                    height: "100px",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 6px rgba(255,255,255,0.2)",
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = "#fce7ea";
                    e.target.style.color = "#F40439";
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = "white";
                    e.target.style.color = "#F40439";
                }}
            >
                Close
            </button>
        </div>
    );
}
