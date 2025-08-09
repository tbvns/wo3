// GoogleSearchExtension.js
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { GoogleSearchComponent } from "./GoogleSearchComponent";

export const GoogleSearchExtension = Node.create({
    name: "googleSearch",
    group: "block",
    atom: true,

    addAttributes() {
        return {
            query: {
                default: "Search something...",
            },
            results: {
                default: [
                    {
                        title: "Example Result",
                        url: "https://example.com",
                        description: "This is an example search result description.",
                    },
                ],
            },
        };
    },

    parseHTML() {
        return [{ tag: "div[data-type='google-search']" }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            mergeAttributes(HTMLAttributes, { "data-type": "google-search" }),
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(GoogleSearchComponent);
    },
});