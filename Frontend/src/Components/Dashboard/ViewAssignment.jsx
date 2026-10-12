import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../utils/env';
import { apiFetch } from '../../utils/logger';

const ViewAssignment = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  useEffect(() => {
    apiFetch(`${baseUrl}/route/get/${id}`, undefined, 'assignments.read').then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not load assignment.'); setAssignment(data); }).catch((error) => toast.error(error.message));
  }, [id]);
  const status = assignment?.status || (assignment?.completed ? 'Submitted' : 'Not started');
  const grade = assignment?.pointsEarned !== null && assignment?.pointsEarned !== undefined && assignment?.pointsPossible > 0 ? `${assignment.pointsEarned} / ${assignment.pointsPossible} (${Math.round(assignment.pointsEarned / assignment.pointsPossible * 100)}%)` : 'Not graded';
  return <main className="page-enter mx-auto max-w-3xl px-4 py-10"><ToastContainer position="top-right" theme="colored" />{!assignment ? <p className="surface-card py-12 text-center">Loading assignment...</p> : <article className="surface-card p-6 sm:p-8"><Link to="/dash" className="link link-primary">Back to assignments</Link><div className="mt-8 flex flex-wrap gap-2"><span className="badge badge-outline">{assignment.subject}</span><span className="badge badge-ghost">{assignment.type || 'Homework'}</span><span className={`badge ${status === 'Graded' ? 'badge-success' : status === 'Submitted' ? 'badge-info' : status === 'In progress' ? 'badge-warning' : 'badge-ghost'}`}>{status}</span><span className={`badge ${assignment.priority === 'High' ? 'badge-error' : assignment.priority === 'Medium' ? 'badge-warning' : 'badge-ghost'}`}>{assignment.priority} priority</span></div><h1 className="mt-4 text-4xl font-black">{assignment.title}</h1><div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="rounded-xl bg-base-200 p-4"><p className="text-sm opacity-60">Due date</p><p className="mt-1 font-semibold">{assignment.dueDate ? new Date(`${assignment.dueDate.slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'No deadline'}</p></div><div className="rounded-xl bg-base-200 p-4"><p className="text-sm opacity-60">Grade</p><p className="mt-1 font-semibold">{grade}</p></div><div className="rounded-xl bg-base-200 p-4"><p className="text-sm opacity-60">Planned work</p><p className="mt-1 font-semibold">{assignment.estimatedMinutes || 0} minutes</p></div></div>{assignment.notes && <section className="mt-6"><h2 className="font-bold">Instructions and notes</h2><p className="mt-2 whitespace-pre-wrap leading-relaxed opacity-80">{assignment.notes}</p></section>}<Link to={`/dash/${assignment._id}`} className="btn btn-primary mt-8">Edit assignment</Link></article>}</main>;
};
export default ViewAssignment;

