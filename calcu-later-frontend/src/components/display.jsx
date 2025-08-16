
import React from "react";

export default function Display({ value, response, result }) {
  return (
    <div className="display">
      <div className="calculation">{value}</div>
      {response && <div className="response">{response}</div>}
      {result && <div className="result">{result}</div>}
    </div>
  );
}
