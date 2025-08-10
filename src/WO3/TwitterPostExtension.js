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
            profileImageSrc: { default: "" },
        };
    },

    parseHTML() {
        return [{ tag: "div.twitter-post-wrapper" }];
    },

    renderHTML({ HTMLAttributes, node }) {
        const {
            username,
            handle,
            text,
            timestamp,
            likes,
            retweets,
            replies,
            profileImageSrc,
        } = node.attrs;

        const imageUrl =
            profileImageSrc ||
            "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png";

        const header = [
            "div",
            { class: "tp-header" },
            [
                "img",
                { class: "tp-profile-img", src: imageUrl, alt: "Profile picture" },
            ],
            [
                "div",
                {},
                ["span", { class: "tp-username" }, username],
                ["span", { class: "tp-handle" }, handle],
            ],
        ];

        const tweetText = ["div", { class: "tp-text" }, text];
        const timestampDiv = ["div", { class: "tp-timestamp" }, timestamp];
        const stats = [
            "div",
            { class: "tp-stats" },
            ["span", {}, `${replies} Replies`],
            ["span", {}, `${retweets} Retweets`],
            ["span", {}, `${likes} Likes`],
        ];

        const componentContent = [
            "div",
            { class: "twitter-post-component" },
            header,
            tweetText,
            timestampDiv,
            stats,
        ];

        return [
            "div",
            mergeAttributes(HTMLAttributes, { class: "twitter-post-wrapper" }),
            componentContent,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(TwitterPostComponent);
    },
});
