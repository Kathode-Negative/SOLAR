import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToLocal} from '../components/Utility/Data';

/**
 * Die `LoginSSA`-Funktion ermöglicht die Anmeldung eines Benutzers.
 * Benutzer können ihre E-Mail und ihr Passwort eingeben, um sich anzumelden.
 * Nach erfolgreicher Anmeldung wird ein Token gespeichert und zur Startseite navigiert.
 *
 * @returns {JSX.Element} Die Login-Seite mit Eingabefeldern und Anmeldebutton.
 */
const LoginSSA = () => {
    const navigate = useNavigate();

    const [email, setMail] = useState("");
    const [pass, setPass] = useState("");

    const [errorVisibility, setErrorVisibility] = useState("text-pretty m-0 text-red-400 align-middle invisible");
    const [fieldColor, setFieldColor] = useState("p-2 m-2 text-white bg-medium align-middle rounded-lg w-3/4 max-w-60");
    
    /**
     * Sendet die Anmeldedaten an das Backend zur Validierung.
     * Bei Erfolg wird ein JWT-Token im Local Storage gespeichert.
     * @async
     */
    const handleSubmit = async () => {
        try {

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email:email, password: pass}),
            });

            if (!response.ok) {

                const { error, message, details } = await response.json();
                throw new Error(`[LoginSSA] HTTP error!
                        status: ${response.status}
                        error: ${error}
                        message: ${message}
                        details: ${details}`);
            }else{
                const data = await response.json();

                saveToLocal('authToken', data.token);
                navigate("/");   
            }
        }
        catch (error) {
            setErrorVisibility("text-pretty m-2 text-red-600 visible ");
            setFieldColor("p-2 m-2 text-white bg-medium align-middle rounded-lg outline outline-red-600 w-3/4 max-w-60");
        }

    }

    return (
        <div className="flex items-center justify-center min-h-full bg-black overflow-hidden">
            <div className="bg-large  w-min-1/3 m-2  p-11  rounded-lg  items-center overflow-hidden  justify-center flex flex-col">
                <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl -m-6  text-center">
                    Log In
                </h1>
                <div className="bg-small  p-6 mt-12 justify-center items-center  rounded-lg flex flex-col">
                    <label className="text-black sm-text-sm">
                        E-Mail
                    </label>
                    <input className={fieldColor}
                        type="text"
                        onChange={(e) => setMail(e.target.value)}
                    />
                    <label className="text-black sm-text-sm">
                        Password
                    </label>
                    <input className={fieldColor}
                        type="text"
                        onChange={(e) => setPass(e.target.value)}
                    />
                    <label className={errorVisibility} >
                        E-mail or password are wrong.
                    </label>
                    <button
                        onClick={() => { handleSubmit() }}
                        className="form-button roboto-bold">
                        Log In
                    </button>
                </div>
            </div>
        </div>
    )
};


export default LoginSSA
