import CryptoJS from "crypto-js";
import axiosClient from '../axiosClient';
import { useEffect, useState } from 'react';
const encryptionKey = import.meta.env.VITE_APP_KEY; // Use the same key as in ContextProvider
import Footer from '../components/Footer';
import '../assets/css/dashboard.css';
import { useStateContext } from "../contexts/contextprovider";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const { user, token } = useStateContext(); // Retrieve user and token from context



  // const encryptedUserData = sessionStorage.getItem("USER_DATA");
  // const user = encryptedUserData
  //   ? JSON.parse(CryptoJS.AES.decrypt(encryptedUserData, encryptionKey).toString(CryptoJS.enc.Utf8))
  //   : null;
  let FRONTEND_URL = "http://localhost:5173";
  const [countsReg, setCountsReg] = useState(0);
  const [countsPvt, setCountsPvt] = useState(0);
  const [countsExReg, setCountsExReg] = useState(0);
  const [challanCountsReg, setchallanCountsReg] = useState(0);
  const [challanCountsPvt, setchallanCountsPvt] = useState(0);
  const [challanCountsExReg, setchallanCountsExReg] = useState(0);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const sanitizeForUrl = (str) => str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
 

  useEffect(() => {
    if (!user) {
      // Redirect to login if user is not logged in
      navigate("/login");
      // Do something with user data
      // console.log("Logged in user:", user);
    }
    if (!token) {
      navigate("/login");
      // Do something with the token, like making API calls
      console.log("Current Token:", token);
    }
  }, [user, token, navigate]);
// Handle edit action

const handleEdit = (id, act ) => {
  if (!id || !act) {
    console.log("Invalid act or id:", { act, id });
    return; // Stop execution if values are missing
  }
  const encryptedId = CryptoJS.AES.encrypt(id.toString(), encryptionKey).toString();
  const urlSafeEncryptedId = sanitizeForUrl(encryptedId);
  const encryptedAct = CryptoJS.AES.encrypt(act.toString(), encryptionKey).toString();  
  const urlSafeEncryptedAct = sanitizeForUrl(encryptedAct);
  navigate(`/student/${urlSafeEncryptedAct}/${urlSafeEncryptedId}`);
};

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  // Confirm delete action
  const confirmDelete = () => {
    if (deleteId) {
      console.log("Deleting student with ID:", deleteId);
      // Perform delete API call here
      setDeleteId(null);
    }
  };

  useEffect(() => {
    if (user?.school_code) {
      // const controller = new AbortController(); // Prevent memory leaks
      let isMounted = true;
      axiosClient.post('getCounts', { school_code: user.school_code })
        .then(response => {
          // console.log("API Response:", response.data);
          if (isMounted) {
            const totalCounts = response.data.studentCounts.total;
            const processedCounts = response.data.studentCounts.processed;
            setCountsReg(totalCounts.REGULAR || 0);
            setCountsPvt(totalCounts.PRIVATE || 0);
            setCountsExReg(totalCounts["EX-REGULAR"] || 0);
            setchallanCountsReg(processedCounts.REGULAR.processed || 0);
            setchallanCountsPvt(processedCounts.PRIVATE.processed || 0);
            setchallanCountsExReg(processedCounts["EX-REGULAR"].processed || 0);
          }
          
        })
        .catch(error => {
          if (isMounted) {
            console.error('Error fetching student counts:', error);
          }
        });

        return () => {
          isMounted = false;
        };// Cleanup request if component unmounts
    }
  }, [user?.school_code]);

  const fetchStudents = (page = 1) => {
    if (!user?.school_code) return;

    let isMounted = true;
    axiosClient
      .post(
        "getStudent",
        { school_code: user.school_code, search, per_page: 10, page }
      )
      .then((response) => {
        if (isMounted) {
          setStudents(response.data.students.data || []); // Access students data correctly
          setCurrentPage(response.data.students.current_page);
          setLastPage(response.data.students.last_page);
        }
        
      })
      .catch((error) => {
        if (isMounted) {
        console.error("Error fetching students:", error);
        }
      });

      return () => {
        isMounted = false;
      };// Cleanup request if component unmounts
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStudents(1); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);
    
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
          {countsReg}
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
          {countsPvt}
          
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
         {countsExReg}
        </td>
      </tr>
      <tr>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm w-[60%] leading-none">
          No. of Candidates Submitted for Challan Generation
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
          {challanCountsReg}
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
          {challanCountsPvt}
        </td>
        <td className="border border-gray-300 p-2 text-gray-700 text-sm leading-none">
          {challanCountsExReg}
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

