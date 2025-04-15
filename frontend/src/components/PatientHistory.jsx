import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PatientHistory.css"
const API_URL = import.meta.env.VITE_API_URL;

const PatientHistory = () => {
    const params = useParams();
    const { userId } = params;
    const [patientHistory, setPatientHistory] = useState([]);

    useEffect(() => {
    const fetchPatientHistory = async () => {
      try {
      const response = await axios.get(
          `${API_URL}/doctor/${userId}/patient-history`,
        );
        setPatientHistory(response.data.patientHistory);
        } 
        catch (error) {
        console.error("Error fetching patient history", error);
        }
        };
        fetchPatientHistory();
        }, [userId]);

     return (
     <>
      <div>
      <div className="patient-History-dashboard">
      <h1 className="text-2xl font-semibold text-center"><span className="mt-5">Patient History</span></h1>
      {patientHistory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 p-5">
          {patientHistory.map((history, index) => (
            <div
              key={index}
              className="border border-gray-300 shadow-md rounded-lg p-4 bg-white">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {history.patientName}
              </h2>

              <p className="text-sm text-gray-600">
                <strong>Date:</strong>{" "}
                {new Date(history.date).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Time Slot:</strong> {history.timeSlot}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {history.status}
              </p>
             </div>
          
          ))}
        </div>
      ) : (
        <p className="text-red-500 text-center">No patient history available.</p>
      )}
    </div>
    </div>
    </>
  );
};

export default PatientHistory;
