import React from 'react';
import { Link } from 'react-router-dom';
import Img from '../../assets/Img/Home.png';

const Home = () => <main className="bg-base-200">
  <section className="hero min-h-[70vh] px-5 py-12 lg:py-20"><div className="hero-content max-w-6xl flex-col gap-10 lg:flex-row-reverse">
    <img className="w-full max-w-xl rounded-2xl object-cover shadow-xl" src={Img} alt="A clear view of your coursework and upcoming deadlines" />
    <div className="max-w-xl"><p className="mb-4 font-semibold uppercase tracking-[0.2em] text-primary">Coursework, under control</p><h1 className="text-4xl font-bold leading-tight md:text-6xl">Never lose track of a deadline.</h1>
      <p className="py-6 text-lg leading-relaxed opacity-80">Frienemie keeps assignments, due dates, submission progress, and grades together. See what needs attention, what you have turned in, and how each course is going.</p>
      <div className="flex flex-wrap gap-3"><Link to="/dash" className="btn btn-primary">Open my tracker</Link><Link to="/about" className="btn btn-ghost">How it works</Link></div>
      <p className="mt-5 text-sm opacity-60">Sign in to keep your coursework connected to your account.</p>
    </div>
  </div></section>
  <section className="mx-auto grid max-w-6xl gap-5 px-5 py-12 md:grid-cols-3">{[
    ['Know what is due', 'Sort coursework by course, assignment type, status, or upcoming deadline.'],
    ['Track each hand-in', 'Move work from not started to in progress, submitted, and graded.'],
    ['Keep grades visible', 'Record points earned and possible to see your average across graded work.'],
  ].map(([title, description], index) => <article key={title} className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm"><span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">0{index + 1}</span><h2 className="mb-2 text-xl font-bold">{title}</h2><p className="leading-relaxed opacity-70">{description}</p></article>)}</section>
</main>;
export default Home;
