const Assignment = require('../Model/assignment');
const logger = require('../../utils/logger');

function logControllerError(req, operation, error, statusCode) {
  logger.write(statusCode >= 500 ? 'error' : 'warn', 'assignment.operation.failed', {
    requestId: req.requestId,
    operation,
    statusCode,
    ...logger.errorDetails(error),
  });
}

function clientErrorStatus(error) {
  return ['ValidationError', 'CastError'].includes(error?.name) ? 400 : 500;
}

const Create = async (req, res) => {
  try {
    const { title, subject, type, dueDate, priority, status, pointsPossible, pointsEarned, estimatedMinutes, notes, uid } = req.body;
    const currentStatus = status || 'Not started';
    const possible = pointsPossible === '' || pointsPossible == null ? null : Number(pointsPossible);
    const earned = pointsEarned === '' || pointsEarned == null ? null : Number(pointsEarned);
    if (earned !== null && (possible === null || earned > possible)) return res.status(400).json({ error: 'Points earned must be within the points possible.' });
    const assignment = await Assignment.create({
      title, subject, type, dueDate: dueDate || null, priority, status: currentStatus,
      pointsPossible: possible,
      pointsEarned: earned,
      estimatedMinutes, notes, uid,
      completed: ['Submitted', 'Graded'].includes(currentStatus),
    });
    res.status(201).json(assignment);
  } catch (error) {
    const statusCode = clientErrorStatus(error);
    logControllerError(req, 'create', error, statusCode);
    res.status(statusCode).json({ error: statusCode === 400 ? error.message : 'Could not save assignment.' });
  }
};

const Read = async (_req, res) => {
  try { res.status(200).json(await Assignment.find().sort({ dueDate: 1, createdAt: -1 })); }
  catch (error) { logControllerError(_req, 'list_all', error, 500); res.status(500).json({ error: 'Could not load assignments.' }); }
};

const SingleRead = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    res.status(200).json(assignment);
  } catch (error) { logControllerError(req, 'read_one', error, 500); res.status(500).json({ error: 'Could not load assignment.' }); }
};

const FindDatabase = async (req, res) => {
  try { res.status(200).json(await Assignment.find({ uid: req.params.uid }).sort({ dueDate: 1, createdAt: -1 })); }
  catch (error) { logControllerError(req, 'list_by_user', error, 500); res.status(500).json({ error: 'Could not load assignments.' }); }
};

const Update = async (req, res) => {
  try {
    const allowed = ['title', 'subject', 'type', 'dueDate', 'priority', 'status', 'pointsPossible', 'pointsEarned', 'estimatedMinutes', 'notes', 'completed'];
    const changes = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    if (changes.dueDate === '') changes.dueDate = null;
    for (const field of ['pointsPossible', 'pointsEarned']) if (changes[field] === '') changes[field] = null;
    if (changes.status) changes.completed = ['Submitted', 'Graded'].includes(changes.status);
    const existing = await Assignment.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Assignment not found.' });
    const possible = changes.pointsPossible !== undefined ? changes.pointsPossible : existing.pointsPossible;
    const earned = changes.pointsEarned !== undefined ? changes.pointsEarned : existing.pointsEarned;
    if (earned != null && (possible == null || Number(earned) > Number(possible))) return res.status(400).json({ error: 'Points earned must be within the points possible.' });
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, changes, { new: true, runValidators: true });
    res.status(200).json(assignment);
  } catch (error) {
    const statusCode = clientErrorStatus(error);
    logControllerError(req, 'update', error, statusCode);
    res.status(statusCode).json({ error: statusCode === 400 ? error.message : 'Could not update assignment.' });
  }
};

const Delete = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    res.status(200).json(assignment);
  } catch (error) { logControllerError(req, 'delete', error, 500); res.status(500).json({ error: 'Could not delete assignment.' }); }
};

module.exports = { Create, Read, SingleRead, Delete, Update, FindDatabase };
