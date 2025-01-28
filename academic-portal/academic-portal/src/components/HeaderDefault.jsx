import '../assets/css/header.css'
import "../../src/App.css";

export default function HeaderDefaut() {

  return (
    <div>
        {/* Header */}
      <header className="header">
        <div className='header-content'>
            {/* src={require('./assets/logo.png')}  */}
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
        <button type="button" className="absolute top-10 right-4 text-white bg-red-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" >Logout</button>
        <div>
        
        </div>
      </header>
    </div>
  )
}
