import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MessageComponent } from "./MessageComponent";

export const MessageExtension = Node.create({
    name: "message",
    group: "block",
    atom: true,

    addAttributes() {
        return {
            name: { default: "John Doe" },
            profileImageSrc: { default: "" },
            messages: {
                default: [
                    { side: "left", text: "Hello!" },
                    { side: "right", text: "Hi there!" },
                ],
            },
        };
    },

    parseHTML() {
        return [{ tag: "div[data-type='message']" }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            mergeAttributes(HTMLAttributes, { "data-type": "message" }),
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MessageComponent);
    },
});