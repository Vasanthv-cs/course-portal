const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  type: { type: String, enum: ['video', 'reading', 'interactive'], default: 'video' },
  youtubeId: { type: String },
  completed: { type: Boolean, default: false } // Keeping for legacy frontend compatibility
});

const quizQuestionSchema = new mongoose.Schema({
  id: { type: String },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String },
  difficulty: { type: String },
  marks: { type: Number, default: 1 }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema],
  quiz: [quizQuestionSchema]
});

const courseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  instructor: { type: String },
  progress: { type: Number, default: 0 },
  enrolled: { type: Boolean, default: false },
  icon: { type: String },
  gradient: { type: String },
  htmlQuizRequired: { type: Boolean, default: false },
  modules: [moduleSchema]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
