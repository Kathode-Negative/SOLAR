import React, { useEffect, useState } from "react";
import Mercury from './../../assets/images/planets/Mercury.png';
import Venus from './../../assets/images/planets/Venus.png';
import Mars from './../../assets/images/planets/Mars.png';
import Saturn from './../../assets/images/planets/Saturn.png';
import Uranus from './../../assets/images/planets/Uranus.png';
import Neptune from './../../assets/images/planets/Neptune.png';
import Earth from './../../assets/images/planets/Earth.png';
import Jupiter from './../../assets/images/planets/Jupiter.png';

/**
 * Enthält Beschreibungen und Bilder der Planeten.
 */
const planetDescriptions = {
  Mercury: {
    image: Mercury,
    description: (
      <>
        Get up close to the Sun on <span className="mercury-color">Mercury</span>! Marvel at
        <span className="mercury-color"> fiery horizons and endless starry nights</span> that tell ancient stories.
        Whether you crave <span className="mercury-color">extreme adventures</span> or{" "}
        <span className="mercury-color">stunning cosmic views</span>,{" "}
        <span className="mercury-color">Mercury</span> offers a one-of-a-kind escape. Book now for an unforgettable interstellar journey!
      </>
    ),
  },
  Earth: {
    image: Earth,
    description: (
      <>
        From crystal-clear oceans to towering mountains, {" "}<span className="earth-color">Earth</span> offers endless adventures and breathtaking scenery. Relax on {" "}<span className="earth-color">pristine beaches</span>, hike {" "}<span className="earth-color">lush forests</span>, or explore{" "}
        <span className="earth-color">vibrant cities</span> filled with rich culture and history. Whether you're seeking {" "}<span className="earth-color">relaxation</span> or {" "}<span className="earth-color">excitement</span>, Earth has it all. Book your perfect getaway today and discover why there’s no place like <span className="earth-color">home</span>!
        </>
    ),
  },
  Jupiter: {
    image: Jupiter,
    description: (
      <>
            Step into a world of <span className="jupiter-color">swirling storms</span>, majestic cloud bands, and the awe-inspiring <span className="jupiter-color">Great Red Spot</span>!{" "}
        <span className="jupiter-color">Jupiter</span> offers breathtaking views, <span className="jupiter-color">mesmerizing moons</span>, and the grandeur of the <span className="jupiter-color">largest planet</span> in the solar system. A must-visit for{" "}
        cosmic explorers and thrill-seekers alike! Book your <span className="jupiter-color">Jupiter adventure</span> now!
      </>
    ),
  },
  Venus: {
    image: Venus,
    description: (
      <>
       Experience the beauty and mystery of <span className="venus-color">Venus</span>! With its
            swirling <span className="venus-color">golden skies</span> and ethereal cloudscapes, <span className="venus-color">Venus</span> is a
            dreamscape like no other. Wander through <span className="venus-color">misty, volcanic plains</span> and enjoy an atmosphere
            of surreal colors and intensity. Perfect for <span className="venus-color">thrill-seekers</span> and romantics alike, <span className="venus-color">Venus</span> promises
            an adventure you'll never forget. Book your celestial getaway now!
          </>
    ),
  },
  Mars: {
    image: Mars,
    description: (
      <>
       Get ready for the thrill of <span className="mars-color">Mars</span>! Explore rugged <span className="mars-color">red landscapes</span>,
            <span className="mars-color"> towering volcanoes</span>, and  <span className="mars-color"> sprawling canyons</span> under pink-hued skies.
            From the mystique of <span className="mars-color"> ancient riverbeds</span> to stunning Martian <span className="mars-color">sunsets</span>,
            <span className="mars-color"> Mars</span> offers an adventure unlike any other. Book your journey now and experience the allure of the <span className="mars-color">Red Planet</span>!
          </>
    ),
  },
  Saturn: {
    image: Saturn,
    description: (
      <>
        Embark on a journey to <span className="saturn-color">Saturn</span>, the jewel of the solar system! Marvel at its
            <span className="saturn-color"> breathtaking rings</span>, shimmering in cosmic splendor, and explore a landscape of
            <span className="saturn-color"> mysterious moons</span> and golden skies. Perfect for dreamers and adventurers alike, <span className="saturn-color">Saturn </span>
            promises an unforgettable celestial escape. Book now and experience the magic of the <span className="saturn-color"> ringed planet</span>!
           </>
    ),
  },
  Uranus: {
    image: Uranus,
    description: (
      <>
         Discover <span className="uranus-color">Uranus</span>, the solar system’s coolest and most unique getaway! Marvel at its icy
            <span className="uranus-color"> blue-green glow</span>, explore <span className="uranus-color">mysterious moons</span>, and enjoy an atmosphere like no other.
            For explorers seeking the unusual and awe-inspiring, <span className="uranus-color">Uranus</span> offers a refreshing cosmic escape.
            Book your adventure to the tilt-angled planet now!
        </>
    ),
  },
  Neptune: {
    image: Neptune,
    description: (
      <>
        Journey to <span className="neptune-color">Neptune</span>, a breathtaking world of deep <span className="neptune-color">azure hues </span>
            and dynamic, windy skies! Explore <span className="neptune-color">captivating storms</span>, icy landscapes, and the mysteries of
            <span className="neptune-color"> distant moons</span>. Ideal for adventurers craving the beauty and intensity of the outer solar system.
            Book your <span className="neptune-color">Neptune escape</span> now for an unforgettable voyage into the <span className="neptune-color">cosmic blue</span>!
       </>
    ),
  },
};

/**
 * Popup-Komponente zur Anzeige von Planeteninformationen.
 * @param {Object} props - Die Eigenschaften der Komponente.
 * @param {boolean} props.openInfo - Gibt an, ob das Popup geöffnet ist.
 * @param {Function} props.closeInfo - Funktion zum Schließen des Popups.
 * @param {Object} props.currentPlanet - Der aktuell ausgewählte Planet.
 */
const PlanetInfoPopup = ({ openInfo, closeInfo, currentPlanet }) => {
  const [planetData, setPlanetData] = useState(null);

  useEffect(() => {
    if (currentPlanet) {
      setPlanetData(planetDescriptions[currentPlanet.name]);
    }
  }, [currentPlanet]);

  if (!openInfo || !planetData) return null;

    return (
    <div
      id="PopupContainer"
      onClick={(e) => e.target.id === "PopupContainer" && closeInfo()}
      className="fixed inset-0 bg-black flex justify-center items-center bg-opacity-30 backdrop-blur-sm"
    >
      <div className="flex-none bg-medium w-4/5 rounded-lg p-8 flex  items-center text-white">
        <div className=" flex flex-col items-center ">
        <h2 className="text-[7vh] font-bold mb-4">{currentPlanet.name}</h2>
        <p className="text-center " 
        style={{ fontSize: "min(2vw, 5.5vh)" }}
        >{planetData.description}</p>
        <button className="mt-6 general-button" onClick={closeInfo}>Close</button>
        </div>
        <img src={planetData.image} alt={currentPlanet.name} className="w-2/6 h-auto mb-[1vh] p-[0.5vh]" />
      </div>
    </div>
  );
};
export default PlanetInfoPopup;
