import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import TiptapEditor from './WO3/TiptapEditor.jsx';
import LandingPage from './WO3/LandingPage.jsx';

function App() {
    return (
        <Router className="root">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/write" element={<TiptapEditor />} />
            </Routes>
        </Router>
    );
}

export default App;
