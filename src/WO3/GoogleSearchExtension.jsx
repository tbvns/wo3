import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { GoogleSearchComponent } from "./GoogleSearchComponent";

export const GoogleSearchExtension = Node.create({
    name: "googleSearch",
    group: "block",
    atom: true,

    addAttributes() {
        return {
            query: { default: "Search something..." },
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
        return [{ tag: "div.google-search-wrapper" }];
    },

    renderHTML({ HTMLAttributes, node }) {
        const { query, results } = node.attrs;

        const searchBar = [
            "div",
            { class: "google-search-bar" },
            ["span", { class: "icon" }, "🔍"],
            ["span", { class: "query" }, query],
        ];

        const resultElements = results.map((r) => [
            "div",
            { class: "google-search-result" },
            ["div", { class: "gs-title" }, r.title],
            ["div", { class: "gs-url" }, r.url],
            ["div", { class: "gs-description" }, r.description],
        ]);

        const componentContent = [
            "div",
            { class: "google-search-component" },
            searchBar,
            ["div", {}, ...resultElements],
        ];

        return [
            "div",
            mergeAttributes(HTMLAttributes, { class: "google-search-wrapper" }),
            componentContent,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(GoogleSearchComponent);
    },
});
