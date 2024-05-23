const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./connection.js");
const cors = require("cors");
const session = require("express-session");
const jwt = require('jsonwebtoken');
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  secret: "het",
  saveUninitialized: true,
  resave: true,
  cookie:{ expires:60*60},
}));


const uri =
  "mongodb+srv://hetrojivadiya999:hetrojivadiya@het.ioacmg7.mongodb.net/ExamPlatform?retryWrites=true&w=majority";
connectDB(uri);

const students = require("./model/students");
const questions = require("./model/questions");



app.get("/fetchQuestions", async (req, res) => {
  try {
    const question = await questions.find({});
    res.json(question);
   
  } catch (err) {
    console.error("Error fetching Questions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/studentData", async (req, res) => {
  try {
    const studentsData = await students.find({});
    res.json(studentsData);
    
  } catch (err) {
    console.error("Error fetching Students Data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const requireAuth = (req, res, next) => {

 
  const token = req.header('Authorization');

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


app.get('/getStudent', requireAuth, async (req, res) => {
  const userEnrollment = req.user.enrollment; 
  try {
    const student = await students.find({ enrollment: userEnrollment });
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching user cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/checkStatus', requireAuth, async (req, res) => {
  const userEnrollment = req.user.enrollment; 
  try {
    const student = await students.find({ enrollment: userEnrollment });

    res.json(student[0]);

  } catch (error) {
    console.error('Error fetching user cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post("/login", async (req, res) => {
  const { enrollment, password } = req.body;
  try {
    const student = await students.findOne({ enrollment, password });

    if (student) {
      const token = jwt.sign({ userId: student._id , enrollment: student.enrollment}, 'your-secret-key', { expiresIn: '1h' });
      
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/submit",requireAuth, async (req, res) => {
  const updatedResult = req.body.updatedResult;
  const enroll = req.user.enrollment;
  try {
    const result = await students.findOneAndUpdate(
      { enrollment: enroll},
      { $set: { oneMark: updatedResult,status:"Attended" } }
    );

    if (result) {
      return res.send("submit");
    }
  } catch (err) {
    console.error("Error during submitting:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/reattend", async (req, res) => {
const enroll = req.body.studentId;

  try {
    const result = await students.findOneAndUpdate(
      { enrollment: enroll},
      { $set: { oneMark: 0,status:"NaN" } }
    );

    if (result) {
      return res.send("Status updated");
    }
  } catch (err) {
    console.error("Error during status update:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/createExam", async (req, res) => {
  const Que = req.body.questions;
  
        await questions.deleteMany()
        await questions.create(Que)
          .then((result) => {
            console.log("Successfully inserted:");
          })
          .catch((err) => {
            console.log("Error inserting data:", err);
          });
  });



app.get("/readFile", (req, res) => {
  const filePath = "C:\\Users\\hetro\\OneDrive\\Desktop\\React\\6.online_exam_platform\\warning.txt";

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).json({ error: err.message });
    } else {
      res.json({ content: data });
    }
  });
});

app.get('/getQuestions',async (req, res) => {

  try {
    const que = await questions.find({});

    res.json({que});

  } catch (error) {
    console.error('Error fetching user cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/updateFile", (req, res) => {
  const filePath = "C:\\Users\\hetro\\OneDrive\\Desktop\\React\\6.online_exam_platform\\warning.txt";
  const content = "False";
  fs.writeFile(filePath, content, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      res.status(500).json({ error: err.message });
    } else {
      console.log('File updated');
      res.json({ message: "File updated successfully" });
    }
  });
});


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});



// const StudentJSON = require("./students.json");
// const QuestionJSON = require("./questions.json");

// const upload = async () => {
//       // await laptop.deleteMany()
//       await students.create(StudentJSON)
//         .then((result) => {
//           console.log("Successfully inserted:");
//         })
//         .catch((err) => {
//           console.log("Error inserting data:", err);
//         });
//       }
// upload();

//     await questions.create(QuestionJSON)
//         .then((result) => {
//           console.log("Successfully inserted:");
//         })
//         .catch((err) => {
//           console.log("Error inserting data:", err);
//         });

//     };

//     upload();



  // app.get('/setuser', (req, res)=>{ 
  //   if(user!==""){
      
  //     res.cookie("userData", user);
  //     console.log(req.cookies); 
  //     res.send(req.cookies); 
  //   }else{
  //     res.send('user is not set'); 
  //   }
  // }); 

  // app.get("/checkCookie", (req, res) => {
  //   res.send(req.cookies);
  // });

  // app.get('/deleteCookie', (req, res)=>{ 
  // res.clearCookie('userData'); 
  // res.send("deleted");   
  // }); 