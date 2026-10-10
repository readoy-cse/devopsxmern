import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Components/Authentication/Login';
import PrivateRoute from './Components/Authentication/PrivateRoute';
import Sinup from './Components/Authentication/Sinup';
import UserProfile from './Components/Authentication/UserProfile';
import Dashboard from './Components/Dashboard/Dashboard';
import Register from './Components/Dashboard/Register';
import Update from './Components/Dashboard/Update';
import ViewAssignment from './Components/Dashboard/ViewAssignment';
import About from './Components/Pages/About';
import Home from './Components/Pages/Home';
import Error from './Components/Pages/Error';
import Footer from './Components/Shared/Footer';
import Navbar from './Components/Shared/Navbar';
import './index.css';
import TeamMembers from './Components/Pages/TeamMembers';
import ScrollTop from './Components/Shared/ScrollTop';

const App = () => {
  const User = localStorage.getItem('User');
  return <div className="app-shell"><ScrollTop /><Navbar /><div className="app-main page-enter"><Routes>
    <Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/about/members" element={<TeamMembers />} />
    {!User && <><Route path="/sinup" element={<Sinup />} /><Route path="/login" element={<Login />} /></>}
    <Route path="/*" element={<PrivateRoute />}><Route path="dash" element={<Dashboard />} /><Route path="dash/:id" element={<Update />} /><Route path="dash/view/:id" element={<ViewAssignment />} /><Route path="reg" element={<Register />} /><Route path="user" element={<UserProfile />} /><Route path="*" element={<Error />} /></Route>
  </Routes></div><Footer /></div>;
};
export default App;
