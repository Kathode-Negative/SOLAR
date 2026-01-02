import { Navigate, Route, Routes } from 'react-router-dom';
import Register from './views/Register';
import Login from './views/Login';
import Logout from './views/Logout';
import Home from './views/Home';
import Menubar from './components/UI/Menubar';
import Profile from './views/Profile';
import MyRoute from './views/MyRoute';
import History from './views/History';
import Favorites from './views/Favorites';
import { Auth } from './components/Utility/Auth';

const App = () => {

  return (
    <div className="mx-auto ">
      <div className="flex flex-col h-screen bg-black ">
        <Menubar />
        <div className="flex-1 overflow-y-auto  bg-black">
          <Routes>          
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/profile" element={<Auth elements = {<Profile/>}/>}/>
            <Route path="/myroute" element={<MyRoute/>}/>
            <Route path="/history" element={<Auth elements = {<History/>}/>}/>
            <Route path="/favorites" element={<Auth elements = {<Favorites/>}/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App
