import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./ComponentDisplay.css";

export default function ComponentDisplay({ preview, name, onClick }) {
    const iframeRef = useRef(null);
    const [mountNode, setMountNode] = useState(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const handleLoad = () => {
            const iframeDocument = iframe.contentDocument;
            if (!iframeDocument) return;

            const mountPoint = iframeDocument.createElement("div");
            iframeDocument.body.appendChild(mountPoint);

            iframeDocument.body.style.margin = "0";
            iframeDocument.body.style.height = "100%";
            iframeDocument.body.style.display = "flex";
            iframeDocument.body.style.alignItems = "center";
            iframeDocument.body.style.justifyContent = "center";
            iframeDocument.body.style.background = "white";
            iframeDocument.body.style.overflow = "hidden";

            setTimeout(() => {
                setMountNode(mountPoint);
            }, 0);
        };

        iframe.addEventListener("load", handleLoad);
        iframe.src = "about:blank";

        // Cleanup function to prevent memory leaks
        return () => {
            iframe.removeEventListener("load", handleLoad);
        };
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className="componentDisplay" onClick={onClick}>
            <div className="preview">
                <iframe
                    ref={iframeRef}
                    title={name}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        background: "white", // Show white while loading
                        overflow: "hidden",
                    }}
                />
                {/* Portal the preview content into our stable mount node */}
                {mountNode && ReactDOM.createPortal(preview, mountNode)}
            </div>
            <div className="name">{name}</div>
        </div>
    );
}
