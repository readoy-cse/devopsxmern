import React from 'react';
import { Link } from 'react-router-dom';

const TeamMembers = () => <main className="page-enter mx-auto max-w-5xl py-12"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">We can help</p><h1 className="mt-2 text-4xl font-black">Support</h1><p className="mt-4 max-w-2xl leading-relaxed opacity-70">Need a hand with your assignment tracker or account? Reach out to the Frienemie team and include a short description of what you were trying to do.</p><div className="surface-card mt-8 p-6 sm:p-8"><h2 className="text-xl font-extrabold">Contact the team</h2><p className="mt-2 opacity-70">Email support for help with coursework and assignments, account access, or reporting a problem.</p><a href="mailto:sakibtalukqder07@gmail.com?subject=Frienemie%20study%20tracker%20support" className="btn btn-primary mt-5">Email support</a></div><Link to="/dash" className="btn btn-ghost mt-5">Back to tracker</Link></main>;
export default TeamMembers;
