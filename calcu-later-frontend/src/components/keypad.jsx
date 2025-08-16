
import React from "react";

export default function Keypad({ onButtonClick, showGiveUp, showEnter }) {
  const buttons = [
    "7","8","9","/","sin","cos","tan",
    "4","5","6","*","π","√","^",
    "1","2","3","-","log","median","(",
    "0",".","=","+","C",")","AC"
  ];

  return (
    <div className="keypad">
      {buttons.map((btn) => (
        <button key={btn} onClick={() => onButtonClick(btn)}>
          {btn}
        </button>
      ))}
      {showEnter && !showGiveUp && (
        <button 
          className="enter-btn" 
          onClick={() => onButtonClick("ENTER")}
          style={{
            gridColumn: "span 7",
            marginTop: "8px",
            background: "rgba(34, 197, 94, 0.8)",
            borderColor: "rgba(34, 197, 94, 0.9)",
            fontWeight: "bold",
            color: "white"
          }}
        >
          ✅ ENTER
        </button>
      )}
      {showEnter && showGiveUp && (
        <div style={{ 
          gridColumn: "span 7", 
          marginTop: "8px", 
          display: "flex", 
          gap: "8px" 
        }}>
          <button 
            className="enter-btn" 
            onClick={() => onButtonClick("ENTER")}
            style={{
              flex: 1,
              background: "rgba(34, 197, 94, 0.8)",
              borderColor: "rgba(34, 197, 94, 0.9)",
              fontWeight: "bold",
              color: "white",
              padding: "12px"
            }}
          >
            ✅ ENTER
          </button>
          <button 
            className="give-up-btn" 
            onClick={() => onButtonClick("GIVE UP")}
            style={{
              flex: 1,
              background: "rgba(239, 68, 68, 0.8)",
              borderColor: "rgba(239, 68, 68, 0.9)",
              fontWeight: "bold",
              color: "white",
              padding: "12px"
            }}
          >
            😅 GIVE UP
          </button>
        </div>
      )}
      {showGiveUp && !showEnter && (
        <button 
          className="give-up-btn" 
          onClick={() => onButtonClick("GIVE UP")}
          style={{
            gridColumn: "span 7",
            marginTop: "8px",
            background: "rgba(239, 68, 68, 0.8)",
            borderColor: "rgba(239, 68, 68, 0.9)",
            fontWeight: "bold"
          }}
        >
          😅 GIVE UP
        </button>
      )}
    </div>
  );
}
