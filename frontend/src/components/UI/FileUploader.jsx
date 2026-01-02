import React, { useRef, useState } from "react";

import './../../assets/styles/GUI.css'


// inspired by 
// https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8

/**
 * Eine benutzerdefinierte Datei-Upload-Komponente.
 * Ermöglicht das Hochladen von Dateien mit einem anpassbaren Button.
 * @param {Object} props - Die Eigenschaften der Komponente.
 * @param {Function} props.handleFile - Eine Callback-Funktion zum Verarbeiten der hochgeladenen Datei.
 * @param {string} props.label - Der Label-Text für die Upload-Schaltfläche.
 * @param {string} [props.className] - Zusätzliche Tailwind-Klassen für Styling.
 * @param {string} [props.accept] - Die akzeptierten Dateitypen (z. B. 'image/*').
 * @param {boolean} [props.isImage] - Falls true, wird das hochgeladene Bild als Hintergrund angezeigt.
 */
const FileUploader = ({handleFile,label,className,accept,isImage}) => {

    const [bgImage,setBgImage] = useState(null);

    /**
     * Setzt die hochgeladene Datei als Hintergrundbild.
     * @param {Event} e - Das Upload-Event.
     */
    const handleBgImage = e =>{
        setBgImage(URL.createObjectURL(e.target.files[0]))
    }

    const hiddenInput = useRef(null);

    /**
     * Simuliert einen Klick auf das versteckte Datei-Upload-Element.
     */
    const handleClick = e => {
        hiddenInput.current.click();
    }
    
    /**
     * Übergibt die hochgeladene Datei an die übergebene `handleFile`-Funktion.
     * @param {Event} e - Das Upload-Event.
     */
    const handleUpload = e =>{
        handleFile(e.target.files[0]);
    }

    return (
        <div onClick={handleClick}>
        {bgImage ? <img className={ "z-0 "+"cursor-pointer " + (className ? className : "general-button") + (isImage ? " object-cover":"")}  src={bgImage}/>
        :<div className={"cursor-pointer flex flex-col items-center justify-center text-center " + (className ? className : "general-button")}>{label}</div>}
        <input className="hidden" type="file" accept={accept === null ? "*" : accept} onChange={isImage ? (e) => {handleBgImage(e); handleUpload(e)}:handleUpload } ref={hiddenInput}/>
        </div>
    )
}

export default FileUploader;
