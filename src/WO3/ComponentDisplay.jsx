import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom"; // Import ReactDOM for portals
import "./ComponentDisplay.css";

export default function ComponentDisplay({ preview, name, onClick }) {
    const iframeRef = useRef(null);
    const [iframeBody, setIframeBody] = useState(null);

    useEffect(() => {
        const handleIframeLoad = () => {
            const iframeDocument = iframeRef.current.contentDocument;
            const iframeBody = iframeDocument.body;

            // Apply basic styles to the iframe body
            iframeBody.style.margin = "0";
            iframeBody.style.padding = "0";
            iframeBody.style.display = "flex";
            iframeBody.style.alignItems = "center";
            iframeBody.style.justifyContent = "center";
            iframeBody.style.color = "white";

            setIframeBody(iframeBody); // Save iframe body for portal rendering
        };

        if (iframeRef.current) {
            iframeRef.current.onload = handleIframeLoad;
        }
    }, []);

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
                    }}
                />
                {iframeBody &&
                    ReactDOM.createPortal(preview, iframeBody)} {/* Render preview inside iframe */}
            </div>
            <div className="name">{name}</div>
        </div>
    );
}