import React from 'react';
import { Link } from 'react-router-dom';
const Error = () => <main className="page-enter grid min-h-[55vh] place-content-center px-4 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-3xl text-primary">?</span><p className="mt-6 text-xs font-extrabold uppercase tracking-[.2em] text-primary">Page not found</p><h1 className="mt-2 text-4xl font-black">This page wandered off.</h1><p className="mt-3 opacity-65">Let us get you back to your assignments.</p><Link to="/" className="btn btn-primary mx-auto mt-6">Go to home</Link></main>;
export default Error;
