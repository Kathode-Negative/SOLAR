import React from 'react'
import './../assets/styles/Home.css'
import '../output.css'
import '../assets/styles/fonts.css'
import '../assets/styles/textStyling.css'
import Logo from './../assets/images/svgs/Solar.svg'
import PlanetInfo from '../components/UI/PlanetInfo'


/**
 * Die `Home`-Komponente stellt die Startseite der Anwendung dar.
 * Sie zeigt das Logo und eine Übersicht der Planeten mit Informationen.
 * @returns {JSX.Element} Die `Home`-Ansicht
 */
const Home = () => {

  const Mercury = '/api/assets/planets/Mercury.png';
  const Venus = '/api/assets/planets/Venus.png';
  const Mars = '/api/assets/planets/Mars.png';
  const Saturn = '/api/assets/planets/Saturn.png';
  const Uranus = '/api/assets/planets/Uranus.png';
  const Neptune = '/api/assets/planets/Neptune.png';
  const Earth = '/api/assets/planets/Earth.png';
  const Jupiter = '/api/assets/planets/Jupiter.png';

  return (
    <div className="flex flex-col justify-center">
      <div
        className="flex flex-col items-center justify-center"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1)), url(/src/assets/images/planet-earth-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
      >
        <img src={Logo} className="md:h-32 sm:h-20 xl:h-48"alt="Logo" />
      </div>

      <div className="pacifico-regular italic text-white tracking-widest sm:text-3xl md:text-5xl xl:text-7xl mb-10 flex items-center justify-center text-glow opacity-95">
        Travel beyond the skies
      </div>

      <div className="flex flex-col items-center">
        {/* Mercury Section */}
      <PlanetInfo
        title = "MERCURY"
        body = {
          <>
            Get up close to the Sun on <span className="mercury-color">Mercury</span>! Marvel at
            <span className="mercury-color"> fiery horizons and endless starry nights</span> that tell ancient stories.
            Whether you crave <span className="mercury-color">extreme adventures</span> or <span className="mercury-color">stunning cosmic views</span>,
            <span className="mercury-color"> Mercury</span> offers a one-of-a-kind escape. Book now for an unforgettable interstellar journey!
          </>
        }
        image = {Mercury}
        imageName = "Mercury"
      />
      {/* Venus Section */}
      <PlanetInfo
        title = "VENUS"
        body = {
          <>
            Experience the beauty and mystery of <span className="venus-color">Venus</span>! With its
            swirling <span className="venus-color">golden skies</span> and ethereal cloudscapes, <span className="venus-color">Venus</span> is a
            dreamscape like no other. Wander through <span className="venus-color">misty, volcanic plains</span> and enjoy an atmosphere
            of surreal colors and intensity. Perfect for <span className="venus-color">thrill-seekers</span> and romantics alike, <span className="venus-color">Venus</span> promises
            an adventure you'll never forget. Book your celestial getaway now!
          </>
        }
        image = {Venus}
        imageName = "Venus"
      />
      <PlanetInfo
        title = "EARTH"
        body = {
          <>
       From crystal-clear oceans to towering mountains, {" "}<span className="earth-color">Earth</span> offers endless adventures and breathtaking scenery. Relax on {" "}<span className="earth-color">pristine beaches</span>, hike {" "}<span className="earth-color">lush forests</span>, or explore{" "}
        <span className="earth-color">vibrant cities</span> filled with rich culture and history. Whether you're seeking {" "}<span className="earth-color">relaxation</span> or {" "}<span className="earth-color">excitement</span>, Earth has it all. Book your perfect getaway today and discover why there’s no place like <span className="earth-color">home</span>!
         </>
        }
        image = {Earth}
        imageName = "Earth"
      />
      {/* Mars Section */}
      <PlanetInfo
        title = "MARS"
        body = {
          <>
            Get ready for the thrill of <span className="mars-color">Mars</span>! Explore rugged <span className="mars-color">red landscapes</span>,
            <span className="mars-color"> towering volcanoes</span>, and  <span className="mars-color"> sprawling canyons</span> under pink-hued skies.
            From the mystique of <span className="mars-color"> ancient riverbeds</span> to stunning Martian <span className="mars-color">sunsets</span>,
            <span className="mars-color"> Mars</span> offers an adventure unlike any other. Book your journey now and experience the allure of the <span className="mars-color">Red Planet</span>!
          </>
        }
        image = {Mars}
        imageName = "Mars"
      />
      {/* Jupiter Section */}
      <PlanetInfo
        title = "JUPITER"
        body = {
          <>
            Step into a world of <span className="jupiter-color">swirling storms</span>, majestic cloud bands, and the awe-inspiring <span className="jupiter-color">Great Red Spot</span>!{" "}
            <span className="jupiter-color">Jupiter</span> offers breathtaking views, <span className="jupiter-color">mesmerizing moons</span>, and the grandeur of the <span className="jupiter-color">largest planet</span> in the solar system. A must-visit for{" "}
            cosmic explorers and thrill-seekers alike! Book your <span className="jupiter-color">Jupiter adventure</span> now!
          </>
        }
        image = {Jupiter}
        imageName = "Jupiter"
      />
      {/* Saturn Section */}
      <PlanetInfo
        title = "SATURN"
        body = {
          <>
            Embark on a journey to <span className="saturn-color">Saturn</span>, the jewel of the solar system! Marvel at its
            <span className="saturn-color"> breathtaking rings</span>, shimmering in cosmic splendor, and explore a landscape of
            <span className="saturn-color"> mysterious moons</span> and golden skies. Perfect for dreamers and adventurers alike, <span className="saturn-color">Saturn </span>
            promises an unforgettable celestial escape. Book now and experience the magic of the <span className="saturn-color"> ringed planet</span>!
          </>
        }
        image = {Saturn}
        imageName = "Saturn"
      />
      {/* Uranus Section */}
      <PlanetInfo
        title = "URANUS"
        body = {
          <>
            Discover <span className="uranus-color">Uranus</span>, the solar system’s coolest and most unique getaway! Marvel at its icy
            <span className="uranus-color"> blue-green glow</span>, explore <span className="uranus-color">mysterious moons</span>, and enjoy an atmosphere like no other.
            For explorers seeking the unusual and awe-inspiring, <span className="uranus-color">Uranus</span> offers a refreshing cosmic escape.
            Book your adventure to the tilt-angled planet now!
          </>
        }
        image = {Uranus}
        imageName = "Uranus"
      />
      {/* Neptune Section */}
      <PlanetInfo
        title = "NEPTUNE"
        body = {
          <>
            Journey to <span className="neptune-color">Neptune</span>, a breathtaking world of deep <span className="neptune-color">azure hues </span>
            and dynamic, windy skies! Explore <span className="neptune-color">captivating storms</span>, icy landscapes, and the mysteries of
            <span className="neptune-color"> distant moons</span>. Ideal for adventurers craving the beauty and intensity of the outer solar system.
            Book your <span className="neptune-color">Neptune escape</span> now for an unforgettable voyage into the <span className="neptune-color">cosmic blue</span>!
          </>
        }
        image = {Neptune}
        imageName = "Neptune"
      />
      </div>
    </div>
  );
};

export default Home;
