import CryptoJS from "crypto-js";
const encryptionKey = import.meta.env.VITE_APP_KEY;// Use the same key as in ContextProvider
import Footer from '../components/Footer'
import '../assets/css/dashboard.css'
// import Navbaar from "../components/Navbaar";

function dashboard() {
  const encryptedUserData = sessionStorage.getItem("USER_DATA");
  const user = encryptedUserData
    ? JSON.parse(CryptoJS.AES.decrypt(encryptedUserData, encryptionKey).toString(CryptoJS.enc.Utf8))
    : null;
    let FRONTEND_URL="http://localhost:5173";
    
  return (
    <div>      
      <div className="container m-auto"> 
      {user ? (
        <div>          
          <p className="text-center text-lg">School Code: {user.school_code} ( {user.school_name || "User"} )</p>          
        </div>
      ) : (
        <p>No user data available. Please log in.</p>
      )}
      <div className="resistation-logo">      
      <img src={`${FRONTEND_URL}/src/assets/images/resistation-logo.png`} alt="Resistation Logo" />
        <p>Registration Summary</p>
      </div>
      <div className="container mx-auto mt-10">
  <table className="table-auto border-collapse border border-gray-300 w-full text-left">
    <thead>
      <tr>
        <th
          className="border border-gray-300 p-2 bg-gray-100 text-sm w-[60%] leading-none"
          colSpan="2"
        >
          Particulars
        </th>
        <th
          className="border border-gray-300 p-2 bg-gray-100 text-sm leading-none"
          colSpan="2"
        >
          Count Nos.
        </th>
      </tr>
    </thead>
  </table>
  <table className="table-auto border-collapse border border-gray-300 w-full text-left">
    <tbody>
      <tr>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm w-[60%] leading-none">
          Category
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
          Regular
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
          Private
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
          Ex-Regular
        </td>
      </tr>
      <tr>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm w-[60%] leading-none">
          No. of Candidates Added on the Portal
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
          100
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
          50
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
         80
        </td>
      </tr>
      <tr>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm w-[60%] leading-none">
          No. of Candidates Submitted for Challan Generation
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
          80
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
          30
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
          70
        </td>
      </tr>
    </tbody>
  </table>
  <table className="border border-gray-300 p-2 text-gray-700 text-sm w-[100%] leading-none">
    <thead>
    <tr>
            <td className="border border-gray-300 p-2 text-gray-700 text-sm w-[30%] leading-none font-black">No. of Challan Genereted</td>
            <td className="border border-gray-300 p-4 text-gray-700 text-sm w-[20%]">10</td>
            <td className="border border-gray-300 p-4 text-gray-700 text-sm w-[30%] font-black">No. of Challan Paid</td>
            <td className="border border-gray-300 p-4 text-gray-700 text-sm w-[20%]">8</td>
          </tr>
    </thead>
  </table>
</div>

  
    </div>
    <Footer />
    </div>

  )
}

export default dashboard