import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../Authentication/firebaseConfig';
import DarkToggle from './DarkToggle';
import { logInfo, logWarn } from '../../utils/logger';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('User') || 'null');
  async function signout() {
    let firebaseSignOut = 'succeeded';
    try { await signOut(auth); } catch (error) { firebaseSignOut = 'failed'; logWarn('auth.signout.failed', error); }
    localStorage.removeItem('User');
    logInfo('auth.signout.completed', { firebaseSignOut });
    navigate('/login');
    window.location.reload();
  }
  const linkClass = ({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-base-200 ${isActive ? 'bg-primary/10 text-primary' : 'opacity-75'}`;
  return <header className="sticky top-0 z-30 border-b border-base-300/70 bg-base-100/90 backdrop-blur-xl">
    <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 md:px-8">
      <Link to="/" className="flex items-center gap-3" aria-label="Frienemie home"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-lg font-black text-primary-content shadow-sm">f.</span><span><span className="block text-lg font-extrabold leading-none tracking-tight">frienemie</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-[.18em] opacity-50">study, gently</span></span></Link>
      <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation"><NavLink to="/" className={linkClass}>Home</NavLink><NavLink to="/about" className={linkClass}>About</NavLink>{user && <><NavLink to="/dash" className={linkClass}>Assignments</NavLink><NavLink to="/reg" className={linkClass}>Add assignment</NavLink></>}</nav>
      <div className="flex items-center gap-2"><DarkToggle />{user ? <div className="dropdown dropdown-end"><button tabIndex={0} className="btn btn-ghost btn-circle avatar" aria-label="Open account menu"><div className="w-9 rounded-full bg-base-300">{user.photoURL ? <img src={user.photoURL} alt="" /> : <span className="grid h-full place-items-center font-bold">{(user.displayName || user.email || 'S').charAt(0).toUpperCase()}</span>}</div></button><ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-52 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl"><li><Link to="/user">My profile</Link></li><li><button onClick={signout}>Sign out</button></li></ul></div> : <><Link to="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">Log in</Link><Link to="/sinup" className="btn btn-primary btn-sm">Get started</Link></>}</div>
    </div>
    {user && <nav className="flex justify-center gap-2 border-t border-base-300/60 px-3 py-2 md:hidden" aria-label="Mobile navigation"><NavLink to="/dash" className={linkClass}>Assignments</NavLink><NavLink to="/reg" className={linkClass}>Add assignment</NavLink><NavLink to="/user" className={linkClass}>Profile</NavLink></nav>}
  </header>;
};
export default Navbar;
