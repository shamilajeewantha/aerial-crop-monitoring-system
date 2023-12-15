import "./header.css"
import {AuthDetails} from "./AuthDetails";
import { useNavigate } from 'react-router-dom';





function Header() {

  const navigate = useNavigate();

  const authUser = AuthDetails();

  const handleGetstared = () => {
    // Use navigate with the state object
    if (authUser){navigate('/selection');} else {navigate('/login');}
    
  };






  return (
<div className="header">
  <div className="headerTitles">
    <span className="headerTitleLg">Welcome</span>
    <div className="bg-transparent p-3 rounded w-25" style={{ position: 'absolute', top: '58%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <button className="btn btn-outline-dark w-100 rounded-10 text-decoration-none custom-button" onClick={handleGetstared}>
        Get Started
      </button>
    </div>
  </div>
</div>

  )
}

export default Header

