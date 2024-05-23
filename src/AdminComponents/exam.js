import React, { useState, useEffect } from 'react';
import './exam.css'; // Import your CSS file

function Exam() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions from your API endpoint
    fetch('http://localhost:3001/getQuestions')
      .then((response) => response.json())
      .then((data) =>{
        console.log(data); // Add this line for debugging
        setQuestions(data.que);
      })
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  return (
    <div className="container">
      <h1>Display Questions</h1>
      {questions.map((question, index) => (
        <MCQ key={index} question={question} />
      ))}
    </div>
  );
}

function MCQ({ question }) {
    return (
      <div className="question-container">
        <div className="question">
          {question.question}
        </div>
        <div className="question text-success">
          {question.type}
        </div>
        <div className="options">
          {question.options.map((option, index) => (
            <div key={index} className="option">
              {`Option ${String.fromCharCode(97 + index)}. ${option}`}
            </div>
          ))}
        </div>
        <div className="answer">
          {`Correct Answer: ${question.answer}`}
        </div>
      </div>
    );
  }
  

export default Exam;
