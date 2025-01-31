import CryptoJS from "crypto-js"
import { useState } from "react";
import { useParams } from "react-router-dom";
import '../assets/css/student.css'
const encryptionKey = import.meta.env.VITE_APP_KEY; // Use the same key as in ContextProvider

   const encryptedUserData = sessionStorage.getItem("USER_DATA");
   const user = encryptedUserData
     ? JSON.parse(CryptoJS.AES.decrypt(encryptedUserData, encryptionKey).toString(CryptoJS.enc.Utf8))
     : null;

 function Student() {
        const [formData, setFormData] = useState({
          student_name: "",
          student_dob: "",
          student_gender: "M",
          student_disability: "NONE", // Default selected disability is "NONE"
          student_divyang_certificate: null,
          student_caste: "GENERAL",
          student_religion: "HINDUISM",
          student_nationality: "INDIAN",
          student_aadhar: "",
          student_category: "REGULAR",
          student_area: "RURAL",
        });

        let FRONTEND_URL = "http://localhost:5173";

        // const AadharInput = ({ formData, setFormData }) => {
          const [aadhar, setAadhar] = useState({
            part1: "",
            part2: "",
            part3: "",
          });

          const handleAadharChange = (e, part) => {
            let value = e.target.value.replace(/\D/g, "").slice(0, 4); // Allow only numbers, max 4 digits
            setAadhar({ ...aadhar, [part]: value });
        
            if (value.length === 4) {
              if (part === "part1") document.getElementById("aadhar-part2").focus();
              else if (part === "part2") document.getElementById("aadhar-part3").focus();
            }
        
            // Merge all parts and store in formData
            const updatedAadhar = { ...aadhar, [part]: value };
            const mergedAadhar = updatedAadhar.part1 + updatedAadhar.part2 + updatedAadhar.part3;
        
            if (mergedAadhar.length === 12) {
              setFormData({ ...formData, student_aadhar: mergedAadhar });
            }
          };

        const { encryptedAct, encryptedId } = useParams();
        const studAct = CryptoJS.AES.decrypt(encryptedAct.replace(/-/g, "+").replace(/_/g, "/"), encryptionKey).toString(CryptoJS.enc.Utf8);
        const studId = CryptoJS.AES.decrypt(encryptedId.replace(/-/g, "+").replace(/_/g, "/"), encryptionKey).toString(CryptoJS.enc.Utf8);
        if (!studId || !studAct) {
          return <h1>Invalid ID </h1>
        } 
  
        const handleDivyangFileChange = (e) => {
          const file = e.target.files[0];
          if (file) {
            // Handle the file here, e.g., save it to formData or upload it
            setFormData({
              ...formData,        
              student_caste_certificate: file,
            });
          }
        };

      const handleCasteFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          // Handle file, for example, save it in formData
          setFormData({
            ...formData,
            student_caste_certificate: file,
          });
        }
      };
  
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
  

    return (
      <>
        <div className="container m-auto">
          {user ? (
            <div>          
            <p className="text-center text-lg">School Code: {user.school_code} ( {user.school_name || "User"} )</p>          
            </div>
            ) : (
              <p>No user data available. Please log in.</p>
            )}

              
            <div className="max-w-[1000px] mx-auto p-6 bg-white shadow-lg rounded-xl">
            {/* <h2 className="text-center text-2xl font-semibold mb-6">Create Your Profile</h2>   */}
            {/* <h3 className="text-lg font-semibold mb-4">Personal Details :</h3> */}
            <div className="stud-communication">      
                <img src={`${FRONTEND_URL}/src/assets/images/resistation-logo.png`} alt="Resistation Logo" />
                <p>Personal Details</p>
              </div>
            <p className="text-gray-600 mb-6">This section allows you to add candidates into your institutions database.</p>
            
            {/* Form Fields */}
            <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <label className="w-1/3 text-base mt-2 font-medium">1. Name of the Student :<span className="required-field"></span></label>
              <div className="w-2/3">
                <input
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <small className="mt-1 text-xs text-gray-500 block">Max 35 Characters</small>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <label className="w-1/3 text-base mt-2 font-medium">2. Date of Birth :<span className="required-field"></span></label>
              <div className="w-2/3">
                <input
                  type="date"
                  name="student_dob"
                  value={formData.student_dob}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <label className="w-1/3 text-base mt-2 font-medium">3. Gender :<span className="required-field"></span></label>
              <div className="w-2/3 flex space-x-4">
                <label className="flex items-center mt-2">
                  <input
                    type="radio"
                    name="student_gender"
                    value="M"
                    checked={formData.student_gender === "M"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Male
                </label>
                <label className="flex items-center mt-2">
                  <input
                    type="radio"
                    name="student_gender"
                    value="F"
                    checked={formData.student_gender === "F"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Female
                </label>
            </div>
          </div>

          <div className="flex items-start space-x-4">
              <label className="w-1/3 text-base mt-2 font-medium">
                4. Disability Type :<span className="required-field"></span>
              </label>
              <div className="w-2/3 flex space-x-4">
                {["NONE", "BLIND", "DUMB", "ORTHOPEDIC", "SPASTIC"].map((type) => (
                  <label key={type} className="flex items-center mt-2">
                    <input
                      type="radio"
                      name="student_disability"
                      value={type}
                      checked={formData.student_disability === type}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Conditional Rendering for Divyang Certificate */}
            {formData.student_disability !== "NONE" && (
              <div className="flex items-start space-x-4 mt-4">
                <label className="w-1/3 text-base font-medium">Divyang Certificate :</label>
                <div className="w-2/3">
                  <input
                    type="file"
                    name="student_divyang_certificate"
                    onChange={handleDivyangFileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}


            <div className="flex items-start space-x-4">
              <label className="w-1/3 text-base mt-2 font-medium">
                5. Caste :<span className="required-field"></span>
              </label>
              <div className="w-2/3 flex space-x-4">
                {["GENERAL", "SC", "ST", "BC-1", "BC-2"].map((caste) => (
                  <label key={caste} className="flex items-center mt-2">
                    <input
                      type="radio"
                      name="student_caste"
                      value={caste}
                      checked={formData.student_caste === caste}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {caste}
                  </label>
                ))}
              </div>
            </div>

            {/* Conditional Rendering for Caste Certificate */}
            {formData.student_caste !== "GENERAL" && (
              <div className="flex items-start space-x-4 mt-4">
                <label className="w-1/3 text-base font-medium">Caste Certificate :</label>
                <div className="w-2/3">
                  <input
                    type="file"
                    name="student_caste_certificate"
                    onChange={handleCasteFileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}

            <div className="flex items-start space-x-4">
              <label className="w-1/3 text-base mt-2 font-medium">
                6. Religion :<span className="required-field"></span>
              </label>
              <div className="w-2/3 flex space-x-4">
                {["HINDUISM", "ISLAM", "SIKHISM", "CHRISTIANITY", "OTHERS"].map((religion) => (
                  <label key={religion} className="flex items-center mt-2">
                    <input
                      type="radio"
                      name="student_religion"
                      value={religion}
                      checked={formData.student_religion === religion}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {religion}
                  </label>
                ))}
              </div>
            </div>
              
            <div className="flex items-start space-x-4">
              <label className="w-1/3 text-base mt-2 font-medium">
                7. Nationality :<span className="required-field"></span>
              </label>
              <div className="w-2/3 flex space-x-4">
                {["INDIAN", "OTHERS"].map((nationality) => (
                  <label key={nationality} className="flex items-center mt-2">
                    <input
                      type="radio"
                      name="student_nationality"
                      value={nationality}
                      checked={formData.student_nationality === nationality}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {nationality}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-start space-x-4">
              {/* Label */}
              <label className="w-1/3 text-base mt-2 font-medium">
                8. Aadhar No :<span className="required-field"></span>
              </label>

              {/* Aadhar Input Fields */}
              <div className="w-2/3 flex space-x-2">
                {/* First Input Field */}
                <div className="flex flex-col items-center">
                  <input
                    id="aadhar-part1"
                    type="text"
                    maxLength="4"
                    value={aadhar.part1}
                    onChange={(e) => handleAadharChange(e, "part1")}
                    className="w-50 p-2 border rounded text-center"
                  />
                  <small className="mt-1 text-xs text-gray-500">Max 4 Characters</small>
                </div>

                {/* Second Input Field */}
                <div className="flex flex-col items-center">
                  <input
                    id="aadhar-part2"
                    type="text"
                    maxLength="4"
                    value={aadhar.part2}
                    onChange={(e) => handleAadharChange(e, "part2")}
                    className="w-50 p-2 border rounded text-center"
                  />
                  <small className="mt-1 text-xs text-gray-500">Max 4 Characters</small>
                </div>

                {/* Third Input Field */}
                <div className="flex flex-col items-center">
                  <input
                    id="aadhar-part3"
                    type="text"
                    maxLength="4"
                    value={aadhar.part3}
                    onChange={(e) => handleAadharChange(e, "part3")}
                    className="w-50 p-2 border rounded text-center"
                  />
                  <small className="mt-1 text-xs text-gray-500">Max 4 Characters</small>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <label className="w-1/3 text-base mt-2 font-medium">9. Area :<span className="required-field"></span></label>
              <div className="w-2/3 flex space-x-4">
                <label className="flex items-center mt-2">
                  <input
                    type="radio"
                    name="student_area"
                    value="RURAL"
                    checked={formData.student_area === "RURAL"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  RURAL
                </label>
                <label className="flex items-center mt-2">
                  <input
                    type="radio"
                    name="student_area"
                    value="URBAN"
                    checked={formData.student_area === "URBAN"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  URBAN
                    </label>
                </div>
              </div>

           <div className="flex items-start space-x-4">
              <label className="w-1/3 text-base mt-2 font-medium">10. Father Name :<span className="required-field"></span></label>
              <div className="w-2/3">
                <input
                  type="text"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <small className="mt-1 text-xs text-gray-500 block">Max 35 Characters</small>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <label className="w-1/3 text-base mt-2 font-medium">11. Mother Name :<span className="required-field"></span></label>
              <div className="w-2/3">
                <input
                  type="text"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <small className="mt-1 text-xs text-gray-500 block">Max 35 Characters</small>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <label className="w-1/3 text-base mt-2 font-medium">12. Category :<span className="required-field"></span></label>
              <div className="w-2/3 flex space-x-4">
                <label className="flex items-center mt-2">
                  <input
                    type="radio"
                    name="student_category"
                    value="REGULAR"
                    checked={formData.student_category === "REGULAR"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  REGULAR
                </label>
                <label className="flex items-center mt-2">
                  <input
                    type="radio"
                    name="student_category"
                    value="PRIVATE"
                    checked={formData.student_category === "PRIVATE"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  PRIVATE
                    </label>
                </div>
              </div>
               
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button className="text-green-500">&lt; Previous</button>
              <button className="bg-green-500 text-white px-6 py-2 rounded">Next &gt;</button>
            </div>
          </div>
        </div>
      </>

    );
  
}

export default  Student
