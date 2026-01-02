import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './../assets/styles/MyRoute.css';
import './../assets/styles/GUI.css'
import './../assets/styles/fonts.css'
import PlanetPopup from '../components/UI/BookingPopup/PlanetPopup';
import RouteHistoryPanel from '../components/UI/Route/RouteHistoryPanel';
import PlanetInfoPopup from '../components/UI/PlanetInfoPopup';
import RoutePanel from '../components/UI/Route/RoutePanel';
import { fetchFavorites, addFavorite, removeFavorite } from "../components/FavoriteData";
import { GET } from '../api/fetchRequests';

/**
 * Funktion zur Planung einer individuellen Reise.
 * Benutzer können Planeten auswählen, ihre Route verwalten und Buchungen vornehmen.
 *
 * @returns {JSX.Element} Die UI für die Routenplanung.
 */
const MyRoute = () => {
  const [selectedPlanets, setSelectedPlanets] = useState([]);
  const [currentPlanet, setCurrentPlanet] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [favorites, setFavorites] = useState([]);
  const [planets,setPlanets] = useState(null)

  /**
   * Ruft die Liste aller Planeten aus der API ab.
   * @async
   */
  const fetchPlanets = async () =>{
    try{
      const response = await GET('/api/allPlanets');
      if(response.ok){
        const data = await response.json();
        setPlanets(data.planets);
      }
    }catch{
    }
  }

  useEffect(() => {
    fetchFavorites(setFavorites);
    fetchPlanets();
  }, []);

  if(!planets){
    return (<div className="flex items-center justify-center h-full p-10">
      <div className="flex items-center w-full h-full rounded-3xl overflow-clip">
        Loading ...
        </div></div>)
  }

  /**
   * Schließt das Buchungspopup.
   */
  const handleRemovePopup = () => {
    setOpenPopup(false);
  };

  /**
   * Schließt das Info-Popup für einen Planeten.
   */
  const handleRemoveInfo = () => setOpenInfo(false);

  /**
   * Setzt den aktuell ausgewählten Planeten.
   * @param {Object} p - Der Planet, der gesetzt werden soll.
   */
  const handleSetCurrentPlanet = (p) => {
    setCurrentPlanet(p);
  };

  /**
   * Fügt einen Planeten zur Route hinzu oder entfernt ihn.
   * @param {Object} planet - Der ausgewählte Planet.
   */
  const handlePlanetClick = (planet) => {
    if (selectedPlanets.includes(planet)) {
      const index = selectedPlanets.indexOf(planet);
      if (index !== -1) {
        selectedPlanets.splice(index, 1);
      }
    } else {
      selectedPlanets.push(planet);
    }
    
  };

 

  return (
    <div className="flex items-center justify-center h-full p-10">
      <div className="flex items-center w-full h-full rounded-3xl overflow-clip">
        <div className="flex flex-col w-2/3 h-full">
          <div className="w-full h-3/5 bg-large">
            <RoutePanel className="flex items-center h-full justify-center w-full" planets={planets} addPlanet={handlePlanetClick} setCurrentPlanet={handleSetCurrentPlanet} />
          </div>
          <div className="flex items-center justify-center h-2/5 w-full bg-small p-2 text-2xl md:text-2xl font-semibold text-white">
              {selectedPlanets.length > 0 ? (
                <div className="flex items-center justify-between w-full h-full">
                  <div className="flex-shrink-0 flex items-center justify-center max-h-full p-2">
                    <img
                      src={currentPlanet?.image}
                      alt={currentPlanet?.name}
                      className="w-[12vw] h-[25vh] object-contain"
                    />
                  </div>
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="flex w-full h-1/2">
                      <div className="flex items-center justify-center w-1/2 h-full">
                        <h3 className="text-[5.5vh] solar text-white text-center">
                          {currentPlanet?.name.toUpperCase()}
                        </h3>
                      </div>
                      <div className="w-1/2 h-full"></div>
                  </div>
                  <div className="flex items-center justify-center w-full h-1/2">
                    <div className="flex items-center justify-center gap-[1vw] h-full w-1/2">
                      <button
                        className="general-button bg-white px-[1.5vw] py-[1vh] text-[1vw] leading-tight rounded-xl"
                        style={{ fontSize: "min(1.5vw, 3.5vh)" }}
                        onClick={() =>
                          favorites.includes(currentPlanet?.name)
                            ? removeFavorite(currentPlanet.name, setFavorites)
                            : addFavorite(currentPlanet.name, setFavorites)
                        }
                      >
                        {favorites.includes(currentPlanet?.name) ? "♥️" : "🤍"}
                      </button>
                      <button
                        className="general-button bg-white px-[1.5vw] py-[1vh] text-[1vw] leading-tight rounded-xl"
                        style={{ fontSize: "min(1.5vw, 3.5vh)" }}
                        onClick={() => setOpenInfo(true)}
                      >
                        Info
                      </button>
                    </div>

                    <div className="flex items-center justify-end h-full w-1/2 pr-[2vw]">
                      {selectedPlanets.length > 1 ? (
                        <button
                          className="general-button bg-white px-[1.5vw] py-[1vh] text-[1vw] leading-tight rounded-xl whitespace-nowrap"
                          style={{ fontSize: "min(1.5vw, 3.5vh)" }}
                          onClick={() => setOpenPopup(true)}
                        >
                          Book Route
                        </button>
                      ) : (
                        <div className="invisible">
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              ) : (
                "Click on planets you want to add to your route"
              )}
            </div>
          </div>
          <RouteHistoryPanel className="flex items-center bg-medium justify-center w-1/3 h-full" planets={selectedPlanets} direction="vertical" animate={true} />
      </div>

      <PlanetPopup openPopup={openPopup} closePopup={handleRemovePopup} selectedPlanets={selectedPlanets} startDate={startDate}></PlanetPopup>
      <PlanetInfoPopup openInfo={openInfo} closeInfo={handleRemoveInfo} currentPlanet={currentPlanet}></PlanetInfoPopup>
    </div>
  );
};

export default MyRoute;