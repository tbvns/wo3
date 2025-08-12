import React, { useState } from "react";
import "./Main.css";
import TiptapEditor from "./TiptapEditor.jsx";
import LandingPage from "./LandingPage.jsx";

export default function Main() {
    const [showEditor, setShowEditor] = useState(false);

    return (
        <div className="root">
            {showEditor ? (
                <TiptapEditor />
            ) : (
                <LandingPage onGetStarted={() => setShowEditor(true)} />
            )}
        </div>
    );
}
