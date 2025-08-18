import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { EmailComponent } from "./EmailComponent";

export const EmailExtension = Node.create({
    name: "email",
    group: "block",
    atom: true,

    addAttributes() {
        return {
            isCompose: { default: false },
            subject: { default: "Re: Project Update" },
            fromName: { default: "Jane Smith" },
            fromEmail: { default: "<jane@company.com>" },
            toEmail: { default: "john@company.com" },
            timestamp: { default: "Aug 16, 2025" },
            body: { default: "Hi there,<br><br>Here are the latest updates on our project..." },
            profileImageSrc: { default: "" },
        };
    },

    parseHTML() {
        return [{ tag: "div.email-wrapper" }];
    },

    renderHTML({ HTMLAttributes, node }) {
        const {
            isCompose,
            subject,
            fromName,
            fromEmail,
            toEmail,
            timestamp,
            body,
            profileImageSrc,
        } = node.attrs;

        const defaultImageSrc = "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico";
        const imageUrl = profileImageSrc || defaultImageSrc;

        if (isCompose) {
            // Compose mode HTML
            return [
                "div",
                mergeAttributes(HTMLAttributes, {
                    class: "email-wrapper compose",
                    body: body // Store HTML content as attribute
                }),
                [
                    "div",
                    { class: "email-compose-window" },
                    [
                        "div",
                        { class: "ec-header" },
                        ["div", { class: "ec-title" }, "New Message"],
                        [
                            "div",
                            { class: "ec-window-actions" },
                            ["span", { class: "ec-icon" }, "−"],
                            ["span", { class: "ec-icon" }, "□"],
                            ["span", { class: "ec-icon" }, "×"],
                        ],
                    ],
                    [
                        "div",
                        { class: "ec-row" },
                        ["div", { class: "ec-label" }, "To"],
                        ["div", { class: "ec-value" }, toEmail],
                    ],
                    [
                        "div",
                        { class: "ec-row" },
                        ["div", { class: "ec-label" }, "Subject"],
                        ["div", { class: "ec-value" }, subject],
                    ],
                    ["div", { class: "ec-body" }, ""], // Empty, will be filled by extractDynamicStylesAndClasses
                    [
                        "div",
                        { class: "ec-actions" },
                        ["div", { class: "ec-btn primary" }, "Send"],
                        ["div", { class: "ec-btn" }, "Formatting"],
                    ],
                ],
            ];
        } else {
            // Receive mode HTML
            return [
                "div",
                mergeAttributes(HTMLAttributes, {
                    class: "email-wrapper receive",
                    body: body // Store HTML content as attribute
                }),
                [
                    "div",
                    { class: "eh-bar" },
                    ["div", { class: "eh-subject" }, subject],
                    [
                        "div",
                        { class: "eh-actions" },
                        ["span", { class: "eh-icon" }, "↶"],
                        ["span", { class: "eh-icon" }, "⭐"],
                        ["span", { class: "eh-icon" }, "..."],
                    ],
                ],
                [
                    "div",
                    { class: "em-line" },
                    ["img", { class: "em-avatar", src: imageUrl, alt: "Profile" }],
                    [
                        "div",
                        { style: "margin-right: 12px;" },
                        [
                            "div",
                            { class: "em-from-row" },
                            fromName,
                            ["span", { class: "em-from-email" }, fromEmail],
                        ],
                        ["div", { class: "em-to-row" }, "to me"],
                    ],
                    ["div", { class: "em-time" }, timestamp],
                ],
                ["div", { class: "email-body" }, ""], // Empty, will be filled by extractDynamicStylesAndClasses
            ];
        }
    },

    addNodeView() {
        return ReactNodeViewRenderer(EmailComponent);
    },
});
