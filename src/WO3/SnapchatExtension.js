import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { SnapchatComponent } from "./SnapchatComponent";

export const SnapchatExtension = Node.create({
    name: "snapchat",
    group: "block",
    atom: true,

    addAttributes() {
        return {
            groupName: { default: "Group Chat" },
            groupIcon: { default: "" },
            people: {
                default: [
                    {
                        id: "1",
                        name: "Alice",
                        color: "#FF6B6B",
                        profileImageSrc: "",
                    },
                    {
                        id: "2",
                        name: "Bob",
                        color: "#4ECDC4",
                        profileImageSrc: "",
                    },
                ],
                parseHTML: (element) => {
                    const attr = element.getAttribute("people");
                    try {
                        return attr ? JSON.parse(attr) : [];
                    } catch {
                        return [];
                    }
                },
                renderHTML: (attributes) => {
                    return { people: JSON.stringify(attributes.people || []) };
                },
            },
            messages: {
                default: [
                    { personId: "1", text: "Hey everyone! 👋" },
                    { personId: "2", text: "What's up?" },
                    { personId: "1", text: "Just chilling, you?" },
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
        return [{ tag: "div.snapchat-wrapper" }];
    },

    renderHTML({ HTMLAttributes, node }) {
        const { groupName, groupIcon, people, messages } = node.attrs;

        const groupHeader = [
            "div",
            { class: "sc-header" },
            [
                "img",
                {
                    class: "sc-group-icon",
                    src:
                        groupIcon ||
                        "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
                    alt: "Group",
                },
            ],
            ["div", { class: "sc-group-name" }, groupName],
            [
                "div",
                { class: "sc-member-count" },
                `${people.length} member${people.length !== 1 ? "s" : ""}`,
            ],
        ];

        const messageElements = (messages || [])
            .map((msg) => {
                const person = people.find((p) => p.id === msg.personId);
                if (!person) return null;

                return [
                    "div",
                    { class: "sc-message-container" },
                    ["div", { class: "sc-message-name" }, person.name],
                    [
                        "div",
                        { class: "sc-message" },
                        [
                            "img",
                            {
                                class: "sc-msg-avatar",
                                src:
                                    person.profileImageSrc ||
                                    "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
                                alt: person.name,
                            },
                        ],
                        [
                            "div",
                            {
                                class: "sc-msg-bubble",
                                style: `background-color: ${person.color}`,
                            },
                            msg.text,
                        ],
                    ],
                ];
            })
            .filter(Boolean);

        const componentContent = [
            "div",
            { class: "snapchat-component" },
            groupHeader,
            ["div", { class: "sc-messages" }, ...messageElements],
        ];

        return [
            "div",
            mergeAttributes(HTMLAttributes, { class: "snapchat-wrapper" }),
            componentContent,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(SnapchatComponent);
    },
});
