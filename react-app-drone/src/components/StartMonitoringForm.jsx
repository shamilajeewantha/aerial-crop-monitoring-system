import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, query, where, getDocs, updateDoc, setDoc } from "firebase/firestore";
import { db } from './Firebase';
import { AuthDetails } from './AuthDetails';

function StartMonitoringForm({ setStartMonitoringSummaryVisible }) {
  const authUser = AuthDetails();

  const [monitoringData, setMonitoringData] = useState({
    farmName: '',
    location: '',
    farmArea: '', // New field for farm area
    cropType: '',
    startDate: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMonitoringData({ ...monitoringData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission for "Start Monitoring" here
    console.log('Monitoring data submitted:', monitoringData);
    try {
      // You can add the "farmName" field to the Firestore document
      await setDoc(doc(db, authUser.uid , monitoringData.farmName), {
        farmer_name: authUser.displayName,
        farm_name: monitoringData.farmName,
        location: monitoringData.location,
        farm_area: monitoringData.farmArea,
        crop_type: monitoringData.cropType,
        start_date: monitoringData.startDate,
        result_image_folders:[],
      });
      setStartMonitoringSummaryVisible(false);
    } catch (e) {
      console.error("Error adding custom document: ", e);
    }
  };

  return (
    <div style={{ margin: '70px 0 !important' }}>
      <h3>Start Monitoring Form</h3>
      <form onSubmit={handleSubmit}>
        {/* New form field for Farm Name */}
        <div className="form-group">
          <label>Farm Name</label>
          <input
            type="text"
            name="farmName"
            value={monitoringData.farmName}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={monitoringData.location}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Farm Area (acres)</label>
          <input
            type="number"
            name="farmArea"
            value={monitoringData.farmArea}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Crop Type</label>
          <input
            type="text"
            name="cropType"
            value={monitoringData.cropType}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={monitoringData.startDate}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary w-50">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default StartMonitoringForm;
