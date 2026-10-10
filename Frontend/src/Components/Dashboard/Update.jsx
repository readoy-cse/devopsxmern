import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../utils/env';

const TYPES = ['Homework', 'Essay', 'Project', 'Quiz', 'Exam', 'Lab', 'Other'];
const STATUSES = ['Not started', 'In progress', 'Submitted', 'Graded'];
const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', subject: '', type: 'Homework', dueDate: '', priority: 'Medium', status: 'Not started', pointsPossible: '', pointsEarned: '', estimatedMinutes: 30, notes: '' });
  useEffect(() => {
    fetch(`${baseUrl}/route/get/${id}`).then(async (response) => {
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not load assignment.');
      setForm({ ...data, type: data.type || 'Homework', status: data.status || (data.completed ? 'Submitted' : 'Not started'), dueDate: data.dueDate ? data.dueDate.slice(0, 10) : '', pointsPossible: data.pointsPossible ?? '', pointsEarned: data.pointsEarned ?? '', estimatedMinutes: data.estimatedMinutes || 30 });
    }).catch((error) => toast.error(error.message)).finally(() => setLoading(false));
  }, [id]);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  async function submit(event) {
    event.preventDefault();
    if (form.pointsEarned !== '' && form.pointsPossible !== '' && Number(form.pointsEarned) > Number(form.pointsPossible)) return toast.error('Points earned cannot exceed points possible.');
    setLoading(true);
    try {
      const payload = { ...form, estimatedMinutes: Number(form.estimatedMinutes), pointsPossible: form.pointsPossible === '' ? null : Number(form.pointsPossible), pointsEarned: form.pointsEarned === '' ? null : Number(form.pointsEarned) };
      const response = await fetch(`${baseUrl}/route/get/up/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not update assignment.');
      toast.success('Assignment updated.'); navigate('/dash');
    } catch (error) { toast.error(error.message); setLoading(false); }
  }
  return <main className="page-enter mx-auto max-w-3xl px-4 py-10"><ToastContainer position="top-right" theme="colored" /><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Keep your tracker current</p><h1 className="mb-2 mt-2 text-4xl font-black">Edit assignment</h1><p className="mb-6 opacity-65">Update its status, deadline, or grade.</p>{loading ? <p className="surface-card py-12 text-center">Loading assignment...</p> : <form onSubmit={submit} className="surface-card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
    <label className="form-control"><span className="label-text mb-2">Assignment title *</span><input name="title" required className="field-control" value={form.title} onChange={update} /></label>
    <label className="form-control"><span className="label-text mb-2">Course / subject *</span><input name="subject" required className="field-control" value={form.subject} onChange={update} /></label>
    <label className="form-control"><span className="label-text mb-2">Assignment type</span><select name="type" className="field-control" value={form.type} onChange={update}>{TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
    <label className="form-control"><span className="label-text mb-2">Due date</span><input name="dueDate" type="date" className="field-control" value={form.dueDate} onChange={update} /></label>
    <label className="form-control"><span className="label-text mb-2">Status</span><select name="status" className="field-control" value={form.status} onChange={update}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
    <label className="form-control"><span className="label-text mb-2">Priority</span><select name="priority" className="field-control" value={form.priority} onChange={update}><option>Low</option><option>Medium</option><option>High</option></select></label>
    <label className="form-control"><span className="label-text mb-2">Points possible</span><input name="pointsPossible" type="number" min="0" max="10000" className="field-control" value={form.pointsPossible} onChange={update} /></label>
    <label className="form-control"><span className="label-text mb-2">Points earned</span><input name="pointsEarned" type="number" min="0" max="10000" className="field-control" value={form.pointsEarned} onChange={update} /></label>
    <label className="form-control"><span className="label-text mb-2">Estimated work time (minutes)</span><input name="estimatedMinutes" type="number" min="5" max="1440" className="field-control" value={form.estimatedMinutes} onChange={update} /></label>
    <label className="form-control sm:col-span-2"><span className="label-text mb-2">Instructions / notes</span><textarea name="notes" className="field-control min-h-32" value={form.notes || ''} onChange={update} /></label>
    <div className="flex gap-3 sm:col-span-2"><button className="btn btn-primary" type="submit">Save changes</button><button className="btn btn-ghost" type="button" onClick={() => navigate('/dash')}>Cancel</button></div>
  </form>}</main>;
};
export default Update;
