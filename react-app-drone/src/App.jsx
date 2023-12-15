import { useDebugValue, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import axios from 'axios';
import Dropdown from './components/Dropdown';
import ListGroup from "./components/ListGroup";
import Button from "./components/Button";
import Alert from "./components/Alert";
import Login from './components/Login';
import Homepage from './pages/homepage';
import Signup from './components/Signup';
import Selectionpage from './pages/Selectionpage';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Userpage from './pages/Userpage';
import Dronepage from './pages/Dronepage';
import Resultpage from './pages/Resultpage';
import Blogpage from './pages/Blogpage';
import ImageViewerPage from './pages/ImageViewerPage';
import AlertTest from './components/AlertTest';






function App() {
  //let items = ["Newyork", "Berlin", "Paris", "Rome"];
  



  const handleSelectItem = function(item) {
    console.log(item);
  };
  


  const [alertVisibile, setAlertVisibility] = useState(false);


  const [data, setData] = useState({}); // Initialize with an empty object
  const items = Object.keys(data);
  useEffect(() => {
    // Send a GET request to the Flask API
    axios.get('http://127.0.0.1:5000/get')
      .then(response => {
        setData(response.data); // Store the entire JSON object
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
/*     <div className="App">
      <h2>Fetch Data from Flask Backend</h2>
      <p>Data received from Flask:</p>
      <ul>
        {Object.keys(data).map(key => (
          <li key={key}>
            <strong>{key}:</strong> {data[key].Area}
          </li>
        ))}
      </ul>
    
    
    <h1>React Dropdown Example</h1>
    <Dropdown />
    <ListGroup
        items={items}
        heading="Cities"
        onSelectItem={handleSelectItem}
      />     

      {alertVisibile && (
        <Alert onClose={() => setAlertVisibility(false)}>My alert</Alert>
      )}
      <Button color={"primary"} onclick={() => setAlertVisibility(true)}>
        my button
      </Button>

      <Login/>
    </div> */







    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/selection" element={<Selectionpage/>}></Route>
      <Route path="/user" element={<Userpage/>}></Route>
      <Route path="/drone" element={<Dronepage/>}></Route>
      <Route path="/result" element={<Resultpage/>}></Route>
      <Route path="/blog" element={<Blogpage/>}></Route>
      <Route path="/imageviewer" element={<ImageViewerPage/>}></Route>
      <Route path="/alert" element={<AlertTest/>}></Route>




    </Routes>
      
    </BrowserRouter>




  )
}

export default App
