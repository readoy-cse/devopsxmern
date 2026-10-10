import React, { useEffect, useState } from 'react';

const DarkToggle = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('Themes') === 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'study-dark' : 'study-light');
    localStorage.setItem('Themes', dark ? 'dark' : 'light');
  }, [dark]);
  return <button type="button" className="btn btn-ghost btn-circle" onClick={() => setDark((value) => !value)} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} title={`Switch to ${dark ? 'light' : 'dark'} theme`}>
    <span aria-hidden="true" className="text-xl">{dark ? '?' : '?'}</span>
  </button>;
};
export default DarkToggle;
