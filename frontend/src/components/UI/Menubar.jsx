import React, { useState, useEffect } from 'react';
import { Link,useLocation} from 'react-router-dom';
import Logo from './../../assets/images/svgs/Solar.svg';
import { getFromLocal, deleteFromLocal, validateTokenFromBackend } from '../Utility/Data.jsx';


/**
 * Die Navigationsleiste der Anwendung.
 * @component
 */
const MenuBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { pathname } = useLocation()

  /**
   * Überprüft bei jeder Routenänderung, ob der Benutzer angemeldet ist.
   */
  useEffect(() => {
    validateTokenFromBackend().then(res =>{
      if (res) {
        setIsLoggedIn(true);
      } else {
        deleteFromLocal('authToken')
        setIsLoggedIn(false);
      }
    })
  }, [pathname]);

  /**
   * Behandelt den Logout des Benutzers.
   */
  const handleLogout = () => {
    deleteFromLocal("authToken")
    setIsLoggedIn(false)
  }

  
  
  const onHoverAnimation = "relative block whitespace-nowrap after:block after:content-[''] "+
                           "after:absolute after:h-[2px] after:mt-1 after:bg-white "+
                           "after:w-full after:scale-x-0 after:hover:scale-x-100 "+
                           "after:transition after:duration-200 after:origin-center";
  const img = (<img src = {Logo} style = {{height: '60%' }}/>);
  
  

  return (
    <header className="h-13 bg-black text-white flex items-center px-4 m-2 justify-between">
      {img} 
      <div className="flex flex-row gap-x-5 md:gap-x-18 sm:gap-x-10 lg:gap-x-20">
        <Link to="/" className={onHoverAnimation}>Home</Link>
        <Link to="/myroute" className={onHoverAnimation}>Plan Route</Link>
        {isLoggedIn ? null : <Link to="/register" className={onHoverAnimation}>Register</Link>}
        {isLoggedIn ? <Link to="/profile" className={onHoverAnimation}>Profile</Link> :
          <Link to="/login" className={onHoverAnimation}>Log In</Link>}
        {isLoggedIn ? <Link to="/logout" className={onHoverAnimation} onClick={handleLogout} >Log Out</Link> : null}
      </div>
    </header>
  );
}
export default MenuBar;