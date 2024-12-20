import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import gifImage from "./gif.gif";


function Login({ setStudentData }) {
  const nav = useNavigate();
  const [isGifVisible, setIsGifVisible] = useState(false);
  const [loader, setLoader] = useState(false);

  const [enrollment, setEnrollment] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      nav("/app");
    }
  }, [nav]);

  const handleCaptureAndAuthenticate = async (e) => {
    e.preventDefault();
    startLoader();

    if (enrollment === "admin" && password === "admin") {
      nav("/dashboard");
    } else {
      try {
        const response = await fetch("https://examnodejs.onrender.com/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ enrollment, password }),
        });

        if (response.ok) {
          window.alert(
            "You've successfully passed the first phase.\nNow, please look at the camera 📷 for the final authentication. 😊"
          );

          try {
            const res = await axios.get(
              "http://127.0.0.1:5000/capture_and_authenticate"
            );

            if (res.data.message === "Authenticated") {
              const data = await response.json();
              const token = data.token;
              localStorage.setItem("token", token);

              await fetch(`https://examnodejs.onrender.com/getStudent`, {
                method: "GET",
                headers: {
                  Authorization: `${token}`,
                },
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  return response.json();
                })
                .then(async (data) => {
                  setStudentData(data[0]);
                  nav("/app");
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            } else {
              setIsGifVisible(true);
            }
            closeLoader();
          } catch (error) {
            console.error(error);
            closeLoader();
          }
        } else {
          console.error("Authentication failed");
          setIsGifVisible(true);
          closeLoader();
        }
      } catch (err) {
        console.error("Error during login:", err);
        closeLoader();
      }
    }
  };

  const startLoader = () => {
    setLoader(true);
  };

  const closeLoader = () => {
    setLoader(false);
  };

  return (
    <>
      {/* <div className="login-container">
        <div className="login-card">
          {isGifVisible && (
            <img
              src={gifImage}
              width={"80px"}
              style={{ marginLeft: "135px" }}
              alt="Animated GIF"
            />
          )}
          <h5 className="card-title text-center">Login</h5>

          <form>
            <div className="mb-3">
              <label className="form-label">Enrollment</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                required
              />
            </div>

            {!loader ? (
              <button onClick={handleCaptureAndAuthenticate} class="d-grid">
                Start Authentication
              </button>
            ) : (
              <div
                className="spinner-border text-primary"
                style={{ marginLeft: "160px" }}
                role="status"
              >
                <span className="sr-only"></span>
              </div>
            )}
          </form>

          {/* Display the webcam feed */}
      {/* <video ref={webcamRef} width={"100px"} style={{ marginLeft: "130px",marginTop:"30px" }} ></video> */}
      {/* </div>
      </div> */}

      <div className="bg-light">
        <div id="__next">
          <div class="d-flex flex-column container">
            <div class="align-items-center justify-content-center g-0 min-vh-100 row">
              <div class="py-8 py-xl-0 col-xxl-4 col-lg-6 col-md-8 col-12">
                <div class="smooth-shadow-md card">
                  <div class="p-6 card-body">
                    {isGifVisible && (
                      <img
                        src={gifImage}
                        width={"80px"}
                        style={{ marginLeft: "210px" }}
                        alt="Animated GIF"
                      />
                    )}
                    <div class="mb-4">
                      <h2>Student Login</h2>
                      <p class="mb-6">Please enter your user information.</p>
                    </div>
                    <form class="">
                      <div class="mb-3">
                        <label class="form-label" for="username">
                          Enrollment
                        </label>
                        <input
                          name="username"
                          placeholder="Enter enrollment here"
                          id="username"
                          class="form-control"
                          type="text"
                          value={enrollment}
                          onChange={(e) => setEnrollment(e.target.value)}
                        />
                      </div>
                      <div class="mb-3">
                        <label class="form-label" for="password">
                          Password
                        </label>
                        <input
                          name="password"
                          placeholder="**************"
                          type="password"
                          id="password"
                          class="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div class="d-lg-flex justify-content-between align-items-center mb-4">
                        <div class="form-check">
                          <input
                            type="checkbox"
                            id="rememberme"
                            class="form-check-input"
                          />
                          <label for="rememberme" class="form-check-label">
                            Remember me
                          </label>
                        </div>
                      </div>
                      <div>
                        <div className="d-grid">
                          {!loader ? (
                            <button
                              onClick={handleCaptureAndAuthenticate}
                              class="btn btn-primary"
                            >
                              Start Authentication
                            </button>
                          ) : (
                            <div
                              className="spinner-border text-primary"
                              style={{ marginLeft: "235px" }}
                              role="status"
                            >
                              <span className="sr-only"></span>
                            </div>
                          )}
                        </div>
                        <div class="d-md-flex justify-content-between mt-4">
                          <div class="mb-2 mb-md-0">
                            <a class="fs-5" href="/authentication/sign-up">
                              Create
                            </a>
                          </div>
                          <div>
                            <a
                              class="text-inherit fs-5"
                              href="/authentication/forget-password"
                            >
                              Forgot your password?
                            </a>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

/* <div className="b">
      <div className="login-form">
        <div className="text">LOGIN</div>
        <form>
          <div className="field">
            <div className="fas fa-envelope"></div>
            <input type="text" placeholder="Enrollment" />
          </div>
          <div className="field">
            <div className="fas fa-lock"></div>
            <input type="password" name="password"  placeholder="Password" />
          </div>
          <button onClick={handleCaptureAndAuthenticate}>LOGIN</button>
        </form>
      </div>
      </div> */

/* <div>
        
        <h1>Login</h1>
  
        <button onClick={ handleCaptureAndAuthenticate}>Capture and Authenticate</button>
        {message && <p>{message}</p>}
</div> */

//   const handleStartWebcam = () => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true })
//       .then((stream) => {
//         videoRef.current.srcObject = stream;
//       })
//       .catch((error) => {
//         console.error('Error accessing webcam:', error);
//       });
//   };

/* <button onClick={handleStartWebcam}>Start Webcam</button>
    <video ref={videoRef} autoPlay /> */
