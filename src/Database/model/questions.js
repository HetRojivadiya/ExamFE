const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy', 
      },

      
});

module.exports = mongoose.model('Questions', questionSchema);
