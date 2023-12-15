import React from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



function Userpage() {

  const navigate = useNavigate();

  const location = useLocation();
  const state = location.state;

  // Access the state properties
  const farm = state.farm;
  const imageFolders = state.imageFolders;

  const handleOperateDroneClick = () => {
    // Use navigate with the state object
    navigate('/drone', {
      state: {
        farm: farm
      }
    });
  };

  const handleViewResultsClick = () => {
    // Use navigate with the state object
    navigate('/result', {
      state: {
        imageFolders: imageFolders
      }
    });
  };


  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>

    <div className="row">
    <div className="col-sm-6 mb-4">
      <div className="card bg-primary text-white">
        <div className="card-body">
          <h5 className="card-title">Drone Operation</h5>
          <p className="card-text">Start capturing and uploading images with the drone and finish once the flight is complete.</p>
          <button onClick={handleOperateDroneClick} className="btn btn-light">Operate Drone</button>
        </div>
      </div>
    </div>
    <div className="col-sm-6 mb-4">
      <div className="card bg-success text-white">
        <div className="card-body">
          <h5 className="card-title">View Results</h5>
          <p className="card-text">Displays captured and analysed field images of various flights for decision making and land planning.</p>
          <button onClick={handleViewResultsClick} className="btn btn-light">View Results</button>
        </div>
      </div>
    </div>
  </div>
  </div>
  )
}

export default Userpage