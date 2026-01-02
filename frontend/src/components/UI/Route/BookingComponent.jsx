import React, { useState, useEffect } from "react";
import { getFromLocal } from "../../Utility/Data";
import RouteHistoryPanel from "./RouteHistoryPanel";
import './../../../assets/styles/GUI.css'

const BookingComponent = ({ trip }) => {



    const [planetList, setPlanetList] = useState([]);
    const imageSrc = "/images/RoutePic.png";

    const getPlanets = async () => {


        try {
            const token = getFromLocal("authToken")
            const response = await fetch("/api/getPlanets", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token,
                },
                body: JSON.stringify({ id: trip.id })
            })
            if (response.ok) {
                const data = await response.json()
                return data.planetList;

            } else {
                return null
            }

        } catch (error) {
        }
    }

    useEffect(() => {
        const fetchPlanets = async () => {
            const planetList = await getPlanets();
            setPlanetList(planetList)
        };

        fetchPlanets();
    }, [trip.id]);

    const lastPlanet = planetList[planetList.length - 1]
    var lastPlanetName;
    if (lastPlanet) {
        lastPlanetName = lastPlanet.name
    } else {
        lastPlanetName = "can't find planet name"
    }



    return (
        <div className="bg-small rounded-lg p-4 flex items-center justify-between mb-4 shadow-lg">
            <div className="flex items-center">

                <div className="ml-4">
                    <h3 className="text-lg font-semibold text-black">
                        {trip.name}
                    </h3>
                    <p className="text-md font-bold text-black">Destination: {lastPlanetName || "Unknown Destination"}</p>
                    {planetList.length > 0 ? (
                        <RouteHistoryPanel
                            className="h-[100px] w-[300px] bg-medium p-2 rounded-lg"
                            planets={planetList}
                            direction="horizontal"
                        />
                    ) : (
                        <p>Loading route...</p>
                    )}
                </div>
            </div>
            <button className="border border-black px-4 py-2 rounded-lg text-black hover:bg-gray-300">
                Cancel Trip
            </button>
        </div>
    );
};

export default BookingComponent;




