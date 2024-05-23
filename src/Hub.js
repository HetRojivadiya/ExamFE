import React from 'react';
import { Route, Routes, HashRouter, Navigate  } from 'react-router-dom';
import App from './App';
import Quiz from './quizComponents/Quiz'
import Login from './Login'
import { useState,useEffect } from 'react';
import Dashboard from './AdminComponents/dashboard';

const Hub = () => {
  const [start,setStartButton] = useState(false);
  const [color,setColor] = useState(true);
  const [questions, setQuestions] = useState([]); 
  const [studentData, setStudentData] = useState(null); 

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetch all questions
        const response = await fetch("http://localhost:3001/fetchQuestions");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const allQuestions = await response.json();
  
        // Filter questions by difficulty
        const easyQuestions = allQuestions.filter((question) => question.type === "easy");
        const mediumQuestions = allQuestions.filter((question) => question.type === "medium");
        const hardQuestions = allQuestions.filter((question) => question.type === "hard");
  
        // Generate random sets of questions
        const selectedQuestions = [];
        selectedQuestions.push(...getRandomQuestions(easyQuestions, 15));
        selectedQuestions.push(...getRandomQuestions(mediumQuestions, 10));
        selectedQuestions.push(...getRandomQuestions(hardQuestions, 5));
  
        // Shuffle the selected questions to randomize the order
        const shuffledQuestions = shuffleArray(selectedQuestions);
  
        setQuestions(shuffledQuestions);
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
  
    fetchQuestions();
  
    const token = localStorage.getItem('token');
    if (token !== null) {
      getStudent(token);
    }
  }, []);

  const getStudent = async(token) => {

    await fetch(`http://localhost:3001/getStudent`, {
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
          <Route path="/" element={<Login setStudentData={setStudentData}/>} />
          <Route path="/dashboard/*" element={<Dashboard/>} />
          <Route path="/app" element={!start ? (<App setStartButton={setStartButton} setColor={setColor} color={color} studentData={studentData}/>):(<Navigate to="/quiz"/>)} />
          <Route path="/quiz" element={start ? (<Quiz questions={questions} setStartButton={setStartButton}/>):(<Navigate to="/app"/>)} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default Hub;
