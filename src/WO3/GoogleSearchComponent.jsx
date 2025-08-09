// GoogleSearchComponent.jsx
import React, { useRef, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";

export const GoogleSearchComponent = ({ node, updateAttributes }) => {
    const { query, results } = node.attrs;

    const queryRef = useRef(null);
    const resultRefs = useRef([]);

    // Initialize content only once
    useEffect(() => {
        if (queryRef.current && queryRef.current.innerText !== query) {
            queryRef.current.innerText = query;
        }
        results.forEach((res, i) => {
            if (resultRefs.current[i]) {
                if (resultRefs.current[i].title.innerText !== res.title) {
                    resultRefs.current[i].title.innerText = res.title;
                }
                if (resultRefs.current[i].url.innerText !== res.url) {
                    resultRefs.current[i].url.innerText = res.url;
                }
                if (
                    resultRefs.current[i].description.innerText !== res.description
                ) {
                    resultRefs.current[i].description.innerText = res.description;
                }
            }
        });
    }, []); // only run once

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
                            style={{ marginBottom: "20px" }}
                            onBlur={() => handleResultBlur(i)}
                        >
                            <div
                                ref={(el) => (resultRefs.current[i].title = el)}
                                contentEditable
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

            {/* Add result button */}
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
        </NodeViewWrapper>
    );
};