import React from 'react';
import { Link } from 'react-router-dom';

const About = () => <main className="mx-auto max-w-5xl px-5 py-12">
  <section className="rounded-3xl bg-base-200 px-6 py-14 text-center md:px-16"><p className="font-semibold uppercase tracking-[0.2em] text-primary">About Frienemie</p><h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold md:text-5xl">A clearer view of your coursework.</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed opacity-75">Frienemie is an assignment tracker that helps students organize coursework by class, type, due date, and submission status. Add notes for instructions, track work through grading, and keep marks in one place.</p><Link to="/reg" className="btn btn-primary mt-8">Add an assignment</Link></section>
  <section className="mx-auto max-w-3xl py-12"><h2 className="text-2xl font-bold">From brief to grade</h2><ol className="mt-5 space-y-4">{['Add the assignment, course, type, and due date.', 'Update its status as you work and submit it.', 'Record the grade to keep your course progress visible.'].map((step, index) => <li key={step} className="flex items-start gap-4 rounded-xl border border-base-300 bg-base-100 p-4"><span className="font-bold text-primary">0{index + 1}</span><span>{step}</span></li>)}</ol></section>
  <section className="border-t border-base-300 pt-8 text-center"><h2 className="text-2xl font-bold">Need help?</h2><p className="mt-2 opacity-70">Contact our team if you need a hand with your tracker.</p><Link to="/about/members" className="btn btn-outline mt-4">Visit support</Link></section>
</main>;
export default About;
