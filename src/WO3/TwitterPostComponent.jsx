import React, { useRef, useEffect, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";

export const TwitterPostComponent = ({ node, updateAttributes }) => {
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

    const usernameRef = useRef(null);
    const handleRef = useRef(null);
    const textRef = useRef(null);
    const timestampRef = useRef(null);
    const likesRef = useRef(null);
    const retweetsRef = useRef(null);
    const repliesRef = useRef(null);

    const [isLiked, setIsLiked] = useState(liked || false);
    const [isRetweeted, setIsRetweeted] = useState(retweeted || false);

    useEffect(() => {
        if (usernameRef.current) usernameRef.current.innerText = username;
        if (handleRef.current) handleRef.current.innerText = handle;
        if (textRef.current) textRef.current.innerText = text;
        if (timestampRef.current) timestampRef.current.innerText = timestamp;
        if (likesRef.current) likesRef.current.innerText = likes;
        if (retweetsRef.current) retweetsRef.current.innerText = retweets;
        if (repliesRef.current) repliesRef.current.innerText = replies;
    }, []);

    const updateAll = () => {
        updateAttributes({
            username: usernameRef.current.innerText,
            handle: handleRef.current.innerText,
            text: textRef.current.innerText,
            timestamp: timestampRef.current.innerText,
            likes: likesRef.current.innerText,
            retweets: retweetsRef.current.innerText,
            replies: repliesRef.current.innerText,
            liked: isLiked,
            retweeted: isRetweeted,
        });
    };

    const handleImageSrcChange = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const src = prompt("Enter profile image URL:", profileImageSrc || "");
        if (src !== null) {
            updateAttributes({ profileImageSrc: src });
        }
    };

    const toggleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked((prev) => !prev);
    };

    const toggleRetweet = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsRetweeted((prev) => !prev);
    };

    return (
        <NodeViewWrapper
            as="div"
            style={{
                border: "1px solid #e1e8ed",
                borderRadius: "16px",
                padding: "12px",
                background: "white",
                maxWidth: "550px",
                fontFamily: "Arial, sans-serif",
                fontSize: "15px",
                lineHeight: "1.4",
                color: "#0f1419",
            }}
            onBlur={updateAll}
        >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                {/* The <a> tag no longer has an onClick handler */}
                <a style={{ display: "inline-block", marginRight: "8px" }}>
                    <img
                        src={
                            profileImageSrc ||
                            "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                        }
                        alt="Profile"
                        // This is now the only click handler and will work consistently
                        onClick={handleImageSrcChange}
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            cursor: "pointer",
                        }}
                    />
                </a>
                <div>
          <span
              ref={usernameRef}
              contentEditable
              suppressContentEditableWarning
              style={{
                  fontWeight: "bold",
                  marginRight: "4px",
                  outline: "none",
              }}
          />
                    <span
                        ref={handleRef}
                        contentEditable
                        suppressContentEditableWarning
                        style={{
                            color: "#536471",
                            outline: "none",
                        }}
                    />
                </div>
            </div>

            {/* Tweet text */}
            <div
                ref={textRef}
                contentEditable
                suppressContentEditableWarning
                style={{
                    marginBottom: "8px",
                    outline: "none",
                }}
            />

            {/* Timestamp */}
            <div
                ref={timestampRef}
                contentEditable
                suppressContentEditableWarning
                style={{
                    color: "#536471",
                    fontSize: "13px",
                    marginBottom: "8px",
                    outline: "none",
                }}
            />

            {/* Stats with correct icons */}
            <div
                style={{
                    display: "flex",
                    gap: "24px",
                    color: "#536471",
                    fontSize: "13px",
                    alignItems: "center",
                }}
            >
                {/* Replies - speech bubble */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                    <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="currentColor"
                    >
                        <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
                    </svg>
                    <span
                        ref={repliesRef}
                        contentEditable
                        suppressContentEditableWarning
                        style={{ outline: "none" }}
                    />
                </div>

                {/* Retweets - repeat arrows */}
                <div
                    onClick={toggleRetweet}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        cursor: "pointer",
                        color: isRetweeted ? "#00ba7c" : "#536471",
                    }}
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="currentColor"
                    >
                        <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>                    </svg>

                    <span
                        ref={retweetsRef}
                        contentEditable
                        suppressContentEditableWarning
                        style={{ outline: "none" }}
                    />
                </div>

                {/* Likes - heart */}
                <div
                    onClick={toggleLike}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        cursor: "pointer",
                        color: isLiked ? "#f91880" : "#536471",
                    }}
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="currentColor"
                    >
                        <path
                            d={
                                isLiked
                                    ? "M12 21.638l-1.45-1.342C5.4 15.364 2 12.272 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.772-3.4 6.864-8.55 11.796L12 21.638z"
                                    : "M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
                            }
                        ></path>
                    </svg>
                    <span
                        ref={likesRef}
                        contentEditable
                        suppressContentEditableWarning
                        style={{ outline: "none" }}
                    />
                </div>
            </div>
        </NodeViewWrapper>
    );
};