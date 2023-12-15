import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, child, get } from 'firebase/database';
import { AuthDetails } from '../components/AuthDetails';
import axios from 'axios';
import Alert from '../components/Alert'; // Import the Alert component


function Dronepage() {
  const db = getDatabase();
  const authUser = AuthDetails();

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const farm = state.farm;
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showAnalyzingAlert, setshowAnalyzingAlert] = useState(false);

  const handleCloseAlert = () => {
    console.log('Button clicked, alertVisible before state change:', showSuccessAlert);
    setShowSuccessAlert(false);
    navigate('/selection');
  };

  const handleCloseAnalyzing = () => {
    console.log('Button clicked, alertVisible before state change:', showAnalyzingAlert);
    setshowAnalyzingAlert(false);
    
  };


  const handleStartCapturingClick = () => {
    set(ref(db, 'droneData'), {
      farmName: farm,
      capture: true,
      farmerID: authUser.uid,
    });
  };

  const handleFinishCapturingClick = () => {
    set(ref(db, 'droneData'), {
      farmName: 'null',
      capture: false,
      farmerID: 'null',
    });
  };

  const handleAnalyzeClick = () => {
    setshowAnalyzingAlert(true);
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'folderData'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val().folder);

          axios.post('http://127.0.0.1:5000/', snapshot.val()) // Replace with your server URL
            .then((response) => {
              if (response.data.success) {
                setShowSuccessAlert(true);
                setshowAnalyzingAlert(false);
                console.log('POST request was successful', response.data);
                const { output, remove_cache_folder } = response.data;
                // Further handling of 'output' and 'remove_cache_folder' here
              } else {
                console.error('Server returned an error', response.data.error);
                const { error, remove_cache_folder } = response.data;
                // Further error handling here
              }
            })
            .catch((error) => {
              console.error('POST request failed', error);
              // Handle errors here if needed
            });
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="d-flex flex-column align-items-center py-4">
      {showSuccessAlert && ( // Conditionally render the success alert
        <Alert onClose={handleCloseAlert}>Analysis completed successfully!</Alert>
      )}
      {showAnalyzingAlert && ( // Conditionally render the success alert
        <Alert onClose={handleCloseAnalyzing}>Data analysis in progress....</Alert>
      )}

      <h1>{farm}</h1>
      <button onClick={handleStartCapturingClick} className="btn btn-primary mt-3">
        Start Capturing Images
      </button>
      <button onClick={handleFinishCapturingClick} className="btn btn-primary mt-3">
        Finish Capturing Images
      </button>
      <button onClick={handleAnalyzeClick} className="btn btn-primary mt-3">
        Analyze Images
      </button>

    </div>
  );
}

export default Dronepage;
