import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleProvider, auth } from './firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function signIn(event) {
    event.preventDefault(); setLoading(true);
    try { const result = await signInWithEmailAndPassword(auth, event.target.email.value, event.target.password.value); localStorage.setItem('User', JSON.stringify(result.user)); navigate('/dash'); window.location.reload(); }
    catch (error) { toast.error(error.message || 'Could not sign in.'); setLoading(false); }
  }
  async function googleSignIn() {
    setLoading(true);
    try { const result = await signInWithPopup(auth, GoogleProvider); localStorage.setItem('User', JSON.stringify(result.user)); navigate('/dash'); window.location.reload(); }
    catch (error) { toast.error(error.message || 'Could not sign in with Google.'); setLoading(false); }
  }
  return <main className="page-enter grid min-h-[72vh] items-center gap-10 py-12 lg:grid-cols-2"><ToastContainer position="top-right" theme="colored" /><section className="mx-auto max-w-lg"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Welcome back</p><h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Keep your coursework on track.</h1><p className="mt-4 text-lg leading-relaxed opacity-65">Your assignments, deadlines, and grades are ready when you are.</p><div className="mt-8 rounded-2xl bg-primary/10 p-5"><p className="font-bold">Keep every deadline in view.</p><p className="mt-1 text-sm opacity-70">See what is due, update submissions, and record your grades.</p></div></section><section className="surface-card mx-auto w-full max-w-md p-6 sm:p-8"><h2 className="text-2xl font-black">Log in</h2><p className="mt-1 text-sm opacity-60">Use your account to open your planner.</p>{loading ? <div className="flex justify-center py-12"><HashLoader color="#167c75" /></div> : <><form onSubmit={signIn} className="mt-6 space-y-4"><label className="block text-sm font-semibold">Email<input required name="email" type="email" autoComplete="email" className="field-control mt-2" placeholder="you@example.com" /></label><label className="block text-sm font-semibold">Password<input required name="password" type="password" autoComplete="current-password" className="field-control mt-2" placeholder="Your password" /></label><button className="btn btn-primary w-full" type="submit">Log in</button></form><div className="divider text-xs opacity-50">OR</div><button onClick={googleSignIn} className="btn btn-outline w-full">Continue with Google</button><p className="mt-5 text-center text-sm opacity-70">New to Frienemie? <Link to="/sinup" className="font-bold text-primary">Create an account</Link></p></>}</section></main>;
};
export default Login;
