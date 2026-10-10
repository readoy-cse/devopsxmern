import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../utils/env';

const TYPES = ['Homework', 'Essay', 'Project', 'Quiz', 'Exam', 'Lab', 'Other'];
const Register = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('User') || '{}');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', type: 'Homework', dueDate: '', priority: 'Medium', status: 'Not started', pointsPossible: '', pointsEarned: '', estimatedMinutes: 30, notes: '' });
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  async function submit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.subject.trim()) return toast.error('Add an assignment title and course.');
    if (form.pointsEarned && form.pointsPossible && Number(form.pointsEarned) > Number(form.pointsPossible)) return toast.error('Points earned cannot exceed points possible.');
    setLoading(true);
    try {
      const payload = { ...form, estimatedMinutes: Number(form.estimatedMinutes), pointsPossible: form.pointsPossible === '' ? null : Number(form.pointsPossible), pointsEarned: form.pointsEarned === '' ? null : Number(form.pointsEarned), uid: user.uid };
      const response = await fetch(`${baseUrl}/route/cr`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save assignment.');
      toast.success('Assignment added.'); navigate('/dash');
    } catch (error) { toast.error(error.message || 'Unable to connect to the server.'); }
    finally { setLoading(false); }
  }
  return <main className="page-enter mx-auto max-w-3xl px-4 py-10"><ToastContainer position="top-right" autoClose={4000} theme="colored" /><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Coursework tracker</p><h1 className="mb-2 mt-2 text-4xl font-black">Add an assignment</h1><p className="mb-6 opacity-65">Capture the brief, deadline, and what you need to submit.</p>
    <form onSubmit={submit} className="surface-card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
      <label className="form-control"><span className="label-text mb-2">Assignment title *</span><input name="title" required maxLength="120" className="field-control" placeholder="e.g. Research essay draft" value={form.title} onChange={update} /></label>
      <label className="form-control"><span className="label-text mb-2">Course / subject *</span><input name="subject" required maxLength="80" className="field-control" placeholder="e.g. Biology 101" value={form.subject} onChange={update} /></label>
      <label className="form-control"><span className="label-text mb-2">Assignment type</span><select name="type" className="field-control" value={form.type} onChange={update}>{TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
      <label className="form-control"><span className="label-text mb-2">Due date</span><input name="dueDate" type="date" className="field-control" value={form.dueDate} onChange={update} /></label>
      <label className="form-control"><span className="label-text mb-2">Status</span><select name="status" className="field-control" value={form.status} onChange={update}><option>Not started</option><option>In progress</option><option>Submitted</option><option>Graded</option></select></label>
      <label className="form-control"><span className="label-text mb-2">Priority</span><select name="priority" className="field-control" value={form.priority} onChange={update}><option>Low</option><option>Medium</option><option>High</option></select></label>
      <label className="form-control"><span className="label-text mb-2">Points possible (optional)</span><input name="pointsPossible" type="number" min="0" max="10000" className="field-control" placeholder="e.g. 50" value={form.pointsPossible} onChange={update} /></label>
      <label className="form-control"><span className="label-text mb-2">Points earned (optional)</span><input name="pointsEarned" type="number" min="0" max="10000" className="field-control" placeholder="Add after grading" value={form.pointsEarned} onChange={update} /></label>
      <label className="form-control"><span className="label-text mb-2">Estimated work time (minutes)</span><input name="estimatedMinutes" type="number" min="5" max="1440" className="field-control" value={form.estimatedMinutes} onChange={update} /></label>
      <label className="form-control sm:col-span-2"><span className="label-text mb-2">Instructions / notes</span><textarea name="notes" maxLength="1000" className="field-control min-h-32" placeholder="Requirements, links, or reminders for submission" value={form.notes} onChange={update} /></label>
      <div className="flex gap-3 sm:col-span-2"><button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save assignment'}</button><button className="btn btn-ghost" type="button" onClick={() => navigate('/dash')}>Cancel</button></div>
    </form>
  </main>;
};
export default Register;
