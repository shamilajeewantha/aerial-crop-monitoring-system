import React, { useEffect, useState } from 'react';
import { FirebaseQuery } from './FirebaseQuery';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./viewanalysis.css"
import { useNavigate } from 'react-router-dom';

function ViewAnalysis() {

  const navigate = useNavigate();
  
  const { data, error } = FirebaseQuery();
  const [dataAvailable, setDataAvailability] = useState(false);
  const [activeFarmAttributes, setActiveFarmAttributes] = useState("No data");
  const [activeTab, setActiveTab] = useState("No farm");

  useEffect(() => {
    if (data) {
      setDataAvailability(true);
      setActiveTab(Object.keys(data)[0]);
    }
  }, [data]);

  // Function to handle tab click and update the activeTab state
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Pure function to retrieve the attributes of the currently active farm
  const getFarmAttributes = (farmName, data) => {
    return data?.[farmName] || {};
  };

  const handleNavigation = () => {
    // Use navigate with the state object
    navigate('/user', {
      state: {
        farm: activeTab,
        imageFolders: activeFarmAttributes.result_image_folders,
      }
    });
  };

  // Update the activeFarmAttributes state inside of the useEffect hook
  useEffect(() => {
    setActiveFarmAttributes(getFarmAttributes(activeTab, data));
  }, [activeTab]);

  return (
    <div >
      {dataAvailable ? (
        <div className="container my-5">
          <div className="row">
            {/* List group column */}
            <div className="col-md-4">
              <div className="list-group" id="myList" role="tablist">
                {Object.keys(data).map((farm) => (
                  <a
                    key={farm}
                    className={`list-group-item list-group-item-action ${activeTab === farm ? 'active' : ''}`}
                    href={`#${farm}`}
                    role="tab"
                    onClick={() => handleTabClick(farm)}
                  >
                    {farm}
                  </a>
                ))}
              </div>
            </div>

            {/* Tab content column */}
            <div className="col-md-8">
              <div className="tab-content ">
                {Object.keys(data).map((farm) => (
                  <div
                    key={farm}
                    className={`tab-pane ${activeTab === farm ? 'active' : ''}`}
                    id={farm}
                    role="tabpanel"
                  >
                    <h2>{farm}</h2>
                    <p>
                    This farm, located in {activeFarmAttributes.location}, has an area of {activeFarmAttributes.farm_area} acres and is dedicated to growing {activeFarmAttributes.crop_type}. The monitoring started on {activeFarmAttributes.start_date}.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="my-5"> {/* Add margin utility class for a gap */}
            <button type="submit" onClick={handleNavigation} className="btn btn-success btn-lg w-45">View Farm</button>
          </div>
        </div>
        
      ) : (
        <div>Loading.....</div>
      )}
    </div>
  );
}

export default ViewAnalysis;
