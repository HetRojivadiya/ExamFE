const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  enrollment: {
    type: String,
    required: true,
    unique: true, 
  },
  GRno:{
    type: String,
    required: true,
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
  password: {
    type: String,
    required: true,
  },
  oneMark: {  
    type: Number,
    default: 0,  
  },
  mobile: {  
    type: String,
   
  },
  stream: {  
    type: String,
    
  },
  status:{
    type:String,

  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;