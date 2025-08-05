import "./Main.css";
import { useState } from "react";
import AddForm from "./addForm.jsx";

export default function Main() {
    const [componentsList, setComponentsList] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    const addElement = (component) => {
        setComponentsList((prevList) => [...prevList, component]);
        setShowAddForm(false);
    };

    return (
        <div className="root">
            <div className="Main">
                <div className="content">
                    {componentsList.map((component, index) => (
                        <div key={index}>{component}</div>
                    ))}
                </div>
                <button onClick={() => setShowAddForm(true)}>Add an element</button>
            </div>
            {showAddForm && (
                <AddForm add={addElement} close={() => setShowAddForm(false)} />
            )}
        </div>
    );
}