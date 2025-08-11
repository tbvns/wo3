// WorkManager.jsx
import React, { useState, useEffect, useRef } from "react";

const WorkManager = ({ onSelectWork, onClose, currentWorkId }) => {
    const [works, setWorks] = useState([]);
    const [newWorkName, setNewWorkName] = useState("");
    const [showNewWork, setShowNewWork] = useState(false);
    const backupInputRef = useRef(null);
    const workInputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadWorks();
    }, []);

    const loadWorks = () => {
        const savedWorks = JSON.parse(localStorage.getItem("tiptap-works") || "[]");
        savedWorks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setWorks(savedWorks);
    };

    const filteredWorks = works.filter((work) =>
        work.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const recentWorks = works.slice(0, 5); // Top 5 recent

    const createNewWork = () => {
        if (!newWorkName.trim()) return;

        const newWork = {
            id: Date.now().toString(),
            name: newWorkName.trim(),
            content: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const savedWorks = JSON.parse(localStorage.getItem("tiptap-works") || "[]");
        savedWorks.push(newWork);
        localStorage.setItem("tiptap-works", JSON.stringify(savedWorks));
        localStorage.setItem(`tiptap-work-${newWork.id}`, JSON.stringify(newWork));

        onSelectWork(newWork.id, newWork.name);
        onClose();
    };

    const deleteWork = (workId) => {
        if (window.confirm("Are you sure you want to delete this work?")) {
            const savedWorks = JSON.parse(localStorage.getItem("tiptap-works") || "[]");
            const filtered = savedWorks.filter((w) => w.id !== workId);
            localStorage.setItem("tiptap-works", JSON.stringify(filtered));
            localStorage.removeItem(`tiptap-work-${workId}`);
            loadWorks();
        }
    };

    const saveBackup = () => {
        const savedWorks = JSON.parse(localStorage.getItem("tiptap-works") || "[]");
        const backup = {
            works: savedWorks,
            workContents: {},
            createdAt: new Date().toISOString(),
            version: "1.0",
        };

        savedWorks.forEach((work) => {
            const workData = JSON.parse(
                localStorage.getItem(`tiptap-work-${work.id}`) || "{}"
            );
            backup.workContents[work.id] = workData;
        });

        const blob = new Blob([JSON.stringify(backup, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "backup.wo3b";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const loadBackup = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!file.name.endsWith(".wo3b")) {
            alert("Please select a valid backup file (.wo3b)");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backup = JSON.parse(e.target.result);
                if (!backup.works || !backup.workContents) {
                    alert("Invalid backup file format");
                    return;
                }
                if (
                    window.confirm(
                        "Loading this backup will replace all current works. Are you sure?"
                    )
                ) {
                    const existingWorks = JSON.parse(
                        localStorage.getItem("tiptap-works") || "[]"
                    );
                    existingWorks.forEach((work) => {
                        localStorage.removeItem(`tiptap-work-${work.id}`);
                    });

                    localStorage.setItem("tiptap-works", JSON.stringify(backup.works));
                    Object.entries(backup.workContents).forEach(([id, data]) => {
                        localStorage.setItem(`tiptap-work-${id}`, JSON.stringify(data));
                    });

                    loadWorks();
                    alert("Backup loaded successfully!");
                }
            } catch (error) {
                alert("Error loading backup file: " + error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = "";
    };

    const loadWork = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!file.name.endsWith(".wo3")) {
            alert("Please select a valid work file (.wo3)");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workData = JSON.parse(e.target.result);
                if (!workData.name || workData.content === undefined) {
                    alert("Invalid work file format");
                    return;
                }

                const newWork = {
                    id: Date.now().toString(),
                    name: workData.name,
                    content: workData.content,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                const savedWorks = JSON.parse(localStorage.getItem("tiptap-works") || "[]");
                savedWorks.push(newWork);
                localStorage.setItem("tiptap-works", JSON.stringify(savedWorks));
                localStorage.setItem(`tiptap-work-${newWork.id}`, JSON.stringify(newWork));

                onSelectWork(newWork.id, newWork.name);
                onClose();
                alert("Work loaded successfully!");
            } catch (error) {
                alert("Error loading work file: " + error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = "";
    };

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <div
            className="work-manager-overlay"
            onClick={(e) => {
                if (e.target.classList.contains("work-manager-overlay")) {
                    onClose();
                }
            }}
        >
            <div className="work-manager-modal two-column">
                {/* LEFT COLUMN */}
                <div className="left-column">
                    <div className="backup-buttons">
                        <button onClick={saveBackup} className="backup-btn save-backup">
                            💾 Save Backup
                        </button>
                        <button
                            onClick={() => backupInputRef.current?.click()}
                            className="backup-btn load-backup"
                        >
                            📁 Load Backup
                        </button>
                        <button
                            onClick={() => workInputRef.current?.click()}
                            className="backup-btn load-work"
                        >
                            📄 Load Work
                        </button>
                    </div>

                    <input
                        ref={backupInputRef}
                        type="file"
                        accept=".wo3b"
                        onChange={loadBackup}
                        style={{ display: "none" }}
                    />
                    <input
                        ref={workInputRef}
                        type="file"
                        accept=".wo3"
                        onChange={loadWork}
                        style={{ display: "none" }}
                    />

                    <div className="new-work-section">
                        {!showNewWork ? (
                            <button
                                onClick={() => setShowNewWork(true)}
                                className="new-work-btn"
                            >
                                + Create New Work
                            </button>
                        ) : (
                            <div className="new-work-form">
                                <input
                                    type="text"
                                    placeholder="Enter work name..."
                                    value={newWorkName}
                                    onChange={(e) => setNewWorkName(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && createNewWork()}
                                    autoFocus
                                />
                                <div className="new-work-actions">
                                    <button onClick={createNewWork} className="create-btn">
                                        Create
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowNewWork(false);
                                            setNewWorkName("");
                                        }}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="recent-works">
                        <h3>🕒 Recently Edited</h3>
                        {recentWorks.length === 0 ? (
                            <div className="no-works">
                                <p>No recent works.</p>
                            </div>
                        ) : (
                            recentWorks.map((work) => (
                                <div
                                    key={work.id}
                                    className={`work-item ${work.id === currentWorkId ? "current" : ""}`}
                                >
                                    <div className="work-info">
                                        <h3>{work.name}</h3>
                                        <p className="work-dates">{formatDate(work.updatedAt)}</p>
                                    </div>
                                    <div className="work-actions">
                                        <button
                                            onClick={() => {
                                                onSelectWork(work.id, work.name);
                                                onClose();
                                            }}
                                            className="load-btn"
                                            disabled={work.id === currentWorkId}
                                        >
                                            {work.id === currentWorkId ? "Current" : "Load"}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="right-column">
                    <input
                        type="text"
                        placeholder="Search works..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    <h3>📚 All Works</h3>
                    {filteredWorks.length === 0 ? (
                        <div className="no-works">
                            <p>No saved works found.</p>
                        </div>
                    ) : (
                        filteredWorks.map((work) => (
                            <div
                                key={work.id}
                                className={`work-item ${work.id === currentWorkId ? "current" : ""}`}
                            >
                                <div className="work-info">
                                    <h3>{work.name}</h3>
                                    <p className="work-dates">{formatDate(work.updatedAt)}</p>
                                </div>
                                <div className="work-actions">
                                    <button
                                        onClick={() => {
                                            onSelectWork(work.id, work.name);
                                            onClose();
                                        }}
                                        className="load-btn"
                                        disabled={work.id === currentWorkId}
                                    >
                                        {work.id === currentWorkId ? "Current" : "Load"}
                                    </button>
                                    <button
                                        onClick={() => deleteWork(work.id)}
                                        className="delete-btn"
                                        disabled={work.id === currentWorkId}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkManager;
