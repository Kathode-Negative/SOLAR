
import React, {  useEffect, useState  } from "react";
import { deleteFromLocal, getFromLocal, validateTokenFromBackend} from "../components/Utility/Data";
import { Link,useNavigate,useLocation } from 'react-router-dom';
import FileUploader from "../components/UI/FileUploader";
import "./../assets/styles/GUI.css"
import { generateFormData, GET, POST } from "../api/fetchRequests";

/**
 * Verwaltet das Benutzerprofil. Erlaubt das Anzeigen und Bearbeiten von Benutzerinformationen.
 * @returns {JSX.Element} Die Profilseite des Benutzers.
 */
const Profile = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation()

    const [fetched, setFetched] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [urlProfileImage, setUrlProfileImage] = useState(null);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [userId, setUserId] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    
    /**
     * Ruft die Benutzerinformationen aus der API ab.
     * @async
     */
    const fetchData = async () => {
        const token = getFromLocal('authToken')
        if(!token){
            navigate('/')
        }
        const response = await GET('/api/profile',{
            'Content-Type': 'application/json',
            'authorization':  token,
        })
        if(!response.ok){
            const { error, message, details } = await response.json();
            throw new Error(`[LoginSSA] HTTP error!
                    status: ${response.status}
                    error: ${error}
                    message: ${message}
                    details: ${details}`);
        }else{
            const data = await response.json();
            const user = data.user;      
            setEmail(user.email);
            setUsername(user.name == 'null' ? "":user.name);
            setPhoneNumber(user.phoneNumber == 'null' ? "":user.phoneNumber);
            setUrlProfileImage(user.profileImage == 'null' ? false : '/api/'+user.profileImage);

            setFetched(true);
        } 
    }

    if(!hasChanges && !fetched){
        try{
            fetchData()
        }catch(error){
            console.error(error.message);
            navigate("/login");
        }
    }
    
    /**
     * Speichert das hochgeladene Bild und generiert eine URL-Vorschau.
     * @param {File} e - Die hochgeladene Bilddatei.
     */
    const handlePictureUpload = (e) => {
        const file = e;
        if (file != null) {
            setProfileImage(file);
            setUrlProfileImage(URL.createObjectURL(file));
            setHasChanges(true);
        }
    };

    /**
     * Aktualisiert den Benutzernamen.
     * @param {Event} e - Das Eingabeereignis.
     */
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setHasChanges(true);
    };

    /**
     * Aktualisiert die Telefonnummer.
     * @param {Event} e - Das Eingabeereignis.
     */
    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
        setHasChanges(true); 
    };

    /**
     * Speichert die aktualisierten Profilinformationen.
     * @async
     */
    const handleSave = async () => {
        const token = getFromLocal('authToken')
        if (!token) {
            console.error("No user is logged in.");
            return;
        }
        try {
            const token = getFromLocal('authToken')
            // put any images in "file" key
            const body = {      
                email: email,
                name: username,
                phoneNumber: phoneNumber
            }
            const data = generateFormData(body);
            data.append('file',profileImage);
            for (var e of data.entries()){
                console.log(e[0] + " - "+ e[1])
            }
            const response = await POST('/api/profile',
                {
                    'authorization':  token,
                },
                data)
            if (response.ok) {
                setFetched(false);
                setHasChanges(false);
            } else {
                const errorData = await response.json();
                console.error('Error updating profile:', errorData);
                alert(`Error: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Error during profile update:', err);
            alert('Something went wrong while saving the profile.');
        }
    };
    
    /**
     * Speichert das Profil beim Drücken der Enter-Taste.
     * @param {Event} e - Das Tastaturereignis.
     */
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSave();
        }
    };

    return (
        <div className="flex items-center justify-center h-full p-10">
            <div className="bg-large w-full h-full max-w-4xl rounded-lg flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 bg-medium flex flex-col items-center p-6">
                    <div className="relative">
                        {urlProfileImage ? (
                            <img
                                src={urlProfileImage}
                                alt=" Profile"
                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-500"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-gray-200 text-center outline outline-gray-300">
                                 profile picture
                            </div>
                        )}
                         
                         <FileUploader
                            accept="image/*"
                            className= "absolute bottom-0 right-0 bg-small rounded-full pb-2 pt-1 pr-1 pl-1 cursor-pointer material-icons text-black text-sm text-center" 
                            handleFile={handlePictureUpload} 
                            label={"edit"}
                        />                        
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-center text-white">{username? username : email}</h2>
                    <nav className="mt-6 w-full">
                        <ul className="text-center space-y-4">
                        <li className="py-2 bg-small rounded-lg text-black font-semibold cursor-pointer">Profile information</li>
                            <li ><button className="py-2 hover:bg-gray-700 rounded-lg w-full cursor-pointer text-white" onClick={() => {navigate('/history')}}>Booking History</button></li>
                            <li><button className="py-2 hover:bg-gray-700 rounded-lg w-full cursor-pointer text-white" onClick={() => {navigate('/favorites')}}>Favorites</button></li>
                        </ul>
                    </nav>
                </div>
                {/* Main Content */}
                <div className="w-2/3 p-8">
                    <h2 className="text-2xl font-semibold text-white mb-6">Personal Information</h2>
                    
                    <div className="bg-small p-6 rounded-lg text-black mb-8">
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Email:</label>
                            <input
                                type="email"
                                value={email}
                                className="w-full bg-[#2d2d2d] text-white rounded-md p-2 mt-1"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Name:</label>
                            <input
                                type="text"
                                value={username}
                              onChange={handleUsernameChange} 
                                className="w-full bg-medium text-white rounded-md p-2 mt-1"
                                placeholder={username}
                            />
                        </div>
                       
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Phone:</label>
                            <input
                                type="text"
                                value={phoneNumber}
                               onChange={handlePhoneNumberChange}   
                               className="w-full bg-medium text-white rounded-md p-2 mt-1"
                                placeholder={phoneNumber}
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => { handleSave() }}
                                 className={`w-1/2 ${
                                    hasChanges ? "form-button hover:bg-zinc-400" 
                                                : "form-button bg-zinc-400 outline-zinc-400 hover:bg-zinc-400 text-zinc-700 border-none"
                                } font-semibold`}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;
