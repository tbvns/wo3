import React, { useRef, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";

export const GoogleSearchComponent = ({ node, updateAttributes }) => {
    const { query, results } = node.attrs;

    const queryRef = useRef(null);
    const resultRefs = useRef([]);

    useEffect(() => {
        if (queryRef.current && queryRef.current.innerText !== query) {
            queryRef.current.innerText = query;
        }

        results.forEach((res, i) => {
            const refObj = resultRefs.current[i];
            if (!refObj) return; // Skip if ref not ready

            if (refObj.title && refObj.title.innerText !== res.title) {
                refObj.title.innerText = res.title;
            }
            if (refObj.url && refObj.url.innerText !== res.url) {
                refObj.url.innerText = res.url;
            }
            if (refObj.description && refObj.description.innerText !== res.description) {
                refObj.description.innerText = res.description;
            }
        });
    }, [query, results]);

    const handleQueryBlur = () => {
        updateAttributes({ query: queryRef.current.innerText });
    };

    const handleResultBlur = (index) => {
        const updatedResults = [...results];
        updatedResults[index] = {
            title: resultRefs.current[index].title.innerText,
            url: resultRefs.current[index].url.innerText,
            description: resultRefs.current[index].description.innerText,
        };
        updateAttributes({ results: updatedResults });
    };

    const addResult = () => {
        updateAttributes({
            results: [
                ...results,
                {
                    title: "New Result",
                    url: "https://example.com",
                    description: "Description here...",
                },
            ],
        });
    };

    const removeResult = (index) => {
        const updatedResults = results.filter((_, i) => i !== index);
        updateAttributes({ results: updatedResults });
        // Clean up refs
        resultRefs.current.splice(index, 1);
    };

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
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "16px",
                    background: "white",
                    maxWidth: "600px",
                    width: "100%",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                {/* Search bar */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "24px",
                        padding: "8px 16px",
                    }}
                >
                    <span style={{ marginRight: "8px", color: "#888" }}>🔍</span>
                    <div
                        ref={queryRef}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleQueryBlur}
                        style={{
                            flex: 1,
                            outline: "none",
                            fontSize: "16px",
                        }}
                    />
                </div>

                {/* Results */}
                <div>
                    {results.map((res, i) => {
                        if (!resultRefs.current[i]) {
                            resultRefs.current[i] = {};
                        }
                        return (
                            <div
                                key={i}
                                style={{
                                    marginBottom: "20px",
                                    position: "relative",
                                    border: "1px solid transparent",
                                    borderRadius: "4px",
                                    padding: "8px",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.border = "1px solid #ddd";
                                    const deleteBtn = e.currentTarget.querySelector(".delete-btn");
                                    if (deleteBtn) deleteBtn.style.opacity = "1";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.border = "1px solid transparent";
                                    const deleteBtn = e.currentTarget.querySelector(".delete-btn");
                                    if (deleteBtn) deleteBtn.style.opacity = "0";
                                }}
                                onBlur={() => handleResultBlur(i)}
                            >
                                <button
                                    className="delete-btn"
                                    onClick={() => removeResult(i)}
                                    style={{
                                        position: "absolute",
                                        top: "4px",
                                        right: "4px",
                                        background: "#ff4444",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "20px",
                                        height: "20px",
                                        minWidth: "20px",
                                        minHeight: "20px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        opacity: "0",
                                        transition: "opacity 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        lineHeight: "1",
                                        padding: "0",
                                    }}
                                    title="Delete result"
                                >
                                    ×
                                </button>
                                <div
                                    ref={(el) => {
                                        if (!resultRefs.current[i]) resultRefs.current[i] = {};
                                        resultRefs.current[i].title = el;
                                    }}                                    contentEditable
                                    suppressContentEditableWarning
                                    style={{
                                        color: "#1a0dab",
                                        fontSize: "18px",
                                        cursor: "pointer",
                                        outline: "none",
                                    }}
                                />
                                <div
                                    ref={(el) => (resultRefs.current[i].url = el)}
                                    contentEditable
                                    suppressContentEditableWarning
                                    style={{
                                        color: "#006621",
                                        fontSize: "14px",
                                        outline: "none",
                                    }}
                                />
                                <div
                                    ref={(el) => (resultRefs.current[i].description = el)}
                                    contentEditable
                                    suppressContentEditableWarning
                                    style={{
                                        color: "#545454",
                                        fontSize: "14px",
                                        outline: "none",
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={addResult}
                    style={{
                        background: "#f8f9fa",
                        border: "1px solid #dadce0",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                >
                    ➕ Add Result
                </button>
            </div>
        </NodeViewWrapper>
    );
};
