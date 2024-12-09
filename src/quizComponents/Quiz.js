import "./Quiz.css";
import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";

export default function Quiz({questions,setStartButton}) {
  const options = ["A", "B", "C", "D"];
  const nav = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [count, setCount] = useState(0);

  const [countArray, setCountArray] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState(
    new Array(30).fill(null)
  );

  

  //For Timer
  const totalSeconds = 30 * 60;
  const [seconds, setSeconds] = useState(totalSeconds);
  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000); // Correct interval duration to 1 second
      return () => clearInterval(timer);
    } else {
      submitTest(); // Automatically submit the test when time is up
    }
  }, [seconds]);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const percentage = 100 - ((totalSeconds - seconds) / totalSeconds) * 100;


  const currentQuestion = questions[currentQuestionIndex];

  //for Select question and save it
  const handleOptionSelect = (Index,option) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = option;
    
    setSelectedOptions(newSelectedOptions);
   
    let button = document.getElementById(currentQuestionIndex.toString());
    button.style.backgroundColor = "#45eb76";

    if(!countArray.includes(currentQuestionIndex))
    {
      setCountArray([...countArray,currentQuestionIndex]);
      setCount(count+1);
    }
    
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitTest = async() => {
    let updatedResult = 0;
    for (let i = 0; i < 30; i++) {
      if (questions[i].answer === selectedOptions[i]) {
        updatedResult++;
      }
    }
  
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://examnodejs.onrender.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, 
        },
        body: JSON.stringify({updatedResult}),
      });

      if (response.ok) {
        setStartButton(false);
        nav("/app")
       } else {
        console.error('Failed to submit');
      }
    }
    catch (err) {
      console.error('Error during submit:', err);
    }

  };

  const enterFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const updateFile = () => {
    fetch(`https://examnodejs.onrender.com/updateFile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  
  useEffect(() => {
    const intervalId = setInterval(() => {

      const fetchData = async () => {
        try {
          const response = await fetch('https://examproject-28db7-default-rtdb.firebaseio.com/.json');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const fetchedData = await response.json();
          
      
          if(fetchedData.exam.indicator === 'True')
          {
            setTimeout(() => {
                      swal({
                        position: "top-end",
                        icon: "error",
                        title: "Attention! Please",
                        showConfirmButton: false,
                        timer: 2000,
                      });
                    
                    }, 100); 

            const updateIndicator = async () => {
              try {
                const updateResponse = await fetch('https://examproject-28db7-default-rtdb.firebaseio.com/exam.json', {
                  method: 'PATCH', // Use PATCH for updates
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ indicator: 'False' }), // Update indicator to 'False'
                });
                if (!updateResponse.ok) {
                  throw new Error('Failed to update indicator');
                }
              } catch (error) {
                console.error('Error updating indicator:', error);
              }
            };
  
            updateIndicator();
          }
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
      
        // fetch(`https://examnodejs.onrender.com/readFile`)
        //   .then((response) => {
        //     if (!response.ok) {
        //       throw new Error("Network response was not ok");
        //     }
        //     return response.json();
        //   })
        //   .then((data) => {
        //     if (data.content === "True") {
              
        //       setTimeout(() => {
        //         swal({
        //           position: "top-end",
        //           icon: "error",
        //           title: "Attention! Please",
        //           showConfirmButton: false,
        //           timer: 2000,
        //         });
        //         updateFile();
        //       }, 100); 
        //     }
        //   })
        //   .catch((error) => {
        //     console.error("Error:", error);
        //   });
    
      
    
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <div className="main">
        <div className="right-section">
          {document.fullscreenElement ? (
            <button
              onClick={exitFullScreen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <img
                src="/images/smallScreen.png"
                alt="Enter Full Screen"
                width={"40px"}
              />
            </button>
          ) : (
            <button
              onClick={enterFullScreen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <img
                src="/images/fullScreen.png"
                alt="Enter Full Screen"
                width={"50px"}
              />
            </button>
          )}

          <div className="part-1">
            <p>All Questions</p>
            <div className="question-buttons flex-row">
              {[...Array(30).keys()].map((index) => (
                <button
                  id={index} // className={selectedOptions[index] !== null ? "selected" : ""}
                  key={index + 1}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}{" "}
                </button>
              ))}
            </div>
            <br />
            <br />
          </div>
        </div>

        <div className="container">
          <div id="game" className="justify-center flex-column">
            <h2>Question {currentQuestionIndex + 1}</h2>
            {/* <h2>{currentQuestion.type}</h2> */}
            <h2 id="question">{currentQuestion.question}</h2>

            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`choice-button my-1 ${
                  selectedOptions[currentQuestionIndex] === option
                    ? "selected"
                    : ""
                }`}
                style={{ border: "none", borderRadius: "10px" }}
                onClick={() => handleOptionSelect(index,option)}
              >
                <div className="choice-container ">
                  <p className="choice-prefix">{options[index]}</p>
                  <p className="choice-text" data-number="1">
                    {option}
                  </p>
                </div>
              </button>
            ))}

            <div className="button-container">
              <button className="button" onClick={handlePrevious}>
                Previous
              </button>
              {currentQuestionIndex === 29 ? (
                <button
                  className="button"
                  style={{ background: "#DC3545" }}
                  onClick={submitTest}
                >
                  Submit
                </button>
              ) : (
                <button className="button" onClick={handleNext}>
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="left-section">
          <div className="part-2">
            <p className="time-r">Time Remaining</p>

            <div className="time-loader">
              <div style={{ width: 200, height: 200 }}>
                <CircularProgressbar
                  value={percentage}
                  counterClockwise
                  strokeWidth={4}
                  styles={{
                    path: {
                      stroke: "#3498db",
                      strokeLinecap: "round",
                      transition: "stroke-dashoffset 0.5s ease 0s",
                    },
                    trail: {
                      stroke: "#e0e0e0",
                    },
                    text: {
                      fill: "#3498db",
                      fontSize: "20px",
                    },
                  }}
                />
              </div>
              <div className="timer">
                {`${minutes.toString().padStart(2, "0")}:${remainingSeconds
                  .toString()
                  .padStart(2, "0")}`}
              </div>
            </div>
            <div
              className="remaining-questions my-3 bg-success"
              style={{ border: "1px solid black ", borderRadius: "30px" }}
            >
              <h3 className="my-1" style={{ fontFamily: "cursive" }}>
                Count: {count} / 30
              </h3>
            </div>
            <div>
              <img
                src="/images/observation.png"
                alt="Enter Full Screen"
                width={"180px"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
