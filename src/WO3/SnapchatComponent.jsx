import React, { useRef, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";

const BubbleTail = ({ side, color }) => {
    const tailStyle = {
        position: "absolute",
        bottom: 0,
        width: "15px",
        height: "15px",
        ...(side === "left"
            ? { left: "-2px", transform: "scaleX(-1)" }
            : { right: "-2px" }),
    };

    return (
        <div style={tailStyle}>
            <svg
                viewBox="0 0 15 15"
                style={{ width: "100%", height: "100%", display: "block" }}
            >
                <path d="M0 15 L0 0 Q10 10, 15 15 Z" fill={color} />
            </svg>
        </div>
    );
};

export const SnapchatComponent = ({ node, updateAttributes }) => {
    const { groupName, groupIcon, people, messages } = node.attrs; // ORIGINAL - No defaults!

    const groupNameRef = useRef(null);
    const messageRefs = useRef([]);
    const peopleNameRefs = useRef([]);

    useEffect(() => {
        if (groupNameRef.current) groupNameRef.current.innerText = groupName;

        people.forEach((person, i) => {
            if (
                peopleNameRefs.current[i] &&
                peopleNameRefs.current[i].innerText !== person.name
            ) {
                peopleNameRefs.current[i].innerText = person.name;
            }
        });

        messages.forEach((msg, i) => {
            if (
                messageRefs.current[i] &&
                messageRefs.current[i].innerText !== msg.text
            ) {
                messageRefs.current[i].innerText = msg.text;
            }
        });
    }, []);

    const handleGroupNameBlur = () => {
        updateAttributes({ groupName: groupNameRef.current.innerText });
    };

    const handleGroupIconChange = () => {
        const src = prompt("Enter group icon URL:", groupIcon || "");
        if (src !== null) updateAttributes({ groupIcon: src });
    };

    const handlePersonNameBlur = (index) => {
        const updated = [...people];
        updated[index] = {
            ...updated[index],
            name: peopleNameRefs.current[index].innerText,
        };
        updateAttributes({ people: updated });
    };

    const handleMessageBlur = (index) => {
        const updated = [...messages];
        updated[index] = {
            ...updated[index],
            text: messageRefs.current[index].innerText,
        };
        updateAttributes({ messages: updated });
    };

    const handlePersonColorChange = (index, value) => {
        const updated = [...people];
        updated[index] = { ...updated[index], color: value };
        updateAttributes({ people: updated });
    };

    const changePersonImage = (index) => {
        const src = prompt(
            "Enter profile image URL:",
            people[index].profileImageSrc || ""
        );
        if (src !== null) {
            const updated = [...people];
            updated[index] = { ...updated[index], profileImageSrc: src };
            updateAttributes({ people: updated });
        }
    };

    const addPerson = () => {
        const newId = Date.now().toString();
        updateAttributes({
            people: [
                ...people,
                {
                    id: newId,
                    name: "New Person",
                    color: "#FF6B6B",
                    profileImageSrc: "",
                },
            ],
        });
    };

    const removePerson = (personId) => {
        updateAttributes({
            people: people.filter((p) => p.id !== personId),
            messages: messages.filter((m) => m.personId !== personId),
        });
    };

    const addMessage = (personId) => {
        updateAttributes({
            messages: [...messages, { personId, text: "New message..." }],
        });
    };

    const removeMessage = (index) => {
        const updatedMessages = messages.filter((_, i) => i !== index);
        updateAttributes({ messages: updatedMessages });
        messageRefs.current.splice(index, 1);
    };

    const getPerson = (personId) => people.find((p) => p.id === personId);

    return (
        <NodeViewWrapper
            as="div"
            style={{
                display: "flex",
                justifyContent: "center",
                margin: "16px 0",
            }}
        >
            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "16px",
                    background: "white",
                    maxWidth: "600px",
                    width: "100%",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                {/* Group Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "16px",
                        paddingBottom: "12px",
                        borderBottom: "1px solid #eee",
                    }}
                >
                    <img
                        src={
                            groupIcon ||
                            "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                        }
                        alt="Group"
                        onClick={handleGroupIconChange}
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            cursor: "pointer",
                            marginRight: "12px",
                        }}
                    />
                    <div
                        ref={groupNameRef}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleGroupNameBlur}
                        style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            outline: "none",
                            flex: 1,
                        }}
                    />
                    <div style={{ fontSize: "12px", color: "#666" }}>
                        {people.length} member{people.length !== 1 ? "s" : ""}
                    </div>
                </div>

                {/* People Management */}
                <div
                    style={{
                        marginBottom: "16px",
                        padding: "12px",
                        background: "#f8f9fa",
                        borderRadius: "8px",
                        border: "1px solid #e9ecef",
                    }}
                >
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            marginBottom: "8px",
                        }}
                    >
                        Manage People:
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginBottom: "12px",
                        }}
                    >
                        {people.map((person, i) => {
                            if (!peopleNameRefs.current[i]) peopleNameRefs.current[i] = {};
                            return (
                                <div
                                    key={person.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        background: "white",
                                        border: "1px solid #ddd",
                                        borderRadius: "20px",
                                        padding: "6px 12px",
                                        fontSize: "12px",
                                        gap: "8px",
                                    }}
                                >
                                    <img
                                        src={
                                            person.profileImageSrc ||
                                            "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                                        }
                                        alt="Profile"
                                        onClick={() => changePersonImage(i)}
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            cursor: "pointer",
                                        }}
                                    />

                                    <div
                                        ref={(el) => (peopleNameRefs.current[i] = el)}
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={() => handlePersonNameBlur(i)}
                                        style={{ outline: "none", minWidth: "40px" }}
                                    />

                                    {/* Color picker swatch */}
                                    <div style={{ position: "relative", width: 16, height: 16 }}>
                                        <div
                                            title="Change color"
                                            style={{
                                                width: 14,
                                                height: 14,
                                                borderRadius: "50%",
                                                background: person.color,
                                                border: "1px solid #ccc",
                                                pointerEvents: "none",
                                            }}
                                        />
                                        <input
                                            type="color"
                                            value={person.color}
                                            onChange={(e) =>
                                                handlePersonColorChange(i, e.target.value)
                                            }
                                            style={{
                                                position: "absolute",
                                                top: -2,
                                                left: -2,
                                                width: 20,
                                                height: 20,
                                                opacity: 0,
                                                cursor: "pointer",
                                            }}
                                            aria-label={`Pick color for ${person.name}`}
                                        />
                                    </div>

                                    <button
                                        onClick={() => removePerson(person.id)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#666",
                                            cursor: "pointer",
                                            fontSize: "12px",
                                            padding: 0,
                                            width: 16,
                                            height: 16,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        title="Remove person"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}

                        <button
                            onClick={addPerson}
                            style={{
                                background: "#007bff",
                                border: "none",
                                borderRadius: "20px",
                                padding: "6px 12px",
                                color: "#fff",
                                cursor: "pointer",
                                fontSize: "12px",
                            }}
                        >
                            + Add Person
                        </button>
                    </div>

                    {people.length > 0 && (
                        <div>
                            <div
                                style={{
                                    fontSize: "12px",
                                    marginBottom: "6px",
                                    color: "#666",
                                }}
                            >
                                Add message from:
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                {people.map((person) => (
                                    <button
                                        key={person.id}
                                        onClick={() => addMessage(person.id)}
                                        style={{
                                            background: person.color,
                                            border: "none",
                                            borderRadius: "12px",
                                            padding: "4px 8px",
                                            cursor: "pointer",
                                            fontSize: "10px",
                                            color: "#000",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        + {person.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Messages */}
                <div>
                    {messages.map((msg, i) => {
                        const person = getPerson(msg.personId);
                        if (!person) return null;

                        return (
                            <div
                                key={i}
                                style={{ marginBottom: "16px", position: "relative" }}
                                onMouseEnter={(e) => {
                                    const deleteBtn = e.currentTarget.querySelector(".delete-btn");
                                    if (deleteBtn) deleteBtn.style.opacity = "1";
                                }}
                                onMouseLeave={(e) => {
                                    const deleteBtn = e.currentTarget.querySelector(".delete-btn");
                                    if (deleteBtn) deleteBtn.style.opacity = "0";
                                }}
                            >
                                <button
                                    className="delete-btn"
                                    onClick={() => removeMessage(i)}
                                    style={{
                                        position: "absolute",
                                        top: "20px",
                                        right: "8px",
                                        background: "#ff4444",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "18px",
                                        height: "18px",
                                        minWidth: "18px",
                                        minHeight: "18px",
                                        cursor: "pointer",
                                        fontSize: "10px",
                                        opacity: "0",
                                        transition: "opacity 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        zIndex: 1,
                                        lineHeight: "1",
                                        padding: "0",
                                    }}
                                    title="Delete message"
                                >
                                    ×
                                </button>

                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#666",
                                        fontWeight: 500,
                                        marginBottom: "4px",
                                        marginLeft: "40px",
                                    }}
                                >
                                    {person.name}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        gap: "8px",
                                    }}
                                >
                                    <img
                                        src={
                                            person.profileImageSrc ||
                                            "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                                        }
                                        alt={person.name}
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            flexShrink: 0,
                                        }}
                                    />
                                    <div style={{ position: "relative", maxWidth: "70%" }}>
                                        <div
                                            ref={(el) => (messageRefs.current[i] = el)}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={() => handleMessageBlur(i)}
                                            style={{
                                                background: person.color,
                                                color: "#000",
                                                padding: "8px 12px",
                                                borderRadius: "18px 18px 18px 5px",
                                                outline: "none",
                                                wordWrap: "break-word",
                                            }}
                                        />
                                        <BubbleTail side="left" color={person.color} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </NodeViewWrapper>
    );
};
