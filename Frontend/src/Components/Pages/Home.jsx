import React from 'react';
import { Link } from 'react-router-dom';
import Img from '../../assets/Img/Home.png';

const Home = () => {
  return (
    <main className="bg-base-200">
      <section className="hero min-h-[70vh] px-5 py-12 lg:py-20">
        <div className="hero-content max-w-6xl flex-col gap-10 lg:flex-row-reverse">
          <img
            className="w-full max-w-xl rounded-2xl object-cover shadow-xl"
            src={Img}
            alt="A welcoming illustration for your personal contact list"
          />
          <div className="max-w-xl">
            <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-primary">Your people, close at hand</p>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">Remember the people who make life better.</h1>
            <p className="py-6 text-lg leading-relaxed opacity-80">
              Frienemie is your private space to keep the names, email addresses, phone numbers, and photos of the people you care about. Find a detail when you need it, and spend less time searching through scattered notes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/dash" className="btn btn-primary">Open my contacts</Link>
              <Link to="/about" className="btn btn-ghost">See how it works</Link>
            </div>
            <p className="mt-5 text-sm opacity-60">Sign in to keep your contact list connected to your account.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-12 md:grid-cols-3">
        {[
          ['Keep details together', 'Names, email addresses, phone numbers, and photos live in one easy-to-find list.'],
          ['Make it yours', 'Add a contact when you meet someone new, then update their details as life changes.'],
          ['Find your way back', 'Open a contact to review their information, or edit and remove entries you no longer need.'],
        ].map(([title, description], index) => (
          <article key={title} className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">0{index + 1}</span>
            <h2 className="mb-2 text-xl font-bold">{title}</h2>
            <p className="leading-relaxed opacity-70">{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Home;
