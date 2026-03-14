"use client";

import { useState } from "react";

interface Props {
  defaultName: string;
  onConfirm: (name: string) => void;
}

export default function NicknameModal({ defaultName, onConfirm }: Props) {
  const [name, setName] = useState(defaultName);
  const [editing, setEditing] = useState(false);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length > 0) {
      onConfirm(trimmed);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal nickname-modal">
        <h2>Nice game!</h2>
        <p>Choose a name for the leaderboard:</p>

        <div className="nickname-display">
          {editing ? (
            <input
              className="nickname-input"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 30))}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
              maxLength={30}
            />
          ) : (
            <div className="nickname-preview" onClick={() => setEditing(true)}>
              {name}
            </div>
          )}
        </div>

        {!editing && (
          <button
            className="nickname-edit-btn"
            onClick={() => setEditing(true)}
          >
            Change name
          </button>
        )}

        <button className="next-btn" onClick={handleSubmit} style={{ marginTop: 16 }}>
          Submit as {name.trim() || defaultName}
        </button>
      </div>
    </div>
  );
}
