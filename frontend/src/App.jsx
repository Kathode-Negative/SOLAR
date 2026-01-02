import { Route, Routes } from 'react-router-dom';
import Menubar from './components/UI/Menubar';
import { Auth } from './components/Utility/Auth';
import Favorites from './views/Favorites';
import History from './views/History';
import Home from './views/Home';
import Login from './views/Login';
import Logout from './views/Logout';
import MyRoute from './views/MyRoute';
import Profile from './views/Profile';
import Register from './views/Register';

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
            <Route path="/myroute" element={<Auth elements = {<MyRoute/>}/>}/>
            <Route path="/history" element={<Auth elements = {<History/>}/>}/>
            <Route path="/favorites" element={<Auth elements = {<Favorites/>}/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App
