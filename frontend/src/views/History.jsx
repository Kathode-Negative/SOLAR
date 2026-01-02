import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BookingComponent from "../components/UI/Route/BookingComponent";
import { getFromLocal } from "../components/Utility/Data";


/**
 * Die `History`-Komponente zeigt die Buchungshistorie eines Benutzers an.
 * @returns {JSX.Element} Die `History`-Ansicht mit Buchungen und Benutzerprofil.
 */
const History = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [email,setEmail] = useState('');
    const [username, setUsername] = useState("");
    const [profileImage,setProfileImage] = useState(null);


    useEffect(() => {
        fetchData();

        const fetchUserRoutes = async () => {
            const token = getFromLocal('authToken')
            try {
                const response = await fetch("/api/userRoutes", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': token
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Fehler beim Laden der Routen");
                }

                const data = await response.json();

                const bookedRoutes = data.routes
                setBookings(bookedRoutes);
            } catch (error) {
                console.error("Fehler: " + error);
            }
        };

        fetchUserRoutes();
    }, []);

    /**
     * Ruft die Benutzerinformationen vom Server ab.
     * @async
     */
    const fetchData = async () => {
        const token = getFromLocal('authToken')
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("/api/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token,
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




    return (
        <div className="flex items-center justify-center h-full p-10">
            <div className="bg-large w-full h-full max-w-4xl rounded-lg flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 bg-medium flex flex-col items-center p-6">
                    <div className="relative">
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
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-white">{username ? username : email}</h2>
                    <nav className="mt-6 w-full">
                        <ul className="text-center space-y-4">
                        <li ><button className="py-2 hover:bg-gray-700 rounded-lg w-full cursor-pointer text-white" onClick={() => {navigate('/profile')}}>Profile information</button></li>
                        <li className="py-2 bg-small rounded-lg text-black font-semibold cursor-pointer">Booking History</li>
                            <li><button className="py-2 hover:bg-gray-700 rounded-lg w-full cursor-pointer text-white" onClick={() => {navigate('/favorites')}}>Favorites</button></li>
                        </ul>
                    </nav>
                </div>
                {/* Main Content */}
                <div className="flex flex-col w-2/3">
                    <h2 className="text-2xl font-semibold p-8 text-white overflow-hidden">Booking History</h2>
                    <div className="w-full bg-large p-8 h-full overflow-y-auto">
                        {bookings.length > 0 ? (
                            bookings.slice().reverse().map((trip,index) => <BookingComponent key={index} trip={trip} />)
                        ) : (
                            <p className="text-white text-center">No bookings available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;