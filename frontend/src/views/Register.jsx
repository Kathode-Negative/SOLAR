import React from "react";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import FileUploader from "../components/UI/FileUploader";
import './../assets/styles/GUI.css'
import { generateFormData, POST } from "../api/fetchRequests";

/**
 * Verwaltet die Benutzerregistrierung. Nutzer können sich mit E-Mail, Passwort und einem optionalen Profilbild registrieren.
 *
 * @returns {JSX.Element} Die Registrierungsseite.
 */
const Register = () => {
    const navigate = useNavigate();

    const [email,setMail] = useState("");

    const [password,setPassword] = useState('');
    const [profileImage, setPicture] = useState(null);

    const [errorVisibility, setErrorVisibility] = useState("text-pretty m-0 text-red-400 align-middle invisible");
    const [fieldColor, setFieldColor] = useState("p-2 m-2 text-white bg-medium align-middle rounded-lg w-3/4 max-w-60");    
    const [errorText,setErrorText] = useState("User with this Email already exists.");

    /**
     * Speichert das hochgeladene Profilbild.
     * @param {File} file - Das hochgeladene Bild.
     */
    const uploadPicture = (file) => {
        let img = file
        if(img != null){
            setPicture(file);
        }
    }

    /**
     * Registriert einen neuen Benutzer, falls die E-Mail noch nicht vergeben ist.
     * @async
     */
    const addUserIfNew = async () => {
        try {
            const body = { email:email, password:password};
            const data = generateFormData(body)
            data.append('file',profileImage);
            const response = await POST('/api/register',{},
                data
            )
            if (response.ok) {
                navigate("/login");
            } else {
                setErrorText(response.message)
                setErrorVisibility("text-pretty m-2 text-red-600 visible ");
                setFieldColor("p-2 m-2 text-white bg-medium align-middle rounded-lg outline outline-red-600 w-3/4 max-w-60");
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };


    return (
        <div className="flex items-center  justify-center min-h-full bg-black overflow-hidden">
            <div className="bg-large  w-min-1/3 m-2  p-11  rounded-lg  items-center overflow-hidden  justify-center flex flex-col">
                <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl -m-6  text-center">
                   Register
                </h1>
                <div className="bg-small p-6 mt-12 justify-center items-center  rounded-lg flex flex-col"> 
                    <label className="text-black sm-text-sm">
                        E-mail
                    </label>
                    <input className={fieldColor}
                        type = "text" 
                        value = {email}
                        onChange={e => setMail(e.target.value)}
                    />

                    <label className="text-black sm-text-sm">
                        Password
                    </label>
                    <input className={fieldColor}
                        type = "text"
                        value = {password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <label className={errorVisibility} >
                        {errorText}
                    </label>
                    
                    <label className="text-black sm-text-sm">
                        Profile Picture
                    </label>
                    

                    <FileUploader accept="image/*" className="text-white m-2 rounded-xl bg-medium w-52 h-28" handleFile={uploadPicture} label={"Upload Picture"} isImage="true"/>
                    
                    <button 
                        onClick={()=>{addUserIfNew()}}
                        className="form-button roboto-bold">
                        Register
                    </button>
                </div>
            </div>
        </div> 
    )
}

export default Register;