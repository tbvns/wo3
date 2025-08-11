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
                parseHTML: (element) => {
                    const attr = element.getAttribute("messages");
                    try {
                        return attr ? JSON.parse(attr) : [];
                    } catch {
                        return [];
                    }
                },
                renderHTML: (attributes) => {
                    return { messages: JSON.stringify(attributes.messages || []) };
                },
            },
        };
    },

    parseHTML() {
        return [{ tag: "div.message-wrapper" }];
    },

    renderHTML({ HTMLAttributes, node }) {
        const { name, profileImageSrc, messages } = node.attrs;
        const imageUrl =
            profileImageSrc ||
            "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png";

        const header = [
            "div",
            { class: "msg-header" },
            ["img", { class: "msg-profile-img", src: imageUrl, alt: "Profile" }],
            ["div", { class: "msg-name" }, name],
        ];

        const messageElements = (messages || []).map((m) => [
            "div",
            { class: `msg-bubble-container ${m.side}` },
            [
                "div",
                { class: "msg-bubble" },
                ["div", { class: `msg-bubble-content ${m.side}` }, m.text],
            ],
        ]);

        const componentContent = [
            "div",
            { class: "message-component" },
            header,
            ["div", {}, ...messageElements],
        ];

        return [
            "div",
            mergeAttributes(HTMLAttributes, { class: "message-wrapper" }),
            componentContent,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MessageComponent);
    },
});
