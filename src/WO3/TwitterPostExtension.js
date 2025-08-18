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
            liked: { default: false },
            retweeted: { default: false },
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
            liked,
            retweeted,
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
            [
                "span",
                {},
                [
                    "img",
                    {
                        src: "https://wo3.tbvns.xyz/images/twt-comments.png",
                        class: "tp-icon",
                        alt: "Replies",
                    },
                ],
                ` ${replies}`,
            ],
            [
                "span",
                { class: retweeted ? "retweeted" : "" },
                [
                    "img",
                    {
                        src: retweeted
                            ? "https://wo3.tbvns.xyz/images/twt-retweeted.png"
                            : "https://wo3.tbvns.xyz/images/twt-retweet.png",
                        class: "tp-icon",
                        alt: "Retweets",
                    },
                ],
                ` ${retweets}`,
            ],
            [
                "span",
                { class: liked ? "liked" : "" },
                [
                    "img",
                    {
                        src: liked
                            ? "https://wo3.tbvns.xyz/images/twt-liked.png"
                            : "https://wo3.tbvns.xyz/images/twt-like.png",
                        class: "tp-icon",
                        alt: "Likes",
                    },
                ],
                ` ${likes}`,
            ],
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
