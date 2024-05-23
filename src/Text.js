import React, { useState, useEffect } from "react";
import axios from "axios";
import App from "./App";


function FileViewer() {
  const [fileContent, setFileContent] = useState("");

  const getFile = async () => {
    axios
      .get("http://localhost:3001/get-text") // Update with your server's URL
      .then((response) => {
        setFileContent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the file content:", error);
      });
  };

  useEffect(() => {
    getFile();
    const interval = setInterval(getFile, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <pre>
        {fileContent === "statusTrue" ? (
          <App />
        ) : (
            <>
            <App/>
            </>
        )}
      </pre>
    </div>
  );
}

export default FileViewer;
