import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../utils/env';

const STATUSES = ['Not started', 'In progress', 'Submitted', 'Graded'];
const closed = (assignment) => ['Submitted', 'Graded'].includes(assignment.status || (assignment.completed ? 'Submitted' : 'Not started'));
const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const user = JSON.parse(localStorage.getItem('User') || '{}');
  const todayKey = new Date().toISOString().slice(0, 10);
  const focusKey = `frienemie-focus-${user.uid}-${todayKey}`;
  const [focusSessions, setFocusSessions] = useState(() => Number(localStorage.getItem(focusKey) || 0));

  async function getAssignments() {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/route/read/${user.uid}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not load your assignments.');
      setAssignments(Array.isArray(result) ? result : []);
    } catch (error) { toast.error(error.message || 'Unable to connect to the server.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { getAssignments(); }, []);
  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setSeconds((remaining) => {
      if (remaining <= 1) {
        window.clearInterval(timer); setRunning(false);
        setFocusSessions((current) => { const next = current + 1; localStorage.setItem(focusKey, String(next)); return next; });
        toast.success('Focus sprint complete. Take a short break!'); return 25 * 60;
      }
      return remaining - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [running, focusKey]);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekAhead = new Date(today); weekAhead.setDate(weekAhead.getDate() + 7);
  const subjects = [...new Set(assignments.map((item) => item.subject).filter(Boolean))].sort();
  const visibleAssignments = useMemo(() => assignments
    .filter((item) => `${item.title} ${item.subject} ${item.type || ''} ${item.notes || ''}`.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => {
      const dueDate = item.dueDate ? new Date(`${item.dueDate.slice(0, 10)}T00:00:00`) : null;
      if (statusFilter === 'all') return true;
      if (statusFilter === 'week') return !closed(item) && dueDate && dueDate >= today && dueDate <= weekAhead;
      if (statusFilter === 'overdue') return !closed(item) && dueDate && dueDate < today;
      if (statusFilter === 'unplanned') return !dueDate;
      return (item.status || (item.completed ? 'Submitted' : 'Not started')) === statusFilter;
    })
    .filter((item) => subjectFilter === 'all' || item.subject === subjectFilter)
    .sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31')),
  [assignments, search, statusFilter, subjectFilter, today, weekAhead]);
  const submitted = assignments.filter(closed).length;
  const overdue = assignments.filter((item) => !closed(item) && item.dueDate && new Date(`${item.dueDate.slice(0, 10)}T00:00:00`) < today).length;
  const dueSoon = assignments.filter((item) => !closed(item) && item.dueDate && new Date(`${item.dueDate.slice(0, 10)}T00:00:00`) >= today && new Date(`${item.dueDate.slice(0, 10)}T00:00:00`) <= weekAhead).length;
  const graded = assignments.filter((item) => item.status === 'Graded' && item.pointsEarned !== null && item.pointsEarned !== undefined && item.pointsEarned !== '' && Number.isFinite(Number(item.pointsEarned)) && Number(item.pointsPossible) > 0);
  const gradeAverage = graded.length ? Math.round(graded.reduce((sum, item) => sum + Number(item.pointsEarned) / Number(item.pointsPossible) * 100, 0) / graded.length) : null;
  const progress = assignments.length ? Math.round(submitted / assignments.length * 100) : 0;

  async function updateAssignment(item, changes) {
    try {
      const response = await fetch(`${baseUrl}/route/get/up/${item._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(changes) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Could not update assignment.');
      setAssignments((current) => current.map((assignment) => assignment._id === item._id ? result : assignment));
    } catch (error) { toast.error(error.message); }
  }
  async function deleteAssignment(id) {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      const response = await fetch(`${baseUrl}/route/del/${id}`, { method: 'DELETE' }); const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not delete assignment.');
      setAssignments((current) => current.filter((item) => item._id !== id)); toast.success('Assignment deleted.');
    } catch (error) { toast.error(error.message); }
  }
  const resetTimer = () => { setRunning(false); setSeconds(25 * 60); };
  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return <main className="page-enter py-8 md:py-12">
    <ToastContainer position="top-right" autoClose={3500} theme="colored" />
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Coursework overview</p><h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">Stay ahead of deadlines.</h1><p className="mt-3 opacity-65">See what is due, track submissions, and keep every course moving.</p></div><Link to="/reg" className="btn btn-primary shadow-md">+ Add assignment</Link></header>
    <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article className="surface-card p-5"><p className="text-sm font-semibold opacity-60">Submitted or graded</p><p className="mt-2 text-3xl font-black">{submitted}<span className="text-base font-semibold opacity-45"> / {assignments.length}</span></p><progress className="progress progress-primary mt-3 w-full" value={progress} max="100" /></article>
      <article className="surface-card p-5"><p className="text-sm font-semibold opacity-60">Overdue</p><p className="mt-2 text-3xl font-black">{overdue}</p><p className="mt-1 text-xs opacity-50">Needs your attention</p></article>
      <article className="surface-card p-5"><p className="text-sm font-semibold opacity-60">Due this week</p><p className="mt-2 text-3xl font-black">{dueSoon}</p><p className="mt-1 text-xs opacity-50">Upcoming submissions</p></article>
      <article className="surface-card p-5"><p className="text-sm font-semibold opacity-60">Grade average</p><p className="mt-2 text-3xl font-black">{gradeAverage === null ? '�' : `${gradeAverage}%`}</p><p className="mt-1 text-xs opacity-50">Across graded assignments</p></article>
    </section>
    <section className="mb-8 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
      <div className="surface-card flex flex-col justify-between gap-4 overflow-hidden p-6 sm:flex-row sm:items-center"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-primary">Your momentum</p><h2 className="mt-2 text-2xl font-black">{progress === 100 && assignments.length ? 'Everything is submitted!' : progress > 0 ? 'You are moving forward.' : 'Start with the next deadline.'}</h2><p className="mt-2 max-w-lg text-sm leading-relaxed opacity-65">{assignments.length ? `${submitted} of ${assignments.length} assignments submitted or graded.` : 'Add your first assignment with its course and due date to build your tracker.'}</p></div><div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border-[7px] border-primary/20 text-2xl font-black text-primary" style={{ background: `conic-gradient(hsl(var(--p)) ${progress}%, hsl(var(--b3)) ${progress}% 100%)` }}><span className="grid h-[4.1rem] w-[4.1rem] place-items-center rounded-full bg-base-100">{progress}%</span></div></div>
      <div className="surface-card flex items-center justify-between gap-4 bg-primary p-5 text-primary-content"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] opacity-75">Focus sprint</p><p className="mt-1 text-4xl font-black tabular-nums">{formattedTime}</p><p className="mt-1 text-xs opacity-75">25 min focus � take a short break after</p><p className="mt-2 text-xs font-bold">{focusSessions} completed today</p></div><div className="flex flex-col gap-2"><button className="btn btn-sm border-0 bg-white/20 text-primary-content hover:bg-white/30" onClick={() => setRunning((value) => !value)}>{running ? 'Pause' : 'Start'}</button><button className="btn btn-ghost btn-xs text-primary-content" onClick={resetTimer}>Reset</button></div></div>
    </section>
    <section>
      <div className="mb-4 flex flex-col gap-3 md:flex-row"><label className="relative flex-1"><span className="sr-only">Search assignments</span><span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">?</span><input className="field-control pl-11" placeholder="Search assignments or courses..." value={search} onChange={(event) => setSearch(event.target.value)} /></label><select className="field-control md:w-52" aria-label="Filter assignments" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All assignments</option><option value="Not started">Not started</option><option value="In progress">In progress</option><option value="Submitted">Submitted</option><option value="Graded">Graded</option><option value="overdue">Overdue</option><option value="week">Due this week</option><option value="unplanned">No deadline</option></select><select className="field-control md:w-48" aria-label="Filter by course" value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}><option value="all">All courses</option>{subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}</select></div>
      {loading ? <div className="flex justify-center py-20"><HashLoader color="#167c75" /></div> : visibleAssignments.length ? <div className="grid gap-4 md:grid-cols-2">{visibleAssignments.map((item) => {
        const due = item.dueDate ? new Date(`${item.dueDate.slice(0, 10)}T00:00:00`) : null;
        const isOverdue = !closed(item) && due && due < today;
        const status = item.status || (item.completed ? 'Submitted' : 'Not started');
        return <article key={item._id} className="surface-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="badge badge-outline font-semibold">{item.subject}</span><span className="badge badge-ghost">{item.type || 'Homework'}</span><span className={`badge ${item.priority === 'High' ? 'badge-error' : item.priority === 'Medium' ? 'badge-warning' : 'badge-ghost'}`}>{item.priority}</span></div><h2 className="mt-3 text-xl font-extrabold">{item.title}</h2></div><select aria-label={`Update ${item.title} status`} className="select select-bordered select-sm max-w-36" value={status} onChange={(event) => updateAssignment(item, { status: event.target.value })}>{STATUSES.map((value) => <option key={value}>{value}</option>)}</select></div>{item.notes && <p className="mt-2 line-clamp-2 text-sm leading-relaxed opacity-65">{item.notes}</p>}<div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm"><span className={`font-semibold ${isOverdue ? 'text-error' : 'opacity-65'}`}>{due ? `${isOverdue ? 'Overdue � ' : 'Due � '}${due.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}` : 'No deadline'}</span>{item.status === 'Graded' && item.pointsPossible ? <span className="font-bold text-primary">Grade: {item.pointsEarned ?? '�'} / {item.pointsPossible}</span> : <span className="text-xs opacity-50">{item.estimatedMinutes || 0} min planned</span>}</div><div className="mt-4 flex justify-end gap-1 border-t border-base-300/70 pt-3"><Link className="btn btn-ghost btn-sm" to={`/dash/view/${item._id}`}>Details</Link><Link className="btn btn-ghost btn-sm" to={`/dash/${item._id}`}>Edit</Link><button className="btn btn-ghost btn-sm text-error" onClick={() => deleteAssignment(item._id)}>Delete</button></div></article>;
      })}</div> : <div className="surface-card border-dashed py-16 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-2xl text-primary">?</div><h2 className="mt-4 text-xl font-black">{assignments.length ? 'No assignments in this view' : 'Your tracker starts here'}</h2><p className="mx-auto mt-2 max-w-sm text-sm opacity-65">{assignments.length ? 'Try another filter, or add an assignment.' : 'Add an assignment, choose its course and due date, then track it through submission and grading.'}</p>{!assignments.length && <Link to="/reg" className="btn btn-primary mt-5">Add your first assignment</Link>}</div>}
    </section>
  </main>;
};
export default Dashboard;
