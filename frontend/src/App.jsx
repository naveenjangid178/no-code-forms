import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateForm from './pages/CreateForm';
import EditForm from './pages/EditForm';
import ViewForm from './pages/ViewForm';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AllForms from './pages/AllForms';
import SubmitForm from './pages/SubmitForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/create-form" element={<CreateForm />} />
        <Route path="/all-forms" element={<AllForms />} />
        <Route path="/edit-form/:id" element={<EditForm />} />
        <Route path="/view-form/:id" element={<ViewForm />} />
        <Route path="/form/:formId" element={<SubmitForm />} />
      </Routes>
    </Router>
  );
}

export default App;