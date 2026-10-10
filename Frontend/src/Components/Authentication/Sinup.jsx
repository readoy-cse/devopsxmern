import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth, GoogleProvider } from './firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  async function createAccount(event) {
    event.preventDefault(); setLoading(true);
    const form = event.currentTarget;
    const name = form.fullname.value.trim(); const email = form.email.value.trim(); const password = form.password.value;
    if (password !== form.cpas.value) { toast.error('Passwords do not match.'); setLoading(false); return; }
    try { const result = await createUserWithEmailAndPassword(auth, email, password); await updateProfile(result.user, { displayName: name }); localStorage.setItem('User', JSON.stringify(result.user)); navigate('/dash'); window.location.reload(); }
    catch (error) { toast.error(error.message || 'Could not create your account.'); setLoading(false); }
  }
  async function googleSignup() {
    setLoading(true);
    try { const result = await signInWithPopup(auth, GoogleProvider); localStorage.setItem('User', JSON.stringify(result.user)); navigate('/dash'); window.location.reload(); }
    catch (error) { toast.error(error.message || 'Could not sign up with Google.'); setLoading(false); }
  }
  return <main className="page-enter grid min-h-[72vh] items-center gap-10 py-12 lg:grid-cols-2"><ToastContainer position="top-right" theme="colored" /><section className="mx-auto max-w-lg"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">A fresh start</p><h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Get your coursework organized.</h1><p className="mt-4 text-lg leading-relaxed opacity-65">Track assignments by course and deadline, then follow each one through submission and grading.</p><div className="mt-8 grid gap-3 sm:grid-cols-3">{['Track by course', 'Manage deadlines', 'Record grades'].map((item, index) => <div key={item} className="rounded-2xl bg-base-200 p-4"><span className="text-xs font-black text-primary">0{index + 1}</span><p className="mt-2 text-sm font-bold">{item}</p></div>)}</div></section><section className="surface-card mx-auto w-full max-w-md p-6 sm:p-8"><h2 className="text-2xl font-black">Create account</h2><p className="mt-1 text-sm opacity-60">Track every assignment from brief to grade.</p>{loading ? <div className="flex justify-center py-12"><HashLoader color="#167c75" /></div> : <><form onSubmit={createAccount} className="mt-6 space-y-4"><label className="block text-sm font-semibold">Your name<input required name="fullname" maxLength="80" autoComplete="name" className="field-control mt-2" placeholder="Full name" /></label><label className="block text-sm font-semibold">Email<input required name="email" type="email" autoComplete="email" className="field-control mt-2" placeholder="you@example.com" /></label><label className="block text-sm font-semibold">Password<input required name="password" type="password" minLength="6" autoComplete="new-password" className="field-control mt-2" placeholder="At least 6 characters" /></label><label className="block text-sm font-semibold">Confirm password<input required name="cpas" type="password" minLength="6" autoComplete="new-password" className="field-control mt-2" placeholder="Enter it again" /></label><button className="btn btn-primary w-full" type="submit">Create my account</button></form><div className="divider text-xs opacity-50">OR</div><button onClick={googleSignup} className="btn btn-outline w-full">Continue with Google</button><p className="mt-5 text-center text-sm opacity-70">Already have an account? <Link to="/login" className="font-bold text-primary">Log in</Link></p></>}</section></main>;
};
export default Signup;


