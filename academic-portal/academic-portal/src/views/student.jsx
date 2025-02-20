import CryptoJS from "crypto-js";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/css/student.css";
import axiosClient from "../axiosClient";
const encryptionKey = import.meta.env.VITE_APP_KEY; // Use the same key as in ContextProvider
import { useStateContext } from "../contexts/contextprovider";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

//  alert(user);

function Student() {
    const { user, token } = useStateContext(); // Retrieve user and token from context
    const navigate = useNavigate();
    const [districts, setDistricts] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [selectedStudents, setselectedStudents] = useState({
        student_name: "",
        birth_date: "",
        student_gender: "M",
        student_disability: "NONE", // Default selected disability is "NONE"
        student_divyang_certificate: null,
        student_caste: "GENERAL",
        student_religion: "HINDUISM",
        student_nationality: "INDIAN",
        aadhar: "",
        student_category: "REGULAR",
        student_area: "RURAL",
        address_line1: "",
        address_line2: "",
        present_block: "",
        present_block_code: "",
        present_district: "",
        present_district_code: "",
        present_state: "",
        present_pin: "",
        mobile_no: "",
        student_email: "",
        roll_number: "",
        section: "",
        student_medium: "HINDI",
        subject_mil_code: "",
        subject_lieu_code: "",
        subject_elective_code: "",
    });

    

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

    useEffect(() => {
        if (selectedStudents.aadhar && selectedStudents.aadhar.length === 12) {
            setselectedStudents((prevState) => ({
                ...prevState, // Preserve other properties
                part1: selectedStudents.aadhar.substring(0, 4),
                part2: selectedStudents.aadhar.substring(4, 8),
                part3: selectedStudents.aadhar.substring(8, 12),
            }));
        }
    }, [selectedStudents.aadhar]);

    const [loading, setLoading] = useState(true); // To track loading status

    useEffect(() => {
        const fetchDistrictData = async () => {
            try {
                const districtResponse = await axiosClient.get("getDistricts"); // API for fetching districts
                setDistricts(districtResponse.data.districts); // Set districts

                console.log("Districts:", districtResponse.data.districts);
                if (districtResponse.data.success) {
                    console.log("Districts:", districtResponse.data.districts);
                    // setDistricts(response.data.districts);
                } else {
                    console.error("Error fetching districts");
                }
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        };
        fetchDistrictData();
    }, [user]);

    useEffect(() => {
        const fetchBlockData = async () => {
            try {
                const blockResponse = await axiosClient.get("getBlocks"); // API for fetching districts
                setBlocks(blockResponse.data.blocks); // Set districts

                console.log("Blocks:", blockResponse.data.blocks);
                if (blockResponse.data.success) {
                    console.log("Blocks:", blockResponse.data.blocks);
                    // setDistricts(response.data.districts);
                } else {
                    console.error("Error fetching Blocks");
                }
            } catch (error) {
                console.error("Error fetching Blocks:", error);
            }
        };
        fetchBlockData();
    }, [user]);

    const [subjects, setSubjects] = useState({
      language_one: [],
      language_two: [],
      additional: [],
  });

  useEffect(() => {
    axiosClient
        .get("subjects") // Fetch subjects from API
        .then((response) => {
            setSubjects(response.data);
            console.log('Subjects are', response.data);
        })
        .catch((error) => {
            console.error("Error fetching subjects:", error);
        });
}, []);

    const { encryptedAct, encryptedId } = useParams();
    const studAct = CryptoJS.AES.decrypt(
        encryptedAct.replace(/-/g, "+").replace(/_/g, "/"),
        encryptionKey
    ).toString(CryptoJS.enc.Utf8);
    const studId = CryptoJS.AES.decrypt(
        encryptedId.replace(/-/g, "+").replace(/_/g, "/"),
        encryptionKey
    ).toString(CryptoJS.enc.Utf8);

    useEffect(() => {
        const school_code = user.school_code;
        const fetchStudentData = async () => {
            try {
                if (!studId || !studAct) {
                    return <h1>Invalid ID </h1>;
                }

                const response = await axiosClient.post("getStudentData", {
                    studId,
                    studAct,
                    school_code,
                });
                if (response.data.success) {
                    setselectedStudents(response.data.student);
                } else {
                    console.error("Student not found");
                }
            } catch (error) {
                console.error("Error fetching student data:", error);
            } finally {
                setLoading(false); // Stop loading once the data is fetched
            }
        };

        fetchStudentData();
    }, [studId, studAct, user.school_code]);

    const handleDistrictChange = (e) => {
        setselectedStudents({
            ...selectedStudents,
            present_district: e.target.value, // Update selected district
        });
    };

    // Find the district name for the selected district code
    // const selectedDistrict = districts.find(
    //   (district) => district.district_code === selectedStudents.present_district_code
    // );

    const handleBlockChange = (e) => {
        setselectedStudents({
            ...selectedStudents,
            present_block: e.target.value, // Update selected district
        });
    };

    // Find the district name for the selected district code
    // const selectedBlock = blocks.find(
    //   (block) => block.block_code === selectedStudents.present_block_code
    // );

    if (!studId || !studAct) {
        return <h1>Invalid ID </h1>;
    }
    const FRONTEND_URL = "http://localhost:5173";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setselectedStudents({
            ...selectedStudents,
            [name]: value,
        });
    };

    return (
        <>
            <div className="container m-auto">
              <form name="studentForm" >
                {user ? (
                    <div>
                        <p className="text-center text-lg">
                            School Code: {user.school_code} ({" "}
                            {user.school_name || "User"} )
                        </p>
                    </div>
                ) : (
                    <p>No user data available. Please log in.</p>
                )}

                <div className="max-w-[1000px] mx-auto p-6  shadow-lg rounded-xl">
                    <div className="stud-personal-details">
                        <img
                            src={`${FRONTEND_URL}/src/assets/images/resistation-logo.png`}
                            alt="Resistation Logo"
                        />
                        <p>Personal Details</p>
                    </div>
                    <p className="text-gray-600 mb-6">
                        This section allows you to add candidates into your
                        institutions database.
                    </p>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                1. Name of the Student :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                               

                            {loading ? (
                                    <Skeleton height={40} />
                                    ) : (
                                        <input
                                        type="text"
                                        name="student_name"
                                        value={selectedStudents.student_name}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                    )}

                                <small className="mt-1 text-xs text-gray-500 block">
                                    Max 35 Characters
                                </small>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                2. Date of Birth :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={selectedStudents.birth_date}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                3. Gender :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3 flex space-x-4">
                                <label className="flex items-center mt-2">
                                    <input
                                        type="radio"
                                        name="student_gender"
                                        value="M"
                                        checked={
                                            selectedStudents.student_gender ===
                                            "M"
                                        }
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
                                        checked={
                                            selectedStudents.student_gender ===
                                            "F"
                                        }
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Female
                                </label>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                4. Disability Type :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3 flex space-x-4">
                                {[
                                    "NONE",
                                    "BLIND",
                                    "DUMB",
                                    "ORTHOPEDIC",
                                    "SPASTIC",
                                ].map((type) => (
                                    <label
                                        key={type}
                                        className="flex items-center mt-2"
                                    >
                                        <input
                                            type="radio"
                                            name="student_disability"
                                            value={type}
                                            checked={
                                                selectedStudents.student_disability ===
                                                type
                                            }
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Conditional Rendering for Divyang Certificate */}
                        {selectedStudents.student_disability !== "NONE" && (
                            <div className="flex items-start space-x-4 mt-4">
                                <label className="w-1/3 text-base font-medium">
                                    Divyang Certificate :
                                </label>
                                <div className="w-2/3">
                                    <input
                                        type="file"
                                        name="student_divyang_certificate"
                                        // onChange={handleDivyangFileChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                5. Caste :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3 flex space-x-4">
                                {["GENERAL", "SC", "ST", "BC-1", "BC-2"].map(
                                    (caste) => (
                                        <label
                                            key={caste}
                                            className="flex items-center mt-2"
                                        >
                                            <input
                                                type="radio"
                                                name="student_caste"
                                                value={caste}
                                                checked={
                                                    selectedStudents.student_caste ===
                                                    caste
                                                }
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            {caste}
                                        </label>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Conditional Rendering for Caste Certificate */}
                        {selectedStudents.student_caste !== "GENERAL" && (
                            <div className="flex items-start space-x-4 mt-4">
                                <label className="w-1/3 text-base font-medium">
                                    Caste Certificate :
                                </label>
                                <div className="w-2/3">
                                    <input
                                        type="file"
                                        name="student_caste_certificate"
                                        // onChange={handleCasteFileChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                6. Religion :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3 flex space-x-4">
                                {[
                                    "HINDUISM",
                                    "ISLAM",
                                    "SIKHISM",
                                    "CHRISTIANITY",
                                    "OTHERS",
                                ].map((religion) => (
                                    <label
                                        key={religion}
                                        className="flex items-center mt-2"
                                    >
                                        <input
                                            type="radio"
                                            name="student_religion"
                                            value={religion}
                                            checked={
                                                selectedStudents.student_religion ===
                                                religion
                                            }
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
                                7. Nationality :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3 flex space-x-4">
                                {["INDIAN", "OTHERS"].map((nationality) => (
                                    <label
                                        key={nationality}
                                        className="flex items-center mt-2"
                                    >
                                        <input
                                            type="radio"
                                            name="student_nationality"
                                            value={nationality}
                                            checked={
                                                selectedStudents.student_nationality ===
                                                nationality
                                            }
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
                                8. Aadhar No :
                                <span className="required-field"></span>
                            </label>

                            {/* Aadhar Input Fields */}
                            <div className="w-2/3 flex space-x-2">
                                {/* First Input Field */}
                                <div className="flex flex-col items-center">
                                    <input
                                        id="aadhar-part1"
                                        type="text"
                                        maxLength="4"
                                        value={selectedStudents.part1}
                                        // onChange={(e) => handleAadharChange(e, "part1")}
                                        className="w-50 p-2 border rounded text-center"
                                    />
                                    <small className="mt-1 text-xs text-gray-500">
                                        Max 4 Characters
                                    </small>
                                </div>

                                {/* Second Input Field */}
                                <div className="flex flex-col items-center">
                                    <input
                                        id="aadhar-part2"
                                        type="text"
                                        maxLength="4"
                                        value={selectedStudents.part2}
                                        // onChange={(e) => handleAadharChange(e, "part2")}
                                        className="w-50 p-2 border rounded text-center"
                                    />
                                    <small className="mt-1 text-xs text-gray-500">
                                        Max 4 Characters
                                    </small>
                                </div>

                                {/* Third Input Field */}
                                <div className="flex flex-col items-center">
                                    <input
                                        id="aadhar-part3"
                                        type="text"
                                        maxLength="4"
                                        value={selectedStudents.part3}
                                        // onChange={(e) => handleAadharChange(e, "part3")}
                                        className="w-50 p-2 border rounded text-center"
                                    />
                                    <small className="mt-1 text-xs text-gray-500">
                                        Max 4 Characters
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                9. Area :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3 flex space-x-4">
                                <label className="flex items-center mt-2">
                                    <input
                                        type="radio"
                                        name="student_area"
                                        value="RURAL"
                                        checked={
                                            selectedStudents.student_area ===
                                            "RURAL"
                                        }
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
                                        checked={
                                            selectedStudents.student_area ===
                                            "URBAN"
                                        }
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    URBAN
                                </label>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                10. Father Name :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    name="father_name"
                                    value={selectedStudents.father_name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                                <small className="mt-1 text-xs text-gray-500 block">
                                    Max 35 Characters
                                </small>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                11. Mother Name :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    name="mother_name"
                                    value={selectedStudents.mother_name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                                <small className="mt-1 text-xs text-gray-500 block">
                                    Max 35 Characters
                                </small>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                12. Category :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3 flex space-x-4">
                                <label className="flex items-center mt-2">
                                    <input
                                        type="radio"
                                        name="student_category"
                                        value="REGULAR"
                                        checked={
                                            selectedStudents.student_category ===
                                            "REGULAR"
                                        }
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
                                        checked={
                                            selectedStudents.student_category ===
                                            "PRIVATE"
                                        }
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    PRIVATE
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-[1000px] mx-auto p-6  "></div>
                    <div className="stud-personal-details">
                        <img
                            src={`${FRONTEND_URL}/src/assets/images/resistation-logo.png`}
                            alt="Resistation Logo"
                        />
                        <p>Communication Details</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-6 font-medium">
                                13. Address Line 1 :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    name="address_line1"
                                    value={selectedStudents.address_line1}
                                    onChange={handleChange}
                                    className="w-full mt-4 p-2 border rounded"
                                />
                                <small className="mt-1 text-xs text-gray-500 block">
                                    Max 45 Characters
                                </small>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                14. Address Line 2 :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    name="address_line2"
                                    value={selectedStudents.address_line2}
                                    onChange={handleChange}
                                    className="w-full  p-2 border rounded"
                                />
                                <small className="mt-1 text-xs text-gray-500 block">
                                    Max 45 Characters
                                </small>
                            </div>
                        </div>

                        {/* <div className="flex items-start space-x-4">
              <label className="w-1/3 text-base mt-2 font-medium">15. Block :<span className="required-field"></span></label>
              <div className="w-2/3">                
                <select
                  name="present_block"
                  value={selectedStudents.present_block}
                  onChange={handleChange}
                  className="w-full p-2 border rounded">
                  <option value="0">Select Block</option>
                  <option value="1">Block 1</option>
                  <option value="2">Block 2</option>
                  <option value="3">Block 3</option>
                  </select>

                <small className="mt-1 text-xs text-gray-500 block">Max 45 Characters</small>
              </div>
            </div> */}

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                15. Block :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <select
                                        name="present_block"
                                        value={
                                            selectedStudents.present_block_code
                                        }
                                        onChange={handleBlockChange}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Select Block</option>
                                        {blocks.map((block) => (
                                            <option
                                                key={block.block_code}
                                                value={block.block_code}
                                            >
                                                {block.block_name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Optionally display selected district name */}
                            {/* {selectedBlock && (
                  <div className="mt-2">
                    <p>Selected block: {selectedBlock.block_name}</p>
                  </div>
                )} */}
                        </div>

                        {/* <div className="flex items-start space-x-4">
              <label className="w-1/3 text-base mt-2 font-medium">16. District :<span className="required-field"></span></label>
              <div className="w-2/3">                
                <select
                  name="present_district"
                  value={selectedStudents.present_district}
                  onChange={handleChange}
                  className="w-full p-2 border rounded">
                  <option value="0">Select District</option>
                  <option value="1">District 1</option>
                  <option value="2">District 2</option>
                  <option value="3">District 3</option>
                  </select>

                <small className="mt-1 text-xs text-gray-500 block">Max 45 Characters</small>
              </div>
            </div> */}

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                16. District :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <select
                                        name="present_district"
                                        value={
                                            selectedStudents.present_district_code
                                        }
                                        onChange={handleDistrictChange}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">
                                            Select District
                                        </option>
                                        {districts.map((district) => (
                                            <option
                                                key={district.district_code}
                                                value={district.district_code}
                                            >
                                                {district.district_name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Optionally display selected district name */}
                            {/* {selectedDistrict && (
        <div className="mt-2">
          <p>Selected District: {selectedDistrict.district_name}</p>
        </div>
      )} */}
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                17. State/Union Territory :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                                <select
                                    name="present_state"
                                    value={selectedStudents.present_state}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="0">Select State</option>
                                    <option value="1">State 1</option>
                                    <option value="2">State 2</option>
                                    <option value="3">State 3</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                18. Pin :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    name="present_pin"
                                    value={selectedStudents.present_pin}
                                    onChange={handleChange}
                                    className="w-full  p-2 border rounded"
                                />
                                <small className="mt-1 text-xs text-gray-500 block">
                                    Max 6 Characters
                                </small>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                19. Contact Mobile No :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    name="mobile_no"
                                    value={selectedStudents.mobile_no}
                                    onChange={handleChange}
                                    className="w-full  p-2 border rounded"
                                />
                                <small className="mt-1 text-xs text-gray-500 block">
                                    Max 10 Characters
                                </small>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                20. Email Id :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                                <input
                                    type="email"
                                    name="student_email"
                                    value={selectedStudents.student_email}
                                    onChange={handleChange}
                                    className="w-full  p-2 border rounded"
                                />
                                <small className="mt-1 text-xs text-gray-500 block">
                                    Max 50 Characters
                                </small>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[1000px] mx-auto p-6 "></div>
                    <div className="stud-education-details">
                        <img
                            src={`${FRONTEND_URL}/src/assets/images/resistation-logo.png`}
                            alt="Resistation Logo"
                        />
                        <p>Education Details</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-6 font-medium">
                                21. Class Roll No :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    name="roll_number"
                                    value={selectedStudents.roll_number}
                                    onChange={handleChange}
                                    className="w-full mt-4 p-2 border rounded"
                                />
                                <small className="mt-1 text-xs text-gray-500 block">
                                    Max 4 Characters
                                </small>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                22. Section :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    name="section"
                                    value={selectedStudents.section}
                                    onChange={handleChange}
                                    className="w-full  p-2 border rounded"
                                />
                                <small className="mt-1 text-xs text-gray-500 block">
                                    Max 1 Characters
                                </small>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                23. Medium of Examination :
                                <span className="required-field"></span>
                            </label>
                            <div className="w-2/3 flex space-x-4">
                                {[
                                    "HINDI",
                                    "URDU",
                                    "ENGLISH",
                                    "BENGALI",
                                    "ORIYA",
                                ].map((medium) => (
                                    <label
                                        key={medium}
                                        className="flex items-center mt-2"
                                    >
                                        <input
                                            type="radio"
                                            name="student_medium"
                                            value={medium}
                                            checked={
                                                selectedStudents.student_medium ===
                                                medium
                                            }
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        {medium}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <label className="w-1/3 text-base mt-2 font-medium">
                                24. Subject Offered :
                                <span className="required-field"></span>
                            </label>
                            {/* <div className="w-2/3">                
                <select
                  name="subject_mil_code"
                  value={selectedStudents.subject_mil_code}
                  onChange={handleChange}
                  className="w-full p-2 border rounded">
                  <option value="0">CHOOSE ONE</option>
                  <option value="1">Subject  1</option>
                  <option value="2">Subject 2</option>
                  <option value="3">Subject 3</option>
                  </select>               
              </div> */}
                        </div>

                        <div className="flex items-start space-x-4">
                <label className="w-half ml-10 mr-40 text-base mt-2 font-medium">
                    Language One :
                    <span className="required-field"></span>
                </label>
                <div className="w-2/3">
                    <select
                        name="subject_mil_code"
                        value={selectedStudents.subject_mil_code}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="0">CHOOSE ONE</option>
                        {subjects.language_one.map((subject) => (
                            <option key={subject.sub_code} value={subject.sub_code}>
                                {subject.sub_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Language Two */}
            <div className="flex items-start space-x-4">
                <label className="w-half ml-10 mr-40 text-base mt-2 font-medium">
                    Language Two :
                    <span className="required-field"></span>
                </label>
                <div className="w-2/3">
                    <select
                        name="subject_lieu_code"
                        value={selectedStudents.subject_lieu_code}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="0">CHOOSE ONE</option>
                        {subjects.language_two.map((subject) => (
                            <option key={subject.sub_code} value={subject.sub_code}>
                                {subject.sub_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Additional */}
            <div className="flex items-start space-x-4">
                <label className="w-half ml-10 mr-48 text-base mt-2 font-medium">
                    Additional :
                    <span className="required-field"></span>
                </label>
                <div className="w-2/3">
                    <select
                        name="subject_elective_code"
                        value={selectedStudents.subject_elective_code}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="0">CHOOSE ONE</option>
                        {subjects.additional.map((subject) => (
                            <option key={subject.sub_code} value={subject.sub_code}>
                                {subject.sub_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6">
                        <button className="text-green-500">&lt; </button>
                        <button className="bg-green-500 text-white px-6 py-2 rounded">
                            Next &gt;
                        </button>
                    </div>
                </div>
                </form>
            </div>
        </>
    );
}

export default Student;
