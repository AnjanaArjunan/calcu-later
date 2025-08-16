
import React, { useState, useEffect } from "react";
import Display from "./display";
import Keypad from "./keypad";
import ModeSelector from "./modeSelector";
import funnyResponses from "../Data/funnyResponses";
import { evaluate, pi, sqrt, log } from "mathjs";

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [response, setResponse] = useState("");
  const [mode, setMode] = useState("fun");
  const [challengeQuestion, setChallengeQuestion] = useState(null);
  const [challengeAttempts, setChallengeAttempts] = useState(0);
  const [showGiveUp, setShowGiveUp] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [calculatedResult, setCalculatedResult] = useState("");
  const [originalCalculation, setOriginalCalculation] = useState("");
  const [originalExpression, setOriginalExpression] = useState("");
  
  // Rotation tracking for responses
  const [responseIndices, setResponseIndices] = useState({
    trivial: 0,
    median: 0,
    difficult: 0
  });

  const getDifficulty = (expr) => {
    // Remove spaces and convert to lowercase for analysis
    const cleanExpr = expr.replace(/\s/g, '').toLowerCase();
    
    // Check for scientific functions (difficult)
    if (/[sin|cos|tan|log|sqrt|π|^]/.test(cleanExpr)) {
      return "difficult";
    }
    
    // Check for complex operations with brackets (median)
    if (/[()]/.test(cleanExpr) || 
        /\d{3,}/.test(cleanExpr) || // 3+ digit numbers
        /[\+\-\*\/].*[\+\-\*\/]/.test(cleanExpr)) { // Multiple operations
      return "median";
    }
    
    // Simple operations (trivial)
    if (/[\+\-\*\/]/.test(cleanExpr)) {
      return "trivial";
    }
    
    return "trivial";
  };

  const getRandomQuestion = () => {
    const questions = funnyResponses.questions;
    return questions[Math.floor(Math.random() * questions.length)];
  };

  const checkAnswer = (userAnswer, correctAnswer) => {
    return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  };

  // Get next response with rotation
  const getNextResponse = (difficulty) => {
    const responses = funnyResponses[difficulty];
    const currentIndex = responseIndices[difficulty];
    const response = responses[currentIndex];
    
    // Update index for next time (rotate back to 0 when reaching end)
    setResponseIndices(prev => ({
      ...prev,
      [difficulty]: (currentIndex + 1) % responses.length
    }));
    
    return response;
  };

  // Effect to show result after delay
  useEffect(() => {
    if (calculatedResult && !showResult) {
      const timer = setTimeout(() => {
        setShowResult(true);
      }, 1500); // 1.5 second delay

      return () => clearTimeout(timer);
    }
  }, [calculatedResult, showResult]);

  const handleButtonClick = (btn) => {
    if (btn === "ENTER" && mode === "challenge" && challengeQuestion) {
      // User is submitting answer to challenge question
      if (checkAnswer(expression, challengeQuestion.a)) {
        setResponse(`🎉 Correct! The answer is: "${challengeQuestion.a}"`);
        setChallengeQuestion(null);
        setChallengeAttempts(0);
        setShowGiveUp(false);
        setExpression("");
        // Show the original calculation result with query
        setCalculatedResult(`${originalExpression} = ${originalCalculation}`);
        setShowResult(true);
      } else {
        const attempts = challengeAttempts + 1;
        setChallengeAttempts(attempts);
        
        if (attempts >= 2) {
          setShowGiveUp(true);
          setResponse(`❌ Wrong answer! Try again or give up. (Attempt ${attempts})`);
        } else {
          setResponse(`❌ Wrong answer! Try again. (Attempt ${attempts})`);
        }
        setExpression("");
      }
      return;
    }

    if (btn === "=") {
      try {
        // Check for division by zero before evaluation
        if (expression.includes('/0') || expression.includes('/ 0')) {
          setResponse("Did you just divide by zero? Because that's how you break the internet. You're impossible! 😱");
          setCalculatedResult("");
          setShowResult(false);
          setExpression("");
          return;
        }

        // Normal calculation logic
        let evalExpr = expression
          .replace(/π/g, pi)
          .replace(/√/g, "sqrt(")
          .replace(/median/g, "median")
          .replace(/log/g, "log10");
        
        // Add closing parenthesis for sqrt if it's missing
        if (evalExpr.includes("sqrt(") && !evalExpr.includes("sqrt()")) {
          // Find the number after sqrt( and add closing parenthesis
          evalExpr = evalExpr.replace(/sqrt\((\d+)/g, "sqrt($1)");
        }
        
        const result = evaluate(evalExpr);
        
        if (mode === "fun") {
          setCalculatedResult(String(result));
          setShowResult(false);
          const diff = getDifficulty(expression);
          const response = getNextResponse(diff);
          setResponse(response);
          setExpression(""); 
        } else {
          // Challenge mode - show a challenge question after calculation
          setOriginalCalculation(String(result));
          setOriginalExpression(expression);
          setCalculatedResult("");
          setShowResult(false);
          const question = getRandomQuestion();
          setChallengeQuestion(question);
          setResponse(`🤔 ${question.q}`);
          setChallengeAttempts(0);
          setShowGiveUp(false);
          setExpression(""); // Clear for answer input
        }
      } catch (error) {
        // Check if it's a division by zero error from mathjs
        if (error.message && error.message.includes('Division by zero')) {
          setResponse("Did you just divide by zero? Because that's how you break the internet. You're impossible! 😱");
        } else {
          setResponse("Bruh… that's not even math. 😑");
        }
        setCalculatedResult("");
        setShowResult(false);
        setExpression(""); // Clear on error too
      }
    } else if (btn === "AC") {
      setExpression("");
      setResponse("");
      setChallengeQuestion(null);
      setChallengeAttempts(0);
      setShowGiveUp(false);
      setCalculatedResult("");
      setShowResult(false);
      setOriginalCalculation("");
      setOriginalExpression("");
    } else if (btn === "C") {
      setExpression(expression.slice(0, -1));
    } else if (btn === "GIVE UP" && showGiveUp) {
      setResponse(`😅 The answer was: "${challengeQuestion.a}"`);
      setChallengeQuestion(null);
      setChallengeAttempts(0);
      setShowGiveUp(false);
      setExpression("");
      // Show the original calculation result with query
      setCalculatedResult(`${originalExpression} = ${originalCalculation}`);
      setShowResult(true);
    } else {
      setExpression(expression + btn);
    }
  };

  return (
    <div className="calculator">
      <ModeSelector mode={mode} setMode={setMode} />
      <Display 
        value={expression} 
        response={response} 
        result={showResult ? calculatedResult : ""}
      />
      <Keypad 
        onButtonClick={handleButtonClick} 
        showGiveUp={showGiveUp} 
        showEnter={mode === "challenge" && challengeQuestion}
      />
    </div>
  );
}
