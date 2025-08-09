import React from "react";
import ComponentDisplay from "./ComponentDisplay";

export default function ComponentInsertModal({ onInsert, onClose }) {
    const components = [
        {
            id: "button1",
            name: "Button 1",
            preview: <button>Button 1</button>
        },
        {
            id: "button2",
            name: "Button 2",
            preview: <button>Button 2</button>
        },
        {
            id: "button3",
            name: "Button 3",
            preview: <button>Button 3</button>
        },
    ];

    return (
        <div style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "300px",
            height: "100vh",
            background: "#222",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "1rem",
            boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            overflowX: "hidden",
            boxSizing: "border-box"
        }}>
            <h2 style={{ margin: "0 0 1rem 0", textAlign: "center" }}>
                Select a Component
            </h2>

            <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                width: "100%"
            }}>
                {components.map((component) => (
                    <li key={component.id} style={{ marginBottom: "1rem", width: "100%" }}>
                        <ComponentDisplay
                            preview={component.preview}
                            name={component.name}
                            onClick={() => onInsert(component.id)}
                        />
                    </li>
                ))}
            </ul>

            <button
                onClick={onClose}
                style={{
                    marginTop: "auto",
                    background: "red",
                    width: "100%",
                    height: "2.5rem",
                    border: "none",
                    borderRadius: "5px",
                    color: "white",
                    cursor: "pointer",
                    transition: "background 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.background = "#ff4444"}
                onMouseLeave={(e) => e.target.style.background = "red"}
            >
                Close
            </button>
        </div>
    );
}