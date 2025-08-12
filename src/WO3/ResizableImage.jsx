import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import React from "react";

const ResizableImageComponent = ({ node, updateAttributes, selected }) => {
    const { src, alt, title, width, textAlign } = node.attrs;

    const initialRem = parseFloat(width) || 20; // default 20rem
    const [size, setSize] = React.useState(initialRem);
    const wrapperRef = React.useRef(null);

    React.useEffect(() => {
        setSize(parseFloat(width) || 20);
    }, [width]);

    const handleSizeChange = (newSize) => {
        setSize(newSize);
        updateAttributes({ width: `${newSize}rem` });
    };

    return (
        <NodeViewWrapper
            as="div"
            ref={wrapperRef}
            className={`resizable-image-wrapper ${selected ? "ProseMirror-selectednode" : ""}`}
            style={{
                textAlign: textAlign || "left",
                width: "100%",
                position: "relative"
            }}
            data-text-align={textAlign || "left"}
        >
            {selected && (
                <div
                    contentEditable={false}
                    style={{
                        position: "absolute",
                        top: "-40px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(0,0,0,0.8)",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        zIndex: 10,
                        color: "white",
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <input
                        type="range"
                        min="5"
                        max="50"
                        step="0.5"
                        value={size}
                        onChange={(e) => handleSizeChange(parseFloat(e.target.value))}
                        style={{ cursor: "pointer" }}
                    />
                    <input
                        type="number"
                        min="5"
                        max="50"
                        step="0.5"
                        value={size}
                        onChange={(e) => handleSizeChange(parseFloat(e.target.value))}
                        style={{
                            width: "60px",
                            background: "transparent",
                            border: "1px solid white",
                            color: "white",
                            textAlign: "center"
                        }}
                    />
                    <span>rem</span>
                </div>
            )}

            <img
                src={src}
                alt={alt}
                title={title}
                style={{ width, display: "inline-block" }}
                className="resizable-image"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
            />
        </NodeViewWrapper>
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
