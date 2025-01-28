import {Navigate, Outlet} from 'react-router-dom'
import { useStateContext } from '../contexts/contextprovider'
import '../assets/css/header.css'
import "../../src/App.css";
import axiosClient from '../axiosClient';
import { useRef, useEffect } from 'react';
import Navbaar from '../components/Navbaar';

function DefaultLayout() {

  const {token, setUser, setToken} = useStateContext(); 
  const fetchedUser = useRef(false);
// Fetch user data (useEffect is now always called)
  useEffect(() => {
    if (token && !fetchedUser.current) {
      fetchedUser.current = true;
      axiosClient
        .get('/user')
        .then(({ data }) => {
          setUser(data);
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
        });
    }
  }, [token, setUser]); 


   if(!token){
    return <Navigate to="/login"/>
   } 

   const onLogout = (e) => {
    // alert('dd');
    e.preventDefault();
    axiosClient
      .get('logout')
      .then(() => {
        setUser(null); // Clear user data
        setToken(null); // Clear token
      })
      .catch((error) => {
        console.error("Logout failed:", error); // Log any errors
      });
  }; 
  
  return (
    <div>
      <div>       
        <header className="header">
          <div className='header-content'>             
              <img 
                  src="https://via.placeholder.com/100" 
                  alt="Academic Council Logo" 
                  className="logo absolute top-1 left-10" 
                  />
                  <div className='header-text'>
                  <h1>Academic Council, Delhi</h1>
                  <p>Clss X Examination , Session: 2025-2026</p>
                  </div>
          </div>
          <button type="button" onClick={onLogout} className="absolute top-10 right-4 text-white bg-red-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
          >Logout</button>
          <div>        
          </div>
        </header>  
        <Navbaar />      
      </div>                 
      <main className="mt-15">     
      <Outlet />                   
      </main>       
    </div>      
  )
}

export default DefaultLayout