
import React from "react";
import Calculator from "./components/calculator";
import "./styles/calculator.css";
import "./App.css"

export default function App() {
  return (
    <div className="App">
      <h1>🧮 Calcu-Later</h1>
      <p className="funny-subtitle">Who Said Math Has to Be Serious? Results with a Twist!</p>
      <Calculator />
    </div>
  );
}
