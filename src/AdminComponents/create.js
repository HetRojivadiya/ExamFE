  import React, { useState } from 'react';
  import Question from './question';

  function Create() {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newOptions, setNewOptions] = useState(['', '', '', '']);
    const [newCorrectAnswer, setNewCorrectAnswer] = useState('');
    const [newType, setNewType] = useState('easy'); 
    const [pastedData, setPastedData] = useState('');

    const handleAddQuestion = () => {
      if (
        newQuestion &&
        newOptions.length === 4 &&
        newOptions.every((option) => option !== '') &&
        newCorrectAnswer !== ''
      ) {
        setQuestions([
          ...questions,
          {
            question: newQuestion,
            options: newOptions,
            answer: newCorrectAnswer,
            type: newType,
          },
        ]);
        setNewQuestion('');
        setNewOptions(['', '', '', '']);
        setNewCorrectAnswer('');
        setNewType('easy');
      }
    };

    const handleEditQuestion = (editedQuestion, editedOptions, editedCorrectAnswer, editedType, index) => {
      const updatedQuestions = [...questions];
      updatedQuestions[index] = {
        question: editedQuestion,
        options: editedOptions,
        answer: editedCorrectAnswer,
        type: editedType,
      };
      setQuestions(updatedQuestions);
    };

    const parseAndAddQuestions = () => {
      const lines = pastedData.split('\n');
      const parsedQuestions = [];
      let currentQuestion = '';
      let currentOptions = ['', '', '', ''];
      let currentCorrectAnswer = '';
      let currentType = 'easy'; // Default type is 'easy'
    
      lines.forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('a.')) {
          currentOptions[0] = trimmedLine.substr(2).trim();
        } else if (trimmedLine.startsWith('b.')) {
          currentOptions[1] = trimmedLine.substr(2).trim();
        } else if (trimmedLine.startsWith('c.')) {
          currentOptions[2] = trimmedLine.substr(2).trim();
        } else if (trimmedLine.startsWith('d.')) {
          currentOptions[3] = trimmedLine.substr(2).trim();
        } else if (trimmedLine.startsWith('answer')) {
          currentCorrectAnswer = trimmedLine.split('=')[1].trim();
        } else if (trimmedLine.startsWith('type')) {
          currentType = trimmedLine.split('=')[1].trim();
        } else if (trimmedLine) {
      
          if (!currentQuestion) {
            
            currentQuestion = trimmedLine;
          } else {
            
            currentQuestion += '\n' + trimmedLine;
          }
        } else {
          // An empty line indicates the end of the current question
          if (currentQuestion) {
            parsedQuestions.push({
              question: currentQuestion,
              options: [...currentOptions],
              answer: currentCorrectAnswer,
              type: currentType,
            });
            currentQuestion = '';
            currentOptions = ['', '', '', ''];
            currentCorrectAnswer = '';
            currentType = 'easy'; // Reset type to 'easy'
          }
        }
      });
    
      if (currentQuestion) {
        // Add the last question if any
        parsedQuestions.push({
          question: currentQuestion,
          options: [...currentOptions],
          answer: currentCorrectAnswer,
          type: currentType,
        });
      }
    
      setQuestions([...questions, ...parsedQuestions]);
      setPastedData('');
    };
    

    const submitExam = async () => {
      try {
        const response = await fetch('http://localhost:3001/createExam', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ questions }),
        });

        if (response.ok) {
          // Handle success
        } else {
          console.error('Failed to submit');
        }
      } catch (err) {
        console.error('Error during submit:', err);
      }
    };

    return (
      <div className="container mt-4">
        <div className="text-center">
          <h1>Let's Create Exam</h1>
        </div>

        <div>
          <h3>Quick Create</h3>
          <div style={{ fontSize: 'small' }}>
            <p style={{ margin: '4px 0', padding: 0 }} className="text-danger">
              Please paste your questions in the following format:
            </p>
            <p style={{ margin: '4px 0', padding: 0 }}>que 1: [Your question here]</p>
            <p style={{ margin: '4px 0', padding: 0 }}>a. [Option A]</p>
            <p style={{ margin: '4px 0', padding: 0 }}>b. [Option B]</p>
            <p style={{ margin: '4px 0', padding: 0 }}>c. [Option C]</p>
            <p style={{ margin: '4px 0', padding: 0 }}>d. [Option D]</p>
            <p style={{ margin: '4px 0', padding: 0 }}>answer = [Correct option]</p>
            <p style={{ margin: '4px 0', padding: 0 }}>type = [Type]</p>
          </div>

          <textarea
            className="form-control mb-2"
            rows="5"
            placeholder="Paste formatted questions here"
            value={pastedData}
            onChange={(e) => setPastedData(e.target.value)}
          />
          <button className="btn btn-primary" onClick={parseAndAddQuestions}>
            Parse and Add Questions
          </button>
        </div>

        <div
          style={{
            borderRadius: '20px',
            background: 'rgb(200,230,212)',
            background: 'linear-gradient(90deg, rgba(200,230,212,1) 18% , rgba(250,250,250,1) 100%)',
          }}
          className="p-3 my-4"
        >
          <div>
            <h3>Add a New Question</h3>
            <input
              type="text"
              className="form-control mb-2 text-dark"
              placeholder="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <div className="form-group">
              {newOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  className="form-control"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...newOptions];
                    updatedOptions[index] = e.target.value;
                    setNewOptions(updatedOptions);
                  }}
                />
              ))}
            </div>
            <div className="form-group">
              <select
                className="form-control"
                value={newCorrectAnswer}
                onChange={(e) => setNewCorrectAnswer(e.target.value)}
              >
                <option value="">Select Correct Answer</option>
                {newOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <select
                className="form-control"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            {questions.length < 29 ? (
              <button className="btn btn-primary" onClick={handleAddQuestion}>
                Add Question
              </button>
            ) : (
              <button className="btn btn-warning" onClick={() => submitExam()}>
                Create Exam
              </button>
            )}
          </div>
          <hr />
          <h3>Questions</h3>
          {questions.map((q, index) => (
            <Question
              key={index}
              question={q.question}
              options={q.options}
              answer={q.answer}
              type={q.type}
              onEdit={(editedQuestion, editedOptions, editedCorrectAnswer, editedType) =>
                handleEditQuestion(editedQuestion, editedOptions, editedCorrectAnswer, editedType, index)
              }
            />
          ))}
        </div>
      </div>
    );
  }

  export default Create;
