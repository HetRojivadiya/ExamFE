// src/components/Question.js
import React, { useState } from 'react';

const Question = ({ question, options, answer, type, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question);
  const [editedOptions, setEditedOptions] = useState([...options]);
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(answer);
  const [editedType, setEditedType] = useState(type); // New state variable for editing the type

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Save the edited question, options, correct answer, and type
    setIsEditing(false);
    onEdit(editedQuestion, editedOptions, editedCorrectAnswer, editedType);
  };

  return (
    <div className="card mb-2">
      <div className="card-body">
        {isEditing ? (
          <div>
            <textarea
              className="form-control"
              rows="2"
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
            />
            <div className="form-check mt-2">
              {editedOptions.map((option, index) => (
                <div key={index} className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id={`option${index}`}
                    name="optionsRadios"
                    value={option}
                    checked={editedCorrectAnswer === option}
                    onChange={() => setEditedCorrectAnswer(option)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`option${index}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {/* Editable type field */}
            <div className="form-group mt-2">
              <select
                className="form-control"
                value={editedType}
                onChange={(e) => setEditedType(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <button
              className="btn btn-primary mt-2"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        ) : (
          <div>
            <p>{question}</p>
            <ul>
              {options.map((option, index) => (
                <li key={index} className={answer === option ? 'text-success' : ''}>
                  {option}
                </li>
              ))}
            </ul>
            <p>Type: {type}</p> {/* Display the type */}
            <button
              className="btn btn-primary"
              onClick={handleEdit}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Question;
