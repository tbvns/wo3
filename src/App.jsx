import './App.css';
import { useState } from 'react';
import Main from "./WO3/Main.jsx";

function App() {
    const [isOpened, setIsOpened] = useState(false);

    if (!isOpened) {
        return (
            <div className="startScreen">
                <h1>Writer of our own</h1>
                <button onClick={() => setIsOpened(true)}>Start the app</button>
            </div>
        );
    }

    return <Main/>;
}

export default App;