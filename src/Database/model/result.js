const mongoose = require('mongoose');

// Define a schema for student results
const Schema = mongoose.Schema;

const studentResultSchema = new Schema({
  enrollment: {
    type: String,
    required: true,
    unique: true, 
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  subject: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
});


const StudentResult = mongoose.model('StudentResult', studentResultSchema);

module.exports = StudentResult;
