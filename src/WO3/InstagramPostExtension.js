import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { InstagramPostComponent } from "./InstagramPostComponent";

export const InstagramPostExtension = Node.create({
    name: "instagramPost",
    group: "block",
    atom: true,

    addAttributes() {
        return {
            username: {
                default: "johndoe",
                parseHTML: element => {
                    return element.getAttribute('data-username') ||
                        element.querySelector('.ig-username')?.textContent ||
                        "johndoe";
                },
                renderHTML: attributes => {
                    if (attributes.username) {
                        return { 'data-username': attributes.username };
                    }
                    return {};
                }
            },
            caption: {
                default: "Beautiful sunset today! 🌅",
                parseHTML: element => {
                    return element.getAttribute('data-caption') ||
                        element.querySelector('.ig-caption-text')?.textContent ||
                        "Beautiful sunset today! 🌅";
                },
                renderHTML: attributes => {
                    if (attributes.caption) {
                        return { 'data-caption': attributes.caption };
                    }
                    return {};
                }
            },
            imageUrl: {
                default: "",
                parseHTML: element => {
                    return element.getAttribute('data-image-url') ||
                        element.querySelector('.ig-post-image')?.getAttribute('src') ||
                        "";
                },
                renderHTML: attributes => {
                    if (attributes.imageUrl) {
                        return { 'data-image-url': attributes.imageUrl };
                    }
                    return {};
                }
            },
            likes: {
                default: "42",
                parseHTML: element => {
                    return element.getAttribute('data-likes') ||
                        element.querySelector('.ig-likes-count')?.textContent ||
                        "42";
                },
                renderHTML: attributes => {
                    if (attributes.likes) {
                        return { 'data-likes': attributes.likes };
                    }
                    return {};
                }
            },
            timestamp: {
                default: "2 hours ago",
                parseHTML: element => {
                    return element.getAttribute('data-timestamp') ||
                        element.querySelector('.ig-timestamp')?.textContent ||
                        "2 hours ago";
                },
                renderHTML: attributes => {
                    if (attributes.timestamp) {
                        return { 'data-timestamp': attributes.timestamp };
                    }
                    return {};
                }
            },
            profileImageSrc: {
                default: "",
                parseHTML: element => {
                    return element.getAttribute('data-profile-image-src') ||
                        element.querySelector('.ig-profile-img')?.getAttribute('src') ||
                        "";
                },
                renderHTML: attributes => {
                    if (attributes.profileImageSrc) {
                        return { 'data-profile-image-src': attributes.profileImageSrc };
                    }
                    return {};
                }
            },
            location: {
                default: "",
                parseHTML: element => {
                    return element.getAttribute('data-location') ||
                        element.querySelector('.ig-location')?.textContent ||
                        "";
                },
                renderHTML: attributes => {
                    if (attributes.location) {
                        return { 'data-location': attributes.location };
                    }
                    return {};
                }
            },
            liked: {
                default: false,
                parseHTML: element => {
                    const dataLiked = element.getAttribute('data-liked');
                    if (dataLiked) {
                        return dataLiked === "true";
                    }
                    // Check if the heart icon suggests it's liked
                    const heartIcon = element.querySelector('.ig-icon[alt="Like"]');
                    if (heartIcon) {
                        return heartIcon.src.includes('heart-filled');
                    }
                    return false;
                },
                renderHTML: attributes => {
                    return { 'data-liked': attributes.liked ? "true" : "false" };
                }
            },
            overlayText: {
                default: "",
                parseHTML: element => {
                    return element.getAttribute('data-overlay-text') ||
                        element.querySelector('.ig-overlay-text')?.textContent ||
                        "";
                },
                renderHTML: attributes => {
                    if (attributes.overlayText) {
                        return { 'data-overlay-text': attributes.overlayText };
                    }
                    return {};
                }
            },
            comments: {
                default: [
                    { username: "friend1", text: "Amazing shot!" },
                    { username: "friend2", text: "Love this! 😍" }
                ],
                parseHTML: (element) => {
                    const commentsAttr = element.getAttribute('data-comments');
                    if (commentsAttr) {
                        try {
                            const parsed = JSON.parse(commentsAttr);
                            if (Array.isArray(parsed)) {
                                return parsed.map(comment => ({
                                    username: comment?.username || "",
                                    text: comment?.text || ""
                                }));
                            }
                        } catch (e) {
                            console.warn('Failed to parse comments from data attribute:', e);
                        }
                    }

                    // Fallback: try to parse from HTML structure
                    const commentElements = element.querySelectorAll('.ig-comment');
                    if (commentElements.length > 0) {
                        return Array.from(commentElements).map(commentEl => ({
                            username: commentEl.querySelector('.ig-comment-username')?.textContent || "",
                            text: commentEl.querySelector('.ig-comment-text')?.textContent || ""
                        }));
                    }

                    // Final fallback
                    return [
                        { username: "friend1", text: "Amazing shot!" },
                        { username: "friend2", text: "Love this! 😍" }
                    ];
                },
                renderHTML: (attributes) => {
                    const safeComments = Array.isArray(attributes.comments) ? attributes.comments : [];
                    return { 'data-comments': JSON.stringify(safeComments) };
                }
            },
        };
    },

    parseHTML() {
        return [{ tag: "div.instagram-post-wrapper" }];
    },

    renderHTML({ HTMLAttributes, node }) {
        const {
            username = "johndoe",
            caption = "Beautiful sunset today! 🌅",
            imageUrl = "",
            likes = "42",
            timestamp = "2 hours ago",
            profileImageSrc = "",
            location = "",
            comments = [],
            liked = false,
            overlayText = "",
        } = node.attrs;

        const defaultProfileImage = "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png";
        const profileImage = profileImageSrc || defaultProfileImage;

        // Ensure comments is a valid array
        const safeComments = Array.isArray(comments) ? comments : [
            { username: "friend1", text: "Amazing shot!" },
            { username: "friend2", text: "Love this! 😍" }
        ];

        // Header
        const header = [
            "div",
            { class: "ig-header" },
            [
                "img",
                {
                    class: "ig-profile-img",
                    src: profileImage,
                    alt: "Profile picture",
                },
            ],
            [
                "div",
                { class: "ig-user-info" },
                ["div", { class: "ig-username" }, username],
                ...(location ? [["div", { class: "ig-location" }, location]] : []),
            ],
            [
                "div",
                { class: "ig-menu" },
                ["span", {}, "⋯"],
            ],
        ];

        // Image container
        const imageContainer = [
            "div",
            { class: "ig-image-container" },
            ...(imageUrl
                ? [["img", { class: "ig-post-image", src: imageUrl, alt: "Post" }]]
                : [[
                    "div",
                    { class: "ig-placeholder" },
                    ["div", { class: "ig-placeholder-icon" }, "📷"],
                    ["div", { class: "ig-placeholder-text" }, "No image"],
                ]]),
            // Add overlay text container if present
            ...(overlayText ? [[
                "div",
                { class: "ig-overlay-text" },
                overlayText
            ]] : [])
        ];

        // Actions
        const actions = [
            "div",
            { class: "ig-actions" },
            [
                "div",
                { class: "ig-action-buttons" },
                ["img", {
                    class: "ig-icon",
                    src: liked ? "https://wo3.tbvns.xyz/images/ig-liked.png" : "https://wo3.tbvns.xyz/images/ig-like.png",
                    alt: "Like",
                    width: "24",
                    height: "24"
                }],
                ["img", { class: "ig-icon", src: "https://wo3.tbvns.xyz/images/ig-comments.png", alt: "Comment", width: "24", height: "24" }],
                ["img", { class: "ig-icon", src: "https://wo3.tbvns.xyz/images/ig-share.png", alt: "Share", width: "24", height: "24" }],
            ],
            ["img", { class: "ig-icon", src: "https://wo3.tbvns.xyz/images/ig-bookmark.png", alt: "Save", width: "24", height: "24" }],
        ];

        // Likes
        const likesDiv = [
            "div",
            { class: "ig-likes" },
            ["span", { class: "ig-likes-count" }, likes],
            " likes",
        ];

        // Caption
        const captionDiv = [
            "div",
            { class: "ig-caption" },
            ["span", { class: "ig-caption-username" }, username],
            " ",
            ["span", { class: "ig-caption-text" }, caption],
        ];

        // Comments - Fixed structure with proper validation
        const commentElements = safeComments.map((comment, index) => {
            // Ensure comment is an object with required properties
            const safeComment = comment || {};
            const commentUsername = safeComment.username || `user${index + 1}`;
            const commentText = safeComment.text || "";

            return [
                "div",
                { class: "ig-comment" },
                ["span", { class: "ig-comment-username" }, commentUsername],
                " ",
                ["span", { class: "ig-comment-text" }, commentText],
            ];
        });

        const commentsDiv = [
            "div",
            { class: "ig-comments" },
            ...commentElements
        ];

        // Timestamp
        const timestampDiv = ["div", { class: "ig-timestamp" }, timestamp];

        const componentContent = [
            "div",
            { class: "instagram-post-component" },
            header,
            imageContainer,
            actions,
            likesDiv,
            captionDiv,
            commentsDiv,
            timestampDiv,
        ];

        // Create wrapper attributes - include all node attributes as data attributes
        const wrapperAttributes = {
            class: "instagram-post-wrapper",
            'data-username': username,
            'data-caption': caption,
            'data-image-url': imageUrl,
            'data-likes': likes,
            'data-timestamp': timestamp,
            'data-profile-image-src': profileImageSrc,
            'data-location': location,
            'data-liked': liked ? "true" : "false",
            'data-overlay-text': overlayText,
            'data-comments': JSON.stringify(safeComments)
        };

        return [
            "div",
            mergeAttributes(HTMLAttributes, wrapperAttributes),
            componentContent,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(InstagramPostComponent);
    },
});
