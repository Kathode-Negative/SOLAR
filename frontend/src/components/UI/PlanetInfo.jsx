import React from "react"
import { useNavigate } from "react-router-dom";
import "./../../assets/styles/GUI.css"
import "./../../assets/styles/fonts.css"


const PlanetInfo = ({image,imageName,title,titleStyle,body,bodyStyle,buttonStyle}) =>{

    const navigate = useNavigate();

    return (
    <div className="p-6 flex flex-row items-center w-3/4 justify-center m-12 bg-large rounded-3xl">
      <div className="p-10 h-full flex-grow flex flex-col items-center">
          <h1 className={titleStyle ? titleStyle :"solar sm:text-5xl md:text-6xl xl:text-8xl text-white text-center tracking-wider opacity-90"}>
            {title}
          </h1>
        <p className={bodyStyle ? bodyStyle :"roboto-thin font-normal sm:text-sm md:text-xl xl:text-2xl text-white text-center  tracking-normal leading-normal opacity-75 p-10"}>
          {body}
        </p>

        <button
          onClick={() => navigate("/myroute")}
          className={buttonStyle ? buttonStyle : "general-button roboto-bold-italic"}
          style={{
            padding: '0.5rem 1.5rem',
            borderRadius: '1rem',
            whiteSpace: 'nowrap',
          }}
        >Book now</button>

      </div>
      <img src={image} alt={imageName} className=" w-1/3 h-auto " 
      />
    </div>)

}

export default PlanetInfo