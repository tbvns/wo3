import React from "react";
import "./addForm.css";
import ComponentDisplay from "./ComponentDisplay";
import TiptapEditor from "./TiptapEditor";

export default function AddForm({ add, close }) {

    const premadeComponents = [
        { name: "Button 1", component: <button>Button 1</button> },
        { name: "Button 2", component: <button>Button 2</button> },
        { name: "Button 3", component: <button>Button 3</button> },
        { name: "Rich Text Editor", component: <TiptapEditor /> },
    ];

    const handleAdd = (component) => {
        add(component);
    };

    return (
        <div className="addForm">
            <h2>Select a Component</h2>
            <ul>
                {premadeComponents.map((item, index) => (
                    <li key={index}>
                        <ComponentDisplay
                            preview={item.component}
                            name={item.name}
                            onClick={() => handleAdd(item.component)}
                        />
                    </li>
                ))}
            </ul>
            <button className="closeButton" onClick={close}>
                Close
            </button>
        </div>
    );
}