<div className="notes-logo">
    <img src={`${FRONTEND_URL}/src/assets/images/notes-logo.png`} />    
    <p>List of Candidates Enrolled by the Institution.</p>
</div>
<div className="container mx-auto mt-10 ">
         <div className="flex justify-end items-end">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-lg p-2 mb-4 w-40 "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
         </div>
  <table className="table-auto border-collapse border border-gray-300 w-full text-left">
    <thead>
      <tr>
        <th className="border border-gray-300 p-2 bg-gray-100 text-sm leading-none">
          Sr. No.
        </th>
        <th className="border border-gray-300 p-2 bg-gray-100 text-sm leading-none">
          Student Code
        </th>
        <th className="border border-gray-300 p-2 bg-gray-100 text-sm leading-none">
          Student Name
        </th>
        <th className="border border-gray-300 p-2 bg-gray-100 text-sm leading-none">
          Student Category
        </th>
        <th className="border border-gray-300 p-2 bg-gray-100 text-sm leading-none">
          Action
        </th>
      </tr>
    </thead>
    <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={student.id}>
                <td className="border border-gray-300 p-2 text-sm">{index + 1 + (currentPage - 1) * 10}</td>
                <td className="border border-gray-300 p-2 text-sm">{student.student_code}</td>
                <td className="border border-gray-300 p-2 text-sm">{student.student_name}</td>
                <td className="border border-gray-300 p-2 text-sm">{student.student_category}</td>
                <td className="border border-gray-300 p-2  flex justify-center gap-1.5">
                    {/* View Button */}
                    {student.actions.view && (
                      <button
                        onClick={() => navigate(student.actions.view)}
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition active:scale-95"
                      >
                        View
                      </button>
                    )}

                    {/* Edit Button */}
                    {student.actions.edit && (
                      <button
                      onClick={() => handleEdit('edit', student.id)}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-green-500 rounded-md shadow-md hover:bg-green-600 transition active:scale-95"
                    >
                      Edit
                    </button>
                    )}

                    {/* Delete Button */}
                    {student.actions.delete && (
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-red-500 rounded-md shadow-md hover:bg-red-600 transition active:scale-95"
                      >
                        Delete
                      </button>
                    )}
                  </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border border-gray-300 p-2 text-center text-sm">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
  </table>
        <div className="mt-4 mb-4 flex justify-end items-center space-x-3">
        <button
          className="px-4 py-2 border rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-200 ease-in-out disabled:opacity-50"
          onClick={() => fetchStudents(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          className="px-4 py-2 border rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-200 ease-in-out disabled:opacity-50"
          onClick={() => fetchStudents(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-3 py-1 text-sm text-gray-700 font-medium">
          Page {currentPage} of {lastPage}
        </span>
        <button
          className="px-4 py-2 border rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-200 ease-in-out disabled:opacity-50"
          onClick={() => fetchStudents(currentPage + 1)}
          disabled={currentPage === lastPage}
        >
          Next
        </button>
        <button
          className="px-4 py-2 border rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-200 ease-in-out disabled:opacity-50"
          onClick={() => fetchStudents(lastPage)}
          disabled={currentPage === lastPage}
        >
          Last
        </button>
      </div>


{deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold">Are you sure you want to delete this record?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

</div>

  </div>
    <Footer />
  </div>

  )
}

export default Dashboard