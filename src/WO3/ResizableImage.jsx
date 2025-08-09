import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import React, { useState, useEffect, useRef } from "react";

const ResizableImageComponent = ({ node, updateAttributes, selected }) => {
    const { src, alt, title, width, textAlign } = node.attrs;
    const [size, setSize] = React.useState(parseInt(width) || 100);
    const wrapperRef = React.useRef(null);
    const [toolbarPos, setToolbarPos] = React.useState({ top: 0, left: 0 });

    React.useEffect(() => {
        setSize(parseInt(width) || 100);
    }, [width]);

    React.useEffect(() => {
        if (selected && wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setToolbarPos({
                top: rect.top - 40,
                left: rect.left + rect.width / 2,
            });
        }
    }, [selected]);

    const handleSizeChange = (newSize) => {
        setSize(newSize);
        updateAttributes({ width: `${newSize}%` });
    };

    return (
        <>
            {selected && (
                <div
                    contentEditable={false}
                    style={{
                        position: "fixed",
                        top: `${toolbarPos.top}px`,
                        left: `${toolbarPos.left}px`,
                        transform: "translateX(-50%)",
                        background: "rgba(0,0,0,0.8)",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        zIndex: 9999,
                        color: "white",
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={size}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        onChange={(e) => handleSizeChange(parseInt(e.target.value))}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <input
                        type="number"
                        min="10"
                        value={size}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        onChange={(e) => handleSizeChange(parseInt(e.target.value))}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: "50px",
                            background: "transparent",
                            border: "1px solid white",
                            color: "white",
                            textAlign: "center",
                            userSelect: "none",
                        }}
                    />
                    <span>%</span>
                </div>
            )}

            <NodeViewWrapper
                as="div"
                ref={wrapperRef}
                className={`resizable-image-wrapper ${
                    selected ? "ProseMirror-selectednode" : ""
                }`}
                style={{ textAlign }}
            >
                <img
                    src={src}
                    alt={alt}
                    title={title}
                    style={{ width }}
                    className="resizable-image"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                />
            </NodeViewWrapper>
        </>
    );
};

export const ResizableImage = Image.extend({
    name: "resizableImage",
    group: "block",
    draggable: false,

    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: "100%",
                parseHTML: (element) => element.style.width || "100%",
                renderHTML: (attributes) => ({
                    style: `width: ${attributes.width}`,
                }),
            },
            textAlign: {
                default: "left",
                parseHTML: (element) => element.style.textAlign || "left",
                renderHTML: (attributes) => ({
                    style: `text-align: ${attributes.textAlign}`,
                }),
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageComponent);
    },
});