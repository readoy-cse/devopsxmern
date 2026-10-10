import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => <footer className="app-footer mt-16 bg-base-100"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm opacity-70 sm:flex-row sm:items-center sm:justify-between md:px-8"><Link to="/" className="flex items-center gap-2 font-extrabold text-base-content"><span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-content">f.</span>frienemie</Link><p>A clearer way to stay on top of coursework.</p><Link className="font-semibold text-primary hover:underline" to="/about/members">Help & support</Link></div></footer>;
export default Footer;
