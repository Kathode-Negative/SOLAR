import React, { useState, useEffect } from "react";
import { getFromLocal } from "../components/Utility/Data";
import { fetchFavorites, addFavorite, removeFavorite } from "../components/FavoriteData";
import { Link, useNavigate } from 'react-router-dom';
import "./../assets/styles/GUI.css"
import './../assets/styles/fonts.css'
import { GET } from "../api/fetchRequests";

/**
 * Seite zur Verwaltung der Favoriten eines Benutzers.
 * @component
 */
const Favorites = () => {
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [planets,setPlanets] = useState([])

    const fetchPlanets = async () =>{
        try{
          const response = await GET('/api/allPlanets');
          if(response.ok){
            const data = await response.json();
            setPlanets(data.planets);
            console.log('fetched planets')
          }
        }catch(e){
            console.log(e)
            console.log('error fetched planets')
        }
    }
    /**
     * Ruft die Benutzerdaten und Favoriten aus der API ab.
     * @async
     */
    const fetchData = async () => {
        const token = getFromLocal("authToken");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("/api/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.user.name == 'null' ? "":data.user.name);
                setEmail(data.user.email);
                setProfileImage(data.user.profileImage == 'null' ? false : '/api/'+data.user.profileImage);
                
                
            } else {
                console.error("Failed to fetch user data");
                navigate("/login");
            }
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            navigate("/login");
        }
    };

    useEffect(() => {
        fetchData();
        console.log('calling planets')
        fetchPlanets();
        fetchFavorites(setFavorites);
    }, []);

    return (
        <div className="flex items-center justify-center h-full p-10">
            <div className="bg-large w-full h-full max-w-4xl rounded-lg flex overflow-hidden">
                {/* Sidebar  */}
                <div className="w-1/3 bg-medium flex flex-col items-center p-6 h-full">
                    {profileImage ? (
                        <img
                        alt=" Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-500"
                        src = {profileImage}
                    />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-gray-200 text-center outline outline-gray-300">
                                 profile picture
                            </div>
                    )}
                    <h2 className="mt-4 text-lg font-semibold text-white">{username ? username : email}</h2>
                    <nav className="mt-6 w-full">
                        <ul className="text-center space-y-4">
                        <li ><button className="py-2 hover:bg-gray-700 rounded-lg w-full cursor-pointer text-white" onClick={() => {navigate('/profile')}}>Profile information</button></li>
                            <li ><button className="py-2 hover:bg-gray-700 rounded-lg w-full cursor-pointer text-white" onClick={() => {navigate('/history')}}>Booking History</button></li>
                            <li className="py-2 bg-small rounded-lg text-black font-semibold cursor-pointer">Favorites</li>
                        </ul>
                    </nav>
                </div>
                <div className="flex flex-col w-2/3">
                    <h2 className="text-2xl font-semibold p-8 text-white overflow-hidden">Favorites</h2>
                    {/* Main Content  */}
                    <div className="bg-large w-full p-8 overflow-y-auto h-full">
                        <div className="bg-medium p-6 rounded-lg w-full text-white text-center mb-8">
                            {(favorites.length > 0)&&(planets.length > 0) ? (
                                planets
                                    .filter((planet) => favorites.includes(planet.name))
                                    .map((planet, index) => (
                                        <div key={index} className="flex  items-center justify-between border-b border-gray-700 pb-1 py-1">
                                            <div className="flex items-center">
                                                <img
                                                    src={planet.image}
                                                    alt={planet.name}
                                                    className="h-20 object-contain mr-4"
                                                    style={{ maxWidth: "4rem" }}
                                                />
                                                <span className="text-white solar text-lg">{planet.name.toUpperCase()}</span>
                                            </div>
                                            <button
                                                className="general-button outline-[#c3b088] bg-small text-white font-bold w-10 h-10 p-0 flex items-center justify-center rounded-full hover:bg-[#dca450d9]"
                                                onClick={() => removeFavorite(planet.name, setFavorites)}
                                            >
                                                <div className="h-0.5 w-3 bg-white"></div>
                                            </button>
                                        </div>
                                    ))
                            ) : (
                                <p className="text-white text-lg">You haven't added any planets to your favorites yet.</p>
                            )}
                        </div>
        
                        <div className="flex flex-col items-center mt-6">
                            <button
                                className="general-button bg-white text-black w-auto"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                Add Favorites
                            </button>
        
                            {/* Dropdown Menu */}
                            {(showDropdown && planets) && (
                                <div className="bg-medium p-6 rounded-lg text-white text-center mt-4 w-full">
                                    {planets
                                        .filter(planet => !favorites.includes(planet.name))
                                        .map((planet, index) => (
                                            <div key={index} className="flex items-center justify-between border-b border-gray-700 pb-1 py-1">
                                                <div className="flex items-center">
                                                    <img
                                                        src={planet.image}
                                                        alt={planet.name}
                                                        className="h-20 object-contain mr-4"
                                                        style={{ maxWidth: "4rem" }}
                                                    />
                                                    <span className="text-white solar text-lg">{planet.name.toUpperCase()}</span>
                                                </div>
                                                <button
                                                    className="general-button outline-teal-500 bg-teal-500 text-white font-bold w-10 h-10 p-0 flex items-center justify-center rounded-full hover:bg-teal-700 relative"
                                                    onClick={() => addFavorite(planet.name, setFavorites)}
                                                    >
                                                    <div className="absolute h-0.5 w-3 bg-white"></div>
                                                    <div className="absolute h-3 w-0.5 bg-white"></div>
                                                 </button>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Favorites;