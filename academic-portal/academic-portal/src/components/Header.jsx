import '../assets/css/header.css'

export default function Header() {
  return (
    <div>
        {/* Header */}
      <header className="header">
        <div className='header-content'>
            {/* src={require('./assets/logo.png')}  */}
            <img 
                src="https://via.placeholder.com/100" 
                alt="Academic Council Logo" 
                className="logo" 
                 />
                <div className='header-text'>
                <h1>Academic Council, Delhi</h1>
                <p>Clss X Examination , Session: 2025-2026</p>
                </div>
        </div>        
      </header>
    </div>
  )
}
