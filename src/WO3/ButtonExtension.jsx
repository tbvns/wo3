import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import React from "react";

// Button component renderer
export const ButtonComponent = ({ node, updateAttributes }) => {
    const { text, color } = node.attrs;

    const handleClick = () => {
        const newText = prompt("Edit button text:", text);
        if (newText !== null) {
            updateAttributes({ text: newText });
        }
    };

    return (
        <NodeViewWrapper
            as="span"
            style={{
                display: "inline-block",
                margin: "5px",
            }}
        >
            <button
                onClick={handleClick}
                style={{
                    background: color,
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                }}
            >
                {text}
            </button>
        </NodeViewWrapper>
    );
};

// Factory function to create button extensions
export const createButtonExtension = (buttonType, defaultText, color) => {
    return Node.create({
        name: buttonType,
        group: "inline",
        inline: true,
        atom: true, // treat as a single unit

        addAttributes() {
            return {
                text: {
                    default: defaultText,
                },
                color: {
                    default: color,
                },
            };
        },

        parseHTML() {
            return [
                {
                    tag: `span[data-button-type="${buttonType}"]`,
                },
            ];
        },

        renderHTML({ HTMLAttributes }) {
            return [
                "span",
                mergeAttributes(HTMLAttributes, {
                    "data-button-type": buttonType,
                }),
            ];
        },

        addNodeView() {
            return ReactNodeViewRenderer(ButtonComponent);
        },
    });
};