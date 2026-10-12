import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleProvider, auth } from './firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';
import { logInfo, logWarn } from '../../utils/logger';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function finishSignIn(user, method) {
    logInfo('auth.login.succeeded', { method });
    localStorage.setItem('User', JSON.stringify(user));
    navigate('/dash');
    window.location.reload();
  }

  async function signIn(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, event.target.email.value, event.target.password.value);
      await finishSignIn(result.user, 'password');
    } catch (error) {
      logWarn('auth.login.failed', error, { method: 'password' });
      toast.error(error.message || 'Could not sign in.');
      setLoading(false);
    }
  }

  async function googleSignIn() {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, GoogleProvider);
      await finishSignIn(result.user, 'google');
    } catch (error) {
      logWarn('auth.login.failed', error, { method: 'google' });
      toast.error(error.message || 'Could not sign in with Google.');
      setLoading(false);
    }
  }

  return <main className="page-enter flex min-h-[72vh] items-center justify-center py-10 sm:py-14">
    <ToastContainer position="top-right" theme="colored" />
    <div className="w-full max-w-[460px]">
      <header className="mb-6 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary text-lg font-black text-primary-content shadow-lg">f.</span>
        <p className="mt-5 text-xs font-extrabold uppercase tracking-[.2em] text-primary">Student workspace</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Welcome back</h1>
        <p className="mt-2 text-sm opacity-65">Log in to see your assignments and due dates.</p>
      </header>
      <section className="surface-card p-6 sm:p-9">
        {loading ? <div className="flex justify-center py-12"><HashLoader color="#174c43" /></div> : <>
          <form onSubmit={signIn} className="space-y-5">
            <label className="block text-sm font-bold">Email address<input required name="email" type="email" autoComplete="email" className="field-control mt-2" placeholder="you@example.com" /></label>
            <label className="block text-sm font-bold">Password<input required name="password" type="password" autoComplete="current-password" className="field-control mt-2" placeholder="Enter your password" /></label>
            <button className="btn btn-primary mt-1 w-full shadow-md" type="submit">Log in</button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest opacity-40"><span className="h-px flex-1 bg-current" />or<span className="h-px flex-1 bg-current" /></div>
          <button onClick={googleSignIn} className="btn btn-outline w-full">Continue with Google</button>
          <p className="mt-6 text-center text-sm opacity-70">New to Frienemie? <Link to="/sinup" className="font-bold text-primary hover:underline">Create an account</Link></p>
        </>}
      </section>
      <p className="mt-5 text-center text-xs opacity-45">Your coursework, deadlines, and grades in one place.</p>
    </div>
  </main>;
};

export default Login;
