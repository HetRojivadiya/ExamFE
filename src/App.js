import React, { useState ,useEffect } from "react";
import axios from "axios";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import swal from 'sweetalert';


function App({ setStartButton, setColor, color ,studentData}) {
  const [showModal, setShowModal] = useState(false);
  const [Loader, setLoader] = useState(false);
  
  

  const nav = useNavigate();

  useEffect( () => {
    const token = localStorage.getItem('token');
    if (token==null) {
      nav('/');
    }else{

      fetch(`http://localhost:3001/checkStatus`, {
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
              console.log(data.status);
              if(data.status==="Attended")
              {
                setStartButton(false);
                setColor(false);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
    }
  }, [nav]);

  const startMonitoring = async () => {

    setTimeout(() => {
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
    }, 4800);

    startLoader();
    navigateGame();
    setColor(false);
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/start_face_monitoring"
      );
      
      setStartButton(false);
      let updatedResult = 0;
    
      const token = localStorage.getItem('token');
      try {
      const response = await fetch('http://localhost:3001/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, 
        },
        body: JSON.stringify({updatedResult}),
      });

      if (response.ok) {
        
        nav("/app")
       } else {
        console.error('Failed to submit');
      }
    }
    catch (err) {
      console.error('Error during submit:', err);
    }
      
      swal({
        position: "top-end",
        icon: "error",
        title: "You are disqualified for the exam",
        showConfirmButton: false,
        timer: 5000,
      });
      closeLoader();
    } catch (error) {
      console.error("Error starting face monitoring:", error);
    }
  };

  const navigateGame = () => {
    setTimeout(() => {
      setStartButton(true);
      nav("/quiz");
      closeLoader();
    }, 5000);
  };

  const startLoader = () => {
    setLoader(true);
  };

  const closeLoader = () => {
    setLoader(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };
  const handleShow = () => {
    setShowModal(true);
  };

  return (
    <>
      {studentData!==null ?(<div className="page-container" id="page-content">
      
        <div className="row d-flex justify-content-center ">
          <div className="col-xl-6 center">
            <div className="card user-card-full">
        
              <div className="row">
                <div className="col-sm-4 bg-c-lite-green user-profile">
                
                  <div className="card-block text-center text-white padding">
                    <div className="m-b-25">
                      <img
                        src="/images/het.jpg"
                        className="img-radius"
                        alt="User"
                      />
                    </div>

                    <h4>{studentData.firstName} {studentData.lastName}</h4>
                    <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                    
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="card-block padding">
                  <div className="row">
                  <div className="col-sm-6">
                  <h4 className="m-b-20 p-b-5 b-b-default f-w-600">
                      Information
                    </h4>
                    </div>
                      <div className="col-sm-6">
                  <button style={{border:"unSet",background:"none",color:"blue",marginLeft:"130px"}} onClick={()=>{localStorage.removeItem('token');
                  nav("/");}}>Logout</button>
                      </div>
                      
                      </div>
                    
                    
                    <div className="row">
                      <div className="col-sm-6">
                        <p>Email</p>
                        <h6
                          style={{ marginTop: "-13px" }}
                          className="text-muted"
                        >
                          {studentData.email}
                        </h6>
                      </div>
                      <div className="col-sm-6">
                        <p>Phone</p>
                        <h6
                          style={{ marginTop: "-13px" }}
                          className="text-muted f-w-400"
                        >
                          {studentData.mobile}
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <p>Enrollment</p>
                        <h6
                          style={{ marginTop: "-13px" }}
                          className="text-muted"
                        >
                          {studentData.enrollment}
                        </h6>
                      </div>
                      <div className="col-sm-6">
                        <p>GR no.</p>
                        <h6
                          style={{ marginTop: "-13px" }}
                          className="text-muted f-w-400"
                        >
                          {studentData.GRno}
                        </h6>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-12">
                        <p className="m-b-10 f-w-600">Stream</p>
                        <h6
                          className="text-muted "
                          style={{ marginTop: "-13px" }}
                        >
                          {studentData.stream}
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <p>Exam Start</p>
                        <h6
                          style={{ marginTop: "-13px" }}
                          className="text-muted"
                        >
                          10:30 AM
                        </h6>
                      </div>
                      <div className="col-sm-6">
                        <p>Exam End</p>
                        <h6
                          style={{ marginTop: "-13px" }}
                          className="text-muted f-w-400"
                        >
                          11:00 AM
                        </h6>
                      </div>
                    </div>
                    <div className="row my-2">
                      <div className="col-sm-3"></div>
                      <div className="col-sm-6">
                        {color === true ? (
                          <button
                            className="btn btn-success"
                            onClick={handleShow}
                          >
                            Start test
                          </button>
                        ) : (
                          <button className="btn btn-danger">Exam End</button>
                        )}
                      </div>
                      <div className="col-sm-3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>):(<div className="spinner-border text-primary" role="status">
              <span className="sr-only"></span>
            </div>)}
      
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton style={{ color: "white" }}>
          <Modal.Title className="my-2" style={{ fontSize: "25px" }}>
            ⚠️Rules / Instruction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li style={{ fontSize: "20px", color: "red", fontWeight: "bold" }}>
              Warning: You are under surveillance during the test
            </li>
            <li>
              No cell phones or other secondary devices in the room or test area
            </li>
            <li>
              Your desk/table must be clear of any materials except your
              test-taking device
            </li>
            <li>No one else can be in the room with you</li>
            <li>No talking</li>
            <li>
              The testing room must be well-lit and you must be clearly visible
            </li>
            <li>No dual screens/monitors</li>
            <li>Do not leave the camera</li>
            <li>No use of additional applications or internet</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          {!Loader ? (
            <Button
              className="btn"
              style={{ fontSize: "20px", padding: "10px" }}
              onClick={startMonitoring}
            >
              Start Test
            </Button>
          ) : (
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only"></span>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
