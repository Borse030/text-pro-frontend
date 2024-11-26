import logo from './logo.svg';
import './App.css';
import React from 'react'
import { BrowserRouter, Routes, Route, Link, Router, useLocation  } from 'react-router-dom';
import Signup from "./Components/Signup"
import Signin from './Components/Signin';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from './Components/LandingPage';
import SideBar from './Components/sideBar';
import {useState} from "react"
import Summariser from "./Components/Summariser"
import Paraphraser from "./Components/Paraphraser"
import Loader from './Components/Loader';
import { ToastContainer } from "react-toastify";
import Translator from './Components/Translator';
import GrammerCheck from './Components/GrammerCheck';
function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks if the user is signed in

 // Function to handle successful sign-in
 const handleSignIn = () => {
  setIsAuthenticated(true); // Update state to indicate user is signed in
};

// Function to handle sign-out
const handleSignOut = () => {
  setIsAuthenticated(false); // Sign out user
};


  return (
    <div className="App" >
<BrowserRouter>

<ToastContainer/>

<Layout isAuthenticated={isAuthenticated} handleSignOut={handleSignOut} />

<Routes>
<Route path='/' element={<LandingPage/>} />
<Route path="/signup" element={<Signup/>}/>
<Route path="/signin" element={<Signin  onSignIn={handleSignIn} />} />
<Route path='/translator' element={<Translator/>} />

<Route path="/summariser" element={<Summariser/>} />
<Route path="/grammerCheck" element={<GrammerCheck/>} />


</Routes>

</BrowserRouter>     
    </div>
  );
}

// This component includes useLocation and renders the SideBar conditionally
const Layout = ({ isAuthenticated, handleSignOut }) => {
  const location = useLocation();

  // Define the paths where the sidebar should be visible
  const sidebarRoutes = ['/summariser', '/translator', '/paraphraser', '/dashboard', '/grammerCheck'];

  return (
    <>
      {/* Conditionally show the Sidebar based on authentication and route */}
      { sidebarRoutes.includes(location.pathname) && (
        <SideBar onSignOut={handleSignOut} />
      )}
    </>
  );
}

export default App;
