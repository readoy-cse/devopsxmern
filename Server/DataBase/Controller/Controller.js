const Assignment = require('../Model/assignment');

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
  } catch (error) { res.status(400).json({ error: error.message }); }
};

const Read = async (_req, res) => {
  try { res.status(200).json(await Assignment.find().sort({ dueDate: 1, createdAt: -1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

const SingleRead = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    res.status(200).json(assignment);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const FindDatabase = async (req, res) => {
  try { res.status(200).json(await Assignment.find({ uid: req.params.uid }).sort({ dueDate: 1, createdAt: -1 })); }
  catch (error) { res.status(500).json({ error: error.message }); }
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
  } catch (error) { res.status(400).json({ error: error.message }); }
};

const Delete = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });
    res.status(200).json(assignment);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { Create, Read, SingleRead, Delete, Update, FindDatabase };
