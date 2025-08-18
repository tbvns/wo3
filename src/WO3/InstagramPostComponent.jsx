import React, { useRef, useEffect, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";

export const InstagramPostComponent = ({ node, updateAttributes }) => {
    const {
        username = "johndoe",
        caption = "Beautiful sunset today! 🌅",
        imageUrl = "",
        likes = "42",
        timestamp = "2 hours ago",
        profileImageSrc = "",
        location = "",
        liked = false,
        comments = [],
        overlayText = ""
    } = node.attrs || {};

    const usernameRef = useRef(null);
    const captionRef = useRef(null);
    const likesRef = useRef(null);
    const timestampRef = useRef(null);
    const locationRef = useRef(null);
    const overlayTextRef = useRef(null);

    const [isLiked, setIsLiked] = useState(liked || false);
    const [commentsList, setCommentsList] = useState(() => {
        // Ensure we always have a valid array
        if (Array.isArray(comments) && comments.length > 0) {
            return comments;
        }
        return [
            { username: "friend1", text: "Amazing shot!" },
            { username: "friend2", text: "Love this! 😍" }
        ];
    });

    useEffect(() => {
        // Safely update text content with null checks
        if (usernameRef.current && username) usernameRef.current.innerText = username;
        if (captionRef.current && caption) captionRef.current.innerText = caption;
        if (likesRef.current && likes) likesRef.current.innerText = likes;
        if (timestampRef.current && timestamp) timestampRef.current.innerText = timestamp;
        if (locationRef.current && location) locationRef.current.innerText = location;
        if (overlayTextRef.current && overlayText) overlayTextRef.current.innerText = overlayText;
    }, [username, caption, likes, timestamp, location, overlayText]);

    const updateAll = () => {
        if (!updateAttributes) return;

        updateAttributes({
            username: usernameRef.current?.innerText || username,
            caption: captionRef.current?.innerText || caption,
            likes: likesRef.current?.innerText || likes,
            timestamp: timestampRef.current?.innerText || timestamp,
            location: locationRef.current?.innerText || location || "",
            liked: isLiked,
            comments: commentsList,
            overlayText: overlayTextRef.current?.innerText || overlayText || "",
        });
    };

    const handleProfileImageChange = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const src = prompt("Enter profile image URL:", profileImageSrc || "");
        if (src !== null && updateAttributes) {
            updateAttributes({ profileImageSrc: src });
        }
    };

    const handlePostImageChange = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const src = prompt("Enter post image URL:", imageUrl || "");
        if (src !== null && updateAttributes) {
            updateAttributes({ imageUrl: src });
        }
    };

    const toggleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        // Immediately update the attributes when state changes
        updateAttributes({ liked: newLikedState });
    };

    const addComment = () => {
        const newComment = { username: "newuser", text: "Add your comment..." };
        const newComments = [...commentsList, newComment];
        setCommentsList(newComments);
        if (updateAttributes) {
            updateAttributes({ comments: newComments });
        }
    };

    const removeComment = (index) => {
        const newComments = commentsList.filter((_, i) => i !== index);
        setCommentsList(newComments);
        if (updateAttributes) {
            updateAttributes({ comments: newComments });
        }
    };

    const updateComment = (index, field, value) => {
        if (index < 0 || index >= commentsList.length) return;

        const newComments = [...commentsList];
        newComments[index] = { ...newComments[index], [field]: value };
        setCommentsList(newComments);
        if (updateAttributes) {
            updateAttributes({ comments: newComments });
        }
    };

    // Ensure commentsList is always an array for rendering
    const safeCommentsList = Array.isArray(commentsList) ? commentsList : [];

    return (
        <NodeViewWrapper
            as="div"
            style={{
                display: "flex",
                justifyContent: "center",
                margin: "16px 0",
            }}
        >
            <div
                style={{
                    border: "1px solid #dbdbdb",
                    borderRadius: "8px",
                    background: "white",
                    maxWidth: "500px",
                    width: "100%",
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    fontSize: "14px",
                    color: "#262626",
                }}
                onBlur={updateAll}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "14px 16px",
                        borderBottom: "1px solid #efefef",
                    }}
                >
                    <img
                        src={
                            profileImageSrc ||
                            "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                        }
                        alt="Profile"
                        onClick={handleProfileImageChange}
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            cursor: "pointer",
                            marginRight: "12px",
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                            }}
                        >
                            <span
                                ref={usernameRef}
                                contentEditable
                                suppressContentEditableWarning
                                style={{
                                    fontWeight: "600",
                                    outline: "none",
                                }}
                            />
                        </div>
                        {location && (
                            <div
                                ref={locationRef}
                                contentEditable
                                suppressContentEditableWarning
                                style={{
                                    fontSize: "12px",
                                    color: "#8e8e8e",
                                    outline: "none",
                                }}
                            />
                        )}
                    </div>
                    <div
                        style={{
                            cursor: "pointer",
                            padding: "8px",
                            fontSize: "16px",
                        }}
                    >
                        ⋯
                    </div>
                </div>

                {/* Image */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        paddingBottom: "100%", // 1:1 aspect ratio
                        background: "#f5f5f5",
                        cursor: "pointer",
                    }}
                    onClick={handlePostImageChange}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Post"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                color: "#8e8e8e",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: "48px", marginBottom: "8px" }}>📷</div>
                            <div>Click to add image</div>
                        </div>
                    )}

                    {/* Overlay Text */}
                    {/*<div*/}
                    {/*    ref={overlayTextRef}*/}
                    {/*    contentEditable*/}
                    {/*    suppressContentEditableWarning*/}
                    {/*    style={{*/}
                    {/*        position: "absolute",*/}
                    {/*        top: "20px",*/}
                    {/*        left: "20px",*/}
                    {/*        right: "20px",*/}
                    {/*        color: "#fff",*/}
                    {/*        fontSize: "24px",*/}
                    {/*        fontWeight: "bold",*/}
                    {/*        textAlign: "center",*/}
                    {/*        outline: "none",*/}
                    {/*        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",*/}
                    {/*        padding: "8px",*/}
                    {/*        borderRadius: "4px",*/}
                    {/*        background: overlayText ? "rgba(0, 0, 0, 0.3)" : "transparent",*/}
                    {/*        minHeight: overlayText ? "auto" : "32px",*/}
                    {/*        lineHeight: "1.2",*/}
                    {/*        wordWrap: "break-word",*/}
                    {/*        cursor: "text",*/}
                    {/*        zIndex: 10,*/}
                    {/*    }}*/}
                    {/*    onClick={(e) => {*/}
                    {/*        e.stopPropagation();*/}
                    {/*    }}*/}
                    {/*    placeholder="Add text overlay..."*/}
                    {/*    onInput={(e) => {*/}
                    {/*        // Update background opacity based on content*/}
                    {/*        const hasText = e.target.innerText.trim().length > 0;*/}
                    {/*        e.target.style.background = hasText ? "rgba(0, 0, 0, 0.3)" : "transparent";*/}
                    {/*    }}*/}
                    {/*/>*/}
                </div>

                {/* Action buttons */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 16px 8px",
                    }}
                >
                    <div style={{ display: "flex", gap: "16px" }}>
                        <img
                            src={`/images/${isLiked ? 'ig-liked' : 'ig-like'}.png`}
                            alt="Like"
                            onClick={toggleLike}
                            style={{
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                            }}
                        />
                        <img
                            src="/images/ig-comments.png"
                            alt="Comment"
                            style={{
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                            }}
                        />
                        <img
                            src="/images/ig-share.png"
                            alt="Share"
                            style={{
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                            }}
                        />
                    </div>
                    <img
                        src="/images/ig-bookmark.png"
                        alt="Save"
                        style={{
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                        }}
                    />
                </div>

                {/* Likes count */}
                <div style={{ padding: "0 16px 8px" }}>
                    <span
                        ref={likesRef}
                        contentEditable
                        suppressContentEditableWarning
                        style={{
                            fontWeight: "600",
                            outline: "none",
                        }}
                    />
                    <span style={{ fontWeight: "600" }}> likes</span>
                </div>

                {/* Caption */}
                <div style={{ padding: "0 16px 8px" }}>
                    <span
                        style={{
                            fontWeight: "600",
                            marginRight: "6px",
                        }}
                    >
                        {username}
                    </span>
                    <span
                        ref={captionRef}
                        contentEditable
                        suppressContentEditableWarning
                        style={{
                            outline: "none",
                            lineHeight: "1.4",
                        }}
                    />
                </div>

                {/* Comments */}
                <div style={{ padding: "0 16px 8px" }}>
                    {safeCommentsList.map((comment, index) => {
                        // Ensure comment is an object with the expected properties
                        const safeComment = comment || {};
                        const commentUsername = safeComment.username || "";
                        const commentText = safeComment.text || "";

                        return (
                            <div
                                key={`${index}-${commentUsername}-${commentText}`}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    marginBottom: "4px",
                                    gap: "8px",
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning
                                        style={{
                                            fontWeight: "600",
                                            marginRight: "6px",
                                            outline: "none",
                                        }}
                                        onBlur={(e) => updateComment(index, 'username', e.target.innerText)}
                                    >
                                        {commentUsername}
                                    </span>
                                    <span
                                        contentEditable
                                        suppressContentEditableWarning
                                        style={{
                                            outline: "none",
                                            lineHeight: "1.4",
                                        }}
                                        onBlur={(e) => updateComment(index, 'text', e.target.innerText)}
                                    >
                                        {commentText}
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeComment(index)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#8e8e8e",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        padding: "2px 4px",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })}
                    <button
                        onClick={addComment}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#0095f6",
                            cursor: "pointer",
                            fontSize: "12px",
                            padding: "4px 0",
                            fontWeight: "600",
                        }}
                    >
                        + Add comment
                    </button>
                </div>

                {/* Timestamp */}
                <div style={{ padding: "0 16px 16px" }}>
                    <span
                        ref={timestampRef}
                        contentEditable
                        suppressContentEditableWarning
                        style={{
                            fontSize: "10px",
                            color: "#8e8e8e",
                            textTransform: "uppercase",
                            letterSpacing: "0.2px",
                            outline: "none",
                        }}
                    />
                </div>
            </div>
        </NodeViewWrapper>
    );
};
