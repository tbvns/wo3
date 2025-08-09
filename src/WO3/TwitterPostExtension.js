import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TwitterPostComponent } from "./TwitterPostComponent";

export const TwitterPostExtension = Node.create({
    name: "twitterPost",
    group: "block",
    atom: true,

    addAttributes() {
        return {
            username: { default: "John Doe" },
            handle: { default: "@johndoe" },
            text: { default: "This is a sample tweet." },
            timestamp: { default: "12:34 PM · Aug 9, 2025" },
            likes: { default: "10" },
            retweets: { default: "5" },
            replies: { default: "2" },
            profileImageLink: { default: "" },
            profileImageSrc: { default: "" },
            liked: { default: false },
            retweeted: { default: false },
        };
    },

    parseHTML() {
        return [{ tag: "div[data-type='twitter-post']" }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            mergeAttributes(HTMLAttributes, { "data-type": "twitter-post" }),
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(TwitterPostComponent);
    },
});