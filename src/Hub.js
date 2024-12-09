import React from 'react';
import { Route, Routes, HashRouter, Navigate } from 'react-router-dom';
import App from './App';
import Quiz from './quizComponents/Quiz';
import Login from './Login';
import { useState, useEffect } from 'react';
import Dashboard from './AdminComponents/dashboard';

const Hub = () => {
  const [start, setStartButton] = useState(false);
  const [color, setColor] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://examnodejs.onrender.com/fetchQuestions");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const allQuestions = await response.json();

        // Filter questions by difficulty
        const easyQuestions = allQuestions.filter((question) => question.type === "easy");
        const mediumQuestions = allQuestions.filter((question) => question.type === "medium");
        const hardQuestions = allQuestions.filter((question) => question.type === "hard");

        if (studentData) {
          // Determine ratios based on student's previous performance
          const ratios = getQuestionRatios(studentData.oneMark);
          const selectedQuestions = [];
          selectedQuestions.push(...getRandomQuestions(easyQuestions, ratios.easy));
          selectedQuestions.push(...getRandomQuestions(mediumQuestions, ratios.medium));
          selectedQuestions.push(...getRandomQuestions(hardQuestions, ratios.hard));

          // Shuffle the selected questions to randomize the order
          const shuffledQuestions = shuffleArray(selectedQuestions);

          setQuestions(shuffledQuestions);
        }
      } catch (error) {
        console.error("Error:", error);
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
      if (oneMark >= 25) {
        // Clever student
        return { easy: 10, medium: 10, hard: 10 };
      } else if (oneMark >= 15) {
        // Medium student
        return { easy: 15, medium: 10, hard: 5 };
      } else {
        // Struggling student
        return { easy: 20, medium: 8, hard: 2 };
      }
    };

    const token = localStorage.getItem('token');
    if (token !== null) {
      getStudent(token);
    }
  }, [studentData]);

  const getStudent = async (token) => {
    await fetch(`https://examnodejs.onrender.com/getStudent`, {
      method: 'GET',
      headers: {
        'Authorization': `${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setStudentData(data[0]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Login setStudentData={setStudentData} />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/app" element={!start ? (<App setStartButton={setStartButton} setColor={setColor} color={color} studentData={studentData} />) : (<Navigate to="/quiz" />)} />
          <Route path="/quiz" element={start ? (<Quiz questions={questions} setStartButton={setStartButton} />) : (<Navigate to="/app" />)} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default Hub;
