import React, { useEffect, useState } from "react";

const ExportModal = ({ onClose, onCopyContent, onCopyStyles, onDownload, onExport, setLevel }) => {
    const [copied, setCopied] = useState(false);
    const [protectionLevel, setProtectionLevel] = useState(0);

    const copyAttribution = () => {
        const attributionText = 'Created with the help of <a href="https://wo3.tbvns.xyz">WO3</a>';
        navigator.clipboard.writeText(attributionText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        onDownload(protectionLevel);
    };

    const handleCopyContent = () => {
        onCopyContent(protectionLevel);
    };

    const getProtectionDescription = (level) => {
        switch(level) {
            case 0: return "No protection";
            case 1: return "Invisible black 0px text between paragraphs, moderate protection";
            case 2: return "Invisible white 1px text between paragraphs, strong protection";
            case 3: return "White span for each space, maximum protection";
            default: return "No protection";
        }
    };

    const getProtectionWarning = (level) => {
        if (level === 1) {
            return "Warning: Will increase word count.";
        }
        if (level === 2) {
            return "Warning: Will increase word count.";
        }
        if (level === 3) {
            return "Warning: Spaces and line breaks may become inconsistent, will increase word count.";
        }
        return "";
    };

    useEffect(() => {
        onExport();
        setLevel(protectionLevel)
    }, [onExport, protectionLevel, setLevel]);

    return (
        <div
            className="work-manager-overlay"
            onClick={(e) => {
                if (e.target.classList.contains("work-manager-overlay")) {
                    onClose();
                }
            }}
        >
            <div className="work-manager-modal" style={{ maxWidth: "500px" }}>
                <div className="work-manager-header">
                    <h2>Export Options</h2>
                    <button className="close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div
                    style={{
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                    }}
                >
                    <button
                        className="backup-btn load-work"
                        onClick={handleCopyContent}
                        style={{ width: "100%" }}
                    >
                        📄 Copy Content
                    </button>
                    <button
                        className="backup-btn load-backup"
                        onClick={onCopyStyles}
                        style={{ width: "100%" }}
                    >
                        🎨 Copy Workskin
                    </button>
                    <button
                        className="backup-btn save-backup"
                        onClick={handleDownload}
                        style={{ width: "100%" }}
                    >
                        💾 Download Files
                    </button>
                </div>

                {/* AI Protection Slider */}
                <div style={{ padding: "0 20px 20px" }}>
                    <h3 style={{ margin: "10px 0 15px" }}>AI and Scraper Protection</h3>

                    {/* Custom styled range slider */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        marginBottom: "10px"
                    }}>
                        <span style={{ fontSize: "0.9em", color: "#718096" }}>0</span>
                        <input
                            type="range"
                            min="0"
                            max="3"
                            value={protectionLevel}
                            onChange={(e) => setProtectionLevel(parseInt(e.target.value))}
                            style={{
                                flex: 1,
                                height: "6px",
                                borderRadius: "3px",
                                border: "1px solid #e2e8f0",
                                outline: "none",
                                appearance: "none",
                                cursor: "pointer",
                                background: `linear-gradient(to right, 
                                    #F40439 0%, 
                                    #F40439 ${protectionLevel * 33.33}%, 
                                    #f7fafc ${protectionLevel * 33.33}%, 
                                    #f7fafc 100%)`
                            }}
                        />
                        <span style={{ fontSize: "0.9em", color: "#718096" }}>3</span>
                    </div>

                    {/* Level indicator dots */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                        padding: "0 5px"
                    }}>
                        {[0, 1, 2, 3].map(level => (
                            <div
                                key={level}
                                style={{
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "50%",
                                    background: protectionLevel >= level
                                        ? "#F40439"
                                        : "#e2e8f0",
                                    border: protectionLevel >= level
                                        ? "2px solid #F86182"
                                        : "2px solid #e2e8f0",
                                    transition: "all 0.2s"
                                }}
                            />
                        ))}
                    </div>

                    <div style={{
                        fontSize: "0.85em",
                        color: "#666",
                        minHeight: "45px"
                    }}>
                        <div>{getProtectionDescription(protectionLevel)}</div>
                        {getProtectionWarning(protectionLevel) && (
                            <div style={{
                                color: "#ff6b6b",
                                fontWeight: "bold",
                                marginTop: "5px"
                            }}>
                                {getProtectionWarning(protectionLevel)}
                            </div>
                        )}
                    </div>
                </div>

                <div
                    style={{
                        padding: "0 20px 20px",
                        fontSize: "0.9em",
                        color: "#666",
                    }}
                >
                    <p>
                        Support us by tagging your work with <strong>WO3</strong> and
                        adding this HTML to your work's end notes:
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
            <pre
                style={{
                    backgroundColor: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "4px",
                    overflowX: "auto",
                    fontSize: "0.85em",
                    flex: 1,
                    margin: 0,
                }}
            >
              <code>
                Created with the help of &lt;a
                href="https://wo3.tbvns.xyz"&gt;WO3&lt;/a&gt;
              </code>
            </pre>
                        <button
                            onClick={copyAttribution}
                            style={{
                                width: "80px",
                                backgroundColor: "#f0f0f0",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.85em",
                            }}
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                    <p style={{ marginTop: "10px", fontSize: "0.85em", fontStyle: "italic" }}>
                        This is completely optional - we won't enforce it if you choose not to include it. <br/>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
