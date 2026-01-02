import React, { useEffect, useState } from "react";
import { getFromLocal } from "../../Utility/Data";
import RouteHistoryPanel from "../Route/RouteHistoryPanel";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "react-datepicker/dist/date_utils.d.ts";
import BookingConfirmation from "./BookingModal";
import LoginCheck from "../../Utility/LoginCheckPopup";

/**
 * Popup-Komponente zur Anzeige und Buchung von Routen.
 * @param {Object} props - Die Eigenschaften der Komponente.
 * @param {boolean} props.openPopup - Gibt an, ob das Popup geöffnet ist.
 * @param {Function} props.closePopup - Funktion zum Schließen des Popups.
 * @param {Array} props.selectedPlanets - Liste der ausgewählten Planeten.
 */
const PlanetPopup = ({ openPopup, closePopup, selectedPlanets }) => {

    const [cost, setCost] = useState(0)
    const [time, setTime] = useState(0)
    const [name, setName] = useState("My Route")
    const [endDate, setEndDate] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoginCheckOpen, setIsLoginCheckOpen] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [startDate, setStartDate] = useState(new Date());


    useEffect(() => {
        if (!selectedPlanets || selectedPlanets.length === 0) {
            setCost(0);
            return;
        }
        console.log(startDate)
        let totalCost = 0;
        let totalTime = 0;
        for (const planet of selectedPlanets) {
            const planetCost = planet.orbitRadius
            totalCost += planetCost * 5;
            totalTime += planetCost / 10;
        }
        console.log("start date: " + startDate)
        setTime(totalTime);
        setCost(totalCost);
        setEndDate(addDays(startDate, totalTime))
        console.log(totalCost)
        console.log(totalTime)
    }, [openPopup, startDate]);


    /**
     * Behandelt das Klicken außerhalb des Popups, um es zu schließen.
     * @param {Event} e - Das Klick-Event.
     */
    const handlePopup = (e) => {
        if (e.target.id === "PopupContainer") {
            closePopup();
        }

    };

    /**
     * Schließt das Popup über den Button.
     */
    const closePopupButton = () => {
        closePopup();
    };

    if (openPopup !== true) return null;

    /**
     * Sendet die Buchungsanfrage an den Server.
     */
    const handleBooking = async () => {
        try {
            console.log("Sending request")
            const token = getFromLocal('authToken')
            const planetsToSend = []
            selectedPlanets.forEach(element => {
                planetsToSend.push(element.id)
            });
            console.log(planetsToSend)
            const response = await fetch('/api/route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token,
                },
                body: JSON.stringify({ name: name, planets: planetsToSend })
            });

            if (!response.ok) {
                const { error, message, details } = await response.json();
                throw new Error(`[PlanetPopup] HTTP error!
                    status: ${response.status}
                    error: ${error}
                        message: ${message}
                        details: ${details}`);
            }

            const data = await response.json()
            setIsModalOpen(true)
            console.log("route has been booked")


        }
        catch (error) {
            console.error("Booking failed:", error.message || error);
            setIsLoginCheckOpen(true)
        }
    };

    return (
        <div
            id="PopupContainer"
            onClick={handlePopup}
            className="fixed inset-0 bg-black flex justify-center items-center bg-opacity-30 backdrop-blur-sm flex animate-fade-in" >
            <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-medium w-1/2 rounded-3xl h-auto w-[1000px] animate-popup-slide-up"
            >
                <div className="p-2 flex justify-center items-center ">
                    {editMode ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                            onBlur={() => {
                                if (name !== "") {
                                    setEditMode(false)
                                }
                            }}
                            onKeyDown={(e) => {
                                if (name !== "") {
                                    if (e.key == "Enter") {
                                        setEditMode(false)
                                    };
                                }
                            }}
                            autoFocus
                            className="p-1 rounded-lg"
                        />
                    ) : (
                        <label onClick={() => {
                            setEditMode(true);
                        }}
                            className="cursor-pointer text-gray-100 text-2xl roboto-regular-italic transition ease-in-out delay-50 bg-medium  hover:scale-110 hover:bg-medium duration-50">
                            {name}
                        </label>
                    )}
                </div>

                <RouteHistoryPanel className="flex items-center bg-medium justify-center w-full h-[200px] mb-6 p-2" planets={selectedPlanets} direction="horizontal"></RouteHistoryPanel>

                <div className="flex flex-row bg-small rounded-t-xl rounded-t-3xl roboto-light">
                    <div className="flex flex-col text-white bg-large p-6 rounded-tr-3xl drop-shadow-xl gap-4 w-1/2 h-auto">
                        <div className="flex flex-row gap-14 bg-medium w-[400px] rounded-xl">
                            <label className="w-40 ml-1 p-2">est. Travel Time</label>
                            <span className="bg-small w-[185px] p-2 rounded-xl text-black roboto-regular-italic pl-4">{time} Days</span>
                        </div>
                        <div className="flex flex-row gap-14 bg-medium w-[400px] rounded-xl">
                            <label className="w-40 ml-1 p-2">est. Cost</label>
                            <span className="bg-small w-[185px] p-2 rounded-xl text-black roboto-regular-italic pl-4">{cost} Credits</span>
                        </div>

                        <div className="flex flex-row gap-14 bg-medium w-[400px] rounded-xl">
                            <label className="w-40 ml-1 p-2">Arrival at location</label>
                            <DatePicker
                                className="bg-small w-[181px] p-2 rounded-xl text-black roboto-regular-italic pl-4"
                                dateFormat="MMMM d, yyyy"
                                selected={endDate}
                                disabled
                            />

                        </div>
                    </div>

                    <div className="flex justify-center items-center w-1/2">
                        <div className="flex flex-col">
                            <span className="absolute top-80 left-50 mt-2 ml-2 text-gray-800 text-sm roboto-medium-italic">Enter a Starting Date</span>
                            <DatePicker className='border-none shadow-lg flex cursor-pointer caret-transparent rounded-l-xl p-6 h-[50px] roboto-light-italic hover:scale-105 hover:bg-gray-200 duration-150 z-60'

                                shouldCloseOnSelect={true}
                                dateFormat="MMMM d, yyyy"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                fixedHeight
                                onKeyDown={(e) => e.preventDefault()}
                                placeholderText="Enter Starting Date"

                            ></DatePicker>
                        </div>
                        <button className="shadow-lg transition ease-in-out delay-50 bg-medium  hover:scale-110 hover:bg-green-400 hover:text-black duration-150 text-white h-[50px] rounded-r-xl p-3 roboto-medium" onClick={handleBooking}>
                            Book Now
                        </button>
                    </div>
                </div>



            </div>
            <BookingConfirmation isOpen={isModalOpen} onConfirm={() => {
                setIsModalOpen(false);
                closePopupButton();
            }

            }></BookingConfirmation>

            <LoginCheck isOpen={isLoginCheckOpen} onConfirm={() => {
                setIsLoginCheckOpen(false);
                closePopupButton();
            }
            }></LoginCheck>
        </div >

    )

}; export default PlanetPopup