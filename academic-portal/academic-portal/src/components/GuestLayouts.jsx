import {Navigate, Outlet} from 'react-router-dom'
import { useStateContext } from '../contexts/contextprovider'
import '../assets/css/header.css'
import "../../src/App.css";

function GuestLayouts() {
    const {token} = useStateContext(); 
    if(token){
     return <Navigate to="/login"/>
    } 
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
          <div>        
          </div>
        </header>
      </div>
      <main>
      <Outlet />
      </main>    
    </div>
  )
}

export default GuestLayouts