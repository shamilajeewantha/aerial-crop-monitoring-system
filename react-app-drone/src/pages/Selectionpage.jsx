import React, { useState } from 'react';
import StartMonitoringForm from '../components/StartMonitoringForm';
import ViewAnalysis from '../components/ViewAnalysis';

function Selectionpage() {
  const [isStartMonitoringSummaryVisible, setStartMonitoringSummaryVisible] = useState(false);
  const [isViewAnalysisSummaryVisible, setViewAnalysisSummaryVisible] = useState(false);

  const handleStartMonitoringClick = () => {
    setStartMonitoringSummaryVisible(true);
    setViewAnalysisSummaryVisible(false); // Hide the other summary if visible
  };

  const handleViewAnalysisClick = () => {
    setViewAnalysisSummaryVisible(true);
    setStartMonitoringSummaryVisible(false); // Hide the other summary if visible
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      {(!isStartMonitoringSummaryVisible && !isViewAnalysisSummaryVisible) && (
        <div className="row">
          <div className="col-sm-6 mb-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Crop Monitoring System</h5>
                <p className="card-text">Track and monitor crop health, growth, and conditions using advanced computer vision technology.</p>
                <button onClick={handleStartMonitoringClick} className="btn btn-light">Start Monitoring</button>
              </div>
            </div>
          </div>
          <div className="col-sm-6 mb-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Crop Data Analysis</h5>
                <p className="card-text">Analyze ground data collected from various dates to gain insights into crop vegetation and growth trends.</p>
                <button onClick={handleViewAnalysisClick} className="btn btn-light">View Analysis</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isStartMonitoringSummaryVisible && <StartMonitoringForm setStartMonitoringSummaryVisible={setStartMonitoringSummaryVisible} />}
      {isViewAnalysisSummaryVisible && <ViewAnalysis />}
    </div>
  );
}

export default Selectionpage;
