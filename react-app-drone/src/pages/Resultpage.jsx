import React from 'react'
import { useLocation } from 'react-router-dom';
import ListGroup from "../components/ListGroup";
import { useNavigate } from 'react-router-dom';

function Resultpage() {

    const navigate = useNavigate();

    const location = useLocation();
    const state = location.state;
  
    // Access the state properties
    const imageFolders = state.imageFolders;

    const handleSelectItem = (item) => {
      console.log(item);
      
      // Use navigate with the state object
      navigate('/imageviewer', {
        state: {
          imageFolder: item
        }
      });
    };




    return (
      <div>
        <div className="text-center pt-5"> {/* Center the heading */}
          <h1>Folder List</h1>
        </div>
        <div className="d-flex justify-content-center align-items-center vh-100"> {/* Separate div for the list */}
          <ListGroup items={imageFolders} onSelectItem={handleSelectItem} />
        </div>
      </div>
    );
  }

export default Resultpage