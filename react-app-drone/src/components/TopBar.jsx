import {AuthDetails,userSignout} from "./AuthDetails";
import "./topbar.css"
import HomeIcon from '../assets/Homeicon.png';
import { Link } from "react-router-dom"; // Import Link


function TopBar() {

  const authUser = AuthDetails();

  return (
    <div className="top">
        <div className="topLeft">
            <img className="topImg" src={HomeIcon} alt="Homeicon" />
        </div>

        <div className="topCenter">
        <ul className="topList">
          <li className="topListItem">
            <Link to="/">Home</Link>
          </li>
          <li className="topListItem">
            <Link to="/blog">Blog</Link>
          </li>
        </ul>
      </div>
        
        <div className="topRight">
          <div className="topRightAuth">
            
              <div>
                
          {authUser ? (
            <>
              <p>{`Signed In as ${authUser.displayName}`}</p>
              <button type="button" className="btn btn-success" onClick={userSignout}>Sign Out</button>
            </>
          ) : (
            <p>Signed Out</p>
          )}
        </div>          
    </div>
        </div>
    </div>
  )
}

export default TopBar