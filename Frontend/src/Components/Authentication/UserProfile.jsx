import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import { logError, logInfo } from '../../utils/logger';

const UserProfile = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('User') || 'null'));
  const [name, setName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  async function saveProfile(event) {
    event.preventDefault(); if (!auth.currentUser) return toast.error('Please sign in again.');
    setSaving(true);
    try { await updateProfile(auth.currentUser, { displayName: name.trim() }); const updated = { uid: auth.currentUser.uid, displayName: name.trim(), email: auth.currentUser.email, photoURL: auth.currentUser.photoURL }; setUser(updated); localStorage.setItem('User', JSON.stringify(updated)); logInfo('profile.update.succeeded'); toast.success('Profile updated.'); }
    catch (error) { logError('profile.update.failed', error); toast.error(error.message || 'Could not update your profile.'); }
    finally { setSaving(false); }
  }
  if (!user) return <main className="py-20 text-center">Please sign in to view your profile.</main>;
  return <main className="page-enter mx-auto max-w-3xl py-12"><ToastContainer position="top-right" theme="colored" /><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Your account</p><h1 className="mt-2 text-4xl font-black">Profile settings</h1><section className="surface-card mt-8 grid gap-8 p-6 sm:grid-cols-[180px_1fr] sm:p-8"><div className="flex flex-col items-center"><div className="grid h-36 w-36 place-items-center overflow-hidden rounded-full bg-primary/10 text-5xl font-black text-primary">{user.photoURL ? <img className="h-full w-full object-cover" src={user.photoURL} alt="Profile" /> : (user.displayName || user.email || 'S').charAt(0).toUpperCase()}</div><p className="mt-3 text-xs opacity-50">Study account</p></div><div><h2 className="text-xl font-extrabold">Personal details</h2><form onSubmit={saveProfile} className="mt-5 space-y-4"><label className="block text-sm font-semibold">Display name<input className="field-control mt-2" value={name} onChange={(event) => setName(event.target.value)} maxLength="80" /></label><label className="block text-sm font-semibold">Email address<div className="field-control mt-2 opacity-60">{user.email}</div></label><button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button></form></div></section></main>;
};
export default UserProfile;
