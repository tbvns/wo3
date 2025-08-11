import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NewsWebsiteComponent } from "./NewsWebsiteComponent";

export const NewsWebsiteExtension = Node.create({
    name: "newsWebsite",
    group: "block",
    atom: true,

    addAttributes() {
        return {
            siteName: { default: "My News" },
            siteLink: { default: "" },
            primaryColor: { default: "#222222" },
            secondaryColor: { default: "#ffffff" },
            styleVariant: { default: 1 },
            headline: { default: "Breaking News Headline" },
            subheadline: { default: "Subheadline goes here" },
            content: { default: "Article content goes here..." },
            accentColor: { default: "#4ecdc4" },
            textColor: { default: "#2c3e50" },
            mutedColor: { default: "#7f8c8d" },
            borderColor: { default: "#dddddd" },
            headlineColor: { default: "#000000" }
        };
    },

    parseHTML() {
        return [{ tag: "div.news-website-wrapper" }];
    },

    renderHTML({ HTMLAttributes, node }) {
        const {
            siteName,
            siteLink,
            primaryColor,
            secondaryColor,
            styleVariant,
            headline,
            subheadline,
            content,
            headlineColor,
            textColor,
            mutedColor,
            borderColor,
            accentColor
        } = node.attrs;

        const topbarStyle =
            styleVariant === 4
                ? `background-color:transparent;color:${primaryColor};border-bottom:1px solid ${borderColor};`
                : `background-color:${primaryColor};color:${secondaryColor};border-color:${primaryColor};`;

        const topbar = [
            "div",
            {
                class: "news-topbar",
                style: topbarStyle
            },
            siteLink
                ? ["a", { href: siteLink, class: "news-site-link" }, siteName]
                : ["span", { class: "news-site-name" }, siteName]
        ];

        return [
            "div",
            mergeAttributes(HTMLAttributes, {
                class: `news-website-wrapper style-${styleVariant}`
            }),
            topbar,
            [
                "div",
                { class: "news-content-area" },
                [
                    "h1",
                    {
                        class: "news-headline",
                        style: `color:${headlineColor};`
                    },
                    headline
                ],
                [
                    "h2",
                    {
                        class: "news-subheadline",
                        style: `color:${mutedColor};border-color:${
                            styleVariant === 2
                                ? accentColor
                                : borderColor
                        };background-color:${
                            styleVariant === 2 ? "#f8f9fa" : "transparent"
                        };`
                    },
                    subheadline
                ],
                [
                    "div",
                    {
                        class: "news-article-content",
                        style: `color:${textColor};`
                    },
                    content
                ]
            ]
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(NewsWebsiteComponent);
    }
});
