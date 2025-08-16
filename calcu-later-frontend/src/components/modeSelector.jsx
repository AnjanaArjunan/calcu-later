

import React from "react";

export default function ModeSelector({ mode, setMode }) {
  return (
    <div className="mode-selector">
      <label>Choose Your Adventure: </label>
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="fun">Fun Mode - Laugh First, Solve Later</option>
        <option value="challenge">Challenge Mode - Brain teasers await!</option>
      </select>
    </div>
  );
}
