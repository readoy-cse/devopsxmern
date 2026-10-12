const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  subject: { type: String, required: true, trim: true, maxlength: 80 },
  type: { type: String, enum: ['Homework', 'Essay', 'Project', 'Quiz', 'Exam', 'Lab', 'Other'], default: 'Homework' },
  dueDate: { type: Date, default: null },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Not started', 'In progress', 'Submitted', 'Graded'], default: 'Not started' },
  pointsPossible: { type: Number, min: 0, max: 10000, default: null },
  pointsEarned: { type: Number, min: 0, max: 10000, default: null },
  estimatedMinutes: { type: Number, min: 5, max: 1440, default: 30 },
  notes: { type: String, maxlength: 1000, default: '' },
  // Kept for older planner entries; status is the source of truth for new assignments.
  completed: { type: Boolean, default: false },
  uid: { type: String, required: true, index: true },
}, { timestamps: true });

module.exports = mongoose.model('StudyTask', AssignmentSchema);
