import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth, GoogleProvider } from './firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';
import { logInfo, logWarn } from '../../utils/logger';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function finishSignup(user, method) {
    logInfo('auth.signup.succeeded', { method });
    localStorage.setItem('User', JSON.stringify(user));
    navigate('/dash');
    window.location.reload();
  }

  async function createAccount(event) {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const name = form.fullname.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    if (password !== form.cpas.value) {
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await finishSignup(result.user, 'password');
    } catch (error) {
      logWarn('auth.signup.failed', error, { method: 'password' });
      toast.error(error.message || 'Could not create your account.');
      setLoading(false);
    }
  }

  async function googleSignup() {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, GoogleProvider);
      await finishSignup(result.user, 'google');
    } catch (error) {
      logWarn('auth.signup.failed', error, { method: 'google' });
      toast.error(error.message || 'Could not sign up with Google.');
      setLoading(false);
    }
  }

  return <main className="page-enter flex min-h-[72vh] items-center justify-center py-10 sm:py-14">
    <ToastContainer position="top-right" theme="colored" />
    <div className="w-full max-w-[460px]">
      <header className="mb-6 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary text-lg font-black text-primary-content shadow-lg">f.</span>
        <p className="mt-5 text-xs font-extrabold uppercase tracking-[.2em] text-primary">Get organized</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Create your account</h1>
        <p className="mt-2 text-sm opacity-65">Track coursework from first draft to final grade.</p>
      </header>
      <section className="surface-card p-6 sm:p-9">
        {loading ? <div className="flex justify-center py-12"><HashLoader color="#174c43" /></div> : <>
          <form onSubmit={createAccount} className="space-y-4">
            <label className="block text-sm font-bold">Your name<input required name="fullname" maxLength="80" autoComplete="name" className="field-control mt-2" placeholder="Full name" /></label>
            <label className="block text-sm font-bold">Email address<input required name="email" type="email" autoComplete="email" className="field-control mt-2" placeholder="you@example.com" /></label>
            <label className="block text-sm font-bold">Password<input required name="password" type="password" minLength="6" autoComplete="new-password" className="field-control mt-2" placeholder="At least 6 characters" /></label>
            <label className="block text-sm font-bold">Confirm password<input required name="cpas" type="password" minLength="6" autoComplete="new-password" className="field-control mt-2" placeholder="Enter it again" /></label>
            <button className="btn btn-primary w-full shadow-md" type="submit">Create account</button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest opacity-40"><span className="h-px flex-1 bg-current" />or<span className="h-px flex-1 bg-current" /></div>
          <button onClick={googleSignup} className="btn btn-outline w-full">Continue with Google</button>
          <p className="mt-6 text-center text-sm opacity-70">Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Log in</Link></p>
        </>}
      </section>
      <p className="mt-5 text-center text-xs opacity-45">Simple assignment tracking for a less stressful semester.</p>
    </div>
  </main>;
};

export default Signup;
