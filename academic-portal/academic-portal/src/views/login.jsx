import { useState } from 'react';
import Footer from '../components/Footer';
import '../assets/css/header.css';
import '../assets/css/footer.css';
import '../assets/css/error.css';
import '../assets/css/login.css';
import axiosClient from '../axiosClient';
import { useStateContext } from '../contexts/contextprovider';
import { useNavigate } from 'react-router-dom';

const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
  };

function Login() { 
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [loginError, setLoginError] = useState('');   
  const [loginInfo, setLoginInfo] = useState({ school_code: '', password: '', captcha_input: '', generated_captcha: '' });
  const { setUser, setToken } = useStateContext();
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));   
  };

  const handleCaptchaRefresh = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
    // setCaptchaError('New captcha generated. Please try again.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();   
    setLoginError('');
    setLoginError('');

  const loginData = { 
      ...loginInfo, 
      captcha_input: captchaInput,
      generated_captcha: captcha 
    };
    setLoading(true);
    try {
      const { data } = await axiosClient.post('login', loginData);
      console.log('Response:', data);
      setUser(data.user);
      setToken(data.token);      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      setLoading(false);
      } catch (err) {
        setCaptcha(generateCaptcha());
        setCaptchaInput('');
          if (err.response) {
              if (err.response.status === 422) {
                // setCaptcha(generateCaptcha());
                  const validationErrors = err.response.data.errors;
      
                  // Safely handle validation errors
                  console.log('Validation Errors:', err.response.data);
                  
                  if(validationErrors){
                    Object.keys(validationErrors).forEach((field) => {
                      if (Array.isArray(validationErrors[field])) {
                          console.error(`${field}: ${validationErrors[field].join(', ')}`);
                      } else {
                          console.error(`${field}: ${validationErrors[field]}`);
                      }
                  });
                  setErrorMessages(validationErrors);
                  }
                  setLoginError(err.response.data.error);
                  // // Optionally store errors in state for UI
                 
              } else {               
                  console.log('API Error:', err.response);
              }
          } else if (err.request) {
              console.error('Request error: No response received:', err.request);
          } else {           
              console.error('Error:', err.message);
          }
      }finally{
        setLoading(false);
      }
  
  
  };
  
  const handleFocus = (field) => {
    setErrorMessages((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[field]; // Remove the error for the focused field
        return updatedErrors;
    });
};

  return (
    <div>
      <div className="container login-container">
        <div className="main-content login-main-content">
          <div className="notice-board">
            <h2>Notice Board</h2>
            <ul>
              <li>1. Notice 1</li>
              <li>2. Notice 2</li>
              <li>3. Notice 3</li>
              <li>4. Notice 4</li>
            </ul>
          </div>

          <div className="login-section">
            <h2>School Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group login-form-group">
                <label htmlFor="user" className="login-label">User Id:</label>
                <input
                  type="text"
                  id="schoolCode"
                  name="school_code"
                  className="login-input"
                  value={loginInfo.school_code || ''}
                  placeholder="Enter your User Id"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleChange(e, loginInfo);
                    }
                  }}
                  onFocus={() => handleFocus('school_code')}
                />
              </div>
               {errorMessages.school_code && (
                <span className="error-message">{Array.isArray(errorMessages.school_code) ? errorMessages.school_code.join(', ') : errorMessages.school_code}</span>
               )}

              <div className="form-group login-form-group">
                <label htmlFor="password" className="login-label">Password:</label>
                <input
                  type="password"
                  id="school_password"
                  className="login-input"
                  name="password"
                  onChange={handleChange}
                  value={loginInfo.password}
                  placeholder="Enter your password"
                  onFocus={() => handleFocus('password')}
                />
              </div>              
               {errorMessages.password && (
                <span className="error-message">{Array.isArray(errorMessages.password) ? errorMessages.password.join(', ') : errorMessages.password}</span>
               )}

              <div className="login-form-group">
                <label className="login-label">Captcha:</label>
                <div className="captcha-container">
                  <span className="captcha-text">{captcha}</span>
                  <button type="button" className="refresh-btn" onClick={handleCaptchaRefresh}>
                    ↻
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter the captcha"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                   onFocus={() => handleFocus('captcha_input')}
                  className="login-input"
                  name="captcha"
                />
              </div>             
               {errorMessages.captcha_input && (
                <span className="error-message">{Array.isArray(errorMessages.captcha_input) ? errorMessages.captcha_input.join(', ') : errorMessages.captcha_input}</span>
               )}

              {loginError && <p className="error-message">{loginError}</p>}
              {/* <button type="submit" className="btn-login">Login</button> */}
              {/* <button type="submit" className="btn-login" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button> */}
              <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <div role="status">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                {/* <span className="sr-only">Loading...</span> */}
            </div>
              ) : (
                "Login"
              )}
</button>
            </form>
         
          </div>
        </div>
       
      </div>
      <Footer />
    </div>
  );
}

export default Login;
