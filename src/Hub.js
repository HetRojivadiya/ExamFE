import React, { useState, useEffect } from 'react';
import { Route, Routes, HashRouter, Navigate } from 'react-router-dom';
import App from './App';
import Quiz from './quizComponents/Quiz';
import Login from './Login';
import Dashboard from './AdminComponents/dashboard';

const Hub = () => {
  const [start, setStartButton] = useState(false);
  const [color, setColor] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      getStudent(token);
    }
  }, []);

  useEffect(() => {
    if (studentData) {
      fetchQuestions(studentData);
    }
  }, [studentData]);

  const fetchQuestions = async (studentData) => {
    try {
      const response = await fetch("https://examnodejs.onrender.com/fetchQuestions");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const allQuestions = await response.json();

      const easyQuestions = allQuestions.filter(q => q.type === "easy");
      const mediumQuestions = allQuestions.filter(q => q.type === "medium");
      const hardQuestions = allQuestions.filter(q => q.type === "hard");

      const ratios = getQuestionRatios(studentData.oneMark);
      const selectedQuestions = [
        ...getRandomQuestions(easyQuestions, ratios.easy),
        ...getRandomQuestions(mediumQuestions, ratios.medium),
        ...getRandomQuestions(hardQuestions, ratios.hard),
      ];

      setQuestions(shuffleArray(selectedQuestions));
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const getRandomQuestions = (questions, count) => {
    const selectedQuestions = [];
    while (selectedQuestions.length < count && questions.length > 0) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      selectedQuestions.push(questions[randomIndex]);
      questions.splice(randomIndex, 1);
    }
    return selectedQuestions;
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const getQuestionRatios = (oneMark) => {
    if (oneMark >= 25) return { easy: 10, medium: 10, hard: 10 };
    if (oneMark >= 15) return { easy: 15, medium: 10, hard: 5 };
    return { easy: 20, medium: 8, hard: 2 };
  };

  const getStudent = async (token) => {
    try {
      const response = await fetch(`https://examnodejs.onrender.com/getStudent`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setStudentData(data[0]);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Login setStudentData={setStudentData} />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/app" element={!start ? (
            <App setStartButton={setStartButton} setColor={setColor} color={color} studentData={studentData} />
          ) : (
            <Navigate to="/quiz" />
          )} />
          <Route path="/quiz" element={start ? (
            <Quiz questions={questions} setStartButton={setStartButton} />
          ) : (
            <Navigate to="/app" />
          )} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default Hub